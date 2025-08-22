import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

function LibraryPage() {
  const navigate = useNavigate();
  const [tracks, setTracks] = useState([]);
  const [completeVideos, setCompleteVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('tracks');
  const [isDeleting, setIsDeleting] = useState({});
  
  // Music player states
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [showPlayer, setShowPlayer] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchLibraryData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("No user ID found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const [tracksResponse, videosResponse] = await Promise.all([
          fetch("https://nback-6gqw.onrender.com/api/get-tracks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
          }),
          fetch("https://nback-6gqw.onrender.com/api/get-complete-videos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
          })
        ]);

        if (!tracksResponse.ok) throw new Error("Failed to fetch tracks");
        if (!videosResponse.ok) throw new Error("Failed to fetch complete videos");

        const tracksData = await tracksResponse.json();
        const videosData = await videosResponse.json();
        
        setTracks(tracksData);
        setCompleteVideos(videosData);

      } catch (err) {
        console.error("Fetch library data error:", err);
        setError("Could not load library data.");
      } finally {
        setLoading(false);
      }
    };

    fetchLibraryData();
  }, []);

  const handleDeleteCompleteVideo = async (videoId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this complete video from your library?");
    if (!confirmDelete) return;

    try {
      setIsDeleting(prev => ({ ...prev, [videoId]: true }));

      const response = await fetch("https://nback-6gqw.onrender.com/api/delete-complete-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, videoId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete video");
      }

      setCompleteVideos(prev => prev.filter(video => video._id !== videoId));

    } catch (err) {
      console.error("Delete complete video error:", err);
      alert("Failed to delete video: " + err.message);
    } finally {
      setIsDeleting(prev => ({ ...prev, [videoId]: false }));
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const formatTime = (timeInSeconds) => {
    if (!timeInSeconds || isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayTrack = (track, index) => {
    console.log('🎵 Playing track:', track.title || `Track ${index + 1}`);
    
    // Stop current track if playing
    if (currentlyPlaying && audioRef.current) {
      audioRef.current.pause();
      // Remove existing event listeners
      audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.removeEventListener('ended', handleTrackEnded);
    }

    // Set new track
    setCurrentlyPlaying({ track, index });
    setCurrentTime(0);
    setDuration(0);
    setShowPlayer(true);

    // Create new audio element
    audioRef.current = new Audio(track.audioUrl);
    audioRef.current.volume = volume;

    // Add event listeners
    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioRef.current.addEventListener('ended', handleTrackEnded);

    // Play the track
    audioRef.current.play().then(() => {
      setIsPlaying(true);
      console.log('✅ Track started playing');
    }).catch(err => {
      console.error('❌ Failed to play track:', err);
      setIsPlaying(false);
    });
  };

  // Separate event handler functions
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleTrackEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error('❌ Failed to resume track:', err);
      });
    }
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const closePlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeEventListener('timeupdate', () => {});
      audioRef.current.removeEventListener('loadedmetadata', () => {});
      audioRef.current.removeEventListener('ended', () => {});
    }
    setCurrentlyPlaying(null);
    setIsPlaying(false);
    setShowPlayer(false);
    setCurrentTime(0);
    setDuration(0);
  };

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      background: '#0a0a0a',
      minHeight: '100vh',
      color: '#ffffff'
    }}>
      {/* Top Navigation */}
      <header style={{
        background: 'rgba(10, 10, 10, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '1rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#ffffff',
            margin: 0
          }}>
            Your Library
          </h1>
          
          <div style={{
            display: 'flex',
            gap: '0.75rem'
          }}>
            <button 
              onClick={() => navigate("/ClipTuneGenerator")}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Create ✨
            </button>
            <button 
              onClick={() => navigate("/settings")}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Settings
            </button>
          </div>
        </div>
      </header>

      <main style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '2rem',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '0.5rem',
          borderRadius: '12px',
          width: 'fit-content'
        }}>
          <button
            onClick={() => setActiveTab('tracks')}
            style={{
              background: activeTab === 'tracks' 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'transparent',
              color: activeTab === 'tracks' ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Music Tracks ({tracks.length})
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            style={{
              background: activeTab === 'videos' 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'transparent',
              color: activeTab === 'videos' ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Videos ({completeVideos.length})
          </button>
        </div>

        {loading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem',
            color: 'rgba(255, 255, 255, 0.6)'
          }}>
            <div style={{
              border: '2px solid rgba(255, 255, 255, 0.1)',
              borderTop: '2px solid #667eea',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }} />
            Loading your library...
          </div>
        )}

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '12px',
            padding: '1rem',
            textAlign: 'center',
            color: '#ef4444',
            marginBottom: '2rem'
          }}>
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Music Tracks Tab */}
            {activeTab === 'tracks' && (
              <div>
                {tracks.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '4rem',
                    color: 'rgba(255, 255, 255, 0.4)'
                  }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>🎵</div>
                    <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No music tracks yet</p>
                    <p style={{ fontSize: '0.9rem' }}>Create your first AI-generated track</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                    {tracks.map((track, idx) => (
                      <div key={track._id || idx} style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '1rem 1.5rem',
                        background: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: '8px',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                        border: '1px solid transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                        e.currentTarget.style.borderColor = 'transparent';
                      }}>
                        
                        {/* Thumbnail */}
                        <div style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.5rem',
                          marginRight: '1rem',
                          flexShrink: 0
                        }}>
                          🎵
                        </div>

                        {/* Track Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h3 style={{
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: '#ffffff',
                            marginBottom: '0.25rem',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {track.title || `Untitled Track ${idx + 1}`}
                          </h3>
                          <p style={{
                            fontSize: '0.85rem',
                            color: 'rgba(255, 255, 255, 0.6)',
                            marginBottom: '0.25rem',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {track.description || 'AI-generated music track'}
                          </p>
                          <p style={{
                            fontSize: '0.8rem',
                            color: 'rgba(255, 255, 255, 0.4)',
                            margin: 0
                          }}>
                            {formatDate(track.generatedAt)}
                          </p>
                        </div>

                        {/* Duration */}
                        <div style={{
                          fontSize: '0.9rem',
                          color: 'rgba(255, 255, 255, 0.6)',
                          marginRight: '1rem',
                          fontFamily: 'monospace'
                        }}>
                          {track.duration || "0:00"}
                        </div>

                        {/* Action Buttons */}
                        <div style={{
                          display: 'flex',
                          gap: '0.5rem',
                          opacity: 0.7,
                          transition: 'opacity 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlayTrack(track, idx);
                            }}
                            style={{
                              background: currentlyPlaying?.track?.audioUrl === track.audioUrl && isPlaying
                                ? 'rgba(102, 126, 234, 0.2)'
                                : 'rgba(255, 255, 255, 0.1)',
                              color: currentlyPlaying?.track?.audioUrl === track.audioUrl && isPlaying
                                ? '#667eea'
                                : '#ffffff',
                              border: 'none',
                              padding: '0.5rem 1rem',
                              borderRadius: '20px',
                              fontSize: '0.8rem',
                              fontWeight: 500,
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              border: currentlyPlaying?.track?.audioUrl === track.audioUrl && isPlaying
                                ? '1px solid rgba(102, 126, 234, 0.3)'
                                : '1px solid rgba(255, 255, 255, 0.1)'
                            }}
                            onMouseEnter={(e) => {
                              if (!(currentlyPlaying?.track?.audioUrl === track.audioUrl && isPlaying)) {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!(currentlyPlaying?.track?.audioUrl === track.audioUrl && isPlaying)) {
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                              }
                            }}
                          >
                            {currentlyPlaying?.track?.audioUrl === track.audioUrl && isPlaying ? (
                              <>🎵 Playing</>
                            ) : (
                              <>▶️ Play</>
                            )}
                          </button>

                          <a
                            href={track.audioUrl}
                            download={`${(track.title || `track_${idx + 1}`).replace(/[^a-z0-9]/gi, '_')}.mp3`}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              background: 'rgba(255, 255, 255, 0.05)',
                              color: 'rgba(255, 255, 255, 0.7)',
                              textDecoration: 'none',
                              padding: '0.5rem 1rem',
                              borderRadius: '20px',
                              fontSize: '0.8rem',
                              fontWeight: 500,
                              transition: 'all 0.2s ease',
                              border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                              e.currentTarget.style.color = '#ffffff';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                            }}
                          >
                            ⬇️ Download
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Complete Videos Tab */}
            {activeTab === 'videos' && (
              <div>
                {completeVideos.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '4rem',
                    color: 'rgba(255, 255, 255, 0.4)'
                  }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>🎬</div>
                    <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No complete videos yet</p>
                    <p style={{ fontSize: '0.9rem' }}>Process a video with ClipTune to create one</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                    {completeVideos.map((video, idx) => (
                      <div key={video._id || idx} style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '1rem 1.5rem',
                        background: 'rgba(255, 255, 255, 0.02)',
                        borderRadius: '8px',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                        border: '1px solid transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                        e.currentTarget.style.borderColor = 'transparent';
                      }}>
                        
                        {/* Video Thumbnail */}
                        <div style={{
                          width: '80px',
                          height: '60px',
                          borderRadius: '8px',
                          background: 'linear-gradient(135deg, #38a169 0%, #48bb78 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.5rem',
                          marginRight: '1rem',
                          flexShrink: 0
                        }}>
                          🎬
                        </div>

                        {/* Video Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h3 style={{
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: '#ffffff',
                            marginBottom: '0.25rem',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {video.title}
                          </h3>
                          <p style={{
                            fontSize: '0.85rem',
                            color: 'rgba(255, 255, 255, 0.6)',
                            marginBottom: '0.25rem'
                          }}>
                            {video.segmentCount} music segments • {video.processedSegments} total segments
                          </p>
                          <p style={{
                            fontSize: '0.8rem',
                            color: 'rgba(255, 255, 255, 0.4)',
                            margin: 0
                          }}>
                            {formatDate(video.createdAt)}
                          </p>
                        </div>

                        {/* Duration */}
                        <div style={{
                          fontSize: '0.9rem',
                          color: 'rgba(255, 255, 255, 0.6)',
                          marginRight: '1rem',
                          fontFamily: 'monospace'
                        }}>
                          {formatDuration(video.duration)}
                        </div>

                        {/* Action Buttons */}
                        <div style={{
                          display: 'flex',
                          gap: '0.5rem',
                          opacity: 0.7,
                          transition: 'opacity 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}>
                          
                          <a
                            href={video.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              background: 'rgba(56, 161, 105, 0.2)',
                              color: '#48bb78',
                              textDecoration: 'none',
                              padding: '0.5rem 1rem',
                              borderRadius: '20px',
                              fontSize: '0.8rem',
                              fontWeight: 500,
                              transition: 'all 0.2s ease',
                              border: '1px solid rgba(56, 161, 105, 0.3)'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(56, 161, 105, 0.3)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(56, 161, 105, 0.2)';
                            }}
                          >
                            Watch
                          </a>

                          <a
                            href={video.videoUrl}
                            download={`${video.title.replace(/[^a-z0-9]/gi, '_')}.mp4`}
                            style={{
                              background: 'rgba(255, 255, 255, 0.1)',
                              color: '#ffffff',
                              textDecoration: 'none',
                              padding: '0.5rem 1rem',
                              borderRadius: '20px',
                              fontSize: '0.8rem',
                              fontWeight: 500,
                              transition: 'all 0.2s ease',
                              border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                            }}
                          >
                            Download
                          </a>

                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCompleteVideo(video._id);
                            }}
                            disabled={isDeleting[video._id]}
                            style={{
                              background: 'rgba(239, 68, 68, 0.1)',
                              color: isDeleting[video._id] ? 'rgba(239, 68, 68, 0.5)' : '#ef4444',
                              border: '1px solid rgba(239, 68, 68, 0.2)',
                              padding: '0.5rem 1rem',
                              borderRadius: '20px',
                              fontSize: '0.8rem',
                              fontWeight: 500,
                              cursor: isDeleting[video._id] ? 'not-allowed' : 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {isDeleting[video._id] ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Bottom Music Player */}
      {showPlayer && currentlyPlaying && (
        <div style={{
          position: 'fixed',
          bottom: '0',
          left: '0',
          right: '0',
          background: 'rgba(10, 10, 10, 0.95)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '1rem 2rem',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          {/* Track Info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flex: '0 0 300px'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              flexShrink: 0
            }}>
              🎵
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#ffffff',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                marginBottom: '0.25rem'
              }}>
                {currentlyPlaying.track.title || `Track ${currentlyPlaying.index + 1}`}
              </div>
              <div style={{
                fontSize: '0.8rem',
                color: 'rgba(255, 255, 255, 0.6)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {currentlyPlaying.track.description || 'AI-generated music'}
              </div>
            </div>
          </div>

          {/* Player Controls */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {/* Control Buttons */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
                  }
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '50%',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                }}
              >
                ⏪
              </button>

              <button
                onClick={togglePlayPause}
                style={{
                  background: '#ffffff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  color: '#0a0a0a',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>

              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10);
                  }
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '50%',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
                }}
              >
                ⏩
              </button>
            </div>

            {/* Progress Bar */}
            <div style={{
              width: '100%',
              maxWidth: '500px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <span style={{
                fontSize: '0.8rem',
                color: 'rgba(255, 255, 255, 0.6)',
                minWidth: '40px',
                fontFamily: 'monospace'
              }}>
                {formatTime(currentTime)}
              </span>
              
              <div
                onClick={handleSeek}
                style={{
                  flex: 1,
                  height: '4px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <div style={{
                  height: '100%',
                  width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                  background: '#ffffff',
                  borderRadius: '2px',
                  transition: 'width 0.1s ease'
                }} />
              </div>
              
              <span style={{
                fontSize: '0.8rem',
                color: 'rgba(255, 255, 255, 0.6)',
                minWidth: '40px',
                fontFamily: 'monospace'
              }}>
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Volume Control & Close */}
          <div style={{
            flex: '0 0 200px',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            justifyContent: 'flex-end'
          }}>
            {/* Volume */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{
                fontSize: '1rem',
                color: 'rgba(255, 255, 255, 0.6)'
              }}>
                🔊
              </span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                style={{
                  width: '80px',
                  height: '4px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '2px',
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none'
                }}
              />
            </div>

            {/* Close Button */}
            <button
              onClick={closePlayer}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '1.2rem',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '4px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
}

export default LibraryPage;