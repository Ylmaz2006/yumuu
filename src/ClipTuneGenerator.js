import React, { useState, useEffect, useRef, useCallback } from 'react';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Helper function to convert timestamp strings (MM:SS or HH:MM:SS) to total seconds

// Constants for thumbnail timeline
const THUMB_WIDTH = 75;  // Decreased from 90
const THUMB_HEIGHT = 60; // Kept the same height
const NUM_THUMBS = 8;    // Decreased from 10

// Standardized styles for consistency
const STYLES = {
  button: {
    primary: {
      background: 'linear-gradient(135deg, #4c51bf 0%, #667eea 100%)',
      color: 'white',
      border: 'none',
      padding: '1rem 2rem',
      borderRadius: '12px',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 20px rgba(76, 81, 191, 0.4)',
      minWidth: '140px',
      textAlign: 'center'
    },
    secondary: {
      background: 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)',
      color: 'white',
      border: 'none',
      padding: '1rem 2rem',
      borderRadius: '12px',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 20px rgba(45, 55, 72, 0.4)',
      minWidth: '140px',
      textAlign: 'center'
    },
    success: {
      background: 'linear-gradient(135deg, #38a169 0%, #48bb78 100%)',
      color: 'white',
      border: 'none',
      padding: '1rem 2rem',
      borderRadius: '12px',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 20px rgba(56, 161, 105, 0.4)',
      minWidth: '140px',
      textAlign: 'center'
    },
    warning: {
      background: 'linear-gradient(135deg, #ed8936 0%, #f6ad55 100%)',
      color: 'white',
      border: 'none',
      padding: '1rem 2rem',
      borderRadius: '12px',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 20px rgba(237, 137, 54, 0.4)',
      minWidth: '140px',
      textAlign: 'center'
    },
    danger: {
      background: 'linear-gradient(135deg, #e53e3e 0%, #f56565 100%)',
      color: 'white',
      border: 'none',
      padding: '1rem 2rem',
      borderRadius: '12px',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 20px rgba(229, 62, 62, 0.4)',
      minWidth: '140px',
      textAlign: 'center'
    },fullVideo: {
  background: 'linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)',
  color: 'white',
  border: 'none',
  padding: '0.75rem 1.5rem',
  borderRadius: '10px',
  fontSize: '0.9rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 20px rgba(237, 137, 54, 0.4)',
  textAlign: 'center'
}
  },
  modal: {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(3px)'
    },
    container: {
      background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
      borderRadius: '24px',
      padding: '3rem',
      boxShadow: '0 25px 80px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)',
      maxWidth: '90%',
      maxHeight: '90vh',
      overflowY: 'auto',
      position: 'relative',
      margin: '2rem',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },
    closeButton: {
      position: 'absolute',
      top: '1.5rem',
      right: '1.5rem',
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: '#a0aec0',
      lineHeight: 1,
      padding: '0.5rem',
      borderRadius: '50%',
      transition: 'background-color 0.2s ease',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#2d3748',
      marginBottom: '1rem',
      textAlign: 'center'
    },
    subtitle: {
      color: '#718096',
      fontSize: '1.1rem',
      textAlign: 'center',
      marginBottom: '2rem'
    }
  },
  input: {
    base: {
      width: '100%',
      padding: '1rem',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '1rem',
      transition: 'border-color 0.2s ease',
      background: '#fafafa'
    },
    label: {
      display: 'block',
      fontSize: '1rem',
      fontWeight: 600,
      color: '#4a5568',
      marginBottom: '0.75rem'
    }
  },
  container: {
    main: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    card: {
      background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
      borderRadius: '24px',
      padding: '3rem',
      boxShadow: '0 25px 80px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)',
      width: '100%',
      maxWidth: '800px',
      margin: '2rem auto',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    }
  }
};
const statusUpdates = [
  { delay: 2000, status: 'Uploading video...', progress: 15 },
  { delay: 4000, status: 'Analyzing video content...', progress: 30 },
  { delay: 7000, status: 'Detecting speech patterns...', progress: 45 },
  { delay: 10000, status: 'Identifying music opportunities...', progress: 60 },
  { delay: 13000, status: 'Processing AI segments...', progress: 75 },
  { delay: 16000, status: 'Finalizing analysis...', progress: 85 }
];
// Helper to get user key for localStorage
function getRecentTracksKey(user) {
  // Replace with your actual user identifier logic
  // e.g., user?.email or user?.id
  return user && user.email ? `recentTracks_${user.email}` : 'recentTracks_guest';
}
// Spotify-like Player component
const SpotifyLikePlayer = ({ 
  track, 
  isPlaying, 
  currentTime, 
  duration, 
  onPlay, 
  onPause, 
  onSeek,
  onPlayInterval,
  onDownloadInterval,
  onUseForVideo,
  intervalStart = track.start,
  intervalEnd = track.end,
  intervalDuration = track.duration
}) => {
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    onSeek(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div 
      className="spotify-player"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        background: 'linear-gradient(135deg, #1e1e1e 0%, #121212 100%)',
        borderRadius: '16px',
        padding: '20px',
        color: 'white',
        fontFamily: "'Circular', -apple-system, BlinkMacSystemFont, sans-serif",
        border: '1px solid #333',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(20px)',
        minWidth: '500px',
        maxWidth: '700px',
        margin: '20px auto',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Track Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '20px'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #1db954 0%, #1ed760 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          boxShadow: '0 4px 16px rgba(29, 185, 84, 0.3)'
        }}>
          🎵
        </div>
        
        <div style={{ flex: 1 }}>
          <h3 style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: 700,
            color: 'white',
            marginBottom: '4px'
          }}>
            {track?.trackName || track?.title || 'AI Generated Track'}
          </h3>
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: '#b3b3b3',
            fontWeight: 400
          }}>
            ClipTune AI • {intervalStart} → {intervalEnd} • {intervalDuration}
          </p>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #1db954 0%, #1ed760 100%)',
          color: 'white',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          boxShadow: '0 2px 8px rgba(29, 185, 84, 0.3)'
        }}>
          ✓ Ready
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '8px'
        }}>
          <span style={{ 
            fontSize: '12px', 
            color: '#b3b3b3',
            minWidth: '40px',
            fontWeight: 500
          }}>
            {formatTime(currentTime)}
          </span>
          
          <div 
            onClick={handleProgressClick}
            style={{
              flex: 1,
              height: '6px',
              background: '#4f4f4f',
              borderRadius: '3px',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.height = '8px';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.height = '6px';
            }}
          >
            <div style={{
              width: `${progressPercentage}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #1db954 0%, #1ed760 100%)',
              borderRadius: '3px',
              position: 'relative',
              transition: 'width 0.1s ease'
            }}>
              <div style={{
                position: 'absolute',
                right: '-6px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '12px',
                height: '12px',
                background: 'white',
                borderRadius: '50%',
                opacity: isHovering ? 1 : 0,
                transition: 'opacity 0.2s ease',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
              }} />
            </div>
          </div>
          
          <span style={{ 
            fontSize: '12px', 
            color: '#b3b3b3',
            minWidth: '40px',
            fontWeight: 500
          }}>
            {formatTime(duration)}
          </span>
        </div>

        {/* Interval Indicator */}
        <div style={{
          background: 'rgba(29, 185, 84, 0.1)',
          border: '1px solid rgba(29, 185, 84, 0.3)',
          borderRadius: '6px',
          padding: '8px 12px',
          fontSize: '12px',
          color: '#1ed760',
          textAlign: 'center',
          fontWeight: 500
        }}>
          ⏱️ Interval: {intervalStart} → {intervalEnd} • {intervalDuration} duration
        </div>
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        {/* Left Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <button
            onClick={() => onSeek(Math.max(0, currentTime - 10))}
            style={{
              background: 'none',
              border: 'none',
              color: '#b3b3b3',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '50%',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#b3b3b3';
              e.currentTarget.style.background = 'none';
            }}
          >
            ⏪
          </button>

          <button
            onClick={isPlaying ? onPause : onPlay}
            style={{
              background: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '18px',
              color: '#000',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 16px rgba(255, 255, 255, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(255, 255, 255, 0.2)';
            }}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>

          <button
            onClick={() => onSeek(Math.min(duration, currentTime + 10))}
            style={{
              background: 'none',
              border: 'none',
              color: '#b3b3b3',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '50%',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#b3b3b3';
              e.currentTarget.style.background = 'none';
            }}
          >
            ⏩
          </button>
        </div>

        {/* Right Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}>
            <button
              onClick={toggleMute}
              onMouseEnter={() => setShowVolumeSlider(true)}
              style={{
                background: 'none',
                border: 'none',
                color: isMuted ? '#f87171' : '#b3b3b3',
                fontSize: '16px',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '4px',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = isMuted ? '#fca5a5' : 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = isMuted ? '#f87171' : '#b3b3b3';
              }}
            >
              {isMuted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
            </button>

            <div 
              style={{
                width: showVolumeSlider ? '80px' : '0',
                overflow: 'hidden',
                transition: 'width 0.3s ease',
                marginLeft: showVolumeSlider ? '8px' : '0'
              }}
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                style={{
                  width: '100%',
                  height: '4px',
                  background: '#4f4f4f',
                  borderRadius: '2px',
                  outline: 'none',
                  cursor: 'pointer',
                  accentColor: '#1db954'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '12px',
        marginTop: '20px',
        paddingTop: '20px',
        borderTop: '1px solid #333'
      }}>
        <button
          onClick={onPlayInterval}
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 16px',
            color: 'white',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.3)';
          }}
        >
          <span>▶️</span>
          Play Interval
        </button>

        <button
          onClick={onDownloadInterval}
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 16px',
            color: 'white',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(16, 185, 129, 0.3)';
          }}
        >
          <span>⬇️</span>
          Download Interval
        </button>

        <button
          onClick={onUseForVideo}
          style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 16px',
            color: 'white',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(245, 158, 11, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(245, 158, 11, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(245, 158, 11, 0.3)';
          }}
        >
          <span>🎬</span>
          Use for Video
        </button>
      </div>
    </div>
  );
};
const App = () => {
  const navigate = useNavigate();
  // Current step in the workflow
  const [currentStep, setCurrentStep] = useState(1); // 1: Upload, 2: Video Edit, 4: Results, 5: Combined Video Preview
// Add these new state variables with your existing ones
const [chatMessage, setChatMessage] = useState('');
const [chatHistory, setChatHistory] = useState([]);
const [isTyping, setIsTyping] = useState(false);
const chatInputRef = useRef(null);
  // State variables for managing component data and UI
  // Add this line with your other useState declarations
  // Full video analysis state
  const [completeVideoProgress, setCompleteVideoProgress] = useState(0);
const [completeVideoStatus, setCompleteVideoStatus] = useState('');
const [isCompleteVideoProcessing, setIsCompleteVideoProcessing] = useState(false);

  const [segmentMusicGeneration, setSegmentMusicGeneration] = useState({});
const [generatedSegmentMusic, setGeneratedSegmentMusic] = useState({});
const [playingSegment, setPlayingSegment] = useState(null);
const [isAnalyzingFullVideo, setIsAnalyzingFullVideo] = useState(false);
const [trackName, setTrackName] = useState('');
const [segmentVideoProcessing, setSegmentVideoProcessing] = useState({});
const [videoSegments, setVideoSegments] = useState([]);
const [selectedTrack, setSelectedTrack] = useState(null);
const [showFullVideoAnalysis, setShowFullVideoAnalysis] = useState(false);
  const [showDropdownMenu, setShowDropdownMenu] = useState(false);
  const [hasBeenSaved, setHasBeenSaved] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState([]);
const terminalRef = useRef(null);
// ADD this new state variable to your ClipTuneGenerator.js component:
const [showInstructionInput, setShowInstructionInput] = useState(false);
const [videoInstructions, setVideoInstructions] = useState('');
const [isCompleteVideoMode, setIsCompleteVideoMode] = useState(false);

// Add this with your other useState declarations:
const [segmentTrackNames, setSegmentTrackNames] = useState({});

// ADD this function to handle track name changes:

const [recentCombinedVideos, setRecentCombinedVideos] = useState([]);
const [savedCombinedVideos, setSavedCombinedVideos] = useState(new Set());
  const [showRecentTracks, setShowRecentTracks] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [youtubeUrls, setYoutubeUrls] = useState(['', '', '', '', '']); // 5 empty URLs
  const [lyrics, setLyrics] = useState('');
  const [description, setDescription] = useState('');
  const [instrumental, setInstrumental] = useState(true);
  const [renderMusicVideo, setRenderMusicVideo] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showBulkGenerateConfirm, setShowBulkGenerateConfirm] = useState(false);
const [showCompleteVideoConfirm, setShowCompleteVideoConfirm] = useState(false);
const [generatingTracks, setGeneratingTracks] = useState([]); // Track generation progress
const [forceShowDropdown, setForceShowDropdown] = useState(false); 
const [bulkGenerateSegmentCount, setBulkGenerateSegmentCount] = useState(0);
const [completeVideoSegmentCount, setCompleteVideoSegmentCount] = useState(0);

// ADD THESE MISSING FUNCTIONS TO ClipTuneGenerator.js

const detectSegmentOverlaps = (segments, currentIndex, newStart, newEnd) => {
  const overlaps = [];
  
  for (let i = 0; i < segments.length; i++) {
    if (i === currentIndex) continue; // Skip the current segment being edited
    
    const segment = segments[i];
    const segStart = segment.parsed_start !== undefined 
      ? segment.parsed_start 
      : parseFloat(segment.start_time || 0);
    const segEnd = segment.parsed_end !== undefined 
      ? segment.parsed_end 
      : parseFloat(segment.end_time || segStart + 30);
    
    // Check for overlap: (newStart < segEnd) && (newEnd > segStart)
    if (newStart < segEnd && newEnd > segStart) {
      overlaps.push({
        index: i,
        segmentNumber: i + 1,
        start: segStart,
        end: segEnd,
        overlapStart: Math.max(newStart, segStart),
        overlapEnd: Math.min(newEnd, segEnd)
      });
    }
  }
  
  return overlaps;
};
// 2. Function to calculate safe boundaries for a segment
const calculateSegmentBoundaries = (segments, currentIndex) => {
  const sortedSegments = segments
    .map((seg, index) => ({
      ...seg,
      originalIndex: index,
      start: seg.parsed_start !== undefined ? seg.parsed_start : parseFloat(seg.start_time || 0),
      end: seg.parsed_end !== undefined ? seg.parsed_end : parseFloat(seg.end_time || 0)
    }))
    .filter(seg => seg.originalIndex !== currentIndex) // Remove current segment
    .sort((a, b) => a.start - b.start);
  
  let maxStart = 0; // Can't start before video beginning
  let minEnd = duration; // Can't end after video end
  
  // Find the segment immediately before and after current position
  const currentSegment = segments[currentIndex];
  const currentStart = currentSegment.parsed_start !== undefined 
    ? currentSegment.parsed_start 
    : parseFloat(currentSegment.start_time || 0);
  
  // Find previous segment (latest segment that ends before current starts)
  for (let seg of sortedSegments) {
    if (seg.end <= currentStart) {
      maxStart = Math.max(maxStart, seg.end);
    }
  }
  
  // Find next segment (earliest segment that starts after current starts)
  for (let seg of sortedSegments) {
    if (seg.start > currentStart) {
      minEnd = Math.min(minEnd, seg.start);
      break;
    }
  }
  
  return { maxStart, minEnd };
};

// Add these functions before your return statement
const getAIResponse = (userMessage) => {
  const responses = [
    "I can help you transform your video into amazing AI-generated music! Upload your video and I'll analyze it for you.",
    "Great! Once you upload a video, I can suggest music styles that would work best with your content.",
    "I'll analyze your video's mood, pacing, and visual elements to create the perfect soundtrack.",
    "Would you like me to create upbeat, calm, dramatic, or ambient music for your video?",
    "I can generate music in various genres - electronic, orchestral, pop, rock, ambient, and more!",
    "Upload your video and tell me what kind of mood or style you're looking for in the music."
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};

// Find the existing handleSendMessage function and replace it with this enhanced version:
const handleSendMessage = async () => {
  if (!chatMessage.trim()) return;

  // Add user message to chat history
  const userMessage = {
    id: Date.now(),
    type: 'user',
    message: chatMessage,
    timestamp: new Date().toLocaleTimeString()
  };

  setChatHistory(prev => [...prev, userMessage]);
  
  // 🚨 FIX: Store the chat message for immediate use
  const currentChatMessage = chatMessage.trim();
  
  // 🚨 FIX: Set description immediately for custom prompt
  setDescription(currentChatMessage);
  
  setChatMessage(''); // Clear input immediately
  setIsTyping(true);

  // Check if user has uploaded a video file
  if (!selectedFile || !isFileReady) {
    // Simulate AI thinking time for regular chat
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        message: "I'd love to help you create music! Please upload a video file first, then I can analyze it and generate the perfect soundtrack based on your description.",
        timestamp: new Date().toLocaleTimeString()
      };
      setChatHistory(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
    return;
  }

  // If video is ready, use chat message for Complete Video processing
  try {
    // 🚨 FIX: Use the stored message instead of state
    setVideoInstructions(currentChatMessage);
    
    // Add AI response indicating processing will start
    const processingMessage = {
      id: Date.now() + 1,
      type: 'ai',
      message: `🎬 Perfect! I'll analyze your video with these instructions: "${currentChatMessage}". Starting complete video analysis now...`,
      timestamp: new Date().toLocaleTimeString()
    };
    setChatHistory(prev => [...prev, processingMessage]);
    setIsTyping(false);

    // Small delay to show the message, then start processing
    setTimeout(() => {
      processVideoWithClipTune();
    }, 1000);

  } catch (error) {
    setIsTyping(false);
    const errorMessage = {
      id: Date.now() + 1,
      type: 'ai',
      message: `❌ Sorry, there was an error processing your request: ${error.message}. Please try again!`,
      timestamp: new Date().toLocaleTimeString()
    };
    setChatHistory(prev => [...prev, errorMessage]);
  }
};
// Also update the send button in the chat interface to show different states:

// 3. Create drag handler with overlap detection
// ADD THESE ADDITIONAL MISSING FUNCTIONS TO ClipTuneGenerator.js

const createDragHandlerWithOverlapDetection = (type) => {
  return (e) => {
    e.preventDefault();
    
    const rect = trackRef.current.getBoundingClientRect();
    
    const move = (moveEvent) => {
      const currentX = Math.max(0, Math.min(moveEvent.clientX - rect.left, THUMB_WIDTH * NUM_THUMBS));
      const width = THUMB_WIDTH * NUM_THUMBS;
      
      let newStartX = startX;
      let newEndX = endX;
      
      if (type === "start") {
        newStartX = Math.min(currentX, endX - 10);
        setStartX(newStartX);
      } else {
        newEndX = Math.max(currentX, startX + 10);
        setEndX(newEndX);
      }
      
      // Convert to time values for overlap checking
      const newStart = (newStartX / width) * duration;
      const newEnd = (newEndX / width) * duration;
      
      // Real-time overlap detection during drag
      if (selectedSegmentForEdit && processedVideoResult?.segments) {
        const overlaps = detectSegmentOverlaps(
          processedVideoResult.segments, 
          selectedSegmentForEdit.index, 
          newStart, 
          newEnd
        );
        
        // Visual feedback for overlaps (you can enhance this with UI indicators)
        if (overlaps.length > 0) {
          console.warn(`⚠️ Drag overlap detected with ${overlaps.length} segment(s)`);
          // You could add visual indicators here (red borders, warnings, etc.)
        }
      }
      
      // Update video time
      const newTime = type === "start" ? newStart : newEnd;
      if (videoPreviewRef.current && !isNaN(newTime)) {
        videoPreviewRef.current.currentTime = newTime;
      }
      
      // Mark as having unsaved changes
      if (selectedSegmentForEdit) {
        setHasUnsavedTimelineChanges(true);
      }
    };
    
    const up = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
      
      // Brief preview play
      if (videoPreviewRef.current) {
        videoPreviewRef.current.play();
        setTimeout(() => {
          if (videoPreviewRef.current) {
            videoPreviewRef.current.pause();
          }
        }, 300);
      }
    };
    
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  };
};

// 4. Function to show segment boundaries to prevent overlaps
const showSegmentBoundaries = (segmentIndex) => {
  if (!processedVideoResult?.segments) return;
  
  const boundaries = calculateSegmentBoundaries(processedVideoResult.segments, segmentIndex);
  const currentSegment = processedVideoResult.segments[segmentIndex];
  
  logToTerminal(`📏 Safe boundaries for Segment ${segmentIndex + 1}:`, 'info');
  logToTerminal(`   Earliest start: ${formatTimeFromSeconds(boundaries.maxStart)}`, 'info');
  logToTerminal(`   Latest end: ${formatTimeFromSeconds(boundaries.minEnd)}`, 'info');
  logToTerminal(`   Maximum duration: ${formatTimeFromSeconds(boundaries.minEnd - boundaries.maxStart)}`, 'info');
  
  // Optionally auto-adjust to safe boundaries
  if (boundaries.minEnd - boundaries.maxStart > 1) { // Must be at least 1 second
    const safeDuration = Math.min(30, boundaries.minEnd - boundaries.maxStart - 0.1); // Leave 0.1s buffer
    const safeStart = boundaries.maxStart;
    const safeEnd = safeStart + safeDuration;
    
    logToTerminal(`💡 Suggested safe range: ${formatTimeFromSeconds(safeStart)} - ${formatTimeFromSeconds(safeEnd)}`, 'info');
  } else {
    logToTerminal(`⚠️ Very limited space available for this segment`, 'warning');
  }
};

// 5. Function to handle starting timeline edit mode with overlap detection
const handleStartTimelineEdit = (segment, segmentIndex) => {
  // Store original timeline state for potential cancellation
  setOriginalTimelineState({ startX, endX });
  
  // Set the segment for editing
  jumpToClipTuneSegment(segment, segmentIndex);
  setSelectedSegmentForEdit({ segment, index: segmentIndex });
  setHasUnsavedTimelineChanges(false);
  
  logToTerminal(`✂️ Started editing timeline for segment ${segmentIndex + 1}`, 'info');
  logToTerminal(`💡 Tip: Use arrow keys for fine adjustments (Shift+← → for start handle, ← → for end handle)`, 'info');
  
  // Show safe boundaries for this segment
  showSegmentBoundaries(segmentIndex);
};
  const [downloadProgress, setDownloadProgress] = useState('');
  const [combinedVideoUrl, setCombinedVideoUrl] = useState('');
  const [selectedTrackForCombine, setSelectedTrackForCombine] = useState(null);
  const [previewVolume, setPreviewVolume] = useState(0.7);
  const [isGeneratingCombined, setIsGeneratingCombined] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [userId, setUserId] = useState(null);
const [recentCombined, setRecentCombined] = useState([]);
  const [activeTrackMenu, setActiveTrackMenu] = useState(null);
  const [user, setUser] = useState(null);
const [isLoadingUser, setIsLoadingUser] = useState(true);
const [isProcessingVideo, setIsProcessingVideo] = useState(false);
const [processedVideoResult, setProcessedVideoResult] = useState(null);
const [showProcessedVideo, setShowProcessedVideo] = useState(false);
// Add these with your existing useState declarations
const [isUploading, setIsUploading] = useState(false);
const [uploadProgress, setUploadProgress] = useState(0);
const [isFileReady, setIsFileReady] = useState(false);
  // Modal control states
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showVideoEditModal, setShowVideoEditModal] = useState(false);
const [isChatMode, setIsChatMode] = useState(true); 
  // Timeline-related state
  const [duration, setDuration] = useState(0);
  const [thumbnails, setThumbnails] = useState([]);
  const [startX, setStartX] = useState(0);
  const [endX, setEndX] = useState(THUMB_WIDTH * NUM_THUMBS);
  const [lastDragged, setLastDragged] = useState("start");
  const [isLoadingVideoData, setIsLoadingVideoData] = useState(false);

  // Sidebar state

  // State for currently playing track
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [trackDuration, setTrackDuration] = useState(0);

  // State for scroll-based player visibility
  const [lastScrollY, setLastScrollY] = useState(0);
  const [playerVisible, setPlayerVisible] = useState(true);
  const [selectedSegmentForEdit, setSelectedSegmentForEdit] = useState(null);
  const [playerHovered, setPlayerHovered] = useState(false);
  const [mouseY, setMouseY] = useState(0);

  // State for recent tracks
  const [recentTracks, setRecentTracks] = useState([]);
  const [bottomPlayerMenu, setBottomPlayerMenu] = useState(false);

  // State for video preview generation
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [selectedTrackForPreview, setSelectedTrackForPreview] = useState(null);
  const [previewMusicVolume, setPreviewMusicVolume] = useState(0.8);
  const [playerHideTimeout, setPlayerHideTimeout] = useState(null);
  const [playerClosedManually, setPlayerClosedManually] = useState(false);
  const [playerJustOpened, setPlayerJustOpened] = useState(false);

  // Refs for DOM elements
  const fileInputRef = useRef(null);
  const audioRefs = useRef([]);
  const videoPreviewRef = useRef(null);
  const trackRef = useRef();
  const sidebarRef = useRef(null);
const handleTrackNameChange = (segmentIndex, trackName) => {
  setSegmentTrackNames(prev => ({
    ...prev,
    [segmentIndex]: trackName
  }));
};

// ADD this function to get track name for a segment:
const getTrackName = (segmentIndex) => {
  return segmentTrackNames[segmentIndex] || `Segment ${segmentIndex + 1} Music`;
};
  // Base URL for the backend API
  const API_BASE_URL = 'https://nback-6gqw.onrender.com';
// Helper function to format seconds as MM:SS or H:MM:SS
const formatTimeFromSeconds = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  } else {
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }
};

const parseClipTuneTime = (timeString, allSegments = null, videoDuration = null) => {
  if (!timeString) return 0;

  // Convert number to string (to handle 830 → "830")
  let timeStr = typeof timeString === "number" ? timeString.toString() : timeString.trim();

  // Remove non-numeric characters except ":" and "."
  timeStr = timeStr.replace(/[^\d:.]/g, '');

  // Handle colon format MM:SS or HH:MM:SS (always explicit)
  if (timeStr.includes(':')) {
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 2) return parts[0] * 60 + parts[1];        // MM:SS
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]; // HH:MM:SS
  }

  // Handle decimal format (e.g., "8.30" → 8m 30s)
  if (timeStr.includes('.')) {
    const [m, s] = timeStr.split('.').map(n => parseInt(n));
    return m * 60 + s;
  }

  // ✅ SMART FORMAT DETECTION
  if (allSegments && videoDuration) {
    const detectedFormat = detectTimeFormat(allSegments, videoDuration);
    return parseWithDetectedFormat(timeStr, detectedFormat);
  }

  // Fallback: try MMSS first, then seconds
  return parseMMSSNumber(timeStr);
};

const detectTimeFormat = (segments, videoDuration) => {
  if (!segments || segments.length === 0) return 'seconds';
  
  console.log(`🔍 Analyzing time format for video duration: ${formatTimeFromSeconds(videoDuration)}`);
  
  // Collect all time values from segments
  const allTimeValues = [];
  segments.forEach((segment, index) => {
    if (segment.start_time) allTimeValues.push(segment.start_time);
    if (segment.end_time) allTimeValues.push(segment.end_time);
  });
  const handleStartTimelineEdit = (segment, segmentIndex) => {
  // Store original timeline state for potential cancellation
  setOriginalTimelineState({ startX, endX });
  
  // Set the segment for editing
  jumpToClipTuneSegment(segment, segmentIndex);
  setSelectedSegmentForEdit({ segment, index: segmentIndex });
  setHasUnsavedTimelineChanges(false);
  
  logToTerminal(`✂️ Started editing timeline for segment ${segmentIndex + 1}`, 'info');
  logToTerminal(`💡 Tip: Use arrow keys for fine adjustments (Shift+← → for start handle, ← → for end handle)`, 'info');
};
// Add this Spotify-like Player component to your ClipTuneGenerator.js file





// ADD these functions to your ClipTuneGenerator.js file

// 1. Function to detect overlaps between segments
const detectSegmentOverlaps = (segments, currentIndex, newStart, newEnd) => {
  const overlaps = [];
  
  for (let i = 0; i < segments.length; i++) {
    if (i === currentIndex) continue; // Skip the current segment being edited
    
    const segment = segments[i];
    const segStart = segment.parsed_start !== undefined 
      ? segment.parsed_start 
      : parseFloat(segment.start_time || 0);
    const segEnd = segment.parsed_end !== undefined 
      ? segment.parsed_end 
      : parseFloat(segment.end_time || segStart + 30);
    
    // Check for overlap: (newStart < segEnd) && (newEnd > segStart)
    if (newStart < segEnd && newEnd > segStart) {
      overlaps.push({
        index: i,
        segmentNumber: i + 1,
        start: segStart,
        end: segEnd,
        overlapStart: Math.max(newStart, segStart),
        overlapEnd: Math.min(newEnd, segEnd)
      });
    }
  }
  
  return overlaps;
};

// 2. Function to calculate safe boundaries for a segment
const calculateSegmentBoundaries = (segments, currentIndex) => {
  const sortedSegments = segments
    .map((seg, index) => ({
      ...seg,
      originalIndex: index,
      start: seg.parsed_start !== undefined ? seg.parsed_start : parseFloat(seg.start_time || 0),
      end: seg.parsed_end !== undefined ? seg.parsed_end : parseFloat(seg.end_time || 0)
    }))
    .filter(seg => seg.originalIndex !== currentIndex) // Remove current segment
    .sort((a, b) => a.start - b.start);
  
  let maxStart = 0; // Can't start before video beginning
  let minEnd = duration; // Can't end after video end
  
  // Find the segment immediately before and after current position
  const currentSegment = segments[currentIndex];
  const currentStart = currentSegment.parsed_start !== undefined 
    ? currentSegment.parsed_start 
    : parseFloat(currentSegment.start_time || 0);
  
  // Find previous segment (latest segment that ends before current starts)
  for (let seg of sortedSegments) {
    if (seg.end <= currentStart) {
      maxStart = Math.max(maxStart, seg.end);
    }
  }
  
  // Find next segment (earliest segment that starts after current starts)
  for (let seg of sortedSegments) {
    if (seg.start > currentStart) {
      minEnd = Math.min(minEnd, seg.start);
      break;
    }
  }
  
  return { maxStart, minEnd };
};

// 4. Add this function to handle canceling timeline edit


  // Convert to numbers for analysis
  const numericValues = allTimeValues.map(val => {
    const str = String(val).replace(/[^\d]/g, '');
    return parseInt(str) || 0;
  }).filter(val => val > 0);
  
  if (numericValues.length === 0) return 'seconds';
  
  const maxValue = Math.max(...numericValues);
  const videoDurationSeconds = videoDuration;
  
  console.log(`📊 Time analysis:`, {
    maxValue,
    videoDurationSeconds,
    allValues: numericValues
  });
  
  // ✅ DETECTION LOGIC
  // If ANY value as pure seconds > video duration → Use MMSS
  if (maxValue > videoDurationSeconds) {
    console.log(`✅ DETECTED FORMAT: MMSS (max value ${maxValue}s > video ${videoDurationSeconds}s)`);
    return 'mmss';
  }
  
  // If ALL values as pure seconds ≤ video duration → Use SECONDS
  console.log(`✅ DETECTED FORMAT: SECONDS (all values ≤ video duration)`);
  return 'seconds';
};
const parseWithDetectedFormat = (timeStr, format, isStartTime = true, segmentData = null) => {
  const num = parseInt(timeStr);
  
  if (format === 'seconds') {
    return num;
  }
  
  if (format === 'mmss') {
    // Check for invalid MMSS (seconds part ≥ 60)
    const numStr = String(num);
    if (numStr.length >= 3) {
      const seconds = parseInt(numStr.slice(-2));
      if (seconds >= 60) {
        // Invalid MMSS detected - treat THIS ENTIRE SEGMENT as seconds format
        console.warn(`⚠️ Invalid MMSS detected in segment: ${num} (${seconds} ≥ 60), treating ENTIRE SEGMENT as seconds`);
        return num; // Return as pure seconds
      }
    }
    
    // Valid MMSS conversion
    return convertMMSSToSeconds(num);
  }
  
  return num; // fallback
};

// Updated processClipTuneSegments with corrected logic

const parseMMSSNumber = (numStr) => {
  if (!numStr) return 0;

  numStr = String(numStr).replace(/[^\d]/g, '');

  if (numStr.length <= 2) {
    return parseInt(numStr); // 1 or 2 digits = seconds
  }

  const minutes = parseInt(numStr.slice(0, -2));
  const seconds = parseInt(numStr.slice(-2));

  return (minutes * 60) + seconds;
};
// Convert MMSS format to seconds
const convertMMSSToSeconds = (num) => {
  const numStr = String(num);
  if (numStr.length <= 2) {
    return num; // 1-2 digits = seconds
  }
  
  const minutes = parseInt(numStr.slice(0, -2));
  const seconds = parseInt(numStr.slice(-2));
  
  return (minutes * 60) + seconds;
};

// Add these functions to your ClipTuneGenerator.js file
// Function to get and display current timeline selection
const getCurrentTimelineSelection = () => {
  const [currentStart, currentEnd] = getTrimRange();
  const currentDuration = currentEnd - currentStart;
  
  if (selectedSegmentForEdit) {
    logToTerminal(`✂️ Current selection for Segment ${selectedSegmentForEdit.index + 1}: ${formatTimeFromSeconds(currentStart)} - ${formatTimeFromSeconds(currentEnd)} (${formatTimeFromSeconds(currentDuration)})`, 'info');
  }
  
  return { currentStart, currentEnd, currentDuration };
};
const getEffectiveVolumeWithData = (segmentIndex, segment, musicData) => {
  // If user has set a custom volume, ALWAYS use that (even if 0)
  if (musicData[segmentIndex]?.customVolume !== undefined) {
    return musicData[segmentIndex].customVolume;
  }
  // Otherwise use AI suggestion or default
  return segment.volume || 0.3;
};
// Function to regenerate complete video with updated volumes

const validateSegmentData = (segments, musicData) => {
  console.log('🔍 VALIDATING SEGMENT DATA BEFORE BACKEND CALL:');
  
  const issues = [];
  
  segments.forEach((segment, index) => {
    if (!segment) {
      issues.push(`Segment ${index + 1}: Segment is undefined`);
      return;
    }
    
    // Check required fields
    if (!segment.start_time && segment.parsed_start === undefined) {
      issues.push(`Segment ${index + 1}: Missing start_time and parsed_start`);
    }
    
    if (!segment.end_time && segment.parsed_end === undefined) {
      issues.push(`Segment ${index + 1}: Missing end_time and parsed_end`);
    }
    
    // Check if timing is valid
    const startTime = segment.parsed_start !== undefined ? segment.parsed_start : parseFloat(segment.start_time || 0);
    const endTime = segment.parsed_end !== undefined ? segment.parsed_end : parseFloat(segment.end_time || 30);
    
    if (isNaN(startTime) || isNaN(endTime)) {
      issues.push(`Segment ${index + 1}: Invalid timing values - start: ${startTime}, end: ${endTime}`);
    }
    
    if (startTime >= endTime) {
      issues.push(`Segment ${index + 1}: Start time (${startTime}) >= end time (${endTime})`);
    }
    
    console.log(`✅ Segment ${index + 1} validation:`, {
      hasStartTime: !!segment.start_time,
      hasEndTime: !!segment.end_time,
      hasParsedStart: segment.parsed_start !== undefined,
      hasParsedEnd: segment.parsed_end !== undefined,
      startTime,
      endTime,
      duration: endTime - startTime,
      hasMusicSummary: !!segment.music_summary,
      hasFadeAlgorithm: !!(segment.fade_algorithm || segment.fade_type)
    });
  });
  
  // Check music data
  Object.entries(musicData).forEach(([index, music]) => {
    if (!music) {
      issues.push(`Music ${parseInt(index) + 1}: Music data is undefined`);
      return;
    }
    
    if (!music.audioUrl) {
      issues.push(`Music ${parseInt(index) + 1}: Missing audioUrl`);
    }
    
    if (music.segmentStart === undefined || music.segmentEnd === undefined) {
      issues.push(`Music ${parseInt(index) + 1}: Missing segment timing`);
    }
    
    console.log(`✅ Music ${parseInt(index) + 1} validation:`, {
      hasAudioUrl: !!music.audioUrl,
      hasSegmentStart: music.segmentStart !== undefined,
      hasSegmentEnd: music.segmentEnd !== undefined,
      hasCustomVolume: music.customVolume !== undefined,
      hasActualMusicTiming: !!music.actualMusicTiming
    });
  });
  
  if (issues.length > 0) {
    console.error('❌ VALIDATION ISSUES FOUND:');
    issues.forEach(issue => console.error(`   ${issue}`));
    throw new Error(`Data validation failed: ${issues.join('; ')}`);
  }
  
  console.log('✅ All segment and music data validation passed');
  return true;
};
const validateSegmentTiming = (startTime, endTime, videoDuration) => {
  const start = parseClipTuneTime(startTime);
  const end = parseClipTuneTime(endTime);
  
  // Check if times are within video duration
  if (start >= videoDuration || end >= videoDuration) {
    console.warn(`⚠️ Segment timing exceeds video duration:`, {
      start: `${startTime} → ${start}s`,
      end: `${endTime} → ${end}s`,
      videoDuration: `${videoDuration}s`
    });
    return false;
  }
  
  // Check if start < end
  if (start >= end) {
    console.warn(`⚠️ Invalid segment: start >= end:`, {
      start: `${startTime} → ${start}s`,
      end: `${endTime} → ${end}s`
    });
    return false;
  }
  
  return true;
};


// 5. Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const getEffectiveVolume = (segmentIndex, segment) => {
  // If user has set a custom volume, ALWAYS use that (even if 0)
  if (generatedSegmentMusic[segmentIndex]?.customVolume !== undefined) {
    return generatedSegmentMusic[segmentIndex].customVolume;
  }
  // Otherwise use AI suggestion or default
  return segment.volume || 0.3;
};
// Updated volume change handler for segments
// REPLACE your existing volume control functions in ClipTuneGenerator.js with these FIXED versions:
       const handlePlayInterval = () => {
  if (!selectedTrack || !selectedTrack.audioUrl) {
    showMessage('No track selected or missing audio URL.', 'warning');
    return;
  }

  const audio = new Audio(selectedTrack.audioUrl);
  audio.currentTime = convertTimestampToSeconds(selectedTrack.intervalStart || '0:00');
  audio.volume = previewVolume;

  audio.play();

  setTimeout(() => {
    audio.pause();
  }, convertTimestampToSeconds(selectedTrack.intervalEnd || '0:30') * 1000);
};
// Add this new state variable with your other useState declarations
const [volumeUpdateProgress, setVolumeUpdateProgress] = useState({});

// REPLACE your existing handleSegmentVolumeChange function with this enhanced version
const handleSegmentVolumeChange = async (segmentIndex, newVolume) => {
  const volumeValue = parseFloat(newVolume);
  
  console.log(`🎚️ Starting volume change for segment ${segmentIndex + 1}: ${Math.round(volumeValue * 100)}%`);
  
  // 🚨 NEW: Set loading state for this specific segment
  setVolumeUpdateProgress(prev => ({
    ...prev,
    [segmentIndex]: {
      isUpdating: true,
      progress: 0,
      targetVolume: Math.round(volumeValue * 100)
    }
  }));
  
  // Update state immediately without triggering timeline edits
  const updatedMusicData = {
    ...generatedSegmentMusic,
    [segmentIndex]: {
      ...generatedSegmentMusic[segmentIndex],
      customVolume: volumeValue,
      hasCustomVolume: true
    }
  };
  
  setGeneratedSegmentMusic(updatedMusicData);
  logToTerminal(`🎚️ Volume updated: Segment ${segmentIndex + 1} = ${Math.round(volumeValue * 100)}%`, 'info');
  
  // 🚨 NEW: Simulate progress updates
  const progressInterval = setInterval(() => {
    setVolumeUpdateProgress(prev => {
      const current = prev[segmentIndex];
      if (!current || current.progress >= 90) return prev;
      
      return {
        ...prev,
        [segmentIndex]: {
          ...current,
          progress: Math.min(current.progress + Math.random() * 15, 90)
        }
      };
    });
  }, 200);
  
  // Clear any existing timeout
  if (window.volumeUpdateTimeout) {
    clearTimeout(window.volumeUpdateTimeout);
  }
  
  // Set new timeout for regeneration with updated data
  window.volumeUpdateTimeout = setTimeout(async () => {
    try {
      // Complete the progress
      setVolumeUpdateProgress(prev => ({
        ...prev,
        [segmentIndex]: {
          ...prev[segmentIndex],
          progress: 100
        }
      }));
      
      await regenerateCompleteVideoWithVolumes(updatedMusicData);
      
      // 🚨 NEW: Clear loading state after completion
      setTimeout(() => {
        setVolumeUpdateProgress(prev => {
          const updated = { ...prev };
          delete updated[segmentIndex];
          return updated;
        });
      }, 1000); // Show 100% for 1 second before clearing
      
    } catch (error) {
      console.error(`❌ Volume update failed for segment ${segmentIndex + 1}:`, error);
      
      // 🚨 NEW: Clear loading state on error
      setVolumeUpdateProgress(prev => {
        const updated = { ...prev };
        delete updated[segmentIndex];
        return updated;
      });
      
      logToTerminal(`❌ Volume update failed: ${error.message}`, 'error');
      showMessage(`Failed to update volume for segment ${segmentIndex + 1}`, 'error');
    } finally {
      clearInterval(progressInterval);
    }
  }, 1500);
};


useEffect(() => {
  console.log('🎚️ Generated segment music state updated:', generatedSegmentMusic);
}, [generatedSegmentMusic]);

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Function to jump to a ClipTune segment
// Function to jump to a ClipTune segment and set timeline handles
// REPLACE your existing jumpToClipTuneSegment function with this updated version
const jumpToClipTuneSegment = (segment, segmentIndex) => {
  // 🚨 NEW: Handle both trimmed and full video segments
  let segmentStartTime, segmentEndTime;
  
  if (processedVideoResult?.trim_info) {
    // 🚨 TRIMMED VIDEO: Segments are relative to trimmed video, convert to absolute time
    const trimStart = processedVideoResult.trim_info.original_start;
    
    segmentStartTime = segment.parsed_start !== undefined 
      ? (trimStart + segment.parsed_start)  // Add trim offset
      : (trimStart + parseClipTuneTime(segment.start_time));
      
    segmentEndTime = segment.parsed_end !== undefined 
      ? (trimStart + segment.parsed_end)    // Add trim offset
      : (trimStart + parseClipTuneTime(segment.end_time));
    
    console.log(`🎯 Trimmed video segment ${segmentIndex + 1}:`);
    console.log(`   Relative to trimmed: ${segment.parsed_start || parseClipTuneTime(segment.start_time)}s - ${segment.parsed_end || parseClipTuneTime(segment.end_time)}s`);
    console.log(`   Absolute in full video: ${segmentStartTime}s - ${segmentEndTime}s`);
    
  } else {
    // 🚨 FULL VIDEO: Use segments as-is
    segmentStartTime = segment.parsed_start !== undefined 
      ? segment.parsed_start 
      : parseClipTuneTime(segment.start_time);
      
    segmentEndTime = segment.parsed_end !== undefined 
      ? segment.parsed_end 
      : parseClipTuneTime(segment.end_time);
  }
  
  const width = THUMB_WIDTH * NUM_THUMBS;
  
  if (duration > 0) {
    const startPos = (segmentStartTime / duration) * width;
    const endPos = (segmentEndTime / duration) * width;
    setStartX(Math.max(0, startPos));
    setEndX(Math.min(width, endPos));
    
    // Jump video to that time
    if (videoPreviewRef.current) {
      videoPreviewRef.current.currentTime = segmentStartTime;
    }
    
    // Store the current segment for reference
    setSelectedSegmentForEdit({ segment, index: segmentIndex });
    
    // Log the action
    if (processedVideoResult?.trim_info) {
      logToTerminal(`🎯 Timeline set to trimmed segment ${segmentIndex + 1}: ${formatTimeFromSeconds(segmentStartTime)} - ${formatTimeFromSeconds(segmentEndTime)} (absolute time)`, 'info');
      logToTerminal(`✂️ Segment relative to trimmed video: ${formatTimeFromSeconds(segment.parsed_start || parseClipTuneTime(segment.start_time))} - ${formatTimeFromSeconds(segment.parsed_end || parseClipTuneTime(segment.end_time))}`, 'info');
    } else {
      logToTerminal(`🎯 Timeline set to segment ${segmentIndex + 1}: ${formatTimeFromSeconds(segmentStartTime)} - ${formatTimeFromSeconds(segmentEndTime)}`, 'info');
    }
    
    logToTerminal(`✂️ You can now adjust the handles to fine-tune before generating music`, 'info');
  }
};
const convertTimestampToSeconds = (timestamp) => {
  const parts = timestamp.split(':').map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1]; // MM:SS
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]; // HH:MM:SS
  return 0; // Default to 0 if format is unexpected
};

// Helper function to format seconds as MM:SS
const formatTime = (totalSeconds) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

  // Helper function to stop any playing music and hide the bottom player
  const stopMusicAndHidePlayer = () => {
    if (currentlyPlaying) {
      const audio = audioRefs.current[currentlyPlaying.index]?.current;
      if (audio) {
        audio.pause();
      }
      setCurrentlyPlaying(null);
      setIsPlaying(false);
    }
    setBottomPlayerMenu(false);
    setPlayerVisible(false);
    setPlayerJustOpened(false);
    setPlayerHovered(false);
  };
// Function to handle successful Google login
const handleGoogleLoginSuccess = (userData) => {
  setUser(userData);
  localStorage.setItem('userEmail', userData.email);
  localStorage.setItem('userId', userData.userId);
};
const logToTerminal = useCallback((message, type = 'info') => {
  const timestamp = new Date().toLocaleTimeString();
  const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';

  const logEntry = {
    id: Date.now() + Math.random(),
    timestamp,
    prefix,
    message,
    type
  };

  setTerminalLogs(prev => [...prev, logEntry]);

  // Scroll to bottom
  setTimeout(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, 100);
}, []);
const generateMusicForSegment = async (segment, segmentIndex) => {
  try {
    setSegmentMusicGeneration(prev => ({
      ...prev,
      [segmentIndex]: true,
      [`${segmentIndex}_progress`]: 0
    }));
    
    console.log(`🔍 GENERATING MUSIC FOR SEGMENT ${segmentIndex + 1} WITH WEBHOOK MONITORING`);
    
    // Get the track name for this segment
    const trackName = getTrackName(segmentIndex);
    console.log(`🎵 Track name: "${trackName}"`);
    
    // Handle both trimmed and full video segments
    let segmentStart, segmentEnd, segmentDuration;
    let usingAdjustedTiming = false;
    let isTrimmedVideo = !!processedVideoResult?.trim_info;
    
    if (selectedSegmentForEdit && selectedSegmentForEdit.index === segmentIndex) {
      // Use current timeline selection (user-adjusted)
      const [timelineStart, timelineEnd] = getTrimRange();
      segmentStart = timelineStart;
      segmentEnd = timelineEnd;
      segmentDuration = timelineEnd - timelineStart;
      usingAdjustedTiming = true;
      
      logToTerminal(`🎵 Generating "${trackName}" for segment ${segmentIndex + 1} with ADJUSTED timing...`, 'info');
      logToTerminal(`✂️ Using timeline selection: ${formatTimeFromSeconds(segmentStart)} to ${formatTimeFromSeconds(segmentEnd)}`, 'info');
      
    } else if (isTrimmedVideo) {
      // For trimmed video, use segment timing relative to trimmed video
      const trimStart = processedVideoResult.trim_info.original_start;
      
      // Segments are relative to trimmed video, so convert to absolute time for music generation
      const relativeStart = segment.parsed_start !== undefined 
        ? segment.parsed_start 
        : parseFloat(segment.start_time || 0);
        
      const relativeEnd = segment.parsed_end !== undefined 
        ? segment.parsed_end 
        : parseFloat(segment.end_time || relativeStart + 30);
      
      // Convert to absolute time in the full video
      segmentStart = trimStart + relativeStart;
      segmentEnd = trimStart + relativeEnd;
      segmentDuration = relativeEnd - relativeStart;
      
      logToTerminal(`🎵 Generating "${trackName}" for TRIMMED video segment ${segmentIndex + 1}...`, 'info');
      logToTerminal(`📊 Relative to trimmed: ${formatTimeFromSeconds(relativeStart)} - ${formatTimeFromSeconds(relativeEnd)}`, 'info');
      logToTerminal(`📊 Absolute in full video: ${formatTimeFromSeconds(segmentStart)} - ${formatTimeFromSeconds(segmentEnd)}`, 'info');
      
    } else {
      // Use processed values for full video
      segmentStart = segment.parsed_start !== undefined 
        ? segment.parsed_start 
        : parseFloat(segment.start_time || 0);
        
      segmentEnd = segment.parsed_end !== undefined 
        ? segment.parsed_end 
        : parseFloat(segment.end_time || segmentStart + 30);
        
      segmentDuration = segment.duration || (segmentEnd - segmentStart);
      usingAdjustedTiming = false;
      
      logToTerminal(`🎵 Generating "${trackName}" for FULL video segment ${segmentIndex + 1}...`, 'info');
    }
    
    console.log(`🎯 SEGMENT ${segmentIndex + 1} TIMING:`, {
      trackName,
      segmentStart,
      segmentEnd,
      segmentDuration,
      usingAdjustedTiming,
      isTrimmedVideo,
      trimmedVideoInfo: isTrimmedVideo ? processedVideoResult.trim_info : null
    });
    
    logToTerminal(`🎯 Using AI description: ${segment.music_summary}`, 'info');
    logToTerminal(`⏱️ "${trackName}" will be generated for: ${formatTimeFromSeconds(segmentStart)} to ${formatTimeFromSeconds(segmentEnd)} (${formatTimeFromSeconds(segmentDuration)})`, 'info');
    
    if (!selectedFile) {
      throw new Error('No video file available');
    }

    // Start progress simulation
    const progressInterval = setInterval(() => {
      setSegmentMusicGeneration(prev => {
        const currentProgress = prev[`${segmentIndex}_progress`] || 0;
        const newProgress = Math.min(currentProgress + Math.random() * 15, 95);
        return {
          ...prev,
          [`${segmentIndex}_progress`]: newProgress
        };
      });
    }, 800);
    
    // 🚨 MODIFIED: Use webhook endpoint instead of direct MusicGPT
    const formData = new FormData();
    formData.append('video', selectedFile);
    formData.append('youtubeUrls', JSON.stringify(youtubeUrls.filter(url => url.trim() !== '')));
    formData.append('lyrics', lyrics || '');
    formData.append('extra_description', segment.detailed_description || segment.music_summary || 'Background music for video segment');
    formData.append('instrumental', 'true');
    
    // Include the track name in the song_title and as separate field
    const songTitle = trackName || `segment_${segmentIndex + 1}${usingAdjustedTiming ? '_adjusted' : ''}${isTrimmedVideo ? '_trimmed' : ''}_${segment.format_used || 'processed'}`;
    formData.append('song_title', songTitle);
    formData.append('track_name', trackName);
    
    formData.append('video_start', segmentStart.toString());
    formData.append('video_end', segmentEnd.toString());

    // 🚨 NEW: Add webhook URL for monitoring
    const webhookUrl = "https://webhook.site/5421b69a-6732-41cb-a96f-b19ae1d7faf0";
    formData.append('webhook_url', webhookUrl);

    logToTerminal(`📤 Sending music generation request with webhook monitoring for "${trackName}"...`, 'info');
    logToTerminal(`📡 Webhook URL: ${webhookUrl}`, 'info');

    // 🚨 CHANGED: Call the webhook-enabled endpoint
    const response = await fetch(`${API_BASE_URL}/api/generate-segment-music-with-webhook`, {
      method: 'POST',
      body: formData,
    });

    clearInterval(progressInterval);
    setSegmentMusicGeneration(prev => ({
      ...prev,
      [`${segmentIndex}_progress`]: 100
    }));

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Segment music generation failed');
    }

    const musicData = await response.json();
    
    console.log(`✅ RECEIVED MUSIC RESPONSE FOR "${trackName}" (SEGMENT ${segmentIndex + 1}):`, {
      musicData,
      hasUrl: !!musicData.url,
      hasAudioUrl: !!musicData.audio_url,
      hasTaskId: !!musicData.task_id,
      status: musicData.status
    });
    
    // 🚨 HANDLE DIFFERENT RESPONSE TYPES
    if (musicData.success && musicData.status === 'completed_immediately' && musicData.url) {
      // Music was generated immediately
      logToTerminal(`✅ "${trackName}" generated immediately for segment ${segmentIndex + 1}!`, 'success');
      
      const newMusicData = {
        ...musicData,
        audioUrl: musicData.url,
        trackName: trackName,
        segment: {
          ...segment,
          start_time: segmentStart.toString(),
          end_time: segmentEnd.toString(),
          adjusted_timing: usingAdjustedTiming,
          is_trimmed_video: isTrimmedVideo,
          track_name: trackName
        },
        segmentStart,
        segmentEnd,
        segmentDuration,
        customVolume: segment.volume || 0.3,
        actualMusicTiming: {
          start: segmentStart,
          end: segmentEnd,
          duration: segmentDuration,
          wasAdjusted: usingAdjustedTiming,
          isTrimmedVideo: isTrimmedVideo,
          trackName: trackName,
          trimmedVideoInfo: isTrimmedVideo ? {
            generationMethod: 'musicgpt_webhook_immediate',
            originalTrimStart: processedVideoResult.trim_info.original_start,
            originalTrimEnd: processedVideoResult.trim_info.original_end,
            relativeStart: isTrimmedVideo ? (segmentStart - processedVideoResult.trim_info.original_start) : segmentStart,
            relativeEnd: isTrimmedVideo ? (segmentEnd - processedVideoResult.trim_info.original_start) : segmentEnd
          } : null
        }
      };

      // Store the music data and update progressive video immediately
      await handleMusicDataAndProgressiveVideo(newMusicData, segmentIndex);
      
    } else if (musicData.success && musicData.status === 'processing' && musicData.task_id) {
      // Music generation started asynchronously - start webhook monitoring
      logToTerminal(`🔄 "${trackName}" generation started for segment ${segmentIndex + 1}. Starting webhook monitoring...`, 'info');
      logToTerminal(`🆔 Task ID: ${musicData.task_id}`, 'info');
      logToTerminal(`📡 Monitoring webhook: ${webhookUrl}`, 'info');
      
      // 🚨 NEW: Start webhook monitoring for this segment
      const webhookToken = extractWebhookToken(webhookUrl);
      
      try {
        // Monitor webhook for completion
        const webhookResult = await monitorWebhookForSegment({
          webhookToken: webhookToken,
          trackName: trackName,
          segmentIndex: segmentIndex,
          maxPollMinutes: 5,
          pollIntervalSeconds: 10,
          minRequests: 1
        });
        
        if (webhookResult.success && webhookResult.audioUrl) {
          logToTerminal(`✅ "${trackName}" completed via webhook monitoring for segment ${segmentIndex + 1}!`, 'success');
          
          const newMusicData = {
            audioUrl: webhookResult.audioUrl,
            url: webhookResult.audioUrl,
            title: webhookResult.title || trackName,
            trackName: trackName,
            duration: webhookResult.duration,
            segment: {
              ...segment,
              start_time: segmentStart.toString(),
              end_time: segmentEnd.toString(),
              adjusted_timing: usingAdjustedTiming,
              is_trimmed_video: isTrimmedVideo,
              track_name: trackName
            },
            segmentStart,
            segmentEnd,
            segmentDuration,
            customVolume: segment.volume || 0.3,
            actualMusicTiming: {
              start: segmentStart,
              end: segmentEnd,
              duration: segmentDuration,
              wasAdjusted: usingAdjustedTiming,
              isTrimmedVideo: isTrimmedVideo,
              trackName: trackName,
              trimmedVideoInfo: isTrimmedVideo ? {
                generationMethod: 'musicgpt_webhook_monitoring',
                originalTrimStart: processedVideoResult.trim_info.original_start,
                originalTrimEnd: processedVideoResult.trim_info.original_end,
                relativeStart: isTrimmedVideo ? (segmentStart - processedVideoResult.trim_info.original_start) : segmentStart,
                relativeEnd: isTrimmedVideo ? (segmentEnd - processedVideoResult.trim_info.original_start) : segmentEnd
              } : null
            }
          };

          // Store the music data and update progressive video
          await handleMusicDataAndProgressiveVideo(newMusicData, segmentIndex);
          
        } else {
          throw new Error(`Webhook monitoring failed: ${webhookResult.error || 'Unknown error'}`);
        }
        
      } catch (webhookError) {
        console.error(`❌ Webhook monitoring failed for "${trackName}":`, webhookError.message);
        logToTerminal(`❌ Webhook monitoring failed for "${trackName}": ${webhookError.message}`, 'error');
        
        // 🚨 FALLBACK: Try polling the task ID directly
        logToTerminal(`🔄 Falling back to task ID polling for "${trackName}"...`, 'info');
        
        try {
          const taskResult = await pollMusicGPTTask(musicData.task_id, trackName, 3); // 3 minute timeout
          
          if (taskResult.success && taskResult.audioUrl) {
            logToTerminal(`✅ "${trackName}" completed via task polling for segment ${segmentIndex + 1}!`, 'success');
            
            const newMusicData = {
              audioUrl: taskResult.audioUrl,
              url: taskResult.audioUrl,
              title: taskResult.title || trackName,
              trackName: trackName,
              duration: taskResult.duration,
              segment: {
                ...segment,
                start_time: segmentStart.toString(),
                end_time: segmentEnd.toString(),
                adjusted_timing: usingAdjustedTiming,
                is_trimmed_video: isTrimmedVideo,
                track_name: trackName
              },
              segmentStart,
              segmentEnd,
              segmentDuration,
              customVolume: segment.volume || 0.3,
              actualMusicTiming: {
                start: segmentStart,
                end: segmentEnd,
                duration: segmentDuration,
                wasAdjusted: usingAdjustedTiming,
                isTrimmedVideo: isTrimmedVideo,
                trackName: trackName,
                trimmedVideoInfo: isTrimmedVideo ? {
                  generationMethod: 'musicgpt_task_polling',
                  originalTrimStart: processedVideoResult.trim_info.original_start,
                  originalTrimEnd: processedVideoResult.trim_info.original_end,
                  relativeStart: isTrimmedVideo ? (segmentStart - processedVideoResult.trim_info.original_start) : segmentStart,
                  relativeEnd: isTrimmedVideo ? (segmentEnd - processedVideoResult.trim_info.original_start) : segmentEnd
                } : null
              }
            };

            // Store the music data and update progressive video
            await handleMusicDataAndProgressiveVideo(newMusicData, segmentIndex);
            
          } else {
            throw new Error(`Task polling also failed: ${taskResult.error || 'Unknown error'}`);
          }
          
        } catch (taskError) {
          console.error(`❌ Task polling also failed for "${trackName}":`, taskError.message);
          logToTerminal(`❌ Both webhook monitoring and task polling failed for "${trackName}"`, 'error');
          throw new Error(`Music generation failed: ${taskError.message}`);
        }
      }
      
    } else {
      throw new Error(`Unexpected response format: ${JSON.stringify(musicData)}`);
    }

  } catch (error) {
    console.error(`❌ Error generating music for segment ${segmentIndex + 1}:`, error);
    logToTerminal(`❌ Failed to generate "${getTrackName(segmentIndex)}" for segment ${segmentIndex + 1}: ${error.message}`, 'error');
    showMessage(`Failed to generate music: ${error.message}`, 'error');
  } finally {
    setSegmentMusicGeneration(prev => {
      const updated = { ...prev };
      delete updated[segmentIndex];
      delete updated[`${segmentIndex}_progress`];
      return updated;
    });
  }
};

// 🚨 NEW: Helper function to handle music data storage and progressive video update
async function handleMusicDataAndProgressiveVideo(newMusicData, segmentIndex) {
  try {
    // Store the music data
    setGeneratedSegmentMusic(prev => {
      const updated = {
        ...prev,
        [segmentIndex]: newMusicData
      };
      
      console.log(`🔄 UPDATED generatedSegmentMusic STATE WITH TRACK NAME:`, {
        trackName: newMusicData.trackName,
        segmentIndex: segmentIndex,
        totalSegments: Object.keys(updated).length,
        isTrimmedVideo: newMusicData.actualMusicTiming?.isTrimmedVideo || false
      });
      
      return updated;
    });

    logToTerminal(`💾 "${newMusicData.trackName}" data stored for segment ${segmentIndex + 1}`, 'success');

    // Update progressive video
    logToTerminal(`🎬 Creating progressive video with "${newMusicData.trackName}" (segment ${segmentIndex + 1})...`, 'info');
    
    const allSegments = processedVideoResult.segments;
    const allMusicData = {
      ...generatedSegmentMusic,
      [segmentIndex]: newMusicData
    };
    
    console.log('📊 Progressive video update data:', {
      totalSegments: allSegments.length,
      segmentsWithMusic: Object.keys(allMusicData).length,
      newSegmentIndex: segmentIndex,
      newTrackName: newMusicData.trackName,
      isTrimmedVideo: newMusicData.actualMusicTiming?.isTrimmedVideo || false
    });

    const progressiveFormData = new FormData();
    progressiveFormData.append('video', selectedFile);
    progressiveFormData.append('segments', JSON.stringify(allSegments));
    progressiveFormData.append('musicData', JSON.stringify(allMusicData));
    progressiveFormData.append('videoDuration', duration.toString());
    progressiveFormData.append('newSegmentIndex', segmentIndex.toString());
    
    // Add trimmed video info if applicable
    if (newMusicData.actualMusicTiming?.isTrimmedVideo && processedVideoResult.trim_info) {
      progressiveFormData.append('trimInfo', JSON.stringify(processedVideoResult.trim_info));
    }

    logToTerminal(`📤 Sending progressive video request...`, 'info');

    const progressiveResponse = await fetch(`${API_BASE_URL}/api/update-progressive-video`, {
      method: 'POST',
      body: progressiveFormData,
    });

    if (!progressiveResponse.ok) {
      const errorData = await progressiveResponse.json();
      throw new Error(errorData.details || errorData.error || 'Progressive video update failed');
    }

    const progressiveResult = await progressiveResponse.json();
    
    if (!progressiveResult.combinedUrl) {
      throw new Error('No progressive video URL received');
    }

    // Update state after successful progressive video creation
    setCombinedVideoUrl(progressiveResult.combinedUrl);
    setShowProcessedVideo(true);

    logToTerminal(`✅ Progressive video created successfully with "${newMusicData.trackName}"!`, 'success');
    logToTerminal(`🎵 Active segments: [${progressiveResult.allActiveSegments?.join(', ') || segmentIndex + 1}]`, 'info');
    logToTerminal(`🔗 Video URL: ${progressiveResult.combinedUrl}`, 'success');

    // Update the music data with progressive video ready flag
    setGeneratedSegmentMusic(prev => ({
      ...prev,
      [segmentIndex]: {
        ...prev[segmentIndex],
        progressiveVideoReady: true,
        progressiveVideoUrl: progressiveResult.combinedUrl
      }
    }));

    // Auto-play the progressive video
    setTimeout(() => {
      const progressiveVideo = document.querySelector('#progressive-video-container video');
      if (progressiveVideo) {
        const playbackStart = newMusicData.actualMusicTiming?.start || newMusicData.segmentStart;
        progressiveVideo.currentTime = playbackStart;
        progressiveVideo.play().catch(err => {
          console.log('Autoplay blocked, user will need to click play');
        });
        logToTerminal(`🎬 Auto-playing "${newMusicData.trackName}" (segment ${segmentIndex + 1}) from progressive video`, 'success');
      }
    }, 500);

    // Show success message with track name
    showMessage(`"${newMusicData.trackName}" generated and video updated for segment ${segmentIndex + 1}!`, 'success');

    // Save to recent tracks with track name
    try {
      await fetch(`${API_BASE_URL}/api/save-recent-track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: localStorage.getItem('userId'),
          audioUrl: newMusicData.audioUrl,
          duration: `${newMusicData.segmentDuration}s`,
          description: newMusicData.segment.music_summary || 'Generated music',
          lyrics: lyrics || '',
          youtubeUrls: youtubeUrls.filter(url => url.trim() !== ''),
          start: formatTime(newMusicData.segmentStart),
          end: formatTime(newMusicData.segmentEnd),
          trackName: newMusicData.trackName,
          segmentIndex: segmentIndex,
          originalFileName: selectedFile?.name || 'unknown_video'
        })
      });
      logToTerminal(`💾 "${newMusicData.trackName}" saved to recent tracks`, 'success');
    } catch (saveError) {
      console.warn('Failed to save to recent tracks:', saveError);
    }

  } catch (progressiveError) {
    console.error(`❌ Progressive video update failed:`, progressiveError);
    logToTerminal(`⚠️ "${newMusicData.trackName}" generated but video update failed: ${progressiveError.message}`, 'warning');
    showMessage(`"${newMusicData.trackName}" generated for segment ${segmentIndex + 1} but video update failed`, 'warning');
    
    // Still mark music as generated but without progressive video
    setGeneratedSegmentMusic(prev => ({
      ...prev,
      [segmentIndex]: {
        ...prev[segmentIndex],
        progressiveVideoReady: false,
        progressiveVideoError: progressiveError.message
      }
    }));
  }

  // Clear the selected segment for edit since music has been generated
  if (selectedSegmentForEdit && selectedSegmentForEdit.index === segmentIndex) {
    setSelectedSegmentForEdit(null);
    logToTerminal(`✂️ Segment timing adjustment completed and cleared`, 'info');
  }
}

// 🚨 FIXED: Helper function to monitor webhook for specific segment - looks for MP3 in multiple requests
async function monitorWebhookForSegment(options) {
  const { webhookToken, trackName, segmentIndex, maxPollMinutes = 5, pollIntervalSeconds = 10, minRequests = 3 } = options;
  
  try {
    logToTerminal(`📡 Starting webhook monitoring for "${trackName}" - waiting for ${minRequests} requests`, 'info');
    
    const response = await fetch(`${API_BASE_URL}/api/monitor-webhook-for-segment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        webhookToken,
        trackName,
        segmentIndex,
        maxPollMinutes,
        pollIntervalSeconds,
        minRequests  // 🚨 FIXED: Pass the correct minRequests (3)
      })
    });

    if (!response.ok) {
      throw new Error(`Webhook monitoring request failed: ${response.status}`);
    }

    const result = await response.json();
    
    // 🚨 ENHANCED: Look for MP3 URL in any of the collected requests
    if (result.success && result.allMp3Files && result.allMp3Files.length > 0) {
      // Found MP3 files - use the first one
      const mp3File = result.allMp3Files[0];
      logToTerminal(`🎵 Found MP3 for "${trackName}": ${mp3File.title}`, 'success');
      
      return {
        success: true,
        audioUrl: mp3File.url,
        title: mp3File.title,
        duration: mp3File.mp3Duration,
        allMp3Files: result.allMp3Files
      };
    } else if (result.success && result.audioUrl) {
      // Single audio URL found
      return {
        success: true,
        audioUrl: result.audioUrl,
        title: result.title,
        duration: result.duration
      };
    } else if (result.success && result.webhookData) {
      // Check webhook data directly for audio URLs
      const webhookData = result.webhookData;
      const audioUrl = webhookData.conversion_path || webhookData.audio_url || webhookData.conversion_path_wav;
      
      if (audioUrl) {
        logToTerminal(`🎵 Found audio URL in webhook data for "${trackName}"`, 'success');
        return {
          success: true,
          audioUrl: audioUrl,
          title: webhookData.title || trackName,
          duration: webhookData.conversion_duration
        };
      }
    }
    
    // No audio URL found in any requests
    logToTerminal(`❌ No MP3 URL found in ${minRequests} webhook requests for "${trackName}"`, 'error');
    return {
      success: false,
      error: `No MP3 URL found in ${minRequests} webhook requests`,
      requestsCollected: result.monitoringInfo?.requestsFound || 0
    };
    
  } catch (error) {
    console.error('Error in webhook monitoring:', error);
    logToTerminal(`❌ Webhook monitoring error for "${trackName}": ${error.message}`, 'error');
    return {
      success: false,
      error: error.message
    };
  }
}

// 🚨 NEW: Helper function to poll MusicGPT task as fallback
async function pollMusicGPTTask(taskId, trackName, timeoutMinutes = 3) {
  const maxAttempts = timeoutMinutes * 2; // Poll every 30 seconds
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/check-musicgpt-task-detailed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, trackName })
      });

      if (!response.ok) {
        throw new Error(`Task check failed: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.audio_url) {
        return {
          success: true,
          audioUrl: result.audio_url,
          title: result.title,
          duration: result.duration
        };
      }
      
      // If not ready, wait 30 seconds and try again
      if (attempts < maxAttempts - 1) {
        logToTerminal(`⏳ "${trackName}" still processing... (attempt ${attempts + 1}/${maxAttempts})`, 'info');
        await new Promise(resolve => setTimeout(resolve, 30000)); // 30 seconds
      }
      
      attempts++;
      
    } catch (error) {
      console.error(`Task polling attempt ${attempts + 1} failed:`, error);
      attempts++;
      
      if (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 30000)); // Wait before retry
      }
    }
  }
  
  return {
    success: false,
    error: `Task polling timeout after ${timeoutMinutes} minutes`
  };
}

// 🚨 NEW: Helper function to extract webhook token from URL
function extractWebhookToken(webhookUrl) {
  const match = webhookUrl.match(/webhook\.site\/([a-f0-9-]+)/);
  return match ? match[1] : null;
}

// 🚨 NEW: Helper function to handle music data storage and progressive video update
async function handleMusicDataAndProgressiveVideo(newMusicData, segmentIndex) {
  try {
    // Store the music data
    setGeneratedSegmentMusic(prev => {
      const updated = {
        ...prev,
        [segmentIndex]: newMusicData
      };
      
      console.log(`🔄 UPDATED generatedSegmentMusic STATE WITH TRACK NAME:`, {
        trackName: newMusicData.trackName,
        segmentIndex: segmentIndex,
        totalSegments: Object.keys(updated).length,
        isTrimmedVideo: newMusicData.actualMusicTiming?.isTrimmedVideo || false
      });
      
      return updated;
    });

    logToTerminal(`💾 "${newMusicData.trackName}" data stored for segment ${segmentIndex + 1}`, 'success');

    // Update progressive video
    logToTerminal(`🎬 Creating progressive video with "${newMusicData.trackName}" (segment ${segmentIndex + 1})...`, 'info');
    
    const allSegments = processedVideoResult.segments;
    const allMusicData = {
      ...generatedSegmentMusic,
      [segmentIndex]: newMusicData
    };
    
    console.log('📊 Progressive video update data:', {
      totalSegments: allSegments.length,
      segmentsWithMusic: Object.keys(allMusicData).length,
      newSegmentIndex: segmentIndex,
      newTrackName: newMusicData.trackName,
      isTrimmedVideo: newMusicData.actualMusicTiming?.isTrimmedVideo || false
    });

    const progressiveFormData = new FormData();
    progressiveFormData.append('video', selectedFile);
    progressiveFormData.append('segments', JSON.stringify(allSegments));
    progressiveFormData.append('musicData', JSON.stringify(allMusicData));
    progressiveFormData.append('videoDuration', duration.toString());
    progressiveFormData.append('newSegmentIndex', segmentIndex.toString());
    
    // Add trimmed video info if applicable
    if (newMusicData.actualMusicTiming?.isTrimmedVideo && processedVideoResult.trim_info) {
      progressiveFormData.append('trimInfo', JSON.stringify(processedVideoResult.trim_info));
    }

    logToTerminal(`📤 Sending progressive video request...`, 'info');

    const progressiveResponse = await fetch(`${API_BASE_URL}/api/update-progressive-video`, {
      method: 'POST',
      body: progressiveFormData,
    });

    if (!progressiveResponse.ok) {
      const errorData = await progressiveResponse.json();
      throw new Error(errorData.details || errorData.error || 'Progressive video update failed');
    }

    const progressiveResult = await progressiveResponse.json();
    
    if (!progressiveResult.combinedUrl) {
      throw new Error('No progressive video URL received');
    }

    // Update state after successful progressive video creation
    setCombinedVideoUrl(progressiveResult.combinedUrl);
    setShowProcessedVideo(true);

    logToTerminal(`✅ Progressive video created successfully with "${newMusicData.trackName}"!`, 'success');
    logToTerminal(`🎵 Active segments: [${progressiveResult.allActiveSegments?.join(', ') || segmentIndex + 1}]`, 'info');
    logToTerminal(`🔗 Video URL: ${progressiveResult.combinedUrl}`, 'success');

    // Update the music data with progressive video ready flag
    setGeneratedSegmentMusic(prev => ({
      ...prev,
      [segmentIndex]: {
        ...prev[segmentIndex],
        progressiveVideoReady: true,
        progressiveVideoUrl: progressiveResult.combinedUrl
      }
    }));

    // Auto-play the progressive video
    setTimeout(() => {
      const progressiveVideo = document.querySelector('#progressive-video-container video');
      if (progressiveVideo) {
        const playbackStart = newMusicData.actualMusicTiming?.start || newMusicData.segmentStart;
        progressiveVideo.currentTime = playbackStart;
        progressiveVideo.play().catch(err => {
          console.log('Autoplay blocked, user will need to click play');
        });
        logToTerminal(`🎬 Auto-playing "${newMusicData.trackName}" (segment ${segmentIndex + 1}) from progressive video`, 'success');
      }
    }, 500);

    // Show success message with track name
    showMessage(`"${newMusicData.trackName}" generated and video updated for segment ${segmentIndex + 1}!`, 'success');

    // Save to recent tracks with track name
    try {
      await fetch(`${API_BASE_URL}/api/save-recent-track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: localStorage.getItem('userId'),
          audioUrl: newMusicData.audioUrl,
          duration: `${newMusicData.segmentDuration}s`,
          description: newMusicData.segment.music_summary || 'Generated music',
          lyrics: lyrics || '',
          youtubeUrls: youtubeUrls.filter(url => url.trim() !== ''),
          start: formatTime(newMusicData.segmentStart),
          end: formatTime(newMusicData.segmentEnd),
          trackName: newMusicData.trackName,
          segmentIndex: segmentIndex,
          originalFileName: selectedFile?.name || 'unknown_video'
        })
      });
      logToTerminal(`💾 "${newMusicData.trackName}" saved to recent tracks`, 'success');
    } catch (saveError) {
      console.warn('Failed to save to recent tracks:', saveError);
    }

  } catch (progressiveError) {
    console.error(`❌ Progressive video update failed:`, progressiveError);
    logToTerminal(`⚠️ "${newMusicData.trackName}" generated but video update failed: ${progressiveError.message}`, 'warning');
    showMessage(`"${newMusicData.trackName}" generated for segment ${segmentIndex + 1} but video update failed`, 'warning');
    
    // Still mark music as generated but without progressive video
    setGeneratedSegmentMusic(prev => ({
      ...prev,
      [segmentIndex]: {
        ...prev[segmentIndex],
        progressiveVideoReady: false,
        progressiveVideoError: progressiveError.message
      }
    }));
  }

  // Clear the selected segment for edit since music has been generated
  if (selectedSegmentForEdit && selectedSegmentForEdit.index === segmentIndex) {
    setSelectedSegmentForEdit(null);
    logToTerminal(`✂️ Segment timing adjustment completed and cleared`, 'info');
  }
}

// 🚨 NEW: Helper function to monitor webhook for specific segment
async function monitorWebhookForSegment(options) {
  const { webhookToken, trackName, segmentIndex, maxPollMinutes = 5, pollIntervalSeconds = 10, minRequests = 1 } = options;
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/monitor-webhook-for-segment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        webhookToken,
        trackName,
        segmentIndex,
        maxPollMinutes,
        pollIntervalSeconds,
        minRequests
      })
    });

    if (!response.ok) {
      throw new Error(`Webhook monitoring request failed: ${response.status}`);
    }

    const result = await response.json();
    return result;
    
  } catch (error) {
    console.error('Error in webhook monitoring:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 🚨 NEW: Helper function to poll MusicGPT task as fallback
async function pollMusicGPTTask(taskId, trackName, timeoutMinutes = 3) {
  const maxAttempts = timeoutMinutes * 2; // Poll every 30 seconds
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/check-musicgpt-task-detailed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, trackName })
      });

      if (!response.ok) {
        throw new Error(`Task check failed: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.audio_url) {
        return {
          success: true,
          audioUrl: result.audio_url,
          title: result.title,
          duration: result.duration
        };
      }
      
      // If not ready, wait 30 seconds and try again
      if (attempts < maxAttempts - 1) {
        logToTerminal(`⏳ "${trackName}" still processing... (attempt ${attempts + 1}/${maxAttempts})`, 'info');
        await new Promise(resolve => setTimeout(resolve, 30000)); // 30 seconds
      }
      
      attempts++;
      
    } catch (error) {
      console.error(`Task polling attempt ${attempts + 1} failed:`, error);
      attempts++;
      
      if (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 30000)); // Wait before retry
      }
    }
  }
  
  return {
    success: false,
    error: `Task polling timeout after ${timeoutMinutes} minutes`
  };
}

// 🚨 NEW: Helper function to extract webhook token from URL
function extractWebhookToken(webhookUrl) {
  const match = webhookUrl.match(/webhook\.site\/([a-f0-9-]+)/);
  return match ? match[1] : null;
}
// 3. UPDATE the segment display UI to show individ
// Updated processClipTuneSegments with proper invalid MMSS detection
const processClipTuneSegments = (segments, videoDuration) => {
  if (!segments || segments.length === 0) {
    console.warn('⚠️ No segments provided to processClipTuneSegments');
    return [];
  }
  
  if (!videoDuration || videoDuration <= 0) {
    console.warn('⚠️ Invalid video duration provided to processClipTuneSegments:', videoDuration);
    return [];
  }
  
  console.log(`🔄 Processing ${segments.length} ClipTune segments for video duration: ${formatTimeFromSeconds(videoDuration)}`);
  
  // ✅ DETECT FORMAT ONCE FOR ALL SEGMENTS
  const detectedFormat = detectTimeFormat(segments, videoDuration);
  
  let validSegments = [];
  let skippedSegments = [];
  
  // Helper function to check if a number has invalid MMSS format
  const hasInvalidMMSS = (numStr) => {
    if (numStr.length === 1) {
      // Single digit is always valid (0-9 seconds)
      return false;
    } else if (numStr.length === 2) {
      // Two digits: check if ≥ 60 (invalid seconds)
      const num = parseInt(numStr);
      return num >= 60;
    } else {
      // Three or more digits: check last two digits for seconds part
      const seconds = parseInt(numStr.slice(-2));
      return seconds >= 60;
    }
  };
  
  // Process segments using detected format
  const processedSegments = segments
    .map((segment, index) => {
      if (!segment) {
        console.warn(`⚠️ Segment ${index + 1} is null or undefined`);
        skippedSegments.push({ index: index + 1, reason: 'null segment' });
        return null;
      }
      
      let start, end, formatUsed = detectedFormat;
      let segmentUsesSecondsFormat = false;
      
      try {
        const startStr = String(segment.start_time).replace(/[^\d]/g, '');
        const endStr = String(segment.end_time).replace(/[^\d]/g, '');
        
        // ✅ CHECK IF THIS SEGMENT SHOULD USE SECONDS FORMAT
        if (detectedFormat === 'mmss') {
          let shouldUseSeconds = false;
          
          // Check start time for invalid MMSS
          if (hasInvalidMMSS(startStr)) {
            shouldUseSeconds = true;
            const invalidPart = startStr.length >= 3 ? startStr.slice(-2) : startStr;
            console.warn(`⚠️ Segment ${index + 1}: Start time ${startStr} has invalid MMSS (${invalidPart} ≥ 60)`);
          }
          
          // Check end time for invalid MMSS
          if (hasInvalidMMSS(endStr)) {
            shouldUseSeconds = true;
            const invalidPart = endStr.length >= 3 ? endStr.slice(-2) : endStr;
            console.warn(`⚠️ Segment ${index + 1}: End time ${endStr} has invalid MMSS (${invalidPart} ≥ 60)`);
          }
          
          // ✅ IF ANY INVALID MMSS FOUND, TREAT ENTIRE SEGMENT AS SECONDS
          if (shouldUseSeconds) {
            console.warn(`⚠️ Segment ${index + 1}: Using SECONDS format for ENTIRE segment due to invalid MMSS`);
            start = parseInt(startStr);
            end = parseInt(endStr);
            segmentUsesSecondsFormat = true;
            formatUsed = 'seconds_override';
          } else {
            // Valid MMSS for both start and end
            start = convertMMSSToSeconds(parseInt(startStr));
            end = convertMMSSToSeconds(parseInt(endStr));
            formatUsed = 'mmss';
          }
        } else {
          // Use seconds format for entire detection
          start = parseInt(startStr);
          end = parseInt(endStr);
          formatUsed = 'seconds';
        }
        
        // Log the conversion for debugging
        if (segmentUsesSecondsFormat) {
          console.log(`🔄 Segment ${index + 1} conversion (SECONDS): ${startStr}→${start}s, ${endStr}→${end}s`);
        } else if (detectedFormat === 'mmss') {
          console.log(`🔄 Segment ${index + 1} conversion (MMSS): ${startStr}→${start}s, ${endStr}→${end}s`);
        }
        
      } catch (error) {
        console.error(`❌ Error parsing times for segment ${index + 1}:`, error);
        skippedSegments.push({ 
          index: index + 1, 
          reason: 'parsing error', 
          error: error.message,
          start_time: segment.start_time,
          end_time: segment.end_time
        });
        return null;
      }
      
      // Validate parsed times
      if (isNaN(start) || isNaN(end)) {
        console.warn(`❌ Invalid parsed times for segment ${index + 1}: start=${start}, end=${end}`);
        skippedSegments.push({ 
          index: index + 1, 
          reason: 'invalid parsed times',
          original_start: segment.start_time,
          original_end: segment.end_time,
          parsed_start: start,
          parsed_end: end
        });
        return null;
      }
      
      // Validate timing logic
      if (start > videoDuration || end >= videoDuration) {
        console.warn(`❌ Segment ${index + 1} exceeds video duration: ${start}s - ${end}s (video: ${videoDuration}s)`);
        skippedSegments.push({ 
          index: index + 1, 
          reason: 'exceeds video duration',
          start,
          end,
          videoDuration
        });
        return null;
      }
      
      if (start >= end) {
        console.warn(`❌ Segment ${index + 1} has invalid timing: start >= end (${start}s >= ${end}s)`);
        skippedSegments.push({ 
          index: index + 1, 
          reason: 'start >= end',
          start,
          end
        });
        return null;
      }
      
      const duration = end - start;
      
      // Validate minimum duration (at least 0.1 second)
      if (duration < 0.1) {
        console.warn(`❌ Segment ${index + 1} too short: ${duration}s`);
        skippedSegments.push({ 
          index: index + 1, 
          reason: 'too short',
          duration
        });
        return null;
      }
      
      // Check for overlaps with previously processed segments
      const hasOverlap = validSegments.some(validSeg => {
        return (start < validSeg.parsed_end && end > validSeg.parsed_start);
      });
      
      if (hasOverlap) {
        console.warn(`❌ Segment ${index + 1} overlaps with existing segment: ${start}s - ${end}s`);
        skippedSegments.push({ 
          index: index + 1, 
          reason: 'overlaps with existing segment',
          start,
          end
        });
        return null;
      }
      
      // Create processed segment
      const processedSegment = {
        ...segment, // Keep all original properties
        
        // Update time strings to be consistent (in seconds)
        start_time: start.toString(),
        end_time: end.toString(),
        
        // Add parsed values for easy access
        parsed_start: start,
        parsed_end: end,
        duration: duration,
        
        // Add processing metadata
        format_used: formatUsed,
        processing_metadata: {
          original_start_time: segment.start_time,
          original_end_time: segment.end_time,
          parsed_start: start,
          parsed_end: end,
          duration: duration,
          format_detected: detectedFormat,
          format_actually_used: formatUsed,
          segment_used_seconds_override: segmentUsesSecondsFormat,
          processed_at: new Date().toISOString()
        },
        
        // Add validation flags
        is_valid: true,
        validation_passed: true
      };
      
      validSegments.push(processedSegment);
      
      const formatDisplay = segmentUsesSecondsFormat ? 'seconds_override' : formatUsed;
      console.log(`✅ Segment ${index + 1}: ${formatTimeFromSeconds(start)} - ${formatTimeFromSeconds(end)} (${formatTimeFromSeconds(duration)}) [${formatDisplay}]`);
      
      return processedSegment;
    })
    .filter(segment => segment !== null); // Remove invalid segments
  
  // Sort segments by start time to ensure proper order
  processedSegments.sort((a, b) => a.parsed_start - b.parsed_start);
  
  // Log processing summary
  console.log(`📊 PROCESSING SUMMARY:`);
  console.log(`   • Detected format: ${detectedFormat.toUpperCase()}`);
  console.log(`   • Total input segments: ${segments.length}`);
  console.log(`   • Valid processed segments: ${processedSegments.length}`);
  console.log(`   • Skipped segments: ${skippedSegments.length}`);
  
  if (skippedSegments.length > 0) {
    console.log(`⚠️ SKIPPED SEGMENTS:`, skippedSegments);
  }
  
  console.log(`✅ Final processed segments: ${processedSegments.length} valid segments`);
  
  return processedSegments;
};
// REPLACE your playSegmentWithMusic function with this FIXED version for second segment:

// REPLACE your playSegmentWithMusic function in ClipTuneGenerator.js with this optimized version
// This will instantly play auto-combined videos without regenerating them

// REPLACE your existing playSegmentWithMusic function with this progressive version
// REPLACE your existing playSegmentWithMusic function with this simple version
// REPLACE your existing playSegmentWithMusic function with this fixed version:

const playSegmentWithMusic = async (segmentIndex) => {
  console.log(`🔍 PLAYING SEGMENT: ${segmentIndex + 1}`);
  
  const musicData = generatedSegmentMusic[segmentIndex];
  if (!musicData) {
    console.error(`❌ No music data found for segment ${segmentIndex}`);
    showMessage('No music generated for this segment yet', 'error');
    return;
  }

  // Check if music was removed
  if (musicData.removed === true) {
    showMessage('This segment music was removed. Restore it first to play.', 'warning');
    return;
  }

  try {
    logToTerminal(`🎬 Playing segment ${segmentIndex + 1}...`, 'info');

    // Get the timing for this segment
    const segmentStart = musicData.actualMusicTiming?.start || 
                        musicData.segmentStart || 
                        parseFloat(processedVideoResult.segments[segmentIndex]?.start_time || 0);

    const segmentEnd = musicData.actualMusicTiming?.end || 
                      musicData.segmentEnd || 
                      parseFloat(processedVideoResult.segments[segmentIndex]?.end_time || segmentStart + 30);

    console.log(`🎯 Segment ${segmentIndex + 1} timing: ${segmentStart}s - ${segmentEnd}s`);

    // Try to find the progressive video first, then fall back to main video preview
    let videoElement = null;
    
    // Try multiple selectors to find the video element
    const videoSelectors = [
      '#progressive-video-container video',
      '#video-preview-container video',
      'video[controls]', // Any video with controls
    ];
    
    for (const selector of videoSelectors) {
      videoElement = document.querySelector(selector);
      if (videoElement) {
        console.log(`✅ Found video element with selector: ${selector}`);
        break;
      }
    }
    
    // Fallback to videoPreviewRef if available
    if (!videoElement && videoPreviewRef.current) {
      videoElement = videoPreviewRef.current;
      console.log(`✅ Using videoPreviewRef as fallback`);
    }
    
    if (!videoElement) {
      throw new Error('No video player found on the page');
    }

    // Check if we have a combined video URL, otherwise use original video
    const videoSource = combinedVideoUrl || videoUrl;
    if (!videoSource) {
      throw new Error('No video source available');
    }

    // Make sure the video has the right source
    if (videoElement.src !== videoSource) {
      console.log(`🔄 Updating video source from ${videoElement.src} to ${videoSource}`);
      videoElement.src = videoSource;
    }

    // Wait for video to be ready
    if (videoElement.readyState < 2) {
      console.log('⏳ Waiting for video to load...');
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Video load timeout')), 10000);
        
        const onLoaded = () => {
          clearTimeout(timeout);
          videoElement.removeEventListener('loadeddata', onLoaded);
          videoElement.removeEventListener('error', onError);
          resolve();
        };
        
        const onError = (e) => {
          clearTimeout(timeout);
          videoElement.removeEventListener('loadeddata', onLoaded);
          videoElement.removeEventListener('error', onError);
          reject(new Error(`Video load error: ${e.message}`));
        };
        
        videoElement.addEventListener('loadeddata', onLoaded);
        videoElement.addEventListener('error', onError);
      });
    }

    // Jump to the segment start time
    console.log(`⏩ Jumping to ${segmentStart}s`);
    videoElement.currentTime = segmentStart;
    
    // Play the video
    const playPromise = videoElement.play();
    if (playPromise) {
      await playPromise;
      console.log(`▶️ Video started playing`);
    }

    // Set up auto-stop at segment end
    let stopHandler = null;
    stopHandler = () => {
      if (videoElement.currentTime >= segmentEnd) {
        videoElement.pause();
        videoElement.removeEventListener('timeupdate', stopHandler);
        logToTerminal(`⏸️ Segment ${segmentIndex + 1} playback completed`, 'info');
        console.log(`⏸️ Stopped at ${videoElement.currentTime}s (end: ${segmentEnd}s)`);
      }
    };
    
    videoElement.addEventListener('timeupdate', stopHandler);

    // Scroll video into view
    videoElement.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center',
      inline: 'nearest'
    });
    
    logToTerminal(`🎵 Playing segment ${segmentIndex + 1} (${formatTimeFromSeconds(segmentStart)} - ${formatTimeFromSeconds(segmentEnd)})`, 'success');
    showMessage(`Playing segment ${segmentIndex + 1}`, 'success');

  } catch (error) {
    console.error(`❌ Error playing segment ${segmentIndex + 1}:`, error);
    logToTerminal(`❌ Failed to play segment: ${error.message}`, 'error');
    showMessage(`Failed to play segment: ${error.message}`, 'error');
    
    // Fallback: try to play just the audio if video fails
    try {
      if (musicData.audioUrl) {
        console.log('🎵 Falling back to audio-only playback');
        const audio = new Audio(musicData.audioUrl);
        audio.currentTime = musicData.actualMusicTiming?.start || 0;
        await audio.play();
        showMessage(`Playing audio for segment ${segmentIndex + 1} (video failed)`, 'warning');
        
        // Stop audio at segment end
        const audioStopHandler = () => {
          const segmentEnd = musicData.actualMusicTiming?.end || 30;
          if (audio.currentTime >= segmentEnd - musicData.actualMusicTiming?.start || 0) {
            audio.pause();
            audio.removeEventListener('timeupdate', audioStopHandler);
          }
        };
        audio.addEventListener('timeupdate', audioStopHandler);
      }
    } catch (audioError) {
      console.error('❌ Audio fallback also failed:', audioError);
      showMessage('Both video and audio playback failed', 'error');
    }
  }
};

  // Fetch recent tracks from backend
  const fetchRecentTracks = async (userId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/get-recent-tracks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      if (res.ok) setRecentTracks(data);
      else setRecentTracks([]);
    } catch (err) {
      setRecentTracks([]);
    }
  };

  // Effect to load user ID and recent tracks on component mount
useEffect(() => {
  const storedUserId = localStorage.getItem('userId');
  const storedEmail = localStorage.getItem('userEmail');
  
  if (storedUserId && storedEmail) {
    setUserId(storedUserId);
    setUser({ 
      email: storedEmail,
      userId: storedUserId 
    });
    setTimeout(() => {
      fetchRecentTracks(storedUserId);
      fetchRecentCombined(storedUserId);
    }, 100);
  } else {
    // Create guest user
    const newUserId = `user_${Date.now()}`;
    localStorage.setItem('userId', newUserId);
    setUserId(newUserId);
    setUser({ 
      email: 'guest@example.com',
      userId: newUserId 
    });
    setTimeout(() => {
      fetchRecentTracks(newUserId);
      fetchRecentCombined(newUserId);
    }, 100);
  }
}, []);
  // Effect to load user data
useEffect(() => {
  const loadUserData = async () => {
    try {
      setIsLoadingUser(true);
      
      // Check if user is logged in (you might have this stored in localStorage)
      const userEmail = localStorage.getItem('userEmail');
      const storedUserId = localStorage.getItem('userId');
      
      if (userEmail && storedUserId) {
        // You can either use the stored email directly or fetch from backend
        setUser({ 
          email: userEmail,
          userId: storedUserId 
        });
      } else {
        // Try to get user from backend if you have a session
        const response = await fetch(`${API_BASE_URL}/get-user`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userEmail })
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoadingUser(false);
    }
  };

  loadUserData();
}, []);
// Effect to handle scroll for player visibility
  useEffect(() => {
    const handleScroll = () => {
      if (playerHovered || playerJustOpened) return;
      
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setPlayerVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setPlayerVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, playerHovered, playerJustOpened]);
  // Fetch recent tracks when user changes
  useEffect(() => {
    if (userId) fetchRecentTracks(userId);
                fetchRecentCombined(userId);
         
  }, [userId]);
  
// Replace the processVideoWithClipTune function in your ClipTuneGenerator.js file
const jumpToCompleteVideoSegment = (segment, segmentIndex) => {
  const segmentStartTime = parseFloat(segment.start_time || 0);
  
  // If we have the complete video, jump to that time
  if (combinedVideoUrl) {
    const completeVideoElement = document.querySelector('#complete-video-player video');
    if (completeVideoElement) {
      completeVideoElement.currentTime = segmentStartTime;
      completeVideoElement.play();
      logToTerminal(`🎯 Jumped to segment ${segmentIndex + 1} in complete video at ${formatTimeFromSeconds(segmentStartTime)}`, 'info');
    }
  } else {
    // Fallback to original video preview
    if (videoPreviewRef.current) {
      videoPreviewRef.current.currentTime = segmentStartTime;
      videoPreviewRef.current.play();
      logToTerminal(`🎯 Jumped to segment ${segmentIndex + 1} in preview at ${formatTimeFromSeconds(segmentStartTime)}`, 'info');
    }
  }
  
  // Also update timeline position
  const width = THUMB_WIDTH * NUM_THUMBS;
  if (duration > 0) {
    const startPos = (segmentStartTime / duration) * width;
    const segmentEndTime = parseFloat(segment.end_time || segmentStartTime + 30);
    const endPos = (segmentEndTime / duration) * width;
    setStartX(Math.max(0, startPos));
    setEndX(Math.min(width, endPos));
  }
};
const handleKeyPress = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    
    // Only proceed if file is ready
    if (isFileReady) {
      handleProceedToNext();
    }
    // Do nothing if no file - input is disabled
  }
};
const debugVolumeSettings = () => {
  console.log('🎚️ VOLUME DEBUG:');
  processedVideoResult?.segments?.forEach((segment, index) => {
    const effective = getEffectiveVolume(index, segment);
    const custom = generatedSegmentMusic[index]?.customVolume;
    const hasCustom = generatedSegmentMusic[index]?.hasCustomVolume;
    const aiSuggested = segment.volume;
    
    console.log(`Segment ${index + 1}:`);
    console.log(`  AI Suggested: ${aiSuggested}`);
    console.log(`  Custom Value: ${custom}`);
    console.log(`  Has Custom: ${hasCustom}`);
    console.log(`  Effective (Used): ${effective}`);
    console.log(`  ----`);
  });
};
// Key changes to make in ClipTuneGenerator.js:

// 1. REPLACE the processVideoWithClipTune function with this updated version:

// REPLACE your existing processVideoWithClipTune function with this updated version
const createDragHandler = (type) => {
  return (e) => {
    e.preventDefault();
    const startMouseX = e.clientX;
    const rect = trackRef.current.getBoundingClientRect();
    
    const move = (moveEvent) => {
      const currentX = Math.max(0, Math.min(moveEvent.clientX - rect.left, THUMB_WIDTH * NUM_THUMBS));
      const width = THUMB_WIDTH * NUM_THUMBS;
      
      if (type === "start") {
        const newStartX = Math.min(currentX, endX - 10);
        setStartX(newStartX);
        
        // Real-time video update
        const newTime = (newStartX / width) * duration;
        if (videoPreviewRef.current && !isNaN(newTime)) {
          videoPreviewRef.current.currentTime = newTime;
        }
      } else {
        const newEndX = Math.max(currentX, startX + 10);
        setEndX(newEndX);
        
        // Real-time video update
        const newTime = (newEndX / width) * duration;
        if (videoPreviewRef.current && !isNaN(newTime)) {
          videoPreviewRef.current.currentTime = newTime;
        }
      }
    };
    
    const up = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
      
      // Optional: Play a brief moment at the final position
      if (videoPreviewRef.current) {
        videoPreviewRef.current.play();
        setTimeout(() => {
          if (videoPreviewRef.current) {
            videoPreviewRef.current.pause();
          }
        }, 500); // Play for 0.5 seconds to preview
      }
    };
    
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  };
};
const handleStartHandleMouseDown = (e) => {
  // Check if timeline editing is disabled
  if (processedVideoResult?.trim_info) {
    showMessage('Timeline editing is disabled for trimmed video analysis. Use the original timeline before processing.', 'warning');
    return;
  }
  
  // Allow dragging when editing a segment OR when no segments exist yet
  if (selectedSegmentForEdit || !processedVideoResult?.segments || processedVideoResult.segments.length === 0) {
    console.log('🎯 Starting START handle drag');
    createDragHandler("start")(e);
  } else {
    console.log('❌ Start handle drag blocked - not in edit mode');
    showMessage('Click "Edit Timeline" on a segment first to enable timeline editing', 'info');
  }
};

// Modified createDragHandler with overlap prevention
const createDragHandlerr= (type) => {
  return (e) => {
    e.preventDefault();
    const startMouseX = e.clientX;
    const rect = trackRef.current.getBoundingClientRect();
    const trackWidth = THUMB_WIDTH * NUM_THUMBS;
    
    // Calculate safe boundaries if editing a segment
    let constraints = { minX: 0, maxX: trackWidth };
    
    if (selectedSegmentForEdit && processedVideoResult?.segments) {
      const boundaries = calculateSegmentBoundaries(
        processedVideoResult.segments, 
        selectedSegmentForEdit.index
      );
      
      // Convert time boundaries to pixel positions
      constraints.minX = Math.max(0, (boundaries.maxStart / duration) * trackWidth);
      constraints.maxX = Math.min(trackWidth, (boundaries.minEnd / duration) * trackWidth);
    }
    
    const move = (moveEvent) => {
      const currentX = Math.max(0, Math.min(moveEvent.clientX - rect.left, trackWidth));
      
      if (type === "start") {
        // Apply constraints for start handle
        let newStartX = currentX;
        
        // Ensure it doesn't go past constraints or end handle
        newStartX = Math.max(constraints.minX, newStartX);
        newStartX = Math.min(newStartX, endX - 10);
        
        setStartX(newStartX);
        
        // Real-time video update
        const newTime = (newStartX / trackWidth) * duration;
        if (videoPreviewRef.current && !isNaN(newTime)) {
          videoPreviewRef.current.currentTime = newTime;
        }
      } else {
        // Apply constraints for end handle
        let newEndX = currentX;
        
        // Ensure it doesn't go past constraints or start handle
        newEndX = Math.min(constraints.maxX, newEndX);
        newEndX = Math.max(newEndX, startX + 10);
        
        setEndX(newEndX);
        
        // Real-time video update
        const newTime = (newEndX / trackWidth) * duration;
        if (videoPreviewRef.current && !isNaN(newTime)) {
          videoPreviewRef.current.currentTime = newTime;
        }
      }
      
      // Check for overlaps and provide feedback
      if (selectedSegmentForEdit && processedVideoResult?.segments) {
        const newStart = (startX / trackWidth) * duration;
        const newEnd = (endX / trackWidth) * duration;
        
        const overlaps = detectSegmentOverlaps(
          processedVideoResult.segments, 
          selectedSegmentForEdit.index, 
          newStart, 
          newEnd
        );
        
        if (overlaps.length > 0) {
          console.warn(`⚠️ Overlap detected with ${overlaps.length} segment(s)`);
        }
      }
      
      // Mark as having unsaved changes
      if (selectedSegmentForEdit) {
        setHasUnsavedTimelineChanges(true);
      }
    };
    
    const up = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
      
      // Brief preview play
      if (videoPreviewRef.current) {
        videoPreviewRef.current.play();
        setTimeout(() => {
          if (videoPreviewRef.current) {
            videoPreviewRef.current.pause();
          }
        }, 300);
      }
    };
    
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  };
};

const handleEndHandleMouseDown = (e) => {
  // Check if timeline editing is disabled
  if (processedVideoResult?.trim_info) {
    showMessage('Timeline editing is disabled for trimmed video analysis. Use the original timeline before processing.', 'warning');
    return;
  }
  
  // Allow dragging when editing a segment OR when no segments exist yet
  if (selectedSegmentForEdit || !processedVideoResult?.segments || processedVideoResult.segments.length === 0) {
    console.log('🎯 Starting END handle drag');
    createDragHandler("end")(e);
  } else {
    console.log('❌ End handle drag blocked - not in edit mode');
    showMessage('Click "Edit Timeline" on a segment first to enable timeline editing', 'info');
  }
};

// 3. ALTERNATIVE: Simple direct drag handlers (if the above doesn't work)
const simpleStartDrag = (e) => {
  e.preventDefault();
  console.log('🎯 Simple start drag initiated');
  
  const rect = trackRef.current.getBoundingClientRect();
  const trackWidth = THUMB_WIDTH * NUM_THUMBS;
  
  const handleMouseMove = (moveEvent) => {
    const newX = Math.max(0, Math.min(moveEvent.clientX - rect.left, endX - 20));
    setStartX(newX);
    setLastDragged("start");
    
    // Update video
    const newTime = (newX / trackWidth) * duration;
    if (videoPreviewRef.current) {
      videoPreviewRef.current.currentTime = newTime;
    }
  };
  
  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    console.log('🎯 Simple start drag ended');
  };
  
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
};

const simpleEndDrag = (e) => {
  e.preventDefault();
  console.log('🎯 Simple end drag initiated');
  
  const rect = trackRef.current.getBoundingClientRect();
  const trackWidth = THUMB_WIDTH * NUM_THUMBS;
  
  const handleMouseMove = (moveEvent) => {
    const newX = Math.min(trackWidth, Math.max(moveEvent.clientX - rect.left, startX + 20));
    setEndX(newX);
    setLastDragged("end");
    
    // Update video
    const newTime = (newX / trackWidth) * duration;
    if (videoPreviewRef.current) {
      videoPreviewRef.current.currentTime = newTime;
    }
  };
  
  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    console.log('🎯 Simple end drag ended');
  };
  
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
};

// REPLACE your existing processVideoWithClipTune function with this updated version

const [originalTimelineState, setOriginalTimelineState] = useState({ startX: 0, endX: 0 });
const [hasUnsavedTimelineChanges, setHasUnsavedTimelineChanges] = useState(false);

// ADD this function to handle starting timeline edit mode
const enhancedHandleStartTimelineEdit = (segment, segmentIndex) => {
  // Store original timeline state for potential cancellation
  setOriginalTimelineState({ startX, endX });
  
  // Set the segment for editing
  jumpToClipTuneSegment(segment, segmentIndex);
  setSelectedSegmentForEdit({ segment, index: segmentIndex });
  setHasUnsavedTimelineChanges(false);
  
  logToTerminal(`✂️ Started editing timeline for segment ${segmentIndex + 1}`, 'info');
  
  // Show safe boundaries
  showSegmentBoundaries(segmentIndex);
  
  logToTerminal(`💡 Tip: Use arrow keys for fine adjustments (Shift+← → for start handle, ← → for end handle)`, 'info');
  logToTerminal(`🚨 Overlaps with other segments will be prevented automatically`, 'info');
};

// ADD this function to handle setting the current timeline
const handleSetCurrentTimeline = () => {
  if (!selectedSegmentForEdit) return;
  
  const [newStart, newEnd] = getTrimRange();
  const newDuration = newEnd - newStart;
  
  // Update the segment data with new timing
  const updatedSegment = {
    ...selectedSegmentForEdit.segment,
    start_time: newStart.toString(),
    end_time: newEnd.toString(),
    parsed_start: newStart,
    parsed_end: newEnd,
    duration: newDuration,
    timeline_was_adjusted: true,
    original_start_time: selectedSegmentForEdit.segment.start_time,
    original_end_time: selectedSegmentForEdit.segment.end_time
  };
  
  // Update the segment in the processed video result
  if (processedVideoResult && processedVideoResult.segments) {
    const updatedSegments = [...processedVideoResult.segments];
    updatedSegments[selectedSegmentForEdit.index] = updatedSegment;
    
    setProcessedVideoResult({
      ...processedVideoResult,
      segments: updatedSegments
    });
  }
  
  logToTerminal(`✅ Timeline updated for segment ${selectedSegmentForEdit.index + 1}:`, 'success');
  logToTerminal(`   New timing: ${formatTimeFromSeconds(newStart)} - ${formatTimeFromSeconds(newEnd)}`, 'success');
  logToTerminal(`   Duration: ${formatTimeFromSeconds(newDuration)}`, 'success');
  
  // Clear editing state
  setSelectedSegmentForEdit(null);
  setHasUnsavedTimelineChanges(false);
  
  showMessage(`Timeline updated for segment ${selectedSegmentForEdit.index + 1}`, 'success');
};

// ADD this function to handle canceling timeline edit
const handleCancelTimelineEdit = () => {
  if (!selectedSegmentForEdit) return;
  
  // Restore original timeline position
  setStartX(originalTimelineState.startX);
  setEndX(originalTimelineState.endX);
  
  // Update video position back to original
  const width = THUMB_WIDTH * NUM_THUMBS;
  const originalTime = (originalTimelineState.startX / width) * duration;
  if (videoPreviewRef.current && !isNaN(originalTime)) {
    videoPreviewRef.current.currentTime = originalTime;
  }
  
  logToTerminal(`❌ Timeline edit cancelled for segment ${selectedSegmentForEdit.index + 1}`, 'info');
  logToTerminal(`🔄 Restored to original position`, 'info');
  
  // Clear editing state
  setSelectedSegmentForEdit(null);
  setHasUnsavedTimelineChanges(false);
  
  showMessage('Timeline changes cancelled', 'info');
};

// MODIFY your existing drag handlers to detect changes


// 7. Add keyboard support with useEffect
// REPLACE the existing keyboard useEffect with this fixed version:

// ALSO ADD this helper function to provide visual feedback when keyboard movement is blocked:

// REPLACE your existing processVideoWithClipTune function with this updated version
const processVideoWithClipTune = async (explicitInstructions = null) => {
  if (!selectedFile) {
    showMessage('Please select a video file first.', 'error');
    return;
  }

  // Start processing
  setIsCompleteVideoProcessing(true);
  setCompleteVideoProgress(0);
  setCompleteVideoStatus('Initializing...');

  // 🚨 FIX: Use explicit instructions parameter with proper fallbacks
  let processingInstructions;
  
  if (explicitInstructions) {
    // Use the explicitly passed instructions (from send button)
    processingInstructions = explicitInstructions.trim();
  } else {
    // Fallback to state values
    processingInstructions = videoInstructions || description || 'only add music to places where people do not speak';
  }
  
  // Ensure we have instructions
  if (!processingInstructions || processingInstructions.trim() === '') {
    processingInstructions = 'only add music to places where people do not speak';
  }
  
  // 🚨 FIX: Update description state for consistency
  setDescription(processingInstructions);
  setVideoInstructions(processingInstructions);

  // Add progress simulation...
  const progressInterval = setInterval(() => {
    setCompleteVideoProgress(prev => {
      if (prev < 85) {
        return prev + Math.random() * 10;
      }
      return prev;
    });
  }, 1000);

  const statusUpdates = [
    { delay: 2000, status: 'Uploading video...', progress: 15 },
    { delay: 4000, status: 'Analyzing video content...', progress: 30 },
    { delay: 7000, status: 'Detecting speech patterns...', progress: 45 },
    { delay: 10000, status: 'Identifying music opportunities...', progress: 60 },
    { delay: 13000, status: 'Processing AI segments...', progress: 75 },
    { delay: 16000, status: 'Finalizing analysis...', progress: 85 }
  ];

  statusUpdates.forEach(({ delay, status, progress }) => {
    setTimeout(() => {
      if (isCompleteVideoProcessing) {
        setCompleteVideoStatus(status);
        setCompleteVideoProgress(progress);
      }
    }, delay);
  });

  try {
    setIsProcessingVideo(true);
    setTerminalLogs([]);
    
    logToTerminal('🎬 Starting ClipTune video analysis...', 'info');
    logToTerminal(`📁 Processing file: ${selectedFile.name}`, 'info');
    logToTerminal(`📊 File size: ${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`, 'info');
    logToTerminal(`🎯 Instructions: ${processingInstructions}`, 'info');

    // Get the current timeline selection (trimmed section)
    const [trimStart, trimEnd] = getTrimRange();
    const trimmedDuration = trimEnd - trimStart;
    
    logToTerminal(`✂️ Trimmed section: ${formatTimeFromSeconds(trimStart)} - ${formatTimeFromSeconds(trimEnd)}`, 'info');
    logToTerminal(`⏱️ Trimmed duration: ${formatTimeFromSeconds(trimmedDuration)}`, 'info');
    
    if (trimmedDuration <= 0) {
      throw new Error('Invalid trim selection. Please select a valid time range.');
    }

    // Update progress
    setCompleteVideoProgress(20);
    setCompleteVideoStatus('Preparing video data...');

    // 🚨 FIX: Create FormData with the EXPLICIT processing instructions
    const formData = new FormData();
    formData.append('video', selectedFile);
    formData.append('extra_prompt', processingInstructions); // Use the explicit instructions
    formData.append('video_start', trimStart.toString());
    formData.append('video_end', trimEnd.toString());
    formData.append('total_seconds', Math.floor(trimmedDuration));

    // Update progress
    setCompleteVideoProgress(35);
    setCompleteVideoStatus('Sending to ClipTune AI...');

    logToTerminal('📤 Uploading and analyzing TRIMMED video section...', 'info');
    logToTerminal(`📊 Instructions being sent: "${processingInstructions}"`, 'info');
    logToTerminal(`📊 Trimmed duration sent: ${Math.floor(trimmedDuration)} seconds`, 'info');

    // Send to backend
    const response = await fetch('https://nback-6gqw.onrender.com/api/cliptune-upload-trimmed', {
      method: 'POST',
      body: formData
    });

    // Update progress
    setCompleteVideoProgress(70);
    setCompleteVideoStatus('Processing AI response...');

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.details || errorData.error || 'ClipTune processing failed');
    }

    const result = await response.json();
    
    // Update progress
    setCompleteVideoProgress(90);
    setCompleteVideoStatus('Analyzing segments...');

    logToTerminal('✅ ClipTune analysis completed successfully!', 'success');
    
    if (!result.success || !result.result || !result.result.segments) {
      throw new Error('No segments found in ClipTune result');
    }

    const rawSegments = result.result.segments;
    logToTerminal(`📋 Received ${rawSegments.length} segments from ClipTune (for trimmed video)`, 'info');
    
    // Process segments
    logToTerminal('🔄 Processing segments for trimmed video...', 'info');
    
    const processedSegments = processClipTuneSegments(rawSegments, trimmedDuration);
    
    if (processedSegments.length === 0) {
      logToTerminal('⚠️ No valid segments after processing - all segments had timing issues', 'error');
      showMessage('No valid segments found. Check video duration and segment timings.', 'warning');
      return;
    }
    
    // Final progress update
    setCompleteVideoProgress(100);
    setCompleteVideoStatus('Complete! Redirecting...');

    if (processedSegments.length < rawSegments.length) {
      const skipped = rawSegments.length - processedSegments.length;
      logToTerminal(`⚠️ Skipped ${skipped} invalid segments due to timing issues`, 'info');
    }
    
    logToTerminal(`🎯 Successfully processed ${processedSegments.length} valid music segments`, 'success');
    
    // Log final confirmation of instructions used
    logToTerminal(`✅ Used processing instructions: "${processingInstructions}"`, 'success');
    
    // Store the PROCESSED segments for display
    setVideoSegments(processedSegments);
    setShowFullVideoAnalysis(true);
    
    // Store processing result with instructions
    setProcessedVideoResult({
      ...result.result,
      segments: processedSegments,
      original_segments: rawSegments,
      processing_instructions: processingInstructions, // Store the instructions used
      trim_info: {
        original_start: trimStart,
        original_end: trimEnd,
        trimmed_duration: trimmedDuration,
        full_video_duration: duration
      },
      processing_metadata: {
        total_raw_segments: rawSegments.length,
        valid_processed_segments: processedSegments.length,
        skipped_segments: rawSegments.length - processedSegments.length,
        trimmed_video_duration: trimmedDuration,
        original_video_duration: duration,
        trim_start: trimStart,
        trim_end: trimEnd,
        instructions_used: processingInstructions,
        processing_timestamp: new Date().toISOString()
      }
    });
    setShowProcessedVideo(true);
    
    // Clear music data for new segments
    setGeneratedSegmentMusic({});
    setSegmentMusicGeneration({});
    
    logToTerminal('✅ Trimmed video analysis complete! Ready for music generation.', 'success');
    logToTerminal(`📊 Processing Summary:`, 'info');
    logToTerminal(`   • Instructions: "${processingInstructions}"`, 'info');
    logToTerminal(`   • Analyzed trimmed section: ${formatTimeFromSeconds(trimStart)} - ${formatTimeFromSeconds(trimEnd)}`, 'info');
    logToTerminal(`   • Valid segments found: ${processedSegments.length}`, 'info');
    
    showMessage(
      `Found ${processedSegments.length} segments using your instructions. Redirecting to segments view...`, 
      'success'
    );

    // Auto-redirect to Step 2
    setTimeout(() => {
      setCurrentStep(2);
      logToTerminal('🔄 Auto-redirected to segments view for music generation', 'info');
      showMessage('Now you can generate music for individual segments!', 'info');
    }, 2000);

  } catch (error) {
    console.error('❌ ClipTune processing error:', error);
    logToTerminal(`❌ Error: ${error.message}`, 'error');
    
    // Update progress to show error
    setCompleteVideoProgress(0);
    setCompleteVideoStatus('Error occurred');
    
    showMessage(error.message || 'Failed to process video with ClipTune.', 'error');
  } finally {
    // Clear progress after delay
    setTimeout(() => {
      setIsCompleteVideoProcessing(false);
      setCompleteVideoProgress(0);
      setCompleteVideoStatus('');
    }, 3000);
    
    // Clear intervals
    clearInterval(progressInterval);
    setIsProcessingVideo(false);
  }
};

const fetchRecentCombined = async (userId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/get-recent-combined`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    const data = await res.json();
    if (res.ok && data) {
      setRecentCombined(Array.isArray(data) ? data : [data]); // Handle both array and single item
    }
  } catch (err) {
    console.error('Error loading recent combined videos:', err);
  }
};


  // Function to add a track to recent tracks

  // Helper function to get first letter of email
const getFirstLetter = (email) => {
  return email ? email.charAt(0).toUpperCase() : 'U';
};
const handleSaveCombinedVideo = async () => {
  try {
    if (!combinedVideoUrl || !userId) {
      console.warn("Missing video URL or userId");
      showMessage("Cannot save video - missing data", 'error');
      return;
    }

    console.log("Saving combined video:", { userId, combinedVideoUrl, duration });

    const res = await axios.post(`${API_BASE_URL}/api/save-combined`, {
      userId,
      title: `Combined Video ${new Date().toLocaleTimeString()}`,
      combinedVideoUrl,
      duration
    });

    console.log("✅ Combined video saved:", res.data.combined);
    
    // Add the new video to the beginning of the array
    setRecentCombined(prev => [res.data.combined, ...prev].slice(0, 5));
    
    showMessage("Combined video saved successfully!", 'success');
  } catch (err) {
    console.error("❌ Failed to save combined video:", err.response?.data || err.message);
    showMessage("Failed to save combined video", 'error');
  }
};
  // Effect to handle scroll for player visibility
  useEffect(() => {
    const handleScroll = () => {
      if (playerHovered || playerJustOpened) return; // Don't hide on scroll if player is being hovered or just opened
      
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide player
        setPlayerVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show player
        setPlayerVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, playerHovered, playerJustOpened]);
// Update video current time when timeline handles are dragged
useEffect(() => {
  const width = THUMB_WIDTH * NUM_THUMBS;
  const activeX = lastDragged === "start" ? startX : endX;
  const newTime = (activeX / width) * duration;

  if (videoPreviewRef.current && !isNaN(newTime)) {
    videoPreviewRef.current.currentTime = newTime;
  }
  
  // Show real-time updates when a segment is selected for editing
  if (selectedSegmentForEdit) {
    const [currentStart, currentEnd] = getTrimRange();
    const currentDuration = currentEnd - currentStart;
    logToTerminal(`✂️ Adjusted Segment ${selectedSegmentForEdit.index + 1}: ${formatTimeFromSeconds(currentStart)} - ${formatTimeFromSeconds(currentEnd)} (${formatTimeFromSeconds(currentDuration)})`, 'info');
  }
}, [startX, endX, lastDragged, duration, selectedSegmentForEdit]);
  // Effect to handle mouse movement when player is hovered
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (playerHovered && !playerJustOpened) {
        const currentY = e.clientY;
        const threshold = 50; // pixels to move down before hiding
        
        if (currentY > mouseY + threshold && mouseY > 0) {
          setPlayerVisible(false);
          setPlayerHovered(false);
        }
        
        setMouseY(currentY);
      }
    };

    const handleClickOutside = (e) => {
      // Close menu if clicking outside
      if (!e.target.closest('[data-bottom-menu]')) {
        setBottomPlayerMenu(false);
      }
    };

    if (playerHovered) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    
    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [playerHovered, mouseY, playerJustOpened]);
const handleManualSave = async () => {
  try {
    await handleSaveCombinedVideo(combinedVideoUrl, true);
    setHasBeenSaved(true); // Hide the button after successful save
  } catch (err) {
    // Error already handled in handleSaveCombinedVideo
  }
};


// Add this function after fetchRecentCombined
// Handler for full video analysis (via backend proxy)
// Handler for full video analysis (via backend proxy)
// Add these with your other useState declarations
const [savedVideoSegment, setSavedVideoSegment] = useState(null);
const [showTimelineEditor, setShowTimelineEditor] = useState(false);

// Function to get segment position on timeline

  // Function to extract thumbnails from video
  const extractThumbnails = async (url) => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.src = url;
      video.crossOrigin = "anonymous";
      video.preload = "metadata";
      video.muted = true;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const thumbs = [];

      video.onloadedmetadata = () => {
        const interval = video.duration / NUM_THUMBS;
        let current = 0;

        const capture = () => {
          if (current >= NUM_THUMBS) return resolve(thumbs);
          video.currentTime = current * interval;
          video.onseeked = () => {
            canvas.width = THUMB_WIDTH;
            canvas.height = THUMB_HEIGHT;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            thumbs.push(canvas.toDataURL("image/jpeg"));
            current++;
            capture();
          };
        };
        capture();
      };
      video.onerror = (e) => {
        console.error("Error loading video for thumbnail extraction:", e);
        resolve([]);
      };
    });
  };

  // Get trim range from timeline positions
  const getTrimRange = () => {
    const width = THUMB_WIDTH * NUM_THUMBS;
    const startTime = (startX / width) * duration;
    const endTime = (endX / width) * duration;
    return [Math.max(0, startTime), Math.min(duration, endTime)];
  };

  // Handle drag for timeline handles
 
  // Update video current time when timeline handles are dragged
  useEffect(() => {
    const width = THUMB_WIDTH * NUM_THUMBS;
    const activeX = lastDragged === "start" ? startX : endX;
    const newTime = (activeX / width) * duration;

    if (videoPreviewRef.current && !isNaN(newTime)) {
      videoPreviewRef.current.currentTime = newTime;
    }
  }, [startX, endX, lastDragged, duration]);

  // Calculate time values for display
  const width = THUMB_WIDTH * NUM_THUMBS;
  const startTime = (startX / width) * duration;
  const endTime = (endX / width) * duration;
  const selectionDuration = endTime - startTime;

  const getTimeValues = () => {
    return [Math.max(0, startTime), Math.min(duration, endTime)];
  };
  
  // Function to display temporary messages to the user
  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  // Handler for video file selection
// Handler for video file selection
// 🚨 NEW: Function to calculate segment constraints and detect overlaps


// 🚨 NEW: Enhanced timeline edit function with constraints


// 🚨 NEW: Jump to segment with overlap constraints
const jumpToClipTuneSegmentWithConstraints = (segment, segmentIndex, constraints) => {
  let segmentStartTime = segment.parsed_start !== undefined 
    ? segment.parsed_start 
    : parseClipTuneTime(segment.start_time);
    
  let segmentEndTime = segment.parsed_end !== undefined 
    ? segment.parsed_end 
    : parseClipTuneTime(segment.end_time);
    
  // 🚨 Apply constraints to prevent overlaps
  if (constraints.maxAllowedEnd < segmentEndTime) {
    segmentEndTime = constraints.maxAllowedEnd;
    logToTerminal(`⚠️ Segment end time constrained to ${formatTimeFromSeconds(segmentEndTime)} to prevent overlap`, 'warning');
  }
  
  const width = THUMB_WIDTH * NUM_THUMBS;
  
  if (duration > 0) {
    const startPos = (segmentStartTime / duration) * width;
    const endPos = (segmentEndTime / duration) * width;
    setStartX(Math.max(0, startPos));
    setEndX(Math.min(width, endPos));
    
    // Jump video to that time
    if (videoPreviewRef.current) {
      videoPreviewRef.current.currentTime = segmentStartTime;
    }
    
    logToTerminal(`🎯 Timeline set to segment ${segmentIndex + 1}: ${formatTimeFromSeconds(segmentStartTime)} - ${formatTimeFromSeconds(segmentEndTime)}`, 'info');
    if (constraints.hasOverlap) {
      logToTerminal(`🚧 Constraints applied to prevent overlaps`, 'info');
    }
  }
};
// REPLACE your existing handleFileSelect function with this updated version
// REPLACE your existing handleFileSelect function with this enhanced version
const handleFileSelect = async (e) => {
  const file = e.target.files[0];
  if (file && file.type.startsWith('video/')) {
    setIsUploading(true);
    setUploadProgress(0);
    setIsFileReady(false);
    
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setThumbnails([]);
    setDuration(0);
    setStartX(0);
    setEndX(THUMB_WIDTH * NUM_THUMBS);

    // Reset states
    setVideoSegments([]); 
    setShowFullVideoAnalysis(false); 
    setTracks([]); 
    setIsProcessing(false); 
    setCombinedVideoUrl(''); 

    const temp = document.createElement("video");
    temp.src = url;
    temp.onloadedmetadata = async () => {
      const dur = Math.floor(temp.duration);
      if (isNaN(dur) || dur === 0) {
        showMessage("Could not load video duration.", 'error');
        setIsUploading(false);
        return;
      }

      setDuration(dur);
      setUploadProgress(50);
      
      try {
        const thumbs = await extractThumbnails(url);
        setThumbnails(thumbs);
        setEndX(THUMB_WIDTH * thumbs.length);
        setUploadProgress(100);
        
        setTimeout(() => {
          setIsUploading(false);
          setIsFileReady(true);
        }, 500);
        
      } catch (thumbError) {
        setUploadProgress(100);
        setTimeout(() => {
          setIsUploading(false);
          setIsFileReady(true);
        }, 500);
      }
    };
    
    temp.onerror = () => {
      setIsUploading(false);
      setIsFileReady(false);
      setSelectedFile(null);
      setVideoUrl('');
      showMessage("Failed to load video file.", 'error');
    };
  } else {
    showMessage('Please select a valid video file.', 'error');
  }
};
// ✅ REPLACE your handleRestoreSegmentMusic function with this FIXED version:

// ✅ FIXED: handleRestoreSegmentMusic function
// ✅ COMPLETE FIXED VERSION: Restores previously removed music for a segment

// Add this new function
const handleProceedToNext = () => {
  if (!isFileReady || !selectedFile) {
    const notReadyMessage = {
      id: Date.now(),
      type: 'ai',
      message: `⚠️ Please upload a video file first before proceeding! 📹`,
      timestamp: new Date().toLocaleTimeString()
    };
    setChatHistory(prev => [...prev, notReadyMessage]);
    return;
  }

  // 🚨 FIX: Set description immediately from current chat message
  if (chatMessage.trim()) {
    setDescription(chatMessage.trim());
    setVideoInstructions(chatMessage.trim());
    console.log('📝 Setting description immediately:', chatMessage.trim());
  } else {
    // 🚨 FIX: Collect chat messages for customPrompt
    const userChatMessages = chatHistory
      .filter(msg => msg.type === 'user')
      .map(msg => msg.message);
    
    if (userChatMessages.length > 0) {
      const chatOnlyDescription = userChatMessages.join('. ');
      setDescription(chatOnlyDescription);
      setVideoInstructions(chatOnlyDescription);
      console.log('📝 Chat-only description for customPrompt:', chatOnlyDescription);
    } else {
      setDescription('');
      setVideoInstructions('');
    }
  }

  // Add AI message about proceeding
  const proceedMessage = {
    id: Date.now(),
    type: 'ai',
    message: savedVideoSegment 
      ? `🚀 Perfect! Creating music for "${selectedFile.name}" with timeline (${savedVideoSegment.startTime} - ${savedVideoSegment.endTime}) and your chat style! ✂️`
      : `🚀 Perfect! Creating music for "${selectedFile.name}" with your chat style! ✂️`,
    timestamp: new Date().toLocaleTimeString()
  };
  setChatHistory(prev => [...prev, proceedMessage]);

  // Update timeline if we have saved video segment
  if (savedVideoSegment) {
    const width = THUMB_WIDTH * NUM_THUMBS;
    const startPos = (savedVideoSegment.start / duration) * width;
    const endPos = (savedVideoSegment.end / duration) * width;
    setStartX(Math.max(0, startPos));
    setEndX(Math.min(width, endPos));
  }

  // Show the configuration modal
  setTimeout(() => {
    setShowConfigModal(true);
    setCurrentStep(1);
  }, 500);
};

// ✅ Enhanced: Safely remove music while preserving original metadata for restoration
// ✅ FIXED: Enhanced handleRemoveSegmentMusic function
const handleRemoveSegmentMusic = async (segmentIndex) => {
  const existing = generatedSegmentMusic[segmentIndex];

  if (!existing) {
    showMessage(`No music found for segment ${segmentIndex + 1}`, 'warning');
    return;
  }

  if (existing.removed === true) {
    showMessage(`Music for segment ${segmentIndex + 1} has already been removed`, 'info');
    return;
  }

  try {
    logToTerminal(`🗑️ Removing music from segment ${segmentIndex + 1}...`, 'info');

    // ✅ PRESERVE ORIGINAL DATA for restoration while marking as removed
    const updated = {
      ...generatedSegmentMusic,
      [segmentIndex]: {
        ...existing,
        removed: true,
        removedAt: new Date().toISOString(),
        
        // Preserve all essential data for restoration
        originalAudioUrl: existing.audioUrl ?? null,
        originalSegmentStart: existing.segmentStart ?? null,
        originalSegmentEnd: existing.segmentEnd ?? null,
        originalCustomVolume: existing.customVolume ?? null,
        originalActualMusicTiming: existing.actualMusicTiming ?? null,
        segment: existing.segment ?? null,
        
        // Keep audioUrl but mark as removed
        audioUrl: existing.audioUrl,
        isRemovedFromVideo: true,
        
        // ✅ NEW: Reset video ready flags
        progressiveVideoReady: false,
        completeVideoReady: false,
        videoProcessing: true
      }
    };

    setGeneratedSegmentMusic(updated);
    logToTerminal(`✅ Music removed from segment ${segmentIndex + 1}`, 'success');
    showMessage(`Music removed from segment ${segmentIndex + 1}`, 'success');

    // ✅ IMMEDIATE complete video regeneration with updated state
    logToTerminal(`🎬 Regenerating complete video without segment ${segmentIndex + 1}...`, 'info');
    
    try {
      await regenerateCompleteVideoWithoutRemovedSegments(updated);
      
      // ✅ UPDATE: Mark complete video as ready after successful regeneration
      setGeneratedSegmentMusic(prev => ({
        ...prev,
        [segmentIndex]: {
          ...prev[segmentIndex],
          completeVideoReady: true,
          videoProcessing: false
        }
      }));
      
      logToTerminal(`🎬 Complete video updated without segment ${segmentIndex + 1} music`, 'success');
      showMessage(`Complete video updated - segment ${segmentIndex + 1} removed`, 'success');
      
    } catch (error) {
      console.error('❌ Complete video regeneration failed:', error);
      logToTerminal(`⚠️ Music removed but complete video update failed: ${error.message}`, 'warning');
      
      // ✅ Mark as error state
      setGeneratedSegmentMusic(prev => ({
        ...prev,
        [segmentIndex]: {
          ...prev[segmentIndex],
          completeVideoReady: false,
          videoProcessing: false,
          videoProcessingError: error.message
        }
      }));
      
      showMessage('Music removed but complete video update failed. Try refreshing.', 'warning');
    }

  } catch (error) {
    console.error(`❌ Error removing music from segment ${segmentIndex + 1}:`, error);
    logToTerminal(`❌ Error: ${error.message}`, 'error');
    showMessage(`Error removing music: ${error.message}`, 'error');
  }
};

// ✅ NEW: Specialized function for regenerating video without removed segments
const [preRenderedVolumeInfo, setPreRenderedVolumeInfo] = useState(null);

const regenerateCompleteVideoWithoutRemovedSegments = async (currentMusicData = null) => {
  if (!selectedFile || !processedVideoResult || !processedVideoResult.segments) {
    throw new Error('Cannot regenerate video - missing data');
  }

  const musicDataToUse = currentMusicData || generatedSegmentMusic;

  try {
    setIsGeneratingPreview(true);
    logToTerminal('🎬 Regenerating video without removed segments...', 'info');

    // ✅ PREPARE SEGMENT DATA (all segments, regardless of music status)
    const validatedSegments = processedVideoResult.segments.map((segment, index) => {
      if (!segment) {
        throw new Error(`Segment ${index + 1} is undefined`);
      }

      const parsedStart = segment.parsed_start !== undefined ? segment.parsed_start : parseFloat(segment.start_time || 0);
      const parsedEnd = segment.parsed_end !== undefined ? segment.parsed_end : parseFloat(segment.end_time || 30);

      if (isNaN(parsedStart) || isNaN(parsedEnd) || parsedStart >= parsedEnd) {
        throw new Error(`Invalid timing data for segment ${index + 1}`);
      }

      return {
        ...segment,
        start_time: parsedStart.toString(),
        end_time: parsedEnd.toString(),
        parsed_start: parsedStart,
        parsed_end: parsedEnd,
        duration: parsedEnd - parsedStart,
        music_summary: segment.music_summary || `Music for segment ${index + 1}`,
        volume: segment.volume !== undefined ? segment.volume : 0.3,
        fade_algorithm: segment.fade_algorithm || 'linear',
        segment_index: index
      };
    });

    // ✅ PREPARE MUSIC DATA - EXCLUDE removed segments but include active ones
    const validatedMusicData = {};
    let activeSegmentCount = 0;
    let removedSegmentCount = 0;

    Object.entries(musicDataToUse).forEach(([indexStr, musicData]) => {
      const index = parseInt(indexStr);
      
      if (!musicData) {
        console.warn(`⚠️ Segment ${index + 1}: Music data is undefined`);
        return;
      }

      // ✅ SKIP removed segments for video generation
      if (musicData.removed === true || musicData.isRemovedFromVideo === true) {
        removedSegmentCount++;
        console.log(`🚫 Segment ${index + 1}: Excluding removed music from video`);
        return;
      }

      // ✅ INCLUDE active segments
      if (!musicData.audioUrl) {
        console.warn(`⚠️ Segment ${index + 1}: Missing audioUrl, skipping`);
        return;
      }

      const correspondingSegment = validatedSegments.find(seg => seg.segment_index === index);
      if (!correspondingSegment) {
        console.warn(`⚠️ Segment ${index + 1}: No corresponding segment found, skipping`);
        return;
      }

      const segmentStart = musicData.segmentStart ?? musicData.actualMusicTiming?.start ?? correspondingSegment.parsed_start ?? 0;
      const segmentEnd = musicData.segmentEnd ?? musicData.actualMusicTiming?.end ?? correspondingSegment.parsed_end ?? 30;

      validatedMusicData[index] = {
        ...musicData,
        audioUrl: musicData.audioUrl,
        segmentStart,
        segmentEnd,
        customVolume: musicData.customVolume !== undefined ? musicData.customVolume : 0.3,
        hasCustomVolume: musicData.hasCustomVolume || false,
        actualMusicTiming: musicData.actualMusicTiming || {
          start: segmentStart,
          end: segmentEnd,
          duration: segmentEnd - segmentStart
        },
        segment: {
          ...correspondingSegment,
          start_time: segmentStart.toString(),
          end_time: segmentEnd.toString(),
          volume: musicData.customVolume !== undefined ? musicData.customVolume : correspondingSegment.volume
        }
      };

      activeSegmentCount++;
    });

    // ✅ ALLOW REGENERATION even with 0 active segments (creates video without music)
    logToTerminal(`📊 Video regeneration: ${activeSegmentCount} active, ${removedSegmentCount} removed segments`, 'info');

    if (activeSegmentCount === 0) {
      logToTerminal('ℹ️ Generating video without any music segments', 'info');
      showMessage('Creating video without music segments', 'info');
    }

    // 🎛️ NEW: PRE-RENDER VOLUMES FOR INSTANT ACCESS (only if we have active segments)
    let preRenderResult = null;
    if (activeSegmentCount > 0) {
      try {
        logToTerminal('🎛️ Pre-rendering volume variations for instant access...', 'info');
        showMessage('Pre-rendering volumes for faster processing...', 'info');

        const preRenderResponse = await fetch(`${API_BASE_URL}/api/prerender-volumes-for-segments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            segments: JSON.stringify(validatedSegments),
            musicData: JSON.stringify(validatedMusicData)
          })
        });

        if (preRenderResponse.ok) {
          preRenderResult = await preRenderResponse.json();
          if (preRenderResult.success) {
            logToTerminal(`✅ Pre-rendered ${preRenderResult.totalVariations} volume variations`, 'success');
            logToTerminal(`⚡ Volume changes will now be ${preRenderResult.estimatedSpeedup || '90% faster'}`, 'info');
          } else {
            logToTerminal(`⚠️ Pre-rendering failed: ${preRenderResult.error}`, 'warning');
          }
        } else {
          logToTerminal('⚠️ Pre-rendering service unavailable, using fallback method', 'warning');
        }
      } catch (preRenderError) {
        console.warn('Pre-rendering failed:', preRenderError);
        logToTerminal('⚠️ Pre-rendering failed, using slower fallback method', 'warning');
        // Continue without pre-rendering - backend will use on-demand creation
      }
    } else {
      logToTerminal('ℹ️ Skipping volume pre-rendering (no active music segments)', 'info');
    }

    // ✅ SEND TO BACKEND with proper handling for no music segments
    const completeVideoFormData = new FormData();
    completeVideoFormData.append('video', selectedFile);
    completeVideoFormData.append('segments', JSON.stringify(validatedSegments));
    completeVideoFormData.append('musicData', JSON.stringify(validatedMusicData));
    completeVideoFormData.append('videoDuration', duration.toString());
    completeVideoFormData.append('allowEmptyMusic', 'true'); // Flag for backend

    // 🎛️ NEW: Include pre-render metadata for backend optimization
    if (preRenderResult && preRenderResult.success) {
      completeVideoFormData.append('hasPreRenderedVolumes', 'true');
      completeVideoFormData.append('preRenderSessionId', Date.now().toString());
      logToTerminal('🚀 Using pre-rendered volumes for instant processing...', 'info');
    } else {
      completeVideoFormData.append('hasPreRenderedVolumes', 'false');
      if (activeSegmentCount > 0) {
        logToTerminal('⏳ Using on-demand volume creation (slower method)...', 'info');
      }
    }

    logToTerminal(`📤 Sending regeneration request: ${activeSegmentCount} music segments...`, 'info');

    const videoCreationStartTime = Date.now();

    const completeVideoResponse = await fetch(`${API_BASE_URL}/api/create-complete-video`, {
      method: 'POST',
      body: completeVideoFormData,
    });

    if (!completeVideoResponse.ok) {
      const errorData = await completeVideoResponse.json();
      throw new Error(errorData.error || 'Failed to regenerate video');
    }

    const completeVideoResult = await completeVideoResponse.json();
    const videoCreationTime = ((Date.now() - videoCreationStartTime) / 1000).toFixed(1);

    if (completeVideoResult.combinedUrl) {
      setCombinedVideoUrl(completeVideoResult.combinedUrl);
      
      // 🎛️ ENHANCED: Log performance metrics
      logToTerminal(`✅ Video regenerated successfully in ${videoCreationTime}s!`, 'success');
      
      if (completeVideoResult.audioProcessing) {
        const { instantAudio, downloadedAudio, speedImprovement } = completeVideoResult.audioProcessing;
        if (instantAudio > 0) {
          logToTerminal(`⚡ Performance: ${instantAudio}/${instantAudio + downloadedAudio} segments used pre-rendered audio (${speedImprovement})`, 'success');
        }
      }
      
      // Enhanced user messages with performance info
      if (removedSegmentCount > 0 && activeSegmentCount > 0) {
        const speedInfo = preRenderResult?.success ? ' (instant volume access)' : '';
        showMessage(`Video updated! ${removedSegmentCount} segment(s) removed, ${activeSegmentCount} active${speedInfo}`, 'success');
      } else if (removedSegmentCount > 0 && activeSegmentCount === 0) {
        showMessage(`Video updated! All music removed (${removedSegmentCount} segments)`, 'success');
      } else {
        const speedInfo = preRenderResult?.success ? ' with instant volume access' : '';
        showMessage(`Video updated successfully${speedInfo}!`, 'success');
      }

      // 🎛️ NEW: Store pre-render info for future volume changes
      if (preRenderResult && preRenderResult.success) {
        // Store in component state or context for instant volume slider updates
        // setPreRenderedVolumeInfo({
        //   available: true,
        //   sessionId: Date.now().toString(),
        //   segments: activeSegmentCount,
        //   totalVariations: preRenderResult.totalVariations,
        //   volumeLevels: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
        // });
        
        logToTerminal('🎛️ Volume sliders now support instant changes!', 'info');
      }
      
    } else {
      throw new Error('No combined video URL received');
    }

  } catch (error) {
    console.error('❌ Error in regenerateCompleteVideoWithoutRemovedSegments:', error);
    logToTerminal(`❌ Failed to regenerate video: ${error.message}`, 'error');
    
    // 🎛️ ENHANCED: Provide troubleshooting info
    if (error.message.includes('pre-render')) {
      logToTerminal('💡 Suggestion: Try again without pre-rendering for compatibility', 'info');
    } else if (error.message.includes('volume')) {
      logToTerminal('💡 Suggestion: Check audio URLs and volume settings', 'info');
    }
    
    throw error; // Re-throw for caller handling
  } finally {
    setIsGeneratingPreview(false);
  }
};

// 🎛️ HELPER FUNCTIONS - ADD THESE TO YOUR COMPONENT

// Fallback method for volume changes when pre-rendering isn't available
const changeVolumeSlowMethod = async (segmentIndex, newVolumeLevel) => {
  try {
    logToTerminal(`🐌 Changing segment ${segmentIndex + 1} to ${newVolumeLevel}% (slower method)...`, 'info');
    
    // Update the music data with new volume
    setGeneratedSegmentMusic(prev => ({
      ...prev,
      [segmentIndex]: {
        ...prev[segmentIndex],
        customVolume: newVolumeLevel / 100,
        hasCustomVolume: true
      }
    }));

    // Regenerate video with new volume (this will use on-demand volume creation)
    await regenerateCompleteVideoWithoutRemovedSegments();
    
    logToTerminal(`✅ Volume changed to ${newVolumeLevel}% using slower method`, 'success');
    return true;
    
  } catch (error) {
    logToTerminal(`❌ Volume change failed: ${error.message}`, 'error');
    throw error;
  }
};

// 🎛️ NEW: Helper function for instant volume changes (add to your component)
const changeVolumeInstantly = async (segmentIndex, newVolumeLevel) => {
  // For now, always use the slower method since we need to set up the state first
  // Once you add the preRenderedVolumeInfo state, you can uncomment the instant logic
  
  /*
  if (!preRenderedVolumeInfo?.available) {
    console.warn('No pre-rendered volumes available, using slower method');
    return changeVolumeSlowMethod(segmentIndex, newVolumeLevel);
  }

  try {
    logToTerminal(`🎛️ Changing segment ${segmentIndex + 1} to ${newVolumeLevel}% instantly...`, 'info');

    const response = await fetch(`${API_BASE_URL}/api/get-volume-variation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        segmentIndex,
        volumeLevel: newVolumeLevel,
        sessionId: preRenderedVolumeInfo.sessionId
      })
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success && result.instant) {
        logToTerminal(`⚡ Volume changed instantly to ${newVolumeLevel}%!`, 'success');
        
        // Update the music data with new volume
        setGeneratedSegmentMusic(prev => ({
          ...prev,
          [segmentIndex]: {
            ...prev[segmentIndex],
            customVolume: newVolumeLevel / 100,
            hasCustomVolume: true
          }
        }));

        // Auto-regenerate video with new volume (this will be fast with pre-rendered audio)
        await regenerateCompleteVideoWithoutRemovedSegments();
        
        return true;
      }
    }
    
    throw new Error('Instant volume change failed');
    
  } catch (error) {
    console.warn('Instant volume change failed, using slower method:', error);
    logToTerminal('⏳ Using slower volume change method...', 'warning');
    return changeVolumeSlowMethod(segmentIndex, newVolumeLevel);
  }
  */
  
  // For now, use the slower method
  return changeVolumeSlowMethod(segmentIndex, newVolumeLevel);
};

// 🎛️ SIMPLIFIED: Enhanced volume slider component integration
// Add this to your JSX where you render volume sliders

// 🎛️ NEW: Helper function for instant volume changes (add to your component)

// 🎛️ NEW: Enhanced volume slider component integration
const VolumeSliderEnhanced = ({ segmentIndex, currentVolume, onVolumeChange }) => {
  const [isChanging, setIsChanging] = useState(false);
  
const handleVolumeChange = async (newVolume) => {
  if (!selectedTrackForPreview || !selectedFile) {
    showMessage('Cannot adjust volume - missing track or video data.', 'error');
    return;
  }

  setPreviewMusicVolume(newVolume);
  
  // Debounce the volume change to avoid too many requests
  if (window.volumeChangeTimeout) {
    clearTimeout(window.volumeChangeTimeout);
  }
  
  window.volumeChangeTimeout = setTimeout(async () => {
    try {
      setIsGeneratingPreview(true);
      showMessage('Updating music volume...', 'info');
      
      const track = selectedTrackForPreview;
      const audioUrl = track.audioUrl || track.url || track.audio_url;
      
      // Get the selected segment time range
      const [segmentStart, segmentEnd] = getTrimRange();
      const segmentDuration = segmentEnd - segmentStart;
      const fullVideoDuration = duration;
      
      // Parse audio timestamps
      let audioStart, audioEnd;
      if (typeof track.start === 'string' && track.start.includes(':')) {
        audioStart = convertTimestampToSeconds(track.start);
        audioEnd = convertTimestampToSeconds(track.end);
      } else {
        audioStart = parseInt(track.start) || 0;
        audioEnd = parseInt(track.end) || audioStart + 30;
      }
      
      const audioDuration = audioEnd - audioStart;
      
      // Create FormData for the new request
      const formData = new FormData();
      
      if (track.videoUrl) {
        formData.append('videoUrl', track.videoUrl);
      } else {
        formData.append('video', selectedFile);
      }
      
      formData.append('audioUrl', audioUrl);
      formData.append('videoDuration', fullVideoDuration.toString());
      formData.append('videoStart', segmentStart.toString());
      formData.append('musicDuration', Math.min(segmentDuration, audioDuration).toString());
      formData.append('audioStart', audioStart.toString());
      formData.append('audioDuration', audioDuration.toString());
      formData.append('musicVolume', newVolume.toString());
      
      const res = await fetch(`${API_BASE_URL}/api/combine-video-audio`, {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }
      
      const responseData = await res.json();
      
      if (!responseData.combinedUrl) {
        throw new Error('No combined video URL received from server');
      }
      
      // Update the combined video URL
      setCombinedVideoUrl(responseData.combinedUrl);
      showMessage(`Volume updated to ${Math.round(newVolume * 100)}%`, 'success');
      
    } catch (err) {
      console.error('Error updating volume:', err);
      showMessage('Failed to update volume. Please try again.', 'error');
    } finally {
      setIsGeneratingPreview(false);
    }
  }, 1000); // 1 second debounce
};

  return (
    <div className="volume-slider-container">
      <input
        type="range"
        min="0"
        max="100"
        step="10"
        value={currentVolume}
        onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
        disabled={isChanging}
        className={`volume-slider ${preRenderedVolumeInfo?.available ? 'instant' : 'slow'}`}
      />
      <span className="volume-indicator">
        {currentVolume}%
        {preRenderedVolumeInfo?.available && (
          <span className="instant-badge">⚡</span>
        )}
        {isChanging && <span className="changing">...</span>}
      </span>
    </div>
  );
};

// ✅ ENHANCED: handleRestoreSegmentMusic function
// ✅ FIXED: handleRestoreSegmentMusic function
const handleRestoreSegmentMusic = async (segmentIndex) => {
  const existing = generatedSegmentMusic[segmentIndex];

  if (!existing) {
    showMessage(`No music data found for segment ${segmentIndex + 1}`, 'warning');
    return;
  }

  if (!existing.removed) {
    showMessage(`Music for segment ${segmentIndex + 1} is already active`, 'info');
    return;
  }

  try {
    logToTerminal(`🔄 Restoring music for segment ${segmentIndex + 1}...`, 'info');

    // ✅ VALIDATE essential fields for restoration
    const originalAudioUrl = existing.originalAudioUrl || existing.audioUrl;
    const originalStart = existing.originalSegmentStart ?? existing.segmentStart ?? existing.actualMusicTiming?.start ?? 0;
    const originalEnd = existing.originalSegmentEnd ?? existing.segmentEnd ?? existing.actualMusicTiming?.end ?? 30;
    const duration = originalEnd - originalStart;

    if (!originalAudioUrl) {
      throw new Error('Missing audio URL for restoration.');
    }

    if (isNaN(originalStart) || isNaN(originalEnd) || duration <= 0) {
      throw new Error('Invalid segment timing during restoration.');
    }

    // ✅ BUILD restored data
    const restoredMusicData = {
      ...existing,
      removed: false,
      isRemovedFromVideo: false,
      removedAt: undefined,
      restoredAt: new Date().toISOString(),
      audioUrl: originalAudioUrl,
      segmentStart: originalStart,
      segmentEnd: originalEnd,
      customVolume: existing.originalCustomVolume ?? existing.customVolume ?? 0.3,
      hasCustomVolume: existing.hasCustomVolume || false,
      
      actualMusicTiming: existing.originalActualMusicTiming || {
        start: originalStart,
        end: originalEnd,
        duration,
        wasAdjusted: false
      },
      
      segment: existing.segment || processedVideoResult?.segments?.[segmentIndex] || {
        start_time: originalStart.toString(),
        end_time: originalEnd.toString(),
        volume: existing.originalCustomVolume ?? 0.3
      },
      
      // ✅ CRITICAL FIX: Set proper video states
      progressiveVideoReady: true, // ✅ Mark as ready since we have the data
      completeVideoReady: false,   // ✅ Will be set after regeneration
      videoProcessing: false       // ✅ Important: Don't start in processing state
    };

    // ✅ UPDATE state with restored data FIRST
    const updatedMusicData = {
      ...generatedSegmentMusic,
      [segmentIndex]: restoredMusicData
    };

    setGeneratedSegmentMusic(updatedMusicData);

    logToTerminal(`✅ Music restored for segment ${segmentIndex + 1}`, 'success');
    logToTerminal(`   Time: ${originalStart}s to ${originalEnd}s`, 'info');
    logToTerminal(`   Volume: ${Math.round(restoredMusicData.customVolume * 100)}%`, 'info');
    showMessage(`Music restored for segment ${segmentIndex + 1}`, 'success');

    // ✅ FIXED: Only regenerate progressive video, not complete video
    logToTerminal(`🎬 Updating progressive video with restored segment ${segmentIndex + 1}...`, 'info');
    
    try {
      // ✅ Mark as processing BEFORE starting regeneration
      setGeneratedSegmentMusic(prev => ({
        ...prev,
        [segmentIndex]: {
          ...prev[segmentIndex],
          videoProcessing: true
        }
      }));

      // ✅ FIXED: Use progressive video update instead of complete video regeneration
      const progressiveFormData = new FormData();
      progressiveFormData.append('video', selectedFile);
      progressiveFormData.append('segments', JSON.stringify(processedVideoResult.segments));
      progressiveFormData.append('musicData', JSON.stringify(updatedMusicData));
      progressiveFormData.append('videoDuration', duration.toString());
      progressiveFormData.append('restoredSegmentIndex', segmentIndex.toString());
      
      // Add trimmed video info if applicable
      if (processedVideoResult?.trim_info) {
        progressiveFormData.append('trimInfo', JSON.stringify(processedVideoResult.trim_info));
      }

      const progressiveResponse = await fetch(`${API_BASE_URL}/api/update-progressive-video`, {
        method: 'POST',
        body: progressiveFormData,
      });

      if (!progressiveResponse.ok) {
        const errorData = await progressiveResponse.json();
        throw new Error(errorData.details || errorData.error || 'Progressive video update failed');
      }

      const progressiveResult = await progressiveResponse.json();
      
      if (progressiveResult.combinedUrl) {
        // ✅ UPDATE: Set the new progressive video URL
        setCombinedVideoUrl(progressiveResult.combinedUrl);
        
        // ✅ CRITICAL FIX: Mark video processing as complete
        setGeneratedSegmentMusic(prev => ({
          ...prev,
          [segmentIndex]: {
            ...prev[segmentIndex],
            completeVideoReady: true,
            videoProcessing: false, // ✅ CLEAR the processing flag
            progressiveVideoUrl: progressiveResult.combinedUrl
          }
        }));
        
        logToTerminal(`✅ Progressive video updated with restored segment ${segmentIndex + 1}`, 'success');
        showMessage(`Segment ${segmentIndex + 1} restored and video updated!`, 'success');
      } else {
        throw new Error('No progressive video URL received');
      }
      
    } catch (error) {
      console.error('❌ Progressive video update failed:', error);
      logToTerminal(`⚠️ Music restored but video update failed: ${error.message}`, 'warning');
      
      // ✅ CRITICAL FIX: Clear processing state even on error
      setGeneratedSegmentMusic(prev => ({
        ...prev,
        [segmentIndex]: {
          ...prev[segmentIndex],
          completeVideoReady: false,
          videoProcessing: false, // ✅ CLEAR the processing flag
          videoProcessingError: error.message
        }
      }));
      
      showMessage('Music restored but video update failed. Try refreshing.', 'warning');
    }

  } catch (error) {
    console.error(`❌ Failed to restore music for segment ${segmentIndex + 1}:`, error);
    logToTerminal(`❌ Restoration failed: ${error.message}`, 'error');
    showMessage(`Restoration failed: ${error.message}`, 'error');
    
    // ✅ CRITICAL FIX: Clear processing state on main error too
    setGeneratedSegmentMusic(prev => ({
      ...prev,
      [segmentIndex]: {
        ...prev[segmentIndex],
        videoProcessing: false // ✅ CLEAR the processing flag
      }
    }));
  }
};

// ✅ ALSO UPDATE: Enhanced regenerateCompleteVideoWithVolumes to better handle restored segments

// ✅ FIXED: Enhanced segment data validation and preparation
const regenerateCompleteVideoWithVolumes = async (currentMusicData = null) => {
  if (!selectedFile || !processedVideoResult || !processedVideoResult.segments) {
    showMessage('Cannot regenerate video - missing data', 'error');
    return;
  }

  const musicDataToUse = currentMusicData || generatedSegmentMusic;

  try {
    setIsGeneratingPreview(true);
    logToTerminal('🎬 Starting complete video generation...', 'info');

    // ✅ STEP 1: Validate and prepare segment data with enhanced error checking
    const validatedSegments = processedVideoResult.segments
      .map((segment, index) => {
        if (!segment) {
          console.error(`❌ Segment ${index + 1} is undefined`);
          return null; // Mark for filtering out
        }

        try {
          // ✅ Parse timing data with multiple fallbacks
          let parsedStart, parsedEnd;
          
          if (segment.parsed_start !== undefined) {
            parsedStart = segment.parsed_start;
          } else if (segment.start_time) {
            parsedStart = parseFloat(segment.start_time);
          } else {
            console.warn(`⚠️ Segment ${index + 1}: No start time, using 0`);
            parsedStart = 0;
          }

          if (segment.parsed_end !== undefined) {
            parsedEnd = segment.parsed_end;
          } else if (segment.end_time) {
            parsedEnd = parseFloat(segment.end_time);
          } else {
            console.warn(`⚠️ Segment ${index + 1}: No end time, using start + 30`);
            parsedEnd = parsedStart + 30;
          }

          // ✅ Validate timing logic
          if (isNaN(parsedStart) || isNaN(parsedEnd)) {
            console.error(`❌ Segment ${index + 1}: Invalid timing - start: ${parsedStart}, end: ${parsedEnd}`);
            return null;
          }

          if (parsedStart >= parsedEnd) {
            console.error(`❌ Segment ${index + 1}: Start >= end (${parsedStart} >= ${parsedEnd})`);
            return null;
          }

          const segmentDuration = parsedEnd - parsedStart;

          // ✅ Create fully validated segment object
          const validatedSegment = {
            // ✅ REQUIRED FIELDS - Backend expects these
            start_time: parsedStart.toString(),
            end_time: parsedEnd.toString(),
            
            // ✅ Parsed values for easy access
            parsed_start: parsedStart,
            parsed_end: parsedEnd,
            duration: segmentDuration,
            
            // ✅ Music description with fallbacks
            music_summary: segment.music_summary || segment.music_details || `Music for segment ${index + 1}`,
            music_details: segment.music_details || segment.music_summary || `Background music for segment ${index + 1}`,
            
            // ✅ Volume and fade settings with defaults
            volume: segment.volume !== undefined ? segment.volume : 0.3,
            fade_algorithm: segment.fade_algorithm || segment.fade_type || 'linear',
            fadein_duration: parseFloat(segment.fadein_duration || segment.fade_in_seconds || 0),
            fadeout_duration: parseFloat(segment.fadeout_duration || segment.fade_out_seconds || 0),
            
            // ✅ Processing metadata
            format_used: segment.format_used || 'processed',
            segment_index: index,
            
            // ✅ Copy all other original segment properties
            ...segment,
            
            // ✅ Override with our validated values
            start_time: parsedStart.toString(),
            end_time: parsedEnd.toString(),
            parsed_start: parsedStart,
            parsed_end: parsedEnd,
            duration: segmentDuration
          };

          console.log(`✅ Segment ${index + 1} validated:`, {
            start_time: validatedSegment.start_time,
            end_time: validatedSegment.end_time,
            duration: validatedSegment.duration,
            music_summary: validatedSegment.music_summary,
            fade_algorithm: validatedSegment.fade_algorithm
          });

          return validatedSegment;

        } catch (error) {
          console.error(`❌ Error validating segment ${index + 1}:`, error);
          return null;
        }
      })
      .filter(segment => segment !== null); // ✅ Remove invalid segments

    if (validatedSegments.length === 0) {
      throw new Error('No valid segments found after validation');
    }

    logToTerminal(`📊 Validated ${validatedSegments.length} segments out of ${processedVideoResult.segments.length} total`, 'info');

    // ✅ STEP 2: Validate and prepare music data with enhanced checks
    const validatedMusicData = {};
    let activeSegmentCount = 0;
    let restoredSegmentCount = 0;

    Object.entries(musicDataToUse).forEach(([indexStr, musicData]) => {
      const index = parseInt(indexStr);
      
      if (!musicData) {
        console.warn(`⚠️ Segment ${index + 1}: Music data is undefined`);
        return;
      }

      // ✅ Skip explicitly removed segments
      if (musicData.removed === true) {
        console.log(`🚫 Segment ${index + 1}: Skipping removed music`);
        return;
      }

      // ✅ Validate essential fields
      if (!musicData.audioUrl) {
        console.warn(`⚠️ Segment ${index + 1}: Missing audioUrl, skipping`);
        return;
      }

      // ✅ Find the corresponding validated segment
      const correspondingSegment = validatedSegments.find(seg => seg.segment_index === index);
      if (!correspondingSegment) {
        console.warn(`⚠️ Segment ${index + 1}: No corresponding validated segment found, skipping`);
        return;
      }

      // ✅ Count restored segments
      if (musicData.restoredAt) {
        restoredSegmentCount++;
        console.log(`🔄 Segment ${index + 1}: Including restored music`);
      }

      // ✅ Ensure all required fields with fallbacks
      const segmentStart = musicData.segmentStart ?? musicData.actualMusicTiming?.start ?? correspondingSegment.parsed_start ?? 0;
      const segmentEnd = musicData.segmentEnd ?? musicData.actualMusicTiming?.end ?? correspondingSegment.parsed_end ?? 30;

      validatedMusicData[index] = {
        ...musicData,
        audioUrl: musicData.audioUrl,
        segmentStart,
        segmentEnd,
        customVolume: musicData.customVolume !== undefined ? musicData.customVolume : 0.3,
        hasCustomVolume: musicData.hasCustomVolume || false,
        actualMusicTiming: musicData.actualMusicTiming || {
          start: segmentStart,
          end: segmentEnd,
          duration: segmentEnd - segmentStart
        },
        
        // ✅ Ensure segment reference exists and is valid
        segment: {
          ...correspondingSegment,
          start_time: segmentStart.toString(),
          end_time: segmentEnd.toString(),
          volume: musicData.customVolume !== undefined ? musicData.customVolume : correspondingSegment.volume
        }
      };

      activeSegmentCount++;
    });

    // ✅ STEP 3: Final validation checks
    if (activeSegmentCount === 0) {
      logToTerminal('⚠️ No active music segments found for video generation', 'warning');
      showMessage('No active music segments to include in video', 'warning');
      return;
    }

    // ✅ Log restoration summary
    if (restoredSegmentCount > 0) {
      logToTerminal(`🔄 Including ${restoredSegmentCount} restored segment(s) in regeneration`, 'info');
    }
    
    logToTerminal(`📊 Sending to backend: ${activeSegmentCount} music segments, ${validatedSegments.length} total segments`, 'info');

    // ✅ Debug log the data being sent
    console.log('🔍 DEBUGGING DATA SENT TO BACKEND:');
    console.log('Validated Segments:', validatedSegments.map(seg => ({
      index: seg.segment_index,
      start_time: seg.start_time,
      end_time: seg.end_time,
      duration: seg.duration,
      music_summary: seg.music_summary
    })));
    console.log('Validated Music Data:', Object.entries(validatedMusicData).map(([idx, data]) => ({
      index: idx,
      audioUrl: data.audioUrl?.substring(0, 50) + '...',
      segmentStart: data.segmentStart,
      segmentEnd: data.segmentEnd,
      volume: data.customVolume
    })));

    // ✅ STEP 4: Prepare FormData with validated data
    const completeVideoFormData = new FormData();
    completeVideoFormData.append('video', selectedFile);
    completeVideoFormData.append('segments', JSON.stringify(validatedSegments));
    completeVideoFormData.append('musicData', JSON.stringify(validatedMusicData));
    completeVideoFormData.append('videoDuration', duration.toString());

    // ✅ STEP 5: Send request to backend
    logToTerminal(`📤 Sending complete video request...`, 'info');

    const completeVideoResponse = await fetch(`${API_BASE_URL}/api/create-complete-video`, {
      method: 'POST',
      body: completeVideoFormData,
    });

    if (!completeVideoResponse.ok) {
      const errorData = await completeVideoResponse.json();
      throw new Error(errorData.error || 'Failed to regenerate complete video');
    }

    const completeVideoResult = await completeVideoResponse.json();

    if (completeVideoResult.combinedUrl) {
      setCombinedVideoUrl(completeVideoResult.combinedUrl);
      logToTerminal('✅ Complete video regenerated successfully!', 'success');
      
      if (restoredSegmentCount > 0) {
        showMessage(`Video updated! ${restoredSegmentCount} segment(s) restored, ${activeSegmentCount} total active`, 'success');
      } else {
        showMessage('Video updated with new settings!', 'success');
      }
    } else {
      throw new Error('No combined video URL received');
    }

  } catch (error) {
    console.error('❌ Error in regenerateCompleteVideoWithVolumes:', error);
    logToTerminal(`❌ Failed to regenerate video: ${error.message}`, 'error');
    showMessage('Failed to update video. Please try again.', 'error');
  } finally {
    setIsGeneratingPreview(false);
  }
};
// Add these functions to your ClipTuneGenerator.js file

// State for music analysis
const [musicAnalysis, setMusicAnalysis] = useState('');
const [isAnalyzingMusic, setIsAnalyzingMusic] = useState(false);
const [showMusicAnalysis, setShowMusicAnalysis] = useState(false);

// Function to analyze video for music with Gemini

const analyzeVideoForMusicWithGeneration = async (customPrompt = '', generateMusic = true) => {
  if (!selectedFile) {
    showMessage('Please select a video file first.', 'error');
    return;
  }

  setIsAnalyzingMusic(true);
  setMusicAnalysis('');
  
  try {
    showMessage('🎵 Analyzing video and generating music with AI...', 'info');
    
    const formData = new FormData();
    formData.append('video', selectedFile);
    if (customPrompt) {
      formData.append('customPrompt', customPrompt);
    }
    formData.append('analysisType', 'full');
    formData.append('generateMusic', generateMusic.toString());

    // FIRST: Upload video to GCS
    console.log('📤 Uploading video to GCS...');
    const uploadResponse = await fetch(`${API_BASE_URL}/api/upload-video-to-gcs`, {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error('Video upload failed');
    }

    const uploadResult = await uploadResponse.json();
    console.log('✅ Video uploaded:', uploadResult.gcs_uri);

    // SECOND: Analyze with Gemini and generate music
    console.log('🤖 Starting Gemini analysis + MusicGPT generation...');
    const analysisResponse = await fetch(`${API_BASE_URL}/api/analyze-gcs-video-for-music-with-generation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        publicUrl: uploadResult.public_url,
        customPrompt: customPrompt,
        analysisType: 'full',
        generateMusic: generateMusic
      }),
    });

    if (!analysisResponse.ok) {
      throw new Error('Analysis + generation failed');
    }

    const result = await analysisResponse.json();
    
    if (result.success) {
      // Store Gemini analysis
      setMusicAnalysis(result.gemini.analysis);
      setShowMusicAnalysis(true);
      
      // Log results to console
      console.log('🎼 GEMINI ANALYSIS:', result.gemini.analysis);
      
      if (result.musicgpt && result.musicgpt.success) {
        console.log('🎶 GENERATED MUSIC URL:', result.musicgpt.music.audio_url || result.musicgpt.music.url);
        
        showMessage(
          `🎉 Analysis and music generation completed! Check console for music URL.`, 
          'success'
        );
        
        // You can also store the music URL in state for playback
        // setGeneratedMusicUrl(result.musicgpt.music.audio_url || result.musicgpt.music.url);
        
      } else {
        showMessage(
          `🎵 Analysis completed! Music generation ${result.musicgpt ? 'failed' : 'was skipped'}.`, 
          result.musicgpt ? 'warning' : 'success'
        );
      }
    } else {
      throw new Error(result.error || 'Analysis failed');
    }

  } catch (error) {
    console.error('❌ Complete workflow error:', error);
    showMessage(`Workflow failed: ${error.message}`, 'error');
  } finally {
    setIsAnalyzingMusic(false);
  }
};
// Add these state variables at the top with your other useState declarations
const [webhookPolling, setWebhookPolling] = useState({});
const [webhookResults, setWebhookResults] = useState({});

// Add this function to poll for webhook results
const pollForWebhookResult = async (taskId, maxAttempts = 30) => {
  console.log('🔄 Starting webhook polling for task:', taskId);
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`🔍 Webhook poll attempt ${attempt}/${maxAttempts} for task ${taskId}`);
      
      const response = await fetch(`${API_BASE_URL}/api/get-webhook-result`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId })
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.success && data.result) {
          console.log('✅ Webhook result found!', data.result);
          
          // Check if music generation is complete
          if (data.result.status === 'completed' && data.result.audio_url) {
            console.log('🎵 Music generation completed via webhook!');
            console.log('🔗 Final audio URL:', data.result.audio_url);
            
            return {
              success: true,
              audio_url: data.result.audio_url,
              title: data.result.title,
              duration: data.result.duration,
              cost: data.result.conversion_cost,
              taskId: taskId
            };
          } else if (data.result.status === 'failed' || data.result.status === 'error') {
            console.error('❌ Music generation failed via webhook:', data.result.error);
            return {
              success: false,
              error: data.result.error || 'Music generation failed',
              taskId: taskId
            };
          } else {
            console.log(`⏳ Task still processing... Status: ${data.result.status}`);
          }
        }
      } else if (response.status === 404) {
        console.log(`⏳ Webhook result not yet available (attempt ${attempt}/${maxAttempts})`);
      } else {
        console.error('❌ Error checking webhook result:', response.status);
      }
      
      // Wait 5 seconds before next attempt
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
      
    } catch (error) {
      console.error(`❌ Webhook polling error (attempt ${attempt}):`, error);
      
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }
  
  console.log('⏰ Webhook polling timeout reached');
  return {
    success: false,
    error: 'Polling timeout - music may still be generating',
    taskId: taskId
  };
};

// Enhanced music generation function with webhook support

// Add this component for webhook status display
const WebhookStatusIndicator = ({ taskId, isPolling }) => {
  if (!isPolling) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      background: 'rgba(59, 130, 246, 0.9)',
      color: 'white',
      padding: '1rem',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      zIndex: 1002,
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <div style={{
        width: '16px',
        height: '16px',
        border: '2px solid transparent',
        borderTop: '2px solid white',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <div>
        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
          🕸️ Webhook Active
        </div>
        <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
          Task: {taskId}
        </div>
      </div>
    </div>
  );
};
// Add this test function
const testWebhookIntegration = async () => {
  try {
    console.log('🧪 Testing webhook integration...');
    
    // Test webhook endpoint
    const testResponse = await fetch(`${API_BASE_URL}/api/test-webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    if (testResponse.ok) {
      const testData = await testResponse.json();
      console.log('✅ Webhook test successful:', testData);
      showMessage('🕸️ Webhook system is working!', 'success');
    } else {
      throw new Error('Webhook test failed');
    }
  } catch (error) {
    console.error('❌ Webhook test failed:', error);
    showMessage('⚠️ Webhook test failed - check backend', 'error');
  }
};

// Add a test button to your UI (temporary)
{process.env.NODE_ENV === 'development' && (
  <button 
    onClick={testWebhookIntegration}
    style={{
      position: 'fixed',
      bottom: '1rem',
      left: '1rem',
      background: '#10b981',
      color: 'white',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '0.8rem',
      zIndex: 1000
    }}
  >
    🧪 Test Webhook
  </button>
)}
// Function to analyze uploaded GCS video
const analyzeGCSVideoForMusic = async (gcsUrl, customPrompt = '') => {
  setIsAnalyzingMusic(true);
  setMusicAnalysis('');
  
  try {
    showMessage('🌐 Analyzing GCS video with Gemini AI...', 'info');
    
    const response = await fetch(`${API_BASE_URL}/api/analyze-gcs-video-for-music`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        publicUrl: gcsUrl,
        customPrompt: customPrompt,
        analysisType: 'full'
      }),
    });

    if (!response.ok) {
      throw new Error('GCS analysis request failed');
    }

    const result = await response.json();
    
    if (result.success) {
      setMusicAnalysis(result.analysis);
      setShowMusicAnalysis(true);
      showMessage(
        `🎵 GCS video music analysis completed! Time: ${result.processingTime}`, 
        'success'
      );
    } else {
      throw new Error(result.error || 'GCS analysis failed');
    }

  } catch (error) {
    console.error('❌ GCS music analysis error:', error);
    showMessage(`GCS music analysis failed: ${error.message}`, 'error');
  } finally {
    setIsAnalyzingMusic(false);
  }
};

// Function to use combined upload + analysis workflow
const uploadAndAnalyzeVideo = async (customPrompt = '') => {
  if (!selectedFile) {
    showMessage('Please select a video file first.', 'error');
    return;
  }

  setIsAnalyzingMusic(true);
  setMusicAnalysis('');
  
  try {
    showMessage('🎬 Uploading to GCS and analyzing with Gemini...', 'info');
    
    const formData = new FormData();
    formData.append('video', selectedFile);
    if (customPrompt) {
      formData.append('customPrompt', customPrompt);
    }
    formData.append('analysisType', 'full');
    formData.append('skipUpload', 'false'); // Set to 'true' to skip GCS upload

    const response = await fetch(`${API_BASE_URL}/api/upload-and-analyze-video`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Combined workflow failed');
    }

    const result = await response.json();
    
    if (result.success) {
      // Update video URL to GCS URL if uploaded
      if (result.upload && result.upload.public_url) {
        setVideoUrl(result.upload.public_url);
        console.log('📁 Video uploaded to GCS:', result.upload.file_name);
      }
      
      // Set the analysis results
      setMusicAnalysis(result.analysis);
      setShowMusicAnalysis(true);
      
      showMessage(
        `🎉 Upload and analysis completed! Time: ${result.processingTime}`, 
        'success'
      );
      
      console.log('🎼 Complete Music Analysis:', result.analysis);
    } else {
      throw new Error(result.error || 'Combined workflow failed');
    }

  } catch (error) {
    console.error('❌ Combined workflow error:', error);
    showMessage(`Upload and analysis failed: ${error.message}`, 'error');
  } finally {
    setIsAnalyzingMusic(false);
  }
};



// Add this CSS to your component's style section or CSS file
const musicAnalysisStyles = `
@keyframes loading {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(0%); }
  100% { transform: translateX(100%); }
}

.music-analysis-section {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.analysis-result {
  font-family: 'Courier New', monospace;
  line-height: 1.6;
}

.analysis-result h1, .analysis-result h2, .analysis-result h3 {
  color: #2c3e50;
  margin-top: 20px;
  margin-bottom: 10px;
}

.analysis-result strong {
  color: #e74c3c;
}

.analysis-result ul {
  margin-left: 20px;
}

.analysis-result li {
  margin-bottom: 5px;
}
`;


// ✅ ADDITIONAL: Debug function to check segment data


// ✅ UPDATE the Restore button in your UI to call debugSegmentStates after restoration:

  // Handler for proceeding from video edit to config modal
  const handleVideoEditConfirm = () => {
    if (duration === 0 || thumbnails.length === 0) {
        showMessage("Please wait for video to load or select a valid video.", "error");
        return;
    }
    setCurrentStep(1); // Go back to step 1 to show config modal
    setShowConfigModal(true);
  };
// PERFORMANCE OPTIMIZATION: Throttle video updates for smoother performance
const throttledVideoUpdate = useCallback(
  debounce((time) => {
    if (videoPreviewRef.current && !isNaN(time)) {
      videoPreviewRef.current.currentTime = time;
    }
  }, 16), // ~60fps updates
  []
);

// ENHANCED: Visual feedback during dragging
const [isDragging, setIsDragging] = useState(false);
const [dragType, setDragType] = useState(null);


  // Handler for going back to video segment selection
  const handleGoBackToVideoEdit = () => {
    // Stop any currently playing music and hide the bottom player
    stopMusicAndHidePlayer();
    
    setShowConfigModal(false);
    setCurrentStep(2); // Go back to video segment selection
  };

  // Handler for initiating music generation
// Modified handleGenerate function with auto video generation
// Updated handleGenerate function - Direct redirect when renderMusicVideo is enabled
// COMPLETE FIXED handleGenerate function - Prevents hanging at generation screen
useEffect(() => {
  // Auto-hide dropdown when all generations are complete
  if (generatingTracks.length > 0) {
    const allCompleted = generatingTracks.every(track => 
      track.status === 'completed' || track.status === 'error'
    );
    
    if (allCompleted) {
      // 🚨 FIX: Just hide dropdown and clean up - DON'T change currentStep
      setTimeout(() => {
        setForceShowDropdown(false);
        // Clean up completed tracks
        setTimeout(() => {
          setGeneratingTracks(prev => 
            prev.filter(track => track.status === 'generating')
          );
        }, 1000);
      }, 3000); // Show completion status for 3 seconds
    }
  }
}, [generatingTracks]); // 🚨 FIX: Remove currentStep dependency



// REPLACE your existing handleGenerate function with this FIXED version
// The key fix is in the track processing section where we use the AI-recommended timing

const handleGenerate = async () => {
  if (!selectedFile) {
    return showMessage('Please select a video file first.', 'error');
  }

  // Validate track name
  if (!trackName || trackName.trim() === '') {
    showMessage('Please enter a track name before generating music', 'error');
    return;
  }

  const [start, end] = getTrimRange();
  const formData = new FormData();
  formData.append('video', selectedFile);
  formData.append('youtubeUrls', JSON.stringify(youtubeUrls.filter(url => url.trim() !== '')));
  formData.append('lyrics', lyrics);
  formData.append('extra_description', description);
  formData.append('instrumental', instrumental.toString());
  formData.append('renderMusicVideo', renderMusicVideo.toString());
  formData.append('song_title', trackName.trim());
  formData.append('track_name', trackName.trim());
  formData.append('userId', userId || localStorage.getItem('userId') || 'anonymous');
  formData.append('video_start', start.toString());
  formData.append('video_end', end.toString());

  try {
    setIsProcessing(true);
    setShowConfigModal(false);

    if (renderMusicVideo) {
      console.log('🎬 RENDER WITH VIDEO IS CHECKED - Staying in processing mode until video complete');
      
      logToTerminal(`🎵 Generating "${trackName.trim()}" with video rendering...`, 'info');
      
      const res = await fetch(`${API_BASE_URL}/api/process-video`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Music generation failed. Please try again.');
      }

      let tracksToProcess = [];
      
      if (data.success && data.tracks && Array.isArray(data.tracks) && data.tracks.length > 0) {
        tracksToProcess = data.tracks;
      } else if (data.success && (data.audioUrl || data.audio_url || data.url)) {
        const singleTrack = {
          audioUrl: data.audioUrl || data.audio_url || data.url,
          url: data.audioUrl || data.audio_url || data.url,
          audio_url: data.audioUrl || data.audio_url || data.url,
          title: data.title || trackName.trim(),
          trackName: data.trackName || trackName.trim(),
          duration: data.duration || '211s',
          // 🚨 FIX: Use AI-recommended timing if available, otherwise use video segment timing
          start: data.start || formatTime(start),
          end: data.end || formatTime(end)
        };
        tracksToProcess = [singleTrack];
      } else {
        throw new Error('No valid tracks received from backend.');
      }

      // 🚨 FIX: Process tracks with correct timing
      const validTracks = tracksToProcess
        .map((track, index) => ({
          ...track,
          audioUrl: track.audioUrl || track.url || track.audio_url,
          url: track.audioUrl || track.url || track.audio_url,
          trackName: trackName.trim(),
          title: trackName.trim(),
          duration: track.duration || '211s',
          // 🚨 CRITICAL FIX: Use the AI-recommended timing from backend response
          start: track.start || formatTime(start), // AI timing takes priority
          end: track.end || formatTime(end),       // AI timing takes priority
          videoSegment: {
            // Keep original video segment info separate
            startSeconds: start,
            endSeconds: end,
            duration: end - start
          }
        }))
        .filter(track => track.audioUrl);

      if (validTracks.length === 0) {
        throw new Error('No valid audio URLs found in tracks.');
      }

      showMessage(`"${trackName.trim()}" generated successfully! Creating video...`, 'success');

      console.log('🎬 Starting automatic video generation while staying in processing mode...');
      
      try {
        console.log('🎵 Using track for video:', validTracks[0]);
        console.log('🎯 Timeline segment:', start, 'to', end, 'seconds');
        
        await handleDownloadVideoWithMusic(validTracks[0]);
        
        console.log('✅ Video generation completed, should be on Step 5 now');
        
      } catch (error) {
        console.error('❌ Auto video generation failed:', error);
        showMessage('Music generated but video creation failed.', 'error');
        
        setTracks(validTracks);
        setCurrentStep(4);
      }

      // 🚨 FIX: Save tracks with correct timing
      for (const track of validTracks) {
        // 🚨 CRITICAL: Use the track's start/end times (which are AI-recommended)
        // instead of the video segment start/end
        await saveRecentTrackWithCorrectTiming(track);
      }

      if (userId) fetchRecentTracks(userId);

    } else {
      // Dropdown behavior code remains the same...
      setShowDropdownMenu(true);
      setForceShowDropdown(true);
      
      const generatingTrack = {
        id: Date.now(),
        trackName: trackName.trim(),
        progress: 0,
        status: 'generating',
        startTime: new Date().toISOString(),
        error: null,
        completedTracks: null
      };
      
      setGeneratingTracks(prev => [...prev, generatingTrack]);
      
      showMessage(`🎵 Generating "${trackName.trim()}" - Check dropdown for progress!`, 'info');
      
      const generatingMessage = {
        id: Date.now(),
        type: 'ai',
        message: `🎵 Started generating "${trackName.trim()}"! You can monitor the progress in the dropdown menu above. I'll let you know when it's ready! 🎧`,
        timestamp: new Date().toLocaleTimeString()
      };
      setChatHistory(prev => [...prev, generatingMessage]);
      
      const progressInterval = setInterval(() => {
        setGeneratingTracks(prev => 
          prev.map(track => 
            track.id === generatingTrack.id 
              ? { ...track, progress: Math.min(track.progress + Math.random() * 15, 95) }
              : track
          )
        );
      }, 800);
      
      logToTerminal(`🎵 Generating "${trackName.trim()}" in background...`, 'info');
      
      const res = await fetch(`${API_BASE_URL}/api/process-video`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      
      clearInterval(progressInterval);

      if (!res.ok) {
        setGeneratingTracks(prev => 
          prev.map(track => 
            track.id === generatingTrack.id 
              ? { ...track, status: 'error', progress: 0, error: data.error || 'Generation failed' }
              : track
          )
        );
        
        const errorMessage = {
          id: Date.now(),
          type: 'ai',
          message: `❌ Sorry, there was an error generating "${trackName.trim()}": ${data.error || 'Unknown error'}. Please try again!`,
          timestamp: new Date().toLocaleTimeString()
        };
        setChatHistory(prev => [...prev, errorMessage]);
        
        throw new Error(data.error || 'Music generation failed. Please try again.');
      }

      let tracksToProcess = [];
      
      if (data.success && data.tracks && Array.isArray(data.tracks) && data.tracks.length > 0) {
        tracksToProcess = data.tracks;
      } else if (data.success && (data.audioUrl || data.audio_url || data.url)) {
        const singleTrack = {
          audioUrl: data.audioUrl || data.audio_url || data.url,
          url: data.audioUrl || data.audio_url || data.url,
          audio_url: data.audioUrl || data.audio_url || data.url,
          title: data.title || trackName.trim(),
          trackName: data.trackName || trackName.trim(),
          duration: data.duration || '211s',
          // 🚨 FIX: Use AI-recommended timing
          start: data.start || formatTime(start),
          end: data.end || formatTime(end)
        };
        tracksToProcess = [singleTrack];
      } else {
        throw new Error('No valid tracks received from backend.');
      }

      // 🚨 FIX: Process tracks with correct timing
      const validTracks = tracksToProcess
        .map((track, index) => ({
          ...track,
          audioUrl: track.audioUrl || track.url || track.audio_url,
          url: track.audioUrl || track.url || track.audio_url,
          trackName: trackName.trim(),
          title: trackName.trim(),
          duration: track.duration || '211s',
          // 🚨 CRITICAL FIX: Use AI-recommended timing
          start: track.start || formatTime(start),
          end: track.end || formatTime(end)
        }))
        .filter(track => track.audioUrl);

      if (validTracks.length === 0) {
        throw new Error('No valid audio URLs found in tracks.');
      }

      setGeneratingTracks(prev => 
        prev.map(track => 
          track.id === generatingTrack.id 
            ? { 
                ...track, 
                status: 'completed', 
                progress: 100, 
                completedTracks: validTracks,
                error: null 
              }
            : track
        )
      );
      
      setTracks(validTracks);
      
      // 🚨 FIX: Save to recent tracks with correct timing
      for (const track of validTracks) {
        await saveRecentTrackWithCorrectTiming(track);
      }
      
      if (userId) fetchRecentTracks(userId);
      
      const successMessage = {
        id: Date.now(),
        type: 'ai',
        message: `🎉 "${trackName.trim()}" generated successfully! You can now find it in your recent tracks dropdown. Click on it to play, or generate another track! 🎵`,
        timestamp: new Date().toLocaleTimeString()
      };
      setChatHistory(prev => [...prev, successMessage]);
      
      showMessage(`🎉 "${trackName.trim()}" completed! Check your recent tracks in the dropdown.`, 'success');
      
      logToTerminal(`✅ "${trackName.trim()}" generation completed successfully!`, 'success');
    }

  } catch (err) {
    console.error('Error generating music:', err);
    showMessage(err.message, 'error');
    
    if (!renderMusicVideo) {
      setGeneratingTracks(prev => 
        prev.map(track => 
          track.status === 'generating' 
            ? { ...track, status: 'error', progress: 0, error: err.message }
            : track
        )
      );
      
      const errorMessage = {
        id: Date.now(),
        type: 'ai',
        message: `❌ Sorry, there was an error: ${err.message}. Please try again!`,
        timestamp: new Date().toLocaleTimeString()
      };
      setChatHistory(prev => [...prev, errorMessage]);
    }
    
    setTracks([]);
  } finally {
    if (!renderMusicVideo || currentStep === 5) {
      setIsProcessing(false);
    }
  }
};

// 🚨 NEW: Function to save recent tracks with correct timing
const saveRecentTrackWithCorrectTiming = async (track) => {
  if (!userId) return;
  
  try {
    console.log('💾 Saving track with timing:', {
      trackName: track.trackName,
      start: track.start, // This should be AI-recommended timing like "0:14"
      end: track.end,     // This should be AI-recommended timing like "0:53"
      videoSegment: track.videoSegment
    });

    const res = await fetch(`${API_BASE_URL}/api/save-recent-track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        audioUrl: track.url || track.audio_url,
        duration: track.duration || `${selectionDuration}s`,
        description,
        lyrics,
        youtubeUrls: youtubeUrls.filter(url => url.trim() !== ''),
        // 🚨 CRITICAL FIX: Use the track's timing (AI-recommended)
        start: track.start, // Should be like "0:14" from AI analysis
        end: track.end,     // Should be like "0:53" from AI analysis
        trackName: track.trackName || track.title || trackName || 'Unnamed Track',
        originalFileName: selectedFile?.name || 'unknown_video',
        generationType: 'full_generation',
        // Also save the original video segment info for reference
        videoSegmentInfo: track.videoSegment ? {
          videoStart: track.videoSegment.startSeconds,
          videoEnd: track.videoSegment.endSeconds,
          videoDuration: track.videoSegment.duration
        } : null
      })
    });

    const data = await res.json();
    if (res.ok && data.recentTracks) {
      setRecentTracks(data.recentTracks);
      logToTerminal(`💾 "${track.trackName || trackName}" saved with correct timing (${track.start} - ${track.end})`, 'success');
    }
  } catch (err) {
    console.warn('Failed to save recent track:', err);
  }
};
// FRONTEND: Enhanced fade algorithm display and controls (ClipTuneGenerator.js)

// Helper function to get fade algorithm info
// REPLACE your existing getFadeAlgorithmInfo function with this fixed version:

// Update your getFadeAlgorithmInfo function to handle both field names
const getFadeAlgorithmInfo = (algorithm) => {
  // Handle null, undefined, empty string, "Not specified", or missing algorithm
  if (!algorithm || 
      algorithm.trim() === '' || 
      algorithm.toLowerCase().trim() === 'not specified' ||
      algorithm.toLowerCase().trim() === 'none' ||
      algorithm.toLowerCase().trim() === 'default') {
    return { 
      name: 'Linear', 
      icon: '📈', 
      color: '#4ecdc4', 
      description: 'Smooth linear transition (default)' 
    };
  }
  
  const algo = algorithm.toLowerCase().trim();
  switch (algo) {
    case 'linear':
    case 'tri':
    case 'triangular':
      return { 
        name: 'Linear', 
        icon: '📈', 
        color: '#4ecdc4', 
        description: 'Smooth straight-line transition' 
      };
    case 'exponential':
    case 'exp':
      return { 
        name: 'Exponential', 
        icon: '📊', 
        color: '#ff6b6b', 
        description: 'Fast start, gradual end' 
      };
    case 'logarithmic':
    case 'log':
      return { 
        name: 'Logarithmic', 
        icon: '📉', 
        color: '#45b7d1', 
        description: 'Gradual start, fast end' 
      };
    case 'cosine':
    case 'cos':
    case 'hsin':
      return { 
        name: 'Cosine', 
        icon: '🌊', 
        color: '#96ceb4', 
        description: 'Smooth S-shaped curve' 
      };
    case 'sigmoid':
    case 's-curve':
    case 'esin':
      return { 
        name: 'S-Curve', 
        icon: '〰️', 
        color: '#feca57', 
        description: 'Gentle start/end, steep middle' 
      };
    case 'step':
    case 'nofade':
      return { 
        name: 'Step', 
        icon: '⬜', 
        color: '#ff9ff3', 
        description: 'Instant on/off (no fade)' 
      };
    default:
      console.log(`Using algorithm: "${algorithm}" as Linear`);
      return { 
        name: 'Linear', 
        icon: '📈', 
        color: '#4ecdc4', 
        description: 'Smooth linear transition' 
      };
  }
};


// Update your FadeInfoDisplay component to handle both field names
const FadeInfoDisplay = ({ segment, index }) => {
  // Add safety checks for segment
  if (!segment) {
    console.warn('FadeInfoDisplay: segment is undefined');
    return null;
  }

  // Handle both field naming conventions safely
  const algorithm = segment.fade_algorithm || segment.fade_type || 'linear';
  const fadeinDuration = segment.fadein_duration || segment.fade_in_seconds;
  const fadeoutDuration = segment.fadeout_duration || segment.fade_out_seconds;
  
  const fadeInfo = getFadeAlgorithmInfo(algorithm);
  const hasFadeIn = fadeinDuration && parseFloat(fadeinDuration) > 0;
  const hasFadeOut = fadeoutDuration && parseFloat(fadeoutDuration) > 0;
  
  if (!hasFadeIn && !hasFadeOut) return null;
  
  return (
    <div style={{
      fontSize: '0.7rem',
      color: 'rgba(255, 255, 255, 0.9)',
      background: 'rgba(0, 0, 0, 0.3)',
      padding: '0.5rem 0.7rem',
      borderRadius: '8px',
      marginBottom: '0.5rem',
      border: `1px solid ${fadeInfo.color}40`
    }}>
      <div style={{ 
        fontWeight: 'bold', 
        marginBottom: '0.4rem',
        color: fadeInfo.color,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        {fadeInfo.icon} {fadeInfo.name} Fade Algorithm
      </div>
      
      <div style={{ 
        fontSize: '0.65rem', 
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: '0.3rem',
        fontStyle: 'italic'
      }}>
        {fadeInfo.description}
      </div>
      
      {hasFadeIn && (
        <div style={{ 
          marginBottom: '0.2rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          background: 'rgba(76, 220, 196, 0.1)',
          padding: '0.2rem 0.4rem',
          borderRadius: '4px'
        }}>
          <span>🔊 Fade In:</span>
          <span style={{ color: '#4ecdc4', fontWeight: 'bold' }}>
            {fadeinDuration}s
          </span>
        </div>
      )}
      
      {hasFadeOut && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          background: 'rgba(255, 140, 0, 0.1)',
          padding: '0.2rem 0.4rem',
          borderRadius: '4px'
        }}>
          <span>🔉 Fade Out:</span>
          <span style={{ color: '#ff8c00', fontWeight: 'bold' }}>
            {fadeoutDuration}s
          </span>
        </div>
      )}
    </div>
  );
};
// Enhanced fade information display component


// Enhanced segment display with advanced fade info

  // Function to save recent track

const saveRecentTrack = async (track, start, end) => {
  if (!userId) return;
  
  try {
    const res = await fetch(`${API_BASE_URL}/api/save-recent-track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        audioUrl: track.url || track.audio_url,
        duration: `${selectionDuration}s`,
        description,
        lyrics,
        youtubeUrls: youtubeUrls.filter(url => url.trim() !== ''),
        start: formatTime(start),
        end: formatTime(end),
        trackName: track.trackName || track.title || trackName || 'Unnamed Track', // 🚨 NEW: Include track name
        originalFileName: selectedFile?.name || 'unknown_video',
        generationType: 'full_generation' // Mark as full generation vs segment
      })
    });

    const data = await res.json();
    if (res.ok && data.recentTracks) {
      setRecentTracks(data.recentTracks);
      logToTerminal(`💾 "${track.trackName || trackName}" saved to recent tracks`, 'success');
    }
  } catch (err) {
    console.warn('Failed to save recent track:', err);
  }
};

  // Handler for saving a generated track to the user's library
  // REPLACE your existing handleSaveToLibrary function with this COMPLETE version:

const handleSaveToLibrary = async (track) => {
  if (!userId) {
    return showMessage('Please ensure a user ID is set to save tracks.', 'error');
  }

  try {
    console.log('💾 Saving track to library:', {
      trackName: track.trackName,
      title: track.title,
      audioUrl: track.audioUrl || track.url || track.audio_url,
      hasSegmentInfo: !!track.segmentIndex
    });

    // Get existing track name or generate a default one
    const existingTrackName = track.trackName || track.title || '';
    const currentTime = new Date().toLocaleString();
    const defaultTitle = existingTrackName || `Track ${currentTime}`;
    
    // Prompt user for track name/title
    const title = prompt("Enter a title for this track:", defaultTitle);
    if (!title || title.trim() === '') {
      showMessage('Track title is required', 'warning');
      return;
    }

    const sanitizedTitle = title.trim();

    // Prepare track data for backend
    const trackData = {
      userId,
      title: sanitizedTitle,
      trackName: sanitizedTitle, // 🚨 NEW: Send track name (same as title for consistency)
      audioUrl: track.audioUrl || track.url || track.audio_url,
      duration: track.duration || `${selectionDuration}s`,
      description: track.description || description || 'Generated music track',
      lyrics: track.lyrics || lyrics || '',
      youtubeUrls: track.youtubeUrls || youtubeUrls.filter(url => url.trim() !== '') || [],
      
      // 🚨 NEW: Enhanced segment information
      segmentInfo: {
        segmentIndex: track.segmentIndex || 0,
        originalStart: track.start || '0:00',
        originalEnd: track.end || '0:30',
        wasAdjusted: track.actualMusicTiming?.wasAdjusted || false,
        isTrimmedVideo: track.actualMusicTiming?.isTrimmedVideo || false,
        timingSource: track.actualMusicTiming?.timingSource || 'unknown'
      },
      
      // 🚨 NEW: Additional metadata
      generationType: track.generationType || 'segment',
      originalFileName: selectedFile?.name || track.originalFileName || 'unknown_video',
      
      // Include timing information if available
      actualMusicTiming: track.actualMusicTiming ? {
        start: track.actualMusicTiming.start,
        end: track.actualMusicTiming.end,
        duration: track.actualMusicTiming.duration,
        wasAdjusted: track.actualMusicTiming.wasAdjusted,
        isTrimmedVideo: track.actualMusicTiming.isTrimmedVideo,
        trackName: sanitizedTitle
      } : null,
      
      // Include current generation context
      generationContext: {
        videoFileName: selectedFile?.name || 'unknown',
        generatedAt: new Date().toISOString(),
        userDescription: description || '',
        userLyrics: lyrics || '',
        youtubeReferences: youtubeUrls.filter(url => url.trim() !== '').length,
        segmentDuration: selectionDuration || 30
      }
    };

    console.log('📤 Sending track data to backend:', {
      title: trackData.title,
      trackName: trackData.trackName,
      hasAudioUrl: !!trackData.audioUrl,
      segmentInfo: trackData.segmentInfo,
      generationType: trackData.generationType
    });

    showMessage(`Saving "${sanitizedTitle}" to library...`, 'info');

    // Send to backend
    const res = await fetch(`${API_BASE_URL}/api/save-track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trackData)
    });

    console.log('📡 Backend response status:', res.status);

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || `Server error: ${res.status}`);
    }

    const responseData = await res.json();
    
    console.log('✅ Track saved successfully:', {
      trackId: responseData.track?._id,
      trackName: responseData.track?.trackName,
      title: responseData.track?.title
    });

    // Show success message with track name
    showMessage(`"${sanitizedTitle}" saved to library successfully!`, 'success');

    // 🚨 NEW: Update recent tracks if available
    if (userId) {
      try {
        await fetchRecentTracks(userId);
        logToTerminal(`📚 Updated recent tracks after saving "${sanitizedTitle}"`, 'info');
      } catch (fetchError) {
        console.warn('Failed to refresh recent tracks:', fetchError);
      }
    }

    // 🚨 NEW: Log the save action
    logToTerminal(`💾 "${sanitizedTitle}" saved to library with full metadata`, 'success');
    logToTerminal(`📊 Track details: ${trackData.segmentInfo?.segmentIndex ? `Segment ${trackData.segmentInfo.segmentIndex}` : 'Full track'}, Duration: ${trackData.duration}`, 'info');

    return responseData;

  } catch (err) {
    console.error('❌ Error saving track to library:', err);
    
    // Detailed error logging
    if (err.message.includes('duplicate')) {
      showMessage('This track already exists in your library', 'warning');
      logToTerminal(`⚠️ Duplicate track not saved: ${track.trackName || 'Unknown'}`, 'warning');
    } else if (err.message.includes('network') || err.message.includes('fetch')) {
      showMessage('Network error while saving track. Please check your connection.', 'error');
      logToTerminal(`🌐 Network error saving track: ${err.message}`, 'error');
    } else if (err.message.includes('User not found')) {
      showMessage('User session expired. Please refresh the page.', 'error');
      logToTerminal(`👤 User authentication error: ${err.message}`, 'error');
    } else {
      showMessage(`Failed to save track: ${err.message}`, 'error');
      logToTerminal(`❌ Save error: ${err.message}`, 'error');
    }
    
    return null;
  }
};


  // Handler for downloading a specific segment of an audio track
 // UPDATE your handleDownloadInterval function in ClipTuneGenerator.js:

const handleDownloadInterval = async (track, index) => {
  // Handle different track structures
  const audioUrl = track.audioUrl || track.url || track.audio_url;
  
  if (!audioUrl) {
    showMessage('Audio URL not available for download.', 'error');
    return;
  }

  // Get track name for filename
  const trackName = track.trackName || track.title || `Track_${index + 1}`;
  const sanitizedTrackName = trackName.replace(/[^a-zA-Z0-9_-]/g, '_'); // Sanitize filename

  // Parse timestamps
  let start, end;
  
  if (typeof track.start === 'string' && track.start.includes(':')) {
    start = convertTimestampToSeconds(track.start);
    end = convertTimestampToSeconds(track.end);
  } else {
    start = parseInt(track.start) || 0;
    end = parseInt(track.end) || start + 30;
  }
  
  const duration = end - start;

  if (duration <= 0) {
    showMessage('Invalid segment duration.', 'error');
    return;
  }

  try {
    console.log('🎵 Download request with track name:', { trackName, audioUrl, start, end, duration });
    showMessage(`Preparing download for "${trackName}"...`, 'info');
    
    const res = await fetch(`${API_BASE_URL}/api/trim-audio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        audioUrl, 
        start, 
        duration,
        trackName: sanitizedTrackName // 🚨 NEW: Send track name to backend
      })
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Server error: ${res.status} - ${errorText}`);
    }
    
    const responseData = await res.json();
    
    if (!responseData.trimmedUrl) {
      throw new Error('No trimmed URL received from server');
    }

    const fileRes = await fetch(responseData.trimmedUrl);
    
    if (!fileRes.ok) {
      throw new Error(`Failed to download trimmed audio file: ${fileRes.status}`);
    }
    
    const blob = await fileRes.blob();
    
    if (blob.size === 0) {
      throw new Error('Downloaded file is empty');
    }
    
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    // 🚨 NEW: Use track name in filename
    link.download = `${sanitizedTrackName}_${formatTime(start)}-${formatTime(end)}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);

    showMessage(`"${trackName}" download completed!`, 'success');
    
  } catch (err) {
    console.error('Error downloading segment:', err);
    showMessage(err.message || 'Failed to download segment.', 'error');
  }
};

  
  // Handle downloading combined video with audio
// REPLACE your existing handleDownloadVideoWithMusic function with this UPDATED version
const handleDownloadVideoWithMusic = async (track) => {
  console.log('🎬 Starting video+music combination process');
  console.log('Track data:', track);
  console.log('Selected file:', selectedFile ? selectedFile.name : 'none');
  
  if (!selectedFile || !track) {
    console.error('Missing video or track data');
    showMessage('Video or audio track not available.', 'error');
    return;
  }
  
  const audioUrl = track.audioUrl || track.url || track.audio_url;
  console.log('Audio URL:', audioUrl);
  
  if (!audioUrl) {
    console.error('No audio URL available');
    showMessage('Audio URL not available.', 'error');
    return;
  }

  // 🚨 IMPORTANT: Don't set isGeneratingCombined when called from handleGenerate with renderMusicVideo=true
  // because we want to stay in the main processing state
  const shouldShowCombinedProcessing = !renderMusicVideo;
  if (shouldShowCombinedProcessing) {
    setIsGeneratingCombined(true);
  }
  
  setSelectedTrackForCombine(track);
  
  // Only show message if not in main processing mode
  if (shouldShowCombinedProcessing) {
    showMessage('Combining video and music...', 'info');
  }
  
  // Get the selected segment time range (where music will be placed)
  const [segmentStart, segmentEnd] = getTrimRange();
  const segmentDuration = segmentEnd - segmentStart;
  
  // Use the complete video duration instead of just the segment
  const fullVideoDuration = duration; // This is the complete video duration
  
  console.log('Video and timing details:', {
    segmentStart,
    segmentEnd,
    segmentDuration,
    fullVideoDuration,
    duration
  });
  
  // Parse audio timestamps
  let audioStart, audioEnd;
  if (typeof track.start === 'string' && track.start.includes(':')) {
    audioStart = convertTimestampToSeconds(track.start);
    audioEnd = convertTimestampToSeconds(track.end);
  } else {
    audioStart = parseInt(track.start) || 0;
    audioEnd = parseInt(track.end) || audioStart + 30;
  }
  
  const audioDuration = audioEnd - audioStart;
  
  // Validate all numeric values before sending
  if (isNaN(fullVideoDuration) || fullVideoDuration <= 0) {
    console.error('Invalid video duration:', fullVideoDuration);
    showMessage('Invalid video duration. Please try reloading the video.', 'error');
    return;
  }
  
  if (isNaN(segmentStart) || isNaN(segmentEnd) || segmentStart < 0 || segmentEnd > fullVideoDuration) {
    console.error('Invalid segment range:', { segmentStart, segmentEnd, fullVideoDuration });
    showMessage('Invalid time selection. Please select a valid range.', 'error');
    return;
  }
  
  if (isNaN(audioStart) || isNaN(audioDuration) || audioDuration <= 0) {
    console.error('Invalid audio timing:', { audioStart, audioDuration });
    showMessage('Invalid audio timing. Please try selecting a different track.', 'error');
    return;
  }
  
  try {
    // Only show combining message if not in main processing mode
    if (shouldShowCombinedProcessing) {
      showMessage('Combining video and music...', 'info');
    }
    
    // Create a FormData object to send the video and audio information
    const formData = new FormData();
    
    // Include the original video file
    if (track.videoUrl) {
      console.log('Using existing video URL:', track.videoUrl);
      formData.append('videoUrl', track.videoUrl);
    } else {
      console.log('Sending original complete video file');
      formData.append('video', selectedFile);
    }
    
    // Audio source and timing information
    formData.append('audioUrl', audioUrl);
    
    // Send complete video duration and segment placement info
    formData.append('videoDuration', fullVideoDuration.toString());
    formData.append('videoStart', segmentStart.toString());
    formData.append('musicDuration', Math.min(segmentDuration, audioDuration).toString());
    formData.append('audioStart', audioStart.toString());
    formData.append('audioDuration', audioDuration.toString());
    
    // Get music volume from localStorage or default to 0.7 (70%)
    let musicVolume = previewVolume || 0.7;
    try {
      const savedSettings = localStorage.getItem('musicSettings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        musicVolume = parsedSettings.musicVolume || previewVolume || 0.7;
      }
    } catch (e) {
      console.warn('Error reading music volume from settings:', e);
    }
    formData.append('musicVolume', musicVolume.toString());
    
    console.log('Sending data:', {
      videoDuration: fullVideoDuration,
      videoStart: segmentStart,
      musicDuration: Math.min(segmentDuration, audioDuration),
      audioStart,
      audioDuration,
      musicVolume,
      note: `Music should start at ${segmentStart}s and play for ${Math.min(segmentDuration, audioDuration)}s in the video`
    });
    
    const res = await fetch(`${API_BASE_URL}/api/combine-video-audio`, {
      method: 'POST',
      body: formData,
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error response:', errorText);
      throw new Error(`Server error: ${res.status}`);
    }
    
    const responseData = await res.json();
    
    if (!responseData.combinedUrl) {
      throw new Error('No combined video URL received from server');
    }
    
    console.log('Server response:', responseData);
    console.log('Combined video URL:', responseData.combinedUrl);
    
    // Validate the combined video URL
    if (!responseData.combinedUrl || !responseData.combinedUrl.startsWith('http')) {
      throw new Error('Invalid combined video URL received from server');
    }
    
    // Set the combined video URL and navigate to preview step
    setCombinedVideoUrl(responseData.combinedUrl);
    setHasBeenSaved(false); // Reset save state for new video
    setSelectedTrackForPreview(track);
    
    // 🚨 CRITICAL FIX: Always navigate to Step 5 when video is complete
    setCurrentStep(5); // Navigate to preview step
    
    // 🚨 IMPORTANT: If we were in main processing mode (renderMusicVideo=true), 
    // now set isProcessing=false since video is complete
    if (renderMusicVideo) {
      setIsProcessing(false);
      console.log('🎬 Video rendering complete - clearing main processing state');
    }
    
    // Show success message
    showMessage('Video with music generated! Adjust volume and preview below.', 'success');
    
    console.log('🎉 ===============================================');
    console.log('✅ COMBINED VIDEO WITH MUSIC READY FOR PREVIEW!');
    console.log('🎯 Preview URL:', responseData.combinedUrl);
    console.log('🎹 Full video duration:', formatTime(fullVideoDuration));
    console.log('🎵 Music overlay: starts at', formatTime(segmentStart), 'and plays for', formatTime(Math.min(segmentDuration, audioDuration)));
    console.log('🎶 Music volume:', Math.round(musicVolume * 100) + '%');
    console.log('===============================================');
    
  } catch (err) {
    console.error('Error creating video with music:', err);
    showMessage(err.message || 'Failed to create video with music.', 'error');
    
    // 🚨 IMPORTANT: If we were in main processing mode and video failed,
    // clear processing state and show error
    if (renderMusicVideo) {
      setIsProcessing(false);
      console.log('🎬 Video rendering failed - clearing main processing state');
    }
  } finally {
    // Only clear isGeneratingCombined if we set it
    if (shouldShowCombinedProcessing) {
      setIsGeneratingCombined(false);
    }
  }
};

  // Function to handle final download from preview page
  const handleFinalDownload = async () => {
    if (!combinedVideoUrl) {
      showMessage('No video available for download.', 'error');
      return;
    }

    try {
      setIsGeneratingPreview(true);
      showMessage('Preparing download...', 'info');

      // Create download with current volume settings
      const downloadFile = async (url, filename) => {
        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Accept': 'video/mp4,video/*,*/*'
            }
          });
          
          if (!response.ok) {
            throw new Error(`Download failed: ${response.status} ${response.statusText}`);
          }
          
          const blob = await response.blob();
          
          if (blob.size === 0) {
            throw new Error('Downloaded file is empty');
          }
          
          // Create and trigger download
          const blobUrl = window.URL.createObjectURL(blob);
          const downloadLink = document.createElement('a');
          downloadLink.href = blobUrl;
          downloadLink.download = filename;
          downloadLink.style.display = 'none';
          
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          
          // Clean up
          setTimeout(() => {
            window.URL.revokeObjectURL(blobUrl);
          }, 10000);
          
          showMessage('Download started! Check your downloads folder.', 'success');
          
        } catch (error) {
          console.error('Download error:', error);
          showMessage(`Download failed: ${error.message}`, 'error');
          // Fallback: open in new tab
          window.open(url, '_blank');
        }
      };

      const filename = `video_with_music_${Date.now()}.mp4`;
      await downloadFile(combinedVideoUrl, filename);
      
    } catch (err) {
      console.error('Error downloading video:', err);
      showMessage('Download failed. Please try again.', 'error');
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  // Function to regenerate video with new volume
  const handleVolumeChange = async (newVolume) => {
    if (!selectedTrackForPreview || !selectedFile) {
      showMessage('Cannot adjust volume - missing track or video data.', 'error');
      return;
    }

    setPreviewMusicVolume(newVolume);
    
    // Debounce the volume change to avoid too many requests
    if (window.volumeChangeTimeout) {
      clearTimeout(window.volumeChangeTimeout);
    }
    
    window.volumeChangeTimeout = setTimeout(async () => {
      try {
        setIsGeneratingPreview(true);
        showMessage('Updating music volume...', 'info');
        
        const track = selectedTrackForPreview;
        const audioUrl = track.audioUrl || track.url || track.audio_url;
        
        // Get the selected segment time range
        const [segmentStart, segmentEnd] = getTrimRange();
        const segmentDuration = segmentEnd - segmentStart;
        const fullVideoDuration = duration;
        
        // Parse audio timestamps
        let audioStart, audioEnd;
        if (typeof track.start === 'string' && track.start.includes(':')) {
          audioStart = convertTimestampToSeconds(track.start);
          audioEnd = convertTimestampToSeconds(track.end);
        } else {
          audioStart = parseInt(track.start) || 0;
          audioEnd = parseInt(track.end) || audioStart + 30;
        }
        
        const audioDuration = audioEnd - audioStart;
        
        // Create FormData for the new request
        const formData = new FormData();
        
        if (track.videoUrl) {
          formData.append('videoUrl', track.videoUrl);
        } else {
          formData.append('video', selectedFile);
        }
        
        formData.append('audioUrl', audioUrl);
        formData.append('videoDuration', fullVideoDuration.toString());
        formData.append('videoStart', segmentStart.toString());
        formData.append('musicDuration', Math.min(segmentDuration, audioDuration).toString());
        formData.append('audioStart', audioStart.toString());
        formData.append('audioDuration', audioDuration.toString());
        formData.append('musicVolume', newVolume.toString());
        
        const res = await fetch(`${API_BASE_URL}/api/combine-video-audio`, {
          method: 'POST',
          body: formData,
        });
        
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        
        const responseData = await res.json();
        
        if (!responseData.combinedUrl) {
          throw new Error('No combined video URL received from server');
        }
        
        // Update the combined video URL
        setCombinedVideoUrl(responseData.combinedUrl);
        showMessage(`Volume updated to ${Math.round(newVolume * 100)}%`, 'success');
        
      } catch (err) {
        console.error('Error updating volume:', err);
        showMessage('Failed to update volume. Please try again.', 'error');
      } finally {
        setIsGeneratingPreview(false);
      }
    }, 1000); // 1 second debounce
  };

  // Reset to start
  const handleStartOver = () => {
    setCurrentStep(1);
    setSelectedFile(null);
    setVideoUrl('');
    setThumbnails([]);
    setTracks([]);
    setYoutubeUrls(['', '', '', '', '']);
    setLyrics('');
    setDescription('');
    setInstrumental(true);
    setRenderMusicVideo(false);
    setMessage({ text: '', type: '' });
    setShowConfigModal(false);
    setShowVideoEditModal(false);
    setIsLoadingVideoData(false);
    // Clear preview states
    setCombinedVideoUrl('');
    setSelectedTrackForPreview(null);
    setIsGeneratingPreview(false);
    setPreviewMusicVolume(0.8);
  };

  // Handle sidebar mouse events


  const Button = ({ variant = 'primary', children, onClick, disabled, style = {} }) => {
    const baseStyle = STYLES.button[variant];
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        style={{
          ...baseStyle,
          ...style,
          opacity: disabled ? 0.7 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = baseStyle.boxShadow.replace('0.4)', '0.6)');
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled) {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = baseStyle.boxShadow;
          }
        }}
      >
        {children}
      </button>
    );
  };
  
  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        minHeight: '100vh',
        width: '100vw',
        margin: 0,
        padding: 0,
        position: 'relative'
      }}
    >
      <style>{`
        html, body, #root, .artifact-container {
          margin: 0 !important;
          padding: 0 !important;
          height: 100% !important;
          overflow-x: hidden !important;
        }
        
        * {
          margin: 0 !important;
          padding: 0 !important;
          box-sizing: border-box !important;
        }
        
        body {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%) !important;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
          @keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
      `}</style>

      {/* Bottom Music Player Bar (When Playing) */}
      {currentlyPlaying && (
        <div 
          style={{
            position: 'fixed',
            bottom: playerVisible ? '20px' : '-80px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: '1000px',
            height: '70px',
            background: 'rgba(30, 41, 59, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            zIndex: 1001,
            display: 'flex',
            alignItems: 'center',
          
            padding: '0 1.5rem',
            gap: '1rem',
            transition: 'bottom 0.3s ease-in-out',
            cursor: 'pointer'
          }}
          onMouseEnter={() => {
            setPlayerHovered(true);
            setPlayerVisible(true);
            setMouseY(0); // Reset mouse tracking
          }}
          onMouseLeave={() => {
            if (playerJustOpened) {
              // Don't hide player immediately after opening from recent track
              return;
            }
            setPlayerHovered(false);
            setMouseY(0);
          }}
        >
          {/* Track Thumbnail */}
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '6px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            color: 'white',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            flexShrink: 0
          }}>
            🎵
          </div>

          {/* Track Info */}
          <div style={{
            flex: '0 0 180px',
            color: 'white'
          }}>
            <div style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              marginBottom: '0.2rem',
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
            }}>
              {currentlyPlaying.track.title || `Track ${currentlyPlaying.index + 1}`}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: 'rgba(255, 255, 255, 0.7)',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
            }}>
              {currentlyPlaying.track.start && currentlyPlaying.track.end 
                ? `Segment: ${currentlyPlaying.track.start} → ${currentlyPlaying.track.end}`
                : 'Full Track'
              }
            </div>
          </div>

          {/* Control Buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            flex: '0 0 auto'
          }}>
            <button
              onClick={() => {
                const audio = audioRefs.current[currentlyPlaying.index]?.current;
                if (audio) {
                  const newTime = Math.max(0, audio.currentTime - 10);
                  audio.currentTime = newTime;
                  setCurrentTime(newTime);
                }
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                fontSize: '0.8rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
            >
              ⏪
            </button>

            <button
              onClick={() => {
                const audio = audioRefs.current[currentlyPlaying.index]?.current;
                if (audio) {
                  if (isPlaying) {
                    audio.pause();
                  } else {
                    audio.play();
                  }
                  setIsPlaying(!isPlaying);
                }
              }}
              style={{
                background: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#1e293b',
                fontSize: '1rem',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>

            <button
              onClick={() => {
                const audio = audioRefs.current[currentlyPlaying.index]?.current;
                if (audio) {
                  const newTime = Math.min(trackDuration, audio.currentTime + 10);
                  audio.currentTime = newTime;
                  setCurrentTime(newTime);
                }
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                fontSize: '0.8rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
            >
              ⏩
            </button>
          </div>

          {/* Progress Bar */}
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '0.75rem'
          }}>
            <span style={{ minWidth: '35px', fontSize: '0.7rem' }}>
              {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}
            </span>
            <div style={{
              flex: 1,
              height: '4px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '2px',
              overflow: 'hidden',
              cursor: 'pointer',
              position: 'relative'
            }}
            onClick={(e) => {
              const audio = audioRefs.current[currentlyPlaying.index]?.current;
              if (audio && trackDuration > 0) {
                const rect = e.currentTarget.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                const newTime = percent * trackDuration;
                
                // Allow seeking anywhere in the full song
                audio.currentTime = newTime;
                setCurrentTime(newTime);
              }
            }}>
              {/* Segment indicator for recent tracks */}
              {currentlyPlaying && currentlyPlaying.track.start && currentlyPlaying.track.end && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: `${trackDuration > 0 ? (() => {
                    const parseTime = (timeStr) => {
                      const parts = timeStr.split(':');
                      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
                    };
                    return (parseTime(currentlyPlaying.track.start) / trackDuration) * 100;
                  })() : 0}%`,
                  width: `${trackDuration > 0 ? (() => {
                    const parseTime = (timeStr) => {
                      const parts = timeStr.split(':');
                      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
                    };
                    const segmentStart = parseTime(currentlyPlaying.track.start);
                    const segmentEnd = parseTime(currentlyPlaying.track.end);
                    return ((segmentEnd - segmentStart) / trackDuration) * 100;
                  })() : 0}%`,
                  height: '100%',
                  background: 'rgba(102, 126, 234, 0.4)',
                  borderRadius: '2px'
                }} />
              )}
              
              {/* Current progress */}
              <div style={{
                height: '100%',
                width: `${trackDuration > 0 ? (currentTime / trackDuration) * 100 : 0}%`,
                background: 'white',
                borderRadius: '2px',
                transition: 'width 0.1s ease',
                position: 'relative',
                zIndex: 1
              }} />
            </div>
            <span style={{ minWidth: '35px', fontSize: '0.7rem' }}>
              {Math.floor(trackDuration / 60)}:{String(Math.floor(trackDuration % 60)).padStart(2, '0')}
            </span>
          </div>

          {/* Additional Controls */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flex: '0 0 auto',
            position: 'relative'
          }}>
            <div 
              style={{
                position: 'relative',
                zIndex: 1003
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setBottomPlayerMenu(!bottomPlayerMenu);
                }}
                data-bottom-menu
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.4rem',
                  cursor: 'pointer',
                  color: 'white',
                  fontSize: '0.8rem',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  position: 'relative',
                  zIndex: 2
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                  // Find the shadow preview and make it visible
                  const parent = e.currentTarget.parentElement;
                  const shadowPreview = parent.querySelector('.button-shadow-preview');
                  if (shadowPreview) {
                    shadowPreview.style.opacity = '1';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  // Hide the shadow preview
                  const parent = e.currentTarget.parentElement;
                  const shadowPreview = parent.querySelector('.button-shadow-preview');
                  if (shadowPreview) {
                    shadowPreview.style.opacity = '0';
                  }
                }}
              >
                •••
              </button>
              
              {/* Button Shadow Preview (shows on hover) */}
              <div 
                style={{
                  position: 'absolute',
                  bottom: '100%',
                  right: 0,
                  marginBottom: '0.5rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  boxShadow: '0 5px 20px rgba(0, 0, 0, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  minWidth: '180px',
                  overflow: 'hidden',
                  opacity: bottomPlayerMenu ? 0 : 0,
                  pointerEvents: 'none',
                  transition: 'opacity 0.2s ease',
                  zIndex: 1
                }}
                className="button-shadow-preview"
              >
                <div style={{
                  width: '100%',
                  padding: '0.75rem 1.25rem',
                  textAlign: 'left',
                  fontSize: '0.85rem',
                  color: 'rgba(255, 255, 255, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <span style={{ fontSize: '1rem', opacity: 0.6 }}>⬇️</span>
                  Download Segment
                </div>
                <div style={{
                  width: '100%',
                  padding: '0.75rem 1.25rem',
                  textAlign: 'left',
                  fontSize: '0.85rem',
                  color: 'rgba(255, 255, 255, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <span style={{ fontSize: '1rem', opacity: 0.6 }}>💾</span>
                  Save to Library
                </div>
              </div>
            </div>
            
            {/* Dropdown Menu (clickable) */}
            {bottomPlayerMenu && (
              <div 
                data-bottom-menu
                style={{
                  position: 'absolute',
                  bottom: '100%',
                  right: 0,
                  marginBottom: '0.5rem',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  zIndex: 1003,
                  minWidth: '180px',
                  overflow: 'hidden',
                  animation: 'fadeIn 0.2s ease-out'
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadInterval(currentlyPlaying.track, currentlyPlaying.index);
                    setBottomPlayerMenu(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '1rem 1.25rem',
                    border: 'none',
                    background: 'white',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: '#2d3748',
                    transition: 'background-color 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f7fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  <span style={{ fontSize: '1rem' }}>⬇️</span>
                  Download Segment
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveToLibrary(currentlyPlaying.track);
                    setBottomPlayerMenu(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '1rem 1.25rem',
                    border: 'none',
                    background: 'white',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    color: '#2d3748',
                    transition: 'background-color 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f7fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  <span style={{ fontSize: '1rem' }}>💾</span>
                  Save to Library
                </button>
              </div>
            )}

            <button
              onClick={() => {
                setCurrentlyPlaying(null);
                setIsPlaying(false);
                setBottomPlayerMenu(false);
                setPlayerClosedManually(true);
                setPlayerJustOpened(false);
                const audio = audioRefs.current[currentlyPlaying.index]?.current;
                if (audio) {
                  audio.pause();
                }
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                borderRadius: '6px',
                padding: '0.4rem',
                cursor: 'pointer',
                color: 'white',
                fontSize: '0.8rem',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '28px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
            >
              ×
            </button>
          </div>
        </div>
      )}
    
      {/* Bottom-right floating box for the first page */}
{/* Bottom-right floating box for combined videos */}
{/* Bottom-right floating box for combined videos */}
{/* Bottom-right floating box for combined videos */}
{/* Bottom-right floating box for combined videos */}
{/* Bottom-right floating box - SIMPLE VERSION */}
{/* Top-right menu button and dropdown */}
      {/* Top-right menu button and dropdown */}
     {/* Top-right circle button */}
      {/* Top-right circle button */}
     {/* Top-right circle button with dropdown */}
     {/* Top-right circle button with hover preview and animated dropdown */}
    {/* Top-right circle button with hover preview and animated dropdown */}
      {(currentStep === 1 || currentStep === 5) && (
        <div 
          data-dropdown-container
          style={{
            position: 'fixed',
            top: '2rem',
            right: '2rem',
            zIndex: 1000
          }}>
          <button
            onClick={() => setShowDropdownMenu(!showDropdownMenu)}
            onMouseEnter={(e) => {
              // Show preview on hover
              const preview = document.getElementById('dropdown-preview');
              if (preview) preview.style.opacity = '1';
              
              // Scale button
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.6)';
            }}
            onMouseLeave={(e) => {
              // Hide preview when not hovering
              const preview = document.getElementById('dropdown-preview');
              if (preview) preview.style.opacity = '0';
              
              // Reset button scale
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
            }}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.3s ease',
              color: 'white',
              fontSize: '1.8rem',
              fontWeight: 'bold',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            }}
          >
            {user?.email ? getFirstLetter(user.email) : 'U'}
          </button>

          {/* Hover Preview Shadow */}
          <div 
            id="dropdown-preview"
            style={{
              position: 'absolute',
              top: '70px',
              right: '0',
              width: '320px',
              background: 'rgba(30, 41, 59, 0.3)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
              opacity: '0',
              pointerEvents: 'none',
              transition: 'opacity 0.3s ease',
              color: 'rgba(255, 255, 255, 0.7)',
              zIndex: 998
            }}>
            <div style={{
              fontSize: '1rem',
              fontWeight: 600,
              marginBottom: '0.5rem',
              textAlign: 'center'
            }}>
              🎵 Recent Tracks Preview
            </div>
            <div style={{
              fontSize: '0.8rem',
              textAlign: 'center',
              opacity: 0.8
            }}>
              Click to view your music library
            </div>
          </div>

          {/* Actual Dropdown with Animation */}


{/* Actual Dropdown with Animation */}
{/* 🚨 STEP 4: Updated dropdown visibility condition */}
{(showDropdownMenu || forceShowDropdown) && (
  <div style={{
    position: 'absolute',
    top: '70px',
    right: '0',
    width: '380px', // Increased width
    minHeight: '400px', // Added minimum height
    maxHeight: '80vh', // Limit max height
    background: 'rgba(30, 41, 59, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    padding: '0',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    overflowY: 'auto', // Enable scrolling
    color: 'white',
    animation: 'dropdownSlideIn 0.3s ease-out',
    transformOrigin: 'top right',
    zIndex: 999
  }}>
    <style>{`
      @keyframes dropdownSlideIn {
        0% {
          opacity: 0;
          transform: translateY(-10px) scale(0.95);
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
    `}</style>
    
    {/* User Info Header */}
    <div style={{
      background: 'rgba(102, 126, 234, 0.1)',
      padding: '1.5rem',
      borderRadius: '16px 16px 0 0',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      textAlign: 'center'
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: 'white',
        margin: '0 auto 1rem',
        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
      }}>
        {user?.email ? getFirstLetter(user.email) : 'U'}
      </div>
      <div style={{
        fontSize: '0.9rem',
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: '0.2rem'
      }}>
        You are logged in as
      </div>
      <div style={{
        fontSize: '1rem',
        fontWeight: 600,
        color: 'white',
        wordBreak: 'break-word'
      }}>
        {user?.email || 'Guest User'}
      </div>
    </div>

    {/* 🚨 STEP 4: Generation Status Indicator */}
    {generatingTracks.length > 0 && (
      <div style={{
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        padding: '1rem 1.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        color: 'white'
      }}>
 <div style={{
  width: '0.1px',        // ← Reduced from 4px to 2px
  height: '0.1px',       // ← Reduced from 4px to 2px
  borderRadius: '50%',
  background: '#60a5fa',
  animation: 'pulse 1.5s ease-in-out infinite'
}} />
        <div>
          <div style={{ 
            fontSize: '0.9rem', 
            fontWeight: 600,
            marginBottom: '0.2rem'
          }}>
            🎵 Music Generation Active
          </div>
          <div style={{ 
            fontSize: '0.75rem', 
            opacity: 0.9 
          }}>
            {generatingTracks.filter(t => t.status === 'generating').length} track(s) in progress
          </div>
        </div>
      </div>
    )}

    {/* Menu Content */}
    <div style={{ padding: '1.5rem' }}>
      {/* Library Button */}
      <button
        onClick={() => {
          navigate('/library'); // Navigate to library page
          setShowDropdownMenu(false);
        }}
        style={{
          width: '100%',
          padding: '1rem',
          background: 'rgba(56, 161, 105, 0.1)',
          border: '1px solid rgba(56, 161, 105, 0.3)',
          borderRadius: '12px',
          color: 'white',
          fontSize: '1rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          marginBottom: '1rem'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(56, 161, 105, 0.2)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(56, 161, 105, 0.1)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        📚 Library
      </button>

      {/* Settings Button */}
      <button
        onClick={() => {
          navigate('/settings');
          setShowDropdownMenu(false);
        }}
        style={{
          width: '100%',
          padding: '1rem',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '12px',
          color: 'white',
          fontSize: '1rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          marginBottom: '1.5rem'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        ⚙️ Settings
      </button>

      {/* Recent Tracks/Videos Section Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1rem',
        padding: '0.5rem 0'
      }}>
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: 700,
          color: 'white',
          margin: 0
        }}>
          {showRecentTracks ? '🎵 Recent Tracks' : '🎬 Saved Videos'}
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowRecentTracks(!showRecentTracks);
          }}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: '8px',
            padding: '0.5rem',
            cursor: 'pointer',
            color: 'white',
            fontSize: '1rem',
            transition: 'background 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
        >
          🔄
        </button>
      </div>

      {/* 🚨 STEP 3: Enhanced Content Area with generating tracks */}
      <div style={{
        maxHeight: '300px',
        overflowY: 'auto',
        paddingRight: '0.5rem'
      }}>
      
{generatingTracks.length > 0 && generatingTracks.map((track) => (
  <div
    key={track.id}
    style={{
      marginBottom: '1rem',
      padding: '1rem',
      background: track.status === 'error' 
        ? 'rgba(239, 68, 68, 0.1)' 
        : track.status === 'completed'
        ? 'rgba(34, 197, 94, 0.1)'
        : 'rgba(59, 130, 246, 0.1)',
      borderRadius: '12px',
      border: track.status === 'error' 
        ? '1px solid rgba(239, 68, 68, 0.3)' 
        : track.status === 'completed'
        ? '1px solid rgba(34, 197, 94, 0.3)'
        : '1px solid rgba(59, 130, 246, 0.3)',
      transition: 'all 0.2s ease',
      animation: 'fadeIn 0.3s ease-out'
    }}
  >
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: track.status === 'generating' ? '0.5rem' : '0'
    }}>
      {/* 🔄 UPDATED: Square Progress Indicator */}
      <div style={{
        width: '50px',
        height: '50px',
        borderRadius: '8px', // Changed from '50%' to '8px' for square shape
        background: track.status === 'error'
          ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
          : track.status === 'completed'
          ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
          : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.8rem',
        color: 'white',
        fontWeight: 'bold',
        flexShrink: 0,
        position: 'relative',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden' // Important for the progress overlay
      }}>
        {track.status === 'error' ? (
          <span style={{ fontSize: '1.2rem' }}>❌</span>
        ) : track.status === 'completed' ? (
          <span style={{ fontSize: '1.2rem' }}>✅</span>
        ) : (
          <>
            {/* 🔄 UPDATED: Square Progress Background */}
            <div style={{
              position: 'absolute',
              inset: '0',
              background: 'rgba(255, 255, 255, 0.1)',
              zIndex: 1
            }} />
            
            {/* 🔄 UPDATED: Square Progress Fill */}
            <div style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              right: '0',
              height: `${track.progress}%`,
              background: 'rgba(255, 255, 255, 0.3)',
              transition: 'height 0.3s ease',
              zIndex: 2,
              borderRadius: '0 0 6px 6px' // Slightly rounded bottom corners
            }} />
            
            {/* 🔄 UPDATED: Percentage Text */}
            <span style={{ 
              position: 'relative', 
              zIndex: 3,
              fontSize: '0.75rem',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
              fontWeight: 'bold',
              lineHeight: '1'
            }}>
              {Math.round(track.progress)}%
            </span>
          </>
        )}
      </div>
      
      {/* Track info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ 
          color: 'white', 
          fontWeight: 600, 
          fontSize: '0.9rem', 
          marginBottom: '0.2rem',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {track.trackName}
        </div>
        <div style={{ 
          color: track.status === 'error' 
            ? '#f87171' 
            : track.status === 'completed'
            ? '#4ade80'
            : '#60a5fa', 
          fontSize: '0.8rem',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          {track.status === 'error' ? (
            <>
              <span>❌</span>
              <span>Error: {track.error}</span>
            </>
          ) : track.status === 'completed' ? (
            <>
              <span>✅</span>
              <span>Generated {track.completedTracks?.length || 1} track(s)</span>
            </>
          ) : (
            <>
              <span>🎵</span>
              <span>Generating... {Math.round(track.progress)}%</span>
            </>
          )}
        </div>
      </div>
      
      {/* Time indicator */}
      <div style={{
        fontSize: '0.7rem',
        color: 'rgba(255, 255, 255, 0.6)',
        textAlign: 'right'
      }}>
        {track.status === 'generating' ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            {/* 🔄 UPDATED: Square Pulse Indicator */}
            <div style={{
              width: '6px',
              height: '6px',
              borderRadius: '1px', // Slightly rounded square
              background: '#60a5fa',
              animation: 'pulse 1.5s ease-in-out infinite'
            }} />
          </div>
        ) : (
          new Date(track.startTime).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        )}
      </div>
    </div>
    
    {/* 🔄 UPDATED: Square Progress Bar for generating tracks */}
    {track.status === 'generating' && (
      <div style={{
        width: '100%',
        height: '6px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '3px',
        overflow: 'hidden',
        marginTop: '0.5rem'
      }}>
        <div style={{
          height: '100%',
          width: `${track.progress}%`,
          background: 'linear-gradient(90deg, #3b82f6, #60a5fa, #93c5fd)',
          borderRadius: '3px',
          transition: 'width 0.8s ease',
          boxShadow: '0 0 10px rgba(96, 165, 250, 0.5)'
        }} />
      </div>
    )}
    
    {/* Success message for completed tracks */}
    {track.status === 'completed' && (
      <div style={{
        marginTop: '0.5rem',
        padding: '0.5rem',
        background: 'rgba(34, 197, 94, 0.1)',
        borderRadius: '6px',
        fontSize: '0.75rem',
        color: '#4ade80',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem'
      }}>
        <span>🎉</span>
        <span>Generated successfully! Available in recent tracks.</span>
      </div>
    )}
  </div>
))}

        {/* 🚨 STEP 3: Separator between generating and completed tracks */}
        {generatingTracks.length > 0 && (showRecentTracks ? recentTracks.length > 0 : recentCombined.length > 0) && (
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            marginBottom: '1rem',
            paddingTop: '1rem'
          }}>
            <div style={{
              fontSize: '0.8rem',
              color: 'rgba(255, 255, 255, 0.6)',
              textAlign: 'center',
              marginBottom: '1rem',
              fontWeight: 500
            }}>
              Previously Generated
            </div>
          </div>
        )}

        {/* 🚨 STEP 3: Regular recent tracks/videos */}
        {showRecentTracks ? (
          recentTracks.length === 0 && generatingTracks.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '2rem 1rem',
              color: 'rgba(255, 255, 255, 0.6)',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              border: '1px dashed rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🎵</div>
              <p style={{ fontSize: '0.9rem', margin: 0, lineHeight: 1.4 }}>
                No music generated yet.<br />
                Upload a video to get started!
              </p>
            </div>
          ) : (
            recentTracks.map((track, i) => (
              <div
                key={track._id || i}
                style={{
                  marginBottom: '1rem',
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}
                onClick={() => {
                  const audioUrl = track.audioUrl || track.url || track.audio_url;
                  if (!audioUrl) {
                    showMessage('Audio not available for this track', 'error');
                    return;
                  }

                  if (currentlyPlaying) {
                    const currentAudio = audioRefs.current[currentlyPlaying.index]?.current;
                    if (currentAudio) {
                      currentAudio.pause();
                    }
                  }

                  setCurrentlyPlaying({ track, index: 0 });
                  setIsPlaying(true);
                  setPlayerClosedManually(false);
                  setPlayerVisible(true);
                  
                  setPlayerJustOpened(true);
                  setTimeout(() => {
                    setPlayerJustOpened(false);
                  }, 2000);

                  const parseTime = (timeStr) => {
                    const parts = timeStr.split(':');
                    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
                  };
                  
                  const segmentStart = parseTime(track.start);

                  const audio = new Audio(audioUrl);
                  
                  audio.addEventListener('loadedmetadata', () => {
                    setTrackDuration(audio.duration);
                    audio.currentTime = segmentStart;
                  });
                  
                  audio.addEventListener('timeupdate', () => {
                    setCurrentTime(audio.currentTime);
                  });
                  
                  audio.addEventListener('ended', () => {
                    setIsPlaying(false);
                    setCurrentlyPlaying(null);
                  });

                  if (!audioRefs.current[0]) {
                    audioRefs.current[0] = { current: null };
                  }
                  audioRefs.current[0].current = audio;
                  
                  audio.play().catch(err => {
                    console.error('Error playing audio:', err);
                    showMessage('Error playing audio', 'error');
                    setIsPlaying(false);
                  });

                  setShowDropdownMenu(false);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  color: 'white',
                  flexShrink: 0
                }}>
                  🎵
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ 
                    color: 'white', 
                    fontWeight: 600, 
                    fontSize: '0.9rem', 
                    marginBottom: '0.2rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {track.title || `Track ${i + 1}`}
                  </div>
                  <div style={{ 
                    color: '#667eea', 
                    fontSize: '0.8rem', 
                    marginBottom: '0.1rem' 
                  }}>
                    {track.start} → {track.end}
                  </div>
                  <div style={{ 
                    color: 'rgba(255, 255, 255, 0.6)', 
                    fontSize: '0.75rem' 
                  }}>
                    {track.duration}
                  </div>
                </div>
              </div>
            ))
          )
        ) : (
          recentCombined.length > 0 ? (
            recentCombined.map((video, i) => (
              <div key={video._id || i} style={{
                marginBottom: '1rem',
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(72, 187, 120, 0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    color: 'white',
                    flexShrink: 0
                  }}>
                    🎬
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ 
                      color: 'white', 
                      fontWeight: 600, 
                      fontSize: '0.9rem', 
                      marginBottom: '0.2rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {video.title}
                    </div>
                    <div style={{ 
                      color: '#48bb78', 
                      fontSize: '0.75rem' 
                    }}>
                      {new Date(video.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <a
                  href={video.combinedVideoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    width: '100%',
                    padding: '0.75rem',
                    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textAlign: 'center',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  View Video
                </a>
              </div>
            ))
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '2rem 1rem',
              color: 'rgba(255, 255, 255, 0.6)',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              border: '1px dashed rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🎬</div>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>
                No saved videos yet.
              </p>
            </div>
          )
        )}
      </div>

      {/* Logout Button - Fixed at bottom */}
      <div style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
        paddingTop: '1.5rem',
        marginTop: '1.5rem'
      }}>
        <button
          onClick={() => {
            // Clear user data
            localStorage.removeItem('userId');
            localStorage.removeItem('userEmail');
            
            // Navigate to home/login
            navigate('/');
            setShowDropdownMenu(false);
            
            // Show message
            showMessage("Successfully logged out", "success");
          }}
          style={{
            width: '100%',
            padding: '1rem',
            background: 'rgba(229, 62, 62, 0.1)',
            border: '1px solid rgba(229, 62, 62, 0.3)',
            borderRadius: '12px',
            color: '#ff6b6b',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(229, 62, 62, 0.2)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(229, 62, 62, 0.1)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          🚪 Logout
        </button>
      </div>

      {/* 🚨 STEP 3 & 4: Combined CSS animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  </div>
)}
        </div>
      )}
      {/* Main Container */}
    <div style={{
  ...STYLES.container.main,
  animation: 'fadeIn 0.6s ease-out',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '2rem',
  minHeight: '100vh',
  display: 'flex'
}}>
{currentStep === 1 && !showVideoEditModal && !showConfigModal && (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    textAlign: 'center',
    padding: '2rem',
    width: '100%',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    marginLeft: 0
  }}>
{isCompleteVideoProcessing && (
  <div style={{
    position: 'fixed',
    bottom: '-1rem',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1002,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    {/* Compact Animated Progress Circle */}
    <div style={{
      position: 'relative',
      width: '60px',
      height: '60px',
      transform: 'rotate(-90deg)',
      marginBottom: '0.75rem'
    }}>
      {/* Background Circle */}
      <svg width="60" height="60" style={{ position: 'absolute' }}>
        <circle
          cx="30"
          cy="30"
          r="25"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="4"
          fill="transparent"
        />
      </svg>
      
      {/* Progress Circle */}
      <svg width="60" height="60" style={{ position: 'absolute' }}>
        <circle
          cx="30"
          cy="30"
          r="25"
          stroke="url(#compactProgressGradient)"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={`${2 * Math.PI * 25}`}
          strokeDashoffset={`${2 * Math.PI * 25 * (1 - completeVideoProgress / 100)}`}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.5s ease',
            filter: 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.6))'
          }}
        />
        <defs>
          <linearGradient id="compactProgressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Percentage Text */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) rotate(90deg)',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        color: 'white',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
      }}>
        {Math.round(completeVideoProgress)}%
      </div>
    </div>

    {/* Status Text Below Circle */}
    <div style={{
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: '0.9rem',
      fontWeight: 500,
      textAlign: 'center',
      textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)',
      background: 'rgba(30, 41, 59, 0.8)',
      backdropFilter: 'blur(10px)',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      whiteSpace: 'nowrap'
    }}>
      🎵 Segments are being generated...
    </div>
  </div>
)}
    {/* ClipTune Title */}
    <div style={{ marginBottom: '3rem' }}>
      <h1 style={{
        ...STYLES.modal.title,
        color: 'white',
        fontSize: '3.5rem',
        textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        marginBottom: '1rem'
      }}>
        <span style={{ fontSize: '4rem', marginRight: '1rem' }}>🎵</span>
        ClipTune
      </h1>
      <p style={{
        ...STYLES.modal.subtitle,
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: '1.3rem',
        fontWeight: 300,
        textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
      }}>
        Transform your videos into stunning AI-generated music
      </p>
    </div>

    {/* Processing State - Only show when renderMusicVideo is true */}
    {isProcessing && renderMusicVideo && (
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '3rem 2rem',
        marginBottom: '3rem',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 40px rgba(0, 0, 0, 0.2)',
        maxWidth: '500px',
        width: '100%'
      }}>
        <div style={{
          border: '4px solid rgba(255, 255, 255, 0.3)',
          borderTop: '4px solid white',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 2rem'
        }} />
        <h3 style={{
          color: 'white',
          fontSize: '1.5rem',
          fontWeight: 600,
          marginBottom: '1rem',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
        }}>
          🎵 Generating Your Music...
        </h3>
        <p style={{ 
          color: 'rgba(255, 255, 255, 0.8)', 
          fontSize: '1.1rem',
          textShadow: '0 1px 5px rgba(0, 0, 0, 0.2)'
        }}>
          Please wait while our AI creates your custom soundtrack
        </p>
      </div>
    )}

    {/* Main Content - Chat Interface and Controls */}
{!(isProcessing && renderMusicVideo) && (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2rem',
    width: '100%',
    maxWidth: '800px'
  }}>
    
    {/* Add Enhanced CSS Animations */}
    <style>{`
      @keyframes sendPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.08); }
        100% { transform: scale(1); }
      }
      
      @keyframes uploadBounce {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-4px) scale(1.05); }
      }
      
      @keyframes scissorSnip {
        0% { transform: rotate(0deg) scale(1); }
        25% { transform: rotate(-8deg) scale(1.15); }
        50% { transform: rotate(8deg) scale(1.15); }
        75% { transform: rotate(-4deg) scale(1.08); }
        100% { transform: rotate(0deg) scale(1); }
      }
      
      @keyframes modeToggleFlip {
        0% { transform: rotateY(0deg) scale(1); }
        50% { transform: rotateY(180deg) scale(1.05); }
        100% { transform: rotateY(360deg) scale(1); }
      }
      
      @keyframes buttonGlow {
        0% { box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); }
        50% { box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6), 0 0 30px rgba(102, 126, 234, 0.4); }
        100% { box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); }
      }
      
      @keyframes successGlow {
        0% { box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); }
        50% { box-shadow: 0 6px 25px rgba(16, 185, 129, 0.6), 0 0 30px rgba(16, 185, 129, 0.4); }
        100% { box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); }
      }
      
      @keyframes warningGlow {
        0% { box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3); }
        50% { box-shadow: 0 6px 25px rgba(245, 158, 11, 0.6), 0 0 30px rgba(245, 158, 11, 0.4); }
        100% { box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3); }
      }
      
      @keyframes ripple {
        0% {
          transform: scale(0);
          opacity: 1;
        }
        100% {
          transform: scale(4);
          opacity: 0;
        }
      }
      
      @keyframes loadingPulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
      }
      
      .chat-button {
        position: relative;
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .chat-button::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: translate(-50%, -50%);
        transition: width 0.6s, height 0.6s;
      }
      
      .chat-button:active::before {
        width: 300px;
        height: 300px;
      }
      
      .mode-toggle-button {
        animation: buttonGlow 3s ease-in-out infinite;
      }
      
      .mode-toggle-button:hover {
        animation: modeToggleFlip 0.8s ease-in-out;
      }
      
      .send-button-ready {
        animation: buttonGlow 2s ease-in-out infinite;
      }
      
      .send-button-ready:hover {
        animation: sendPulse 0.6s ease-in-out;
      }
      
      .upload-button {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .upload-button:hover {
        animation: uploadBounce 0.6s ease-in-out;
      }
      
      .upload-button-success {
        animation: successGlow 2s ease-in-out infinite;
      }
      
      .scissor-button:hover {
        animation: scissorSnip 0.8s ease-in-out;
      }
      
      .scissor-button-active {
        animation: warningGlow 2s ease-in-out infinite;
      }
      
      .loading-spinner {
        animation: spin 1s linear infinite;
      }
      
      .pulse-ready {
        animation: loadingPulse 1.5s ease-in-out infinite;
      }
      
      .button-disabled {
        opacity: 0.5;
        cursor: not-allowed;
        animation: none !important;
      }
    `}</style>
    
    {/* 🚨 Enhanced Mode Toggle Button */}
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '2rem',
      width: '100%',
      maxWidth: '600px'
    }}>
      <button
        className={`chat-button mode-toggle-button`}
        onClick={() => setIsCompleteVideoMode(!isCompleteVideoMode)}
        style={{
          background: isCompleteVideoMode 
            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
            : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          color: 'white',
          border: 'none',
          padding: '0.75rem 2rem',
          borderRadius: '25px',
          fontSize: '0.9rem',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: isCompleteVideoMode
            ? '0 4px 15px rgba(16, 185, 129, 0.3)'
            : '0 4px 15px rgba(59, 130, 246, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
          e.currentTarget.style.boxShadow = isCompleteVideoMode
            ? '0 8px 25px rgba(16, 185, 129, 0.5)'
            : '0 8px 25px rgba(59, 130, 246, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = isCompleteVideoMode
            ? '0 4px 15px rgba(16, 185, 129, 0.3)'
            : '0 4px 15px rgba(59, 130, 246, 0.3)';
        }}
      >
        <span style={{ 
          fontSize: '1rem',
          transition: 'transform 0.3s ease',
          display: 'inline-block'
        }}>
          {isCompleteVideoMode ? '🎬' : '🎵'}
        </span>
        {isCompleteVideoMode ? 'Complete Video Mode' : 'Normal Music Mode'}
        <span style={{ 
          fontSize: '0.7rem', 
          opacity: 0.8,
          background: 'rgba(255, 255, 255, 0.2)',
          padding: '2px 6px',
          borderRadius: '10px',
          marginLeft: '0.5rem',
          transition: 'all 0.3s ease'
        }}>
          {isCompleteVideoMode ? 'Premium' : 'Standard'}
        </span>
      </button>
    </div>

    {/* Enhanced Mode Description */}
 


<div style={{
  width: '600px',
  maxWidth: '90vw',
  fontFamily: 'SÃ¶hne, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif'
}}>
  {/* Main Chat Input Container */}
  <div style={{
    background: 'rgba(51, 65, 85, 0.3)',
    borderRadius: '26px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '0',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease'
  }}>
    <div style={{
      position: 'relative',
      padding: '16px'
    }}>
      {/* Large Textarea Container - Keeps original look */}
      <div style={{
        marginBottom: '50px'
      }}>
        <textarea
          value={chatMessage}
          onChange={(e) => {
            const value = e.target.value;
            // Only allow first line - remove any line breaks
            const firstLine = value.split('\n')[0];
            setChatMessage(firstLine);
          }}
          placeholder={isCompleteVideoMode 
            ? "Describe processing instructions (e.g., 'only add music where people don't speak')"
            : "Describe your music style (e.g., 'epic orchestral for action scenes')"
          }
          style={{
            width: '80%',
            minHeight: '120px',        // Keep original large height
            maxHeight: '300px',        // Keep original max height  
            padding: '20px 60px 20px 160px', // Keep original padding
            fontSize: '16px',
            lineHeight: '24px',
            color: '#ffffff',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            resize: 'none',            // Prevent manual resizing
            fontFamily: 'inherit',
            overflow: 'hidden',        // Hide scroll bars
            textAlign: 'left',
            transition: 'all 0.3s ease',
            
            // Key properties for single line behavior
            whiteSpace: 'nowrap',      // Prevent text wrapping to new lines
            overflowX: 'auto',         // Allow horizontal scrolling
            overflowY: 'hidden',       // Hide vertical overflow
            
            // Hide scrollbars but keep functionality
            scrollbarWidth: 'none',    // Firefox
            msOverflowStyle: 'none',   // IE/Edge
          }}
          rows={5}                     // Keep original rows for visual size
          onInput={(e) => {
            // Prevent textarea from growing vertically
            e.target.style.height = '120px'; // Keep fixed height
            
            // Only allow horizontal scrolling
            const value = e.target.value;
            const firstLine = value.split('\n')[0];
            if (value !== firstLine) {
              e.target.value = firstLine;
              setChatMessage(firstLine);
            }
          }}
          onKeyDown={(e) => {
            // Prevent Enter key from creating new lines
            if (e.key === 'Enter') {
              e.preventDefault();
              
              if (chatMessage.trim()) {
                if (!isFileReady) {
                  showMessage('Please upload a video file first', 'error');
                  return;
                }
                
                if (isCompleteVideoMode) {
                  setVideoInstructions(chatMessage.trim());
                  setDescription(chatMessage.trim());
                  processVideoWithClipTune();
                } else {
                  handleProceedToNext();
                }
              }
            }
            
            // Prevent other keys that could create new lines
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
              e.preventDefault();
            }
          }}
          onPaste={(e) => {
            // Handle paste events to only keep first line
            e.preventDefault();
            const paste = (e.clipboardData || window.clipboardData).getData('text');
            const firstLine = paste.split('\n')[0];
            setChatMessage(prevMessage => prevMessage + firstLine);
          }}
        />
        
        {/* Custom CSS to hide scrollbars completely */}
        <style>{`
          /* Hide scrollbars in webkit browsers */
          textarea::-webkit-scrollbar {
            display: none;
          }
          
          /* Ensure single line behavior */
          textarea {
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE/Edge */
          }
          
          /* Optional: Add subtle visual indicator for overflow */
          textarea:focus {
            box-shadow: inset 0 0 0 1px rgba(102, 126, 234, 0.5);
          }
        `}</style>
      </div>
      
      {/* Dynamic feedback indicator - REMOVED */}
      
      {/* Video segment info display */}
      {savedVideoSegment && !isCompleteVideoMode && (
        <div style={{
          position: 'absolute',
          bottom: '60px',
          left: '16px',
          right: '60px',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '12px',
          padding: '8px 12px',
          fontSize: '12px',
          color: '#10b981',
          textAlign: 'center',
          animation: 'fadeIn 0.3s ease'
        }}>
          🎬 Video segment set: {savedVideoSegment.startTime} - {savedVideoSegment.endTime} ({savedVideoSegment.duration}s)
        </div>
      )}
      
      {/* Enhanced Left side buttons container */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        display: 'flex',
        gap: '8px'
      }}>
        {/* Enhanced Upload Button */}
        <button
          className={`chat-button upload-button ${isFileReady ? 'upload-button-success' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            border: 'none',
            background: isFileReady 
              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
              : 'transparent',
            cursor: 'pointer',
            color: isFileReady ? 'white' : 'rgba(255, 255, 255, 0.7)',
            fontSize: '18px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: isFileReady 
              ? '0 4px 15px rgba(16, 185, 129, 0.3)' 
              : 'none'
          }}
          title={isFileReady ? "File uploaded successfully!" : "Upload video file"}
        >
          {isUploading ? (
            <div className="loading-spinner" style={{
              width: '18px',
              height: '18px',
              border: '2px solid transparent',
              borderTop: '2px solid currentColor',
              borderRadius: '50%'
            }} />
          ) : isFileReady ? (
            <span style={{ 
              fontSize: '16px',
              animation: 'loadingPulse 2s ease-in-out infinite'
            }}>✅</span>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66L9.64 16.2a2 2 0 01-2.83-2.83l8.48-8.48" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          <input
            type="file"
            accept="video/*"
            ref={fileInputRef}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </button>

        {/* Enhanced Timeline Editor Button */}
        {!isCompleteVideoMode && (
          <button
            className={`chat-button scissor-button ${savedVideoSegment ? 'scissor-button-active' : ''} ${!isFileReady ? 'button-disabled' : ''}`}
            onClick={() => {
              if (isFileReady) {
                setShowTimelineEditor(true);
              } else {
                showMessage('Please upload a video file first', 'error');
              }
            }}
            disabled={!isFileReady}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              border: 'none',
              background: savedVideoSegment 
                ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                : isFileReady ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
              cursor: isFileReady ? 'pointer' : 'not-allowed',
              color: savedVideoSegment 
                ? 'white'
                : isFileReady ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.3)',
              fontSize: '18px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: savedVideoSegment 
                ? '0 4px 15px rgba(245, 158, 11, 0.3)' 
                : 'none'
            }}
            title={
              !isFileReady ? "Upload video first" :
              savedVideoSegment ? `Timeline set: ${savedVideoSegment.startTime} - ${savedVideoSegment.endTime}` :
              "Set video timeline"
            }
          >
            <span style={{ 
              fontSize: '16px',
              display: 'inline-block',
              transition: 'transform 0.3s ease'
            }}>✂️</span>
          </button>
        )}
      </div>
      
      {/* Enhanced Send Button */}
      <button
        className={`chat-button ${(chatMessage.trim() && isFileReady) ? 'send-button-ready' : 'button-disabled'}`}
onClick={() => {
  if (!chatMessage.trim()) {
    showMessage('Please enter a message first', 'error');
    return;
  }
  
  if (!isFileReady) {
    showMessage('Please upload a video file first', 'error');
    return;
  }
  
  const messageText = chatMessage.trim();
  
  if (isCompleteVideoMode) {
    // 🚨 CRITICAL FIX: Set BOTH states IMMEDIATELY and SYNCHRONOUSLY
    setVideoInstructions(messageText);
    setDescription(messageText);
    
    // Clear input immediately for instant feedback
    setChatMessage('');
    
    // Show confirmation that instructions were captured
    const confirmMessage = {
      id: Date.now(),
      type: 'ai',
      message: `🎯 Processing instructions set: "${messageText}". Starting complete video analysis...`,
      timestamp: new Date().toLocaleTimeString()
    };
    setChatHistory(prev => [...prev, confirmMessage]);
    
    // 🚨 NEW: Call processVideoWithClipTune with explicit parameters
    // This ensures the function has the correct values regardless of state timing
    processVideoWithClipTune(messageText);
    
  } else {
    // Normal mode - existing logic
    setDescription(messageText);
    showMessage(`✅ Description set: "${messageText}"`, 'success');
    handleProceedToNext();
  }
}}
        disabled={!chatMessage.trim() || !isFileReady}
        style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '36px',
          height: '36px',
          borderRadius: '18px',
          border: 'none',
          background: (!chatMessage.trim() || !isFileReady) 
            ? '#6b7280' 
            : isCompleteVideoMode
            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
            : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          cursor: (!chatMessage.trim() || !isFileReady) ? 'not-allowed' : 'pointer',
          color: 'white',
          overflow: 'hidden',
          transform: (!chatMessage.trim() || !isFileReady) ? 'scale(0.95)' : 'scale(1)',
          boxShadow: (chatMessage.trim() && isFileReady) 
            ? (isCompleteVideoMode 
              ? '0 4px 12px rgba(16, 185, 129, 0.3)'
              : '0 4px 12px rgba(59, 130, 246, 0.3)')
            : 'none'
        }}
        title={
          !chatMessage.trim() ? "Enter a message first" :
          !isFileReady ? "Upload video first" :
          isCompleteVideoMode ? "Start Complete Video Analysis" :
          "Continue to Music Generation"
        }
      >
        {/* Animated Icon */}
        <div style={{
          transition: 'transform 0.3s ease',
          transform: (chatMessage.trim() && isFileReady) ? 'scale(1)' : 'scale(0.8)'
        }}>
          {isCompleteVideoMode ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z" 
                    fill="currentColor"/>
            </svg>
          )}
        </div>
      </button>
    </div>
  </div>
</div>
    {/* Enhanced Upload Progress Indicator */}
    {isUploading && (
      <div style={{
        background: 'rgba(59, 130, 246, 0.1)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '12px',
        padding: '1rem',
        color: '#3b82f6',
        textAlign: 'center',
        animation: 'fadeIn 0.3s ease',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{
          width: '100%',
          height: '6px',
          background: 'rgba(59, 130, 246, 0.2)',
          borderRadius: '3px',
          marginBottom: '0.5rem',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${uploadProgress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
            borderRadius: '3px',
            transition: 'width 0.3s ease',
            animation: 'loadingPulse 1.5s ease-in-out infinite'
          }} />
        </div>
        <span className="pulse-ready">🎹 Uploading and processing video... {uploadProgress}%</span>
      </div>
    )}

    {/* Enhanced File Ready Indicator */}
    {isFileReady && (
      <div style={{
        background: 'rgba(16, 185, 129, 0.1)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '12px',
        padding: '1rem',
        color: '#10b981',
        textAlign: 'center',
        animation: 'fadeIn 0.3s ease',
        width: '100%',
        maxWidth: '400px'
      }}>
        <span className="pulse-ready">✅ Video is uploaded. </span>
      </div>
    )}
  </div>
)}
  </div>
)}
{currentStep === 2 && (
  <div style={{
    width: '100%',
    minHeight: '100vh',
    padding: '2rem',
    color: '#E2E8F0',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }}>


    {/* Video Preview and Segments Layout */}
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center',
      alignItems: 'flex-start',
      marginBottom: '2.5rem',
      gap: '2rem',
      width: '100%'
    }}>
      {/* LEFT SIDE - ClipTune segments */}
   {/* LEFT SIDE - ClipTune segments */}


{/* LEFT SIDE - ClipTune segments */}
<div style={{ 
  flex: '0 0 25%',
  position: 'sticky',
  top: '2rem',
  maxHeight: 'calc(100vh - 4rem)',
  overflowY: 'auto'
}}>
  {processedVideoResult && processedVideoResult.segments && Array.isArray(processedVideoResult.segments) && processedVideoResult.segments.length > 0 && (
    <div style={{
      background: '#1f2937', // Gray-800 equivalent
      border: '1px solid #374151', // Gray-700 equivalent
      borderRadius: '12px',
      display: 'flex',
      flexDirection: 'column',
      maxHeight: '80vh',
      height: 'fit-content'
    }}>
      {/* Header */}
      <div style={{
        padding: '1rem',
        borderBottom: '1px solid #374151',
        position: 'sticky',
        top: '0',
        background: '#1f2937',
        zIndex: 10,
        borderRadius: '12px 12px 0 0'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem'
        }}>
          <h2 style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'white',
            margin: 0
          }}>
            <span style={{ fontSize: '1.25rem', color: '#000000' }}>🎵</span>
            ClipTune AI Segments
          </h2>
          <span style={{
            padding: '0.25rem 0.5rem',
            background: '#000000',
            color: 'white',
            fontSize: '0.75rem',
            borderRadius: '9999px',
            fontWeight: 500
          }}>
            {processedVideoResult.segments.length}
          </span>
        </div>
      </div>
      
      {/* Segments List */}
      <div style={{
        flex: '1',
        overflowY: 'auto',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
   {processedVideoResult.segments.map((segment, index) => {
  if (!segment) {
    console.warn(`Segment ${index} is undefined`);
    return null;
  }

  const startTimeVal = segment.parsed_start !== undefined ? segment.parsed_start : parseFloat(segment.start_time || 0);
  const endTimeVal = segment.parsed_end !== undefined ? segment.parsed_end : parseFloat(segment.end_time || startTimeVal + 30);
  const segmentDuration = segment.duration || (endTimeVal - startTimeVal);
  
  const hasGeneratedMusic = generatedSegmentMusic[index] && !generatedSegmentMusic[index].removed;
  const isGenerating = segmentMusicGeneration[index];
  const effectiveVolume = getEffectiveVolume(index, segment);
  const hasCustomVolume = generatedSegmentMusic[index]?.hasCustomVolume || false;
  const isEditing = selectedSegmentForEdit && selectedSegmentForEdit.index === index;
  const isRemoved = generatedSegmentMusic[index]?.removed === true;
  
  return (
    <div
      key={index}
      style={{
        padding: '1rem',
        borderRadius: '0.5rem',
        border: isEditing
          ? '1px solid #8b5cf6'
          : hasGeneratedMusic && !isRemoved
          ? '1px solid #000000'
          : isGenerating
          ? '1px solid #3b82f6'
          : isRemoved
          ? '1px solid #6b7280'
          : '1px solid #000000',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative',
        background: isEditing
          ? '#581c87'
          : hasGeneratedMusic && !isRemoved
          ? '#1a1a1a'
          : isGenerating
          ? '#1e3a8a'
          : isRemoved
          ? '#374151'
          : '#1f2937',
        boxShadow: isEditing
          ? '0 10px 25px rgba(139, 92, 246, 0.2)'
          : hasGeneratedMusic && !isRemoved
          ? '0 10px 25px rgba(0, 0, 0, 0.4)'
          : isGenerating
          ? '0 10px 25px rgba(59, 130, 246, 0.2)'
          : isRemoved
          ? '0 4px 15px rgba(107, 114, 128, 0.2)'
          : '0 10px 25px rgba(0, 0, 0, 0.3)'
      }}
      onMouseEnter={(e) => {
        if (!isEditing) {
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isEditing) {
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      {/* Editing Mode Indicator */}
     
      
      {/* Main segment content */}
      <div style={{ marginBottom: '0.75rem', paddingRight: '4rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '0.75rem'
        }}>
          <div style={{ flex: '1', paddingRight: '4rem' }}>
            <p style={{
              fontSize: '0.875rem',
              color: '#d1d5db',
              marginBottom: '0.5rem',
              fontFamily: 'monospace',
              margin: '0 0 0.5rem 0'
            }}>
              {formatTimeFromSeconds(startTimeVal)} - {formatTimeFromSeconds(endTimeVal)}
            </p>
            <p style={{
              color: 'white',
              fontWeight: 500,
              fontSize: '0.875rem',
              lineHeight: '1.4',
              margin: '0 0 0.25rem 0'
            }}>
              {segment.music_summary}
            </p>
            <p style={{
              fontSize: '0.75rem',
              color: '#9ca3af',
              margin: '0.25rem 0 0 0'
            }}>
              Duration: {formatTimeFromSeconds(segmentDuration)}
            </p>
          </div>
        </div>
      </div>
      {!hasGeneratedMusic && !isGenerating && !isRemoved && (
              <>
                {/* Track Name Input */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{
                    display: 'block',
        fontSize: '0.75rem',
        fontWeight: 500,
        color: '#d1d5db',
        marginBottom: '0.5rem'
      }}>
        🎵 Track Name
      </label>
      <input
        type="text"
        value={segmentTrackNames[index] || ''}
        onChange={(e) => handleTrackNameChange(index, e.target.value)}
        placeholder={`Segment ${index + 1} Music`}
        style={{
          width: '100%',
          padding: '0.5rem 0.75rem',
          background: '#1f2937',
          border: '1px solid #374151',
          borderRadius: '0.375rem',
          fontSize: '0.8rem',
          color: '#e5e7eb',
          outline: 'none',
          transition: 'border-color 0.2s ease'
        }}
        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
        onBlur={(e) => e.target.style.borderColor = '#374151'}
      />
    </div>
    
    {/* Horizontal button container for Generate Music and Edit Timeline */}
    <div style={{ 
      display: 'flex', 
      gap: '0.5rem', 
      width: '100%' 
    }}>
      {/* Your existing Generate Music and Edit Timeline buttons */}
    </div>
  </>
)}
      {/* Action Buttons Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {!hasGeneratedMusic && !isGenerating && !isRemoved && (
          <>
            {/* Horizontal button container for Generate Music and Edit Timeline */}
            <div style={{ 
              display: 'flex', 
              gap: '0.5rem', 
              width: '100%' 
            }}>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  generateMusicForSegment(segment, index);
                }}
                style={{
                  flex: '1',
                  padding: '0.5rem 0.5rem',
                  background: '#2563eb',
                  border: 'none',
                  borderRadius: '0.25rem',
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  transition: 'background-color 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.25rem',
                  color: 'white',
                  cursor: 'pointer',
                  minHeight: '36px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#1d4ed8'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#2563eb'}
              >
                <span style={{ fontSize: '0.7rem' }}>🎵</span>
                Generate Music
              </button>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  // Only allow editing if no music has been generated for this segment
                  if (!generatedSegmentMusic[index] || generatedSegmentMusic[index].removed) {
                    handleStartTimelineEdit(segment, index);
                  } else {
                    // Show message that editing is disabled after music generation
                    showMessage('Timeline editing is disabled after music generation. Remove music first to edit.', 'warning');
                  }
                }}
                style={{
                  flex: '1',
                  padding: '0.5rem 0.5rem',
                  background: (generatedSegmentMusic[index] && !generatedSegmentMusic[index].removed) 
                    ? '#6b7280' // Gray when disabled
                    : '#3b82f6', // Blue when enabled
                  border: 'none',
                  borderRadius: '0.25rem',
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  transition: 'background-color 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.25rem',
                  color: 'white',
                  cursor: (generatedSegmentMusic[index] && !generatedSegmentMusic[index].removed) 
                    ? 'not-allowed' 
                    : 'pointer',
                  opacity: (generatedSegmentMusic[index] && !generatedSegmentMusic[index].removed) 
                    ? 0.6 
                    : 1,
                  minHeight: '36px'
                }}
                onMouseEnter={(e) => {
                  if (!generatedSegmentMusic[index] || generatedSegmentMusic[index].removed) {
                    e.currentTarget.style.background = '#2563eb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!generatedSegmentMusic[index] || generatedSegmentMusic[index].removed) {
                    e.currentTarget.style.background = '#3b82f6';
                  } else {
                    e.currentTarget.style.background = '#6b7280';
                  }
                }}
                disabled={generatedSegmentMusic[index] && !generatedSegmentMusic[index].removed}
              >
                <span style={{ fontSize: '0.7rem' }}>✂️</span>
                Edit Timeline
              </button>
            </div>
          </>
        )}

        {isGenerating && (
          <div style={{
            width: '100%',
            padding: '0.5rem 0.75rem',
            background: '#2563eb', // Blue for generating state
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            color: 'white'
          }}>
            <div style={{
              width: '0.75rem',
              height: '0.75rem',
              border: '2px solid white',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            Generating...
          </div>
        )}
 
 
{(hasGeneratedMusic || isRemoved) && (
  <div style={{
    display: 'flex',
    gap: '0.5rem',
    width: '100%'
  }}>
    {/* Play button - only show if music exists and isn't removed */}
    {hasGeneratedMusic && !isRemoved && (
      <button 
        onClick={(e) => {
          e.stopPropagation();
          playSegmentWithMusic(index);
        }}
        style={{
          flex: '1',
          padding: '0.5rem',
          background: '#2563eb',
          border: 'none',
          borderRadius: '0.25rem',
          fontSize: '0.7rem',
          fontWeight: 500,
          transition: 'background-color 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.25rem',
          color: 'white',
          cursor: 'pointer',
          minHeight: '36px'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = '#1d4ed8'}
        onMouseLeave={(e) => e.currentTarget.style.background = '#2563eb'}
      >
        <span style={{ fontSize: '0.7rem' }}>▶️</span>
        Play
      </button>
    )}
    
    {/* Remove/Restore button logic - FIXED */}
    {generatedSegmentMusic[index] && (
      <>
        {/* ✅ FIXED: Show processing state only when actually processing */}
        {generatedSegmentMusic[index].videoProcessing === true ? (
          <div style={{
            flex: '1',
            padding: '0.5rem',
            background: '#6b7280',
            borderRadius: '0.25rem',
            fontSize: '0.7rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.25rem',
            color: 'white',
            minHeight: '36px'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              border: '2px solid transparent',
              borderTop: '2px solid white',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            Updating Video...
          </div>
        ) : (
          /* ✅ FIXED: Show Remove/Restore button when NOT processing */
          <button 
            onClick={(e) => {
              e.stopPropagation();
              if (generatedSegmentMusic[index].removed) {
                handleRestoreSegmentMusic(index);
              } else {
                handleRemoveSegmentMusic(index);
              }
            }}
            style={{
              flex: '1',
              padding: '0.5rem',
              background: generatedSegmentMusic[index].removed ? '#2563eb' : '#dc2626',
              border: 'none',
              borderRadius: '0.25rem',
              fontSize: '0.7rem',
              fontWeight: 500,
              transition: 'background-color 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.25rem',
              color: 'white',
              cursor: 'pointer',
              minHeight: '36px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = generatedSegmentMusic[index].removed ? '#1d4ed8' : '#b91c1c';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = generatedSegmentMusic[index].removed ? '#2563eb' : '#dc2626';
            }}
          >
            {generatedSegmentMusic[index].removed ? (
              <>
                <span style={{ fontSize: '0.7rem' }}>🔄</span>
                Restore
              </>
            ) : (
              <>
                <span style={{ fontSize: '0.7rem' }}>🗑️</span>
                Remove
              </>
            )}
          </button>
        )}
        
        {/* Error state display */}
        {generatedSegmentMusic[index].videoProcessingError && (
          <div style={{
            flex: '1',
            padding: '0.5rem',
            background: '#dc2626',
            borderRadius: '0.25rem',
            fontSize: '0.7rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.25rem',
            color: 'white',
            minHeight: '36px',
            cursor: 'pointer'
          }}
          title="Video update failed - click to retry"
          onClick={(e) => {
            e.stopPropagation();
            // Clear error and retry
            setGeneratedSegmentMusic(prev => ({
              ...prev,
              [index]: {
                ...prev[index],
                videoProcessingError: undefined
              }
            }));
          }}
        >
          <span style={{ fontSize: '0.7rem' }}>⚠️</span>
          Update Failed (Click to Retry)
        </div>
        )}
      </>
    )}
  </div>
)}
      </div>

      {/* Volume Control Section */}
    {/* Volume Control Section - Enhanced with Loading State */}
{hasGeneratedMusic && !isRemoved && (
  <div 
    style={{
      marginTop: '0.75rem',
      padding: '0.75rem',
      background: 'rgba(17, 24, 39, 0.5)',
      borderRadius: '0.25rem',
      border: '1px solid #4b5563',
      position: 'relative' // Important for overlay positioning
    }}
    onClick={(e) => e.stopPropagation()}
    onMouseDown={(e) => e.stopPropagation()}
    onMouseUp={(e) => e.stopPropagation()}
  >
    {/* 🚨 NEW: Volume Update Loading Overlay */}
    {volumeUpdateProgress[index]?.isUpdating && (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(30, 41, 59, 0.95)',
        backdropFilter: 'blur(4px)',
        borderRadius: '0.25rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20,
        gap: '0.75rem'
      }}>
        {/* Circular Progress Indicator */}
        <div style={{
          position: 'relative',
          width: '50px',
          height: '50px',
          transform: 'rotate(-90deg)'
        }}>
          {/* Background Circle */}
          <svg width="50" height="50" style={{ position: 'absolute' }}>
            <circle
              cx="25"
              cy="25"
              r="20"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="3"
              fill="transparent"
            />
          </svg>
          
          {/* Progress Circle */}
          <svg width="50" height="50" style={{ position: 'absolute' }}>
            <circle
              cx="25"
              cy="25"
              r="20"
              stroke="#3b82f6"
              strokeWidth="3"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 20}`}
              strokeDashoffset={`${2 * Math.PI * 20 * (1 - (volumeUpdateProgress[index]?.progress || 0) / 100)}`}
              strokeLinecap="round"
              style={{
                transition: 'stroke-dashoffset 0.3s ease',
                filter: 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.6))'
              }}
            />
          </svg>
          
          {/* Percentage Text */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(90deg)',
            fontSize: '0.7rem',
            fontWeight: 'bold',
            color: 'white',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
          }}>
            {Math.round(volumeUpdateProgress[index]?.progress || 0)}%
          </div>
        </div>

        {/* Status Text */}
        <div style={{
          color: 'white',
          fontSize: '0.8rem',
          fontWeight: 500,
          textAlign: 'center',
          lineHeight: '1.2'
        }}>
          🎚️ Updating Volume to {volumeUpdateProgress[index]?.targetVolume}%
          <div style={{
            fontSize: '0.7rem',
            color: 'rgba(255, 255, 255, 0.7)',
            marginTop: '0.25rem'
          }}>
            Regenerating video with new audio levels...
          </div>
        </div>
      </div>
    )}

    {/* Original Volume Control Content */}
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '0.5rem'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.75rem',
        color: '#d1d5db',
        fontWeight: 500
      }}>
        <span style={{ fontSize: '0.75rem' }}>🔊</span>
        Volume Control
      </div>
      <div style={{
        fontSize: '0.75rem',
        fontWeight: 'bold',
        padding: '0.25rem 0.5rem',
        borderRadius: '0.25rem',
        background: hasCustomVolume ? '#2563eb' : '#4b5563',
        color: hasCustomVolume ? 'white' : '#d1d5db'
      }}>
        {Math.round(effectiveVolume * 100)}%
      </div>
    </div>
    
    <input
      type="range"
      min="0"
      max="1"
      step="0.1"
      value={effectiveVolume}
      onChange={(e) => {
        e.stopPropagation();
        e.preventDefault();
        handleSegmentVolumeChange(index, parseFloat(e.target.value));
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
      onPointerMove={(e) => e.stopPropagation()}
      disabled={volumeUpdateProgress[index]?.isUpdating} // Disable during update
      style={{
        width: '100%',
        accentColor: '#2563eb',
        cursor: volumeUpdateProgress[index]?.isUpdating ? 'not-allowed' : 'pointer',
        opacity: volumeUpdateProgress[index]?.isUpdating ? 0.5 : 1
      }}
    />
    
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.75rem',
      color: '#9ca3af',
      marginTop: '0.25rem'
    }}>
      <span>🔇 0%</span>
      <span>🔊 100%</span>
    </div>
  </div>
)}

      {/* ✅ TIMELINE CONTROLS - NOW INSIDE THE MAP FUNCTION WHERE 'index' IS DEFINED */}

      {/* Success Status */}
      {hasGeneratedMusic && !isRemoved && (
        <div style={{
          marginTop: '0.75rem',
          padding: '0.5rem',
          background: 'rgba(37, 99, 235, 0.3)',
          borderRadius: '0.25rem',
          border: '1px solid #2563eb'
        }}>
          <p style={{
            color: '#93c5fd',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            margin: 0
          }}>
            <span style={{ fontSize: '0.75rem' }}>🎵</span>
            Music Generated Successfully
          </p>
        </div>
      )}
    </div>
  );
})}
      </div>
      {/* Timeline Editing Controls - Add this INSIDE the segment map loop, after volume control */}

      {/* Bottom Action Buttons */}
      <div style={{
        padding: '1rem',
        borderTop: '1px solid #374151',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        background: '#1f2937',
        borderRadius: '0 0 12px 12px'
      }}>
        <button 
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            background: '#2563eb', // Changed to blue
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            transition: 'background-color 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            color: 'white',
            cursor: 'pointer'
          }}
          onClick={() => {
            const segmentsWithMusic = Object.keys(generatedSegmentMusic).length;
            setCompleteVideoSegmentCount(segmentsWithMusic);
            setShowCompleteVideoConfirm(true);
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#1d4ed8'} // Darker blue on hover
          onMouseLeave={(e) => e.currentTarget.style.background = '#2563eb'}
        >
  Download video ({Object.keys(generatedSegmentMusic).length})
        </button>
        
        <div style={{
          fontSize: '0.75rem',
          color: '#9ca3af',
          textAlign: 'center'
        }}>
          ✅ {Object.keys(generatedSegmentMusic).length}/{processedVideoResult.segments.length} segments have music
        </div>
      </div>
    </div>
  )}
</div>
      {/* CENTER - Video preview box with timeline underneath */}
     {/* CENTER - Video preview box with timeline underneath */}

{/* CENTER - Video preview box with timeline underneath */}
<div style={{ 
  flex: '0 0 50%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minHeight: '60vh'
}}>
  {/* ClipTune Title */}
  <div style={{
    textAlign: 'center',
    marginBottom: '2rem',
    width: '100%'
  }}>
    <h1 style={{
      fontSize: '4rem',
      fontWeight: 'bold',
      color: 'white',
      textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
      margin: 0,
      letterSpacing: '2px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    }}>
      ClipTune
    </h1>
  </div>

  {/* Video Container */}
{/* Video Container with Complete Video Button */}
<div id="video-preview-container" style={{ 
  width: '100%', 
  textAlign: 'center', 
  marginBottom: '2rem',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  position: 'relative'  // For absolute positioning of button
}}>
  {/* Video Section - Centered */}
  <div id="progressive-video-container" style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: '2rem'
  }}>
    <div style={{
      width: '100%',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {/* Video title div */}
      <div style={{
        background: processedVideoResult?.trim_info ? 
          'linear-gradient(135deg, #38a169 0%, #48bb78 100%)' : 
          'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
        color: 'white',
        padding: '0.5rem 1.5rem',
        borderRadius: '20px 20px 0 0',
        fontSize: '0.9rem',
        fontWeight: 600,
        marginBottom: '0'
      }}>
      
      </div>

      <video
        ref={videoPreviewRef}
        src={combinedVideoUrl || videoUrl}
        controls
        autoPlay={false}
        style={{
          width: '800px',  // Back to original size for better centering
          maxWidth: '90vw',
          maxHeight: '500px',
          minHeight: '300px',
          borderRadius: processedVideoResult?.trim_info ? '0 0 16px 16px' : '16px',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4)',
          margin: '0 auto 2rem auto',
          display: 'block',
        }}
        onLoadedMetadata={() => {
          if (processedVideoResult?.trim_info && videoPreviewRef.current) {
            const { original_start, original_end } = processedVideoResult.trim_info;
            
            // Set initial time to start of trimmed section
            videoPreviewRef.current.currentTime = original_start;
            
            // Add event listener to keep playback within trimmed range
            const handleTimeUpdate = () => {
              if (videoPreviewRef.current) {
                const currentTime = videoPreviewRef.current.currentTime;
                
                // If we go past the end of trimmed section, loop back to start
                if (currentTime >= original_end) {
                  videoPreviewRef.current.currentTime = original_start;
                }
                
                // If we go before the start of trimmed section, jump to start
                if (currentTime < original_start) {
                  videoPreviewRef.current.currentTime = original_start;
                }
              }
            };
            
            // Remove any existing listeners first
            videoPreviewRef.current.removeEventListener('timeupdate', handleTimeUpdate);
            videoPreviewRef.current.addEventListener('timeupdate', handleTimeUpdate);
          }
        }}
        onSeeked={() => {
          // Constrain seeking to trimmed range
          if (processedVideoResult?.trim_info && videoPreviewRef.current) {
            const { original_start, original_end } = processedVideoResult.trim_info;
            const currentTime = videoPreviewRef.current.currentTime;
            
            if (currentTime < original_start || currentTime >= original_end) {
              videoPreviewRef.current.currentTime = original_start;
            }
          }
        }}
      />

      {/* Trimmed video info display */}
      {processedVideoResult?.trim_info && (
        <div style={{
          background: 'rgba(56, 161, 105, 0.1)',
          border: '1px solid rgba(56, 161, 105, 0.3)',
          borderRadius: '12px',
          padding: '1rem',
          marginTop: '1rem',
          color: '#E2E8F0',
          textAlign: 'center',
          maxWidth: '500px'
        }}>
        
    
        </div>
      )}
    </div>
  </div>
{/* Complete Video Button - Moved much further to the right */}
{/* Complete Video Button - Moved much further to the right */}
{!processedVideoResult?.segments && (
  <div style={{
    position: 'absolute',
    right: '-18rem',
    top: '4rem',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    minWidth: '280px',
    maxWidth: '280px'
  }}>
    {/* Complete Video Button */}
    <div style={{ position: 'relative' }}>
      <Button
        variant="success"
        onClick={() => {
          if (!showInstructionInput) {
            setShowInstructionInput(true);
            setVideoInstructions('');
          } else if (videoInstructions.trim() === '') {
            showMessage('Please enter processing instructions before continuing', 'error');
          } else {
            // Use the instruction input text directly - NO POPUP
            setDescription(videoInstructions); // Set the description from input
            processVideoWithClipTune(); // Process directly
          }
        }}
        disabled={isProcessingVideo || isLoadingVideoData}
        style={{
          opacity: isProcessingVideo ? 0.7 : 1,
          transform: isProcessingVideo ? 'scale(0.98)' : 'scale(1)',
          background: isProcessingVideo
            ? '#6b7280'
            : showInstructionInput && videoInstructions.trim() !== ''
            ? '#10b981'
            : '#2563eb',
          color: 'white',
          border: 'none',
          padding: '1rem 1.2rem',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: isProcessingVideo ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: 'none',
          textAlign: 'center',
          outline: 'none',
          fontFamily: "'SF Pro Display', 'Segoe UI', 'Helvetica Neue', 'Arial', 'Roboto', sans-serif",
          letterSpacing: '0.3px',
          position: 'relative',
          whiteSpace: 'nowrap',
          width: '100%'
        }}
      >
        {isProcessingVideo 
          ? 'Processing...' 
          : showInstructionInput && videoInstructions.trim() !== ''
          ? '▶️ Process Video'
          : '🎵 Complete Video'
        }
      </Button>
    </div>

    {/* Premium Feature Notice - Only show when instruction input is NOT visible */}
    {!showInstructionInput && (
      <div style={{
        background: 'rgba(30, 41, 59, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '12px',
        padding: '1.2rem',
        border: '1px solid rgba(255, 215, 0, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        textAlign: 'center',
        maxWidth: '100%'
      }}>
        <div style={{
          color: '#ffd700',
          fontSize: '1.1rem',
          fontWeight: '600',
          marginBottom: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          ⭐ Premium Feature
        </div>
        
        <div style={{
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: '0.85rem',
          lineHeight: '1.3',
          marginBottom: '1rem'
        }}>
          AI-powered video analysis with intelligent music segment detection
        </div>
        
        <div style={{
          background: 'rgba(255, 215, 0, 0.1)',
          borderRadius: '8px',
          padding: '0.6rem',
          fontSize: '0.75rem',
          color: 'rgba(255, 255, 255, 0.8)',
          fontStyle: 'italic',
          lineHeight: '1.2'
        }}>
          Click "Complete Video" to access this feature
        </div>
      </div>
    )}

    {/* Instruction Input Section */}
    {showInstructionInput && (
      <div style={{
        background: 'rgba(30, 41, 59, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '12px',
        padding: '1.2rem',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        animation: 'slideDown 0.3s ease-out',
        maxWidth: '100%'
      }}>
        <div style={{
          marginBottom: '1rem',
          color: 'white',
          fontSize: '1rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          🎯 Processing Instructions
          <span style={{
            color: '#ef4444',
            fontSize: '0.8rem',
            fontWeight: 'normal'
          }}>
            *Required
          </span>
        </div>
        
        <textarea
          value={videoInstructions}
          onChange={(e) => setVideoInstructions(e.target.value)}
          placeholder="Enter detailed instructions for ClipTune processing...

Examples:
- 'Only add music to places where people do not speak'
- 'Add background music during action scenes'
- 'Create ambient music for quiet moments'"
          style={{
            width: '100%',
            minHeight: '100px',
            padding: '0.8rem',
            background: '#1f2937',
            border: videoInstructions.trim() === '' 
              ? '2px solid #ef4444'
              : '2px solid #10b981',
            borderRadius: '8px',
            fontSize: '0.85rem',
            color: '#e5e7eb',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            outline: 'none',
            resize: 'vertical',
            transition: 'border-color 0.2s ease',
            boxSizing: 'border-box',
            lineHeight: '1.3'
          }}
          onFocus={(e) => {
            if (videoInstructions.trim() !== '') {
              e.target.style.borderColor = '#3b82f6';
            }
          }}
          onBlur={(e) => {
            e.target.style.borderColor = videoInstructions.trim() === '' 
              ? '#ef4444' 
              : '#10b981';
          }}
        />
        
        {/* Character count and validation */}
        <div style={{
          marginTop: '0.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.75rem',
          flexWrap: 'wrap'
        }}>
          <span style={{
            color: videoInstructions.trim() === '' 
              ? '#ef4444' 
              : videoInstructions.length < 20
              ? '#f59e0b'
              : '#10b981',
            lineHeight: '1.2'
          }}>
            {videoInstructions.trim() === '' 
              ? '⚠️ Required' 
              : videoInstructions.length < 20
              ? '💡 Add detail'
              : '✅ Good'
            }
          </span>
          <span style={{ color: '#9ca3af' }}>
            {videoInstructions.length}
          </span>
        </div>

        {/* Action buttons */}
        <div style={{
          marginTop: '1rem',
          display: 'flex',
          gap: '0.4rem'
        }}>
          <button
            onClick={() => {
              setShowInstructionInput(false);
              setVideoInstructions('');
            }}
            style={{
              flex: '1',
              padding: '0.7rem 0.8rem',
              background: 'rgba(107, 114, 128, 0.8)',
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              fontSize: '0.85rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(107, 114, 128, 1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(107, 114, 128, 0.8)';
            }}
          >
            Cancel
          </button>
          
         <button
  onClick={() => {
    if (videoInstructions.trim() === '') {
      showMessage('Please enter processing instructions before continuing', 'error');
      return;
    }
    // 🚨 FIX: Set both videoInstructions AND description
    setDescription(videoInstructions.trim());
    processVideoWithClipTune();
  }}
  disabled={videoInstructions.trim() === ''}
  style={{
    flex: '2',
    padding: '0.7rem 0.8rem',
    background: videoInstructions.trim() === ''
      ? 'rgba(107, 114, 128, 0.5)'
      : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    border: 'none',
    borderRadius: '6px',
    color: 'white',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: videoInstructions.trim() === '' ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    opacity: videoInstructions.trim() === '' ? 0.6 : 1
  }}
  onMouseEnter={(e) => {
    if (videoInstructions.trim() !== '') {
      e.currentTarget.style.transform = 'translateY(-1px)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
    }
  }}
  onMouseLeave={(e) => {
    if (videoInstructions.trim() !== '') {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }
  }}
>
  🚀 Process
</button>
        </div>
      </div>
    )}

    {/* Add CSS animation */}
    <style>{`
      @keyframes slideDown {
        0% {
          opacity: 0;
          transform: translateY(-10px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}</style>
  </div>
)}
</div>
        {/* Timeline Section - Now directly under the video */}
        
{/* Timeline Section - Now directly under the video */}
{!isLoadingVideoData && thumbnails.length > 0 && (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center',
    width: '100%'
  }}>
    <div
      ref={trackRef}
      style={{
        position: 'relative',
        width: THUMB_WIDTH * NUM_THUMBS,
        height: THUMB_HEIGHT,
        borderRadius: '12px',
        overflow: 'hidden',
        userSelect: 'none',
        background: '#1A202C',
        boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '1rem'
      }}
    >
      {/* Thumbnails */}
      <div style={{ display: 'flex', height: '100%' }}>
        {thumbnails.map((thumb, i) => (
          <img key={i} src={thumb} style={{ width: THUMB_WIDTH, height: THUMB_HEIGHT, objectFit: 'cover' }} alt={`thumb-${i}`} />
        ))}
      </div>

      {/* Selection overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: startX,
        width: endX - startX,
        height: '100%',
        background: selectedSegmentForEdit 
          ? 'rgba(102, 126, 234, 0.6)' 
          : processedVideoResult?.trim_info
          ? 'rgba(56, 161, 105, 0.4)'  // Green for trimmed video
          : 'rgba(66, 153, 225, 0.4)',
        borderLeft: selectedSegmentForEdit 
          ? '4px solid #667eea' 
          : processedVideoResult?.trim_info
          ? '4px solid #48bb78'  // Green for trimmed video
          : '3px solid #4299E1',
        borderRight: selectedSegmentForEdit 
          ? '4px solid #667eea' 
          : processedVideoResult?.trim_info
          ? '4px solid #48bb78'  // Green for trimmed video
          : '3px solid #4299E1',
        pointerEvents: 'none',
        boxSizing: 'border-box'
      }} />

      {/* Trimmed video overlay indicator */}
      {processedVideoResult?.trim_info && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(56, 161, 105, 0.9)',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          pointerEvents: 'none',
          border: '2px solid white',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
        }}>
          ✂️ TRIMMED VIDEO ANALYZED
        </div>
      )}

      {/* Start handle - DISABLED for trimmed video */}
 <div
  style={{
    position: 'absolute',
    left: startX - 8,
    top: '50%',
    transform: 'translateY(-50%)',
    width: 16,
    height: 'calc(100% + 16px)',
    background: selectedSegmentForEdit ? '#4299E1' : '#6b7280', // Blue when editing, gray when disabled
    cursor: selectedSegmentForEdit ? 'ew-resize' : 'not-allowed', // Change cursor based on edit state
    borderRadius: '6px',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: selectedSegmentForEdit 
      ? '0 0 15px rgba(66, 153, 225, 0.5)' 
      : '0 0 10px rgba(107, 114, 128, 0.3)', // Different shadow when disabled
    opacity: selectedSegmentForEdit ? 1 : 0.6, // Reduced opacity when disabled
    transition: 'all 0.2s ease' // Smooth transition between states
  }}
  onMouseDown={(e) => {
    // Only allow dragging when editing a segment
    if (selectedSegmentForEdit) {
      createDragHandlerr("start")(e);
    } else {
      // Optional: Show message when trying to drag while not editing
      showMessage('Click "Edit Timeline" on a segment first to enable timeline editing', 'info');
    }
  }}
  title={selectedSegmentForEdit ? "Drag to adjust start time" : "Click 'Edit Timeline' to enable"} // Tooltip
>
  <span style={{
    color: 'white', 
    transform: 'rotate(90deg)', 
    fontSize: '10px'
  }}>
    |||
  </span>
</div>

{/* End handle - Only movable when editing */}
<div
  style={{
    position: 'absolute',
    left: endX - 8,
    top: '50%',
    transform: 'translateY(-50%)',
    width: 16,
    height: 'calc(100% + 16px)',
    background: selectedSegmentForEdit ? '#4299E1' : '#6b7280', // Blue when editing, gray when disabled
    cursor: selectedSegmentForEdit ? 'ew-resize' : 'not-allowed', // Change cursor based on edit state
    borderRadius: '6px',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: selectedSegmentForEdit 
      ? '0 0 15px rgba(66, 153, 225, 0.5)' 
      : '0 0 10px rgba(107, 114, 128, 0.3)', // Different shadow when disabled
    opacity: selectedSegmentForEdit ? 1 : 0.6, // Reduced opacity when disabled
    transition: 'all 0.2s ease' // Smooth transition between states
  }}
  onMouseDown={(e) => {
    // Only allow dragging when editing a segment
    if (selectedSegmentForEdit) {
      createDragHandlerr("end")(e);
    } else {
      // Optional: Show message when trying to drag while not editing
      showMessage('Click "Edit Timeline" on a segment first to enable timeline editing', 'info');
    }
  }}
  title={selectedSegmentForEdit ? "Drag to adjust end time" : "Click 'Edit Timeline' to enable"} // Tooltip
>
  <span style={{
    color: 'white', 
    transform: 'rotate(90deg)', 
    fontSize: '10px'
  }}>
    |||
  </span>
</div>

    </div>

    {/* Time indicators - centered under timeline */}
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      gap: '1.5rem',
      alignItems: 'center',
      width: THUMB_WIDTH * NUM_THUMBS,
      color: '#E2E8F0'
    }}>
      <div style={{ 
        background: selectedSegmentForEdit 
          ? 'rgba(102, 126, 234, 0.2)' 
          : processedVideoResult?.trim_info
          ? 'rgba(56, 161, 105, 0.2)'
          : 'rgba(255,255,255,0.05)', 
        padding: '0.75rem 1rem', 
        borderRadius: '12px', 
        textAlign: 'center',
        border: selectedSegmentForEdit 
          ? '1px solid #667eea' 
          : processedVideoResult?.trim_info
          ? '1px solid #48bb78'
          : 'none'
      }}>
        <strong>Start:</strong> {formatTime(startTime)}
      </div>
      <div style={{ 
        background: selectedSegmentForEdit 
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
          : processedVideoResult?.trim_info
          ? 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)'
          : '#000000', 
        padding: '1rem 1.5rem', 
        borderRadius: selectedSegmentForEdit || processedVideoResult?.trim_info ? '12px' : '0px', 
        fontWeight: '500', 
        color: 'white',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontSize: selectedSegmentForEdit || processedVideoResult?.trim_info ? '0.9rem' : '1.1rem',
        letterSpacing: '0.5px',
        textAlign: 'center',
        border: selectedSegmentForEdit || processedVideoResult?.trim_info ? '2px solid white' : 'none',
        boxShadow: selectedSegmentForEdit 
          ? '0 4px 15px rgba(102, 126, 234, 0.4)' 
          : processedVideoResult?.trim_info
          ? '0 4px 15px rgba(56, 161, 105, 0.4)'
          : 'none'
      }}>
        {selectedSegmentForEdit 
          ? `✂️ Editing Segment ${selectedSegmentForEdit.index + 1}` 
          : processedVideoResult?.trim_info
          ? `✅ Trimmed Video Analyzed`
          : `Duration: ${formatTime(selectionDuration)}`
        }
        {(selectedSegmentForEdit || processedVideoResult?.trim_info) && (
          <div style={{ 
            fontSize: '0.7rem', 
            opacity: 0.9, 
            marginTop: '0.2rem' 
          }}>
            {processedVideoResult?.trim_info 
              ? `${formatTime(processedVideoResult.trim_info.trimmed_duration)} analyzed`
              : formatTime(selectionDuration)
            }
          </div>
        )}
      </div>
      <div style={{ 
        background: selectedSegmentForEdit 
          ? 'rgba(102, 126, 234, 0.2)' 
          : processedVideoResult?.trim_info
          ? 'rgba(56, 161, 105, 0.2)'
          : 'rgba(255,255,255,0.05)', 
        padding: '0.75rem 1rem', 
        borderRadius: '12px', 
        textAlign: 'center',
        border: selectedSegmentForEdit 
          ? '1px solid #667eea' 
          : processedVideoResult?.trim_info
          ? '1px solid #48bb78'
          : 'none'
      }}>
        <strong>End:</strong> {formatTime(endTime)}
      </div>
    </div>

    {/* Process with ClipTune Button - Show different states */}
<div style={{ textAlign: 'center', marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
  {/* Timeline Control Buttons - Show when editing */}
  {selectedSegmentForEdit && (
    <div style={{
      display: 'flex',
      gap: '1rem',
      marginBottom: '1rem'
    }}>
      <button
        onClick={handleCancelTimelineEdit}
        style={{
          padding: '0.75rem 1.5rem',
          background: 'linear-gradient(135deg, #e53e3e 0%, #f56565 100%)',
          border: 'none',
          borderRadius: '8px',
          color: 'white',
          fontSize: '0.9rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(229, 62, 62, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <span>❌</span>
        Cancel Timeline Edit
      </button>
      
      <button
        onClick={handleSetCurrentTimeline}
        style={{
          padding: '0.75rem 1.5rem',
          background: hasUnsavedTimelineChanges 
            ? 'linear-gradient(135deg, #38a169 0%, #48bb78 100%)'
            : 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
          border: 'none',
          borderRadius: '8px',
          color: 'white',
          fontSize: '0.9rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = hasUnsavedTimelineChanges 
            ? '0 4px 15px rgba(56, 161, 105, 0.4)'
            : '0 4px 15px rgba(66, 153, 225, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <span>✅</span>
        {hasUnsavedTimelineChanges ? 'Save Timeline Changes' : 'Set Current Timeline'}
      </button>
    </div>
  )}

  {/* Main Process Button */}


{/* Main Process Button */}
{!processedVideoResult?.segments ? (
  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
    <Button
      variant="primary"
      onClick={handleVideoEditConfirm}
      style={{
        background: '#28a745',
        fontSize: '1.1rem',
        padding: '1.25rem 2.5rem',
        borderRadius: '6px',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontWeight: '500',
        letterSpacing: '1px',
        textTransform: 'uppercase'
      }}
    >
      Confirm
    </Button>
  </div>
) : (
  <div style={{
    background: 'rgba(56, 161, 105, 0.1)',
    border: '2px solid rgba(56, 161, 105, 0.3)',
    borderRadius: '12px',
    padding: '1.5rem 2rem',
    color: '#E2E8F0',
    textAlign: 'center'
  }}>
 
  </div>
)}
</div>
  </div>
)}
      </div>
    </div>
  
    {/* Loading Indicator */}
    {isLoadingVideoData && (
      <div style={{ textAlign: 'center', padding: '3rem 0', width: '100%' }}>
        <div style={{
          border: '4px solid #4A5568',
          borderTop: '4px solid #4299E1',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 2rem'
        }} />
        <p style={{ fontSize: '1.1rem', color: '#A0AEC0' }}>
          Analyzing video and generating timeline...
        </p>
      </div>
    )}

    {/* Complete Video Display */}
    {showProcessedVideo && processedVideoResult && processedVideoResult.combined_video_url && (
      <div style={{
        ...STYLES.container.card,
        maxWidth: '900px',
        background: 'linear-gradient(145deg, #f8fafc 0%, #ffffff 100%)',
        border: '1px solid #e0e0e0',
        padding: '3rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '3rem'
      }}>
        <h2 style={{
          ...STYLES.modal.title,
          fontSize: '2.5rem',
          color: '#2d3748',
          marginBottom: '1rem'
        }}>
          Original Video Review 🎬
        </h2>
        <p style={{
          ...STYLES.modal.subtitle,
          color: '#718096',
          marginBottom: '2rem'
        }}>
          Here's a review of your original processed video.
        </p>

        <video
          src={processedVideoResult.combined_video_url}
          controls
          style={{
            width: '100%',
            maxWidth: '800px',
            borderRadius: '16px',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)',
            border: '2px solid #a0aec0',
            marginBottom: '2.5rem'
          }}
        />

        {combinedVideoUrl && (
          <div style={{
            backgroundColor: 'rgba(235, 244, 255, 0.6)',
            padding: '2rem',
            borderRadius: '16px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
            border: '1px solid #bee3f8',
            width: '100%',
            maxWidth: '700px',
            textAlign: 'center',
            marginTop: '1.5rem'
          }}>
            <h4 style={{
              margin: '0 0 1rem 0',
              color: '#2c5282',
              fontSize: '1.4rem',
              fontWeight: 'bold'
            }}>
              ✨ Last Combined Video
            </h4>
            <video
              src={combinedVideoUrl}
              controls
              style={{
                width: '100%',
                maxWidth: '600px',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                marginBottom: '1.5rem'
              }}
            />
            <a
              href={combinedVideoUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...STYLES.button.primary,
                padding: '0.8rem 1.8rem',
                fontSize: '0.95rem',
                borderRadius: '10px',
                boxShadow: '0 6px 20px rgba(76, 81, 191, 0.3)'
              }}
            >
              Download Combined Video
            </a>
          </div>
        )}
      </div>
    )}

    {/* Confirmation Modals */}
    {showCompleteVideoConfirm && (
      <div style={{
        ...STYLES.modal.overlay,
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(4px)'
      }}>
        <div style={{
          ...STYLES.modal.container,
          width: '450px',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#2d3748',
            marginBottom: '1rem'
          }}>
           download video
          </h3>
          <p style={{
            color: '#718096',
            fontSize: '1.1rem',
            marginBottom: '2rem',
            lineHeight: 1.5
          }}>
            This will create a complete video with <strong>{completeVideoSegmentCount}</strong> music segments
            out of <strong>{processedVideoResult?.segments?.length || 0}</strong> total segments.
          </p>
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center'
          }}>
           
            <Button
              variant="secondary"
              onClick={() => setShowCompleteVideoConfirm(false)}
            >
              Cancel
            </Button>
      

<Button
  variant="success"
  onClick={async () => {
    setShowCompleteVideoConfirm(false);
    
    try {
      setIsGeneratingPreview(true);
      logToTerminal('🎬 Starting complete video generation...', 'info');
      
      if (!selectedFile || !processedVideoResult || !processedVideoResult.segments) {
        throw new Error('Missing video file or processed segments');
      }

      // Validate and prepare segment data
      const validatedSegments = processedVideoResult.segments.map((segment, index) => {
        if (!segment) {
          console.error(`❌ Segment ${index} is undefined`);
          throw new Error(`Segment ${index + 1} is undefined`);
        }

        const validatedSegment = {
          start_time: segment.start_time || segment.parsed_start?.toString() || '0',
          end_time: segment.end_time || segment.parsed_end?.toString() || '30',
          parsed_start: segment.parsed_start !== undefined ? segment.parsed_start : parseFloat(segment.start_time || 0),
          parsed_end: segment.parsed_end !== undefined ? segment.parsed_end : parseFloat(segment.end_time || 30),
          duration: segment.duration || ((segment.parsed_end || parseFloat(segment.end_time || 30)) - (segment.parsed_start || parseFloat(segment.start_time || 0))),
          music_summary: segment.music_summary || `Music for segment ${index + 1}`,
          music_details: segment.music_details || segment.music_summary || `Background music for segment ${index + 1}`,
          volume: segment.volume !== undefined ? segment.volume : 0.3,
          fade_algorithm: segment.fade_algorithm || segment.fade_type || 'linear',
          fadein_duration: segment.fadein_duration || segment.fade_in_seconds || 0,
          fadeout_duration: segment.fadeout_duration || segment.fade_out_seconds || 0,
          format_used: segment.format_used || 'processed',
          processing_metadata: segment.processing_metadata || {},
          segment_index: index,
          ...segment
        };

        if (isNaN(validatedSegment.parsed_start) || isNaN(validatedSegment.parsed_end)) {
          throw new Error(`Invalid timing data for segment ${index + 1}`);
        }

        if (validatedSegment.parsed_start >= validatedSegment.parsed_end) {
          throw new Error(`Start time >= end time for segment ${index + 1}`);
        }

        return validatedSegment;
      });

      // Validate and prepare music data
      const musicDataToUse = generatedSegmentMusic;
      const validatedMusicData = {};

      Object.entries(musicDataToUse).forEach(([indexStr, musicData]) => {
        const index = parseInt(indexStr);

        if (!musicData) {
          console.warn(`⚠️ Segment ${index + 1}: Music data is undefined`);
          return;
        }

        if (musicData.removed === true) {
          console.warn(`🚫 Segment ${index + 1}: Music is marked as removed`);
          return;
        }

        if (!musicData.audioUrl) {
          console.warn(`⚠️ Segment ${index + 1}: Missing audioUrl`);
          return;
        }

        const segmentStart = musicData.segmentStart ?? musicData.actualMusicTiming?.start ?? 0;
        const segmentEnd = musicData.segmentEnd ?? musicData.actualMusicTiming?.end ?? 30;
        const duration = segmentEnd - segmentStart;

        validatedMusicData[index] = {
          ...musicData,
          audioUrl: musicData.audioUrl,
          segmentStart,
          segmentEnd,
          customVolume: musicData.customVolume ?? (musicData.segment?.volume ?? 0.3),
          hasCustomVolume: musicData.hasCustomVolume || false,
          actualMusicTiming: musicData.actualMusicTiming || {
            start: segmentStart,
            end: segmentEnd,
            duration
          }
        };

        console.log(`✅ Segment ${index + 1}:`, {
          segmentStart,
          segmentEnd,
          duration,
          volume: validatedMusicData[index].customVolume,
          hasCustomVolume: validatedMusicData[index].hasCustomVolume,
          audioUrl: validatedMusicData[index].audioUrl
        });
      });

      if (Object.keys(validatedMusicData).length === 0) {
        throw new Error('No music data available for any segments');
      }

      // Create FormData for complete video generation
      const completeVideoFormData = new FormData();
      completeVideoFormData.append('video', selectedFile);
      completeVideoFormData.append('segments', JSON.stringify(validatedSegments));
      completeVideoFormData.append('musicData', JSON.stringify(validatedMusicData));
      completeVideoFormData.append('videoDuration', duration.toString());

      logToTerminal(`📤 Sending complete video request with ${Object.keys(validatedMusicData).length} music segments...`, 'info');

      const completeVideoResponse = await fetch(`${API_BASE_URL}/api/create-complete-video`, {
        method: 'POST',
        body: completeVideoFormData,
      });

      if (!completeVideoResponse.ok) {
        const errorData = await completeVideoResponse.json();
        throw new Error(errorData.error || 'Failed to create complete video');
      }

      const completeVideoResult = await completeVideoResponse.json();
      
      if (completeVideoResult.combinedUrl) {
        setCombinedVideoUrl(completeVideoResult.combinedUrl);
        setShowProcessedVideo(true);
        logToTerminal('✅ Complete video with all music segments created successfully!', 'success');
        
        // 🚨 NEW: Save the complete video to library BEFORE downloading
        try {
          logToTerminal('💾 Saving complete video to library...', 'info');
          
          const saveResponse = await fetch(`${API_BASE_URL}/api/save-complete-video`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: localStorage.getItem('userId'),
              title: `Complete Video ${new Date().toLocaleString()}`,
              videoUrl: completeVideoResult.combinedUrl,
              duration: duration,
              segmentCount: Object.keys(validatedMusicData).length,
              description: description || 'AI-generated complete video with music segments',
              processedSegments: validatedSegments.length
            })
          });

          if (saveResponse.ok) {
            const saveResult = await saveResponse.json();
            if (!saveResult.isDuplicate) {
              logToTerminal('✅ Complete video saved to library successfully!', 'success');
              showMessage(`Complete video created, saved to library, and downloading! (${Object.keys(validatedMusicData).length} music segments)`, 'success');
            } else {
              logToTerminal('ℹ️ Complete video already exists in library', 'info');
              showMessage(`Complete video created and downloading! (already in library)`, 'success');
            }
          } else {
            const saveError = await saveResponse.json();
            logToTerminal(`⚠️ Failed to save to library: ${saveError.error}`, 'warning');
            showMessage(`Complete video created and downloading! (library save failed)`, 'success');
          }
        } catch (saveError) {
          console.error('❌ Error saving to library:', saveError);
          logToTerminal(`⚠️ Library save error: ${saveError.message}`, 'warning');
          showMessage(`Complete video created and downloading! (library save failed)`, 'success');
        }
        
        // Automatically download the video
        logToTerminal('📥 Starting automatic download...', 'info');
        
        try {
          const downloadLink = document.createElement('a');
          downloadLink.href = completeVideoResult.combinedUrl;
          downloadLink.download = `complete_video_with_music_${Date.now()}.mp4`;
          downloadLink.style.display = 'none';
          
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          
          logToTerminal('✅ Download started! Check your downloads folder.', 'success');
          
        } catch (downloadError) {
          console.error('Download error:', downloadError);
          logToTerminal('⚠️ Download failed, but video is available for manual download', 'info');
          showMessage(`Complete video created and saved! (Download failed - use manual download)`, 'success');
          window.open(completeVideoResult.combinedUrl, '_blank');
        }
        
      } else {
        throw new Error('No combined video URL received');
      }

    } catch (error) {
      console.error('❌ Error creating complete video:', error);
      logToTerminal(`❌ Failed to create complete video: ${error.message}`, 'error');
      showMessage('Failed to create complete video. Please try again.', 'error');
    } finally {
      setIsGeneratingPreview(false);
    }
  }}
  disabled={isGeneratingPreview}
  style={{
    opacity: isGeneratingPreview ? 0.7 : 1,
    cursor: isGeneratingPreview ? 'not-allowed' : 'pointer'
  }}
>
  {isGeneratingPreview ? 'Creating & Downloading...' : 'Create & Download Video'}
</Button>
          </div>
        </div>
      </div>
    )}

    {showBulkGenerateConfirm && (
      <div style={{
        ...STYLES.modal.overlay,
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(4px)'
      }}>
        <div style={{
          ...STYLES.modal.container,
          width: '450px',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#2d3748',
            marginBottom: '1rem'
          }}>
            🎵 Generate Music for All Segments
          </h3>
          <p style={{
            color: '#718096',
            fontSize: '1.1rem',
            marginBottom: '2rem',
            lineHeight: 1.5
          }}>
            This will generate music for <strong>{bulkGenerateSegmentCount}</strong> remaining segments.
            This process may take several minutes.
          </p>
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center'
          }}>
            <Button
              variant="secondary"
              onClick={() => setShowBulkGenerateConfirm(false)}
            >
              Cancel
            </Button>
            
            <Button
              variant="primary"
              onClick={() => {
                setShowBulkGenerateConfirm(false);
                // Add the bulk generation logic here
              }}
            >
              Generate Music
            </Button>
          </div>
        </div>
      </div>
    )}
  </div>
)}

{/* 🚨 NEW: Music Analysis Section */}
{currentStep >= 2 && selectedFile && (
  <div className="step-section">

    
    
    {/* Analysis Results Display */}
    {showMusicAnalysis && musicAnalysis && (
      <div className="analysis-results" style={{ marginTop: '20px' }}>
        <div style={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <h3 style={{ color: '#495057', marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
            🎼 Detailed Music Analysis Results
            <span style={{ 
              fontSize: '12px', 
              backgroundColor: '#28a745', 
              color: 'white', 
              padding: '2px 8px', 
              borderRadius: '12px', 
              marginLeft: '10px' 
            }}>
              AI Generated
            </span>
          </h3>
          
          {/* Formatted Analysis Display */}
          <div 
            className="analysis-content"
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '6px',
              border: '1px solid #e9ecef',
              maxHeight: '500px',
              overflowY: 'auto',
              fontSize: '14px',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
            }}
          >
            {musicAnalysis}
          </div>
          
          {/* Action Buttons */}
          <div style={{ 
            marginTop: '15px', 
            display: 'flex', 
            gap: '10px', 
            flexWrap: 'wrap' 
          }}>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(musicAnalysis);
                showMessage('🎵 Music analysis copied to clipboard!', 'success');
              }}
              style={{
                padding: '10px 16px',
                backgroundColor: '#17a2b8',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              📋 Copy Full Analysis
            </button>
            
            <button 
              onClick={() => {
                // Extract just the music description parts for use in generation
                const musicDescriptions = musicAnalysis
                  .split('\n')
                  .filter(line => 
                    line.includes('BPM') || 
                    line.includes('Key') || 
                    line.includes('Genre') || 
                    line.includes('Mood') ||
                    line.includes('Instrument')
                  )
                  .join('\n');
                
                navigator.clipboard.writeText(musicDescriptions);
                showMessage('🎯 Key music parameters copied for generation!', 'success');
              }}
              style={{
                padding: '10px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              🎯 Copy Key Parameters
            </button>
            
            <button 
              onClick={() => {
                // Auto-fill the extra description field with analysis
                const descriptionField = document.querySelector('textarea[placeholder*="Describe"]');
                if (descriptionField) {
                  const summary = musicAnalysis.substring(0, 500) + '...';
                  descriptionField.value = summary;
                  showMessage('🎵 Music description auto-filled from analysis!', 'success');
                } else {
                  showMessage('Description field not found. Please copy manually.', 'warning');
                }
              }}
              style={{
                padding: '10px 16px',
                backgroundColor: '#fd7e14',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              ✏️ Auto-Fill Description
            </button>
            
            <button 
              onClick={() => setShowMusicAnalysis(false)}
              style={{
                padding: '10px 16px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              👁️ Hide Analysis
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
)}

{/* Add this CSS to your component's styles */}
<style jsx>{`
  .analysis-content h1,
  .analysis-content h2,
  .analysis-content h3 {
    color: #2c3e50 !important;
    margin: 20px 0 10px 0 !important;
    font-weight: bold !important;
  }
  
  .analysis-content h1 {
    font-size: 18px !important;
    border-bottom: 2px solid #3498db;
    padding-bottom: 5px;
  }
  
  .analysis-content h2 {
    font-size: 16px !important;
    color: #e74c3c !important;
  }
  
  .analysis-content h3 {
    font-size: 14px !important;
    color: #f39c12 !important;
  }
  
  .analysis-content strong,
  .analysis-content b {
    color: #2980b9 !important;
    font-weight: 600 !important;
  }
  
  .analysis-content ul,
  .analysis-content ol {
    margin-left: 20px !important;
    margin-bottom: 15px !important;
  }
  
  .analysis-content li {
    margin-bottom: 8px !important;
    line-height: 1.5 !important;
  }
  
  .analysis-content code {
    background-color: #f1f2f6 !important;
    padding: 2px 6px !important;
    border-radius: 3px !important;
    font-family: 'Monaco', 'Consolas', monospace !important;
    color: #e74c3c !important;
  }
  
  .step-section {
    margin-bottom: 30px;
    padding: 20px;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .step-section h2 {
    color: #2c3e50;
    margin-bottom: 10px;
    font-size: 24px;
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .analysis-results {
    animation: fadeInUp 0.5s ease-out;
  }
`}</style>
        {/* Step 4: Results */}
     {/* Step 4: Results with Spotify Players */}
{currentStep === 4 && tracks.length > 0 && (
  <div style={{
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  }}>
    <div style={{
      textAlign: 'center',
      marginBottom: '3rem'
    }}>
      <h2 style={{
        color: 'white',
        fontSize: '2.5rem',
        fontWeight: 700,
        marginBottom: '1rem'
      }}>
        🎉 Music Generated Successfully!
      </h2>
      <p style={{
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: '1.2rem',
        margin: 0
      }}>
        Your AI-generated tracks are ready to play and download
      </p>
    </div>

    {/* Render Spotify Players for each track when renderMusicVideo is FALSE */}
    {!renderMusicVideo ? (
      tracks.map((track, index) => {
        if (!audioRefs.current[index]) audioRefs.current[index] = React.createRef();
        
        const audioUrl = track.audioUrl || track.url || track.audio_url;
        const trackTitle = track.trackName || track.title || `Track ${index + 1}`;
        
        return (
          <SpotifyLikePlayer
            key={index}
            track={track}
            isPlaying={currentlyPlaying?.index === index && isPlaying}
            currentTime={currentlyPlaying?.index === index ? currentTime : 0}
            duration={trackDuration || 221}
            onPlay={() => {
              // Stop other tracks
              if (currentlyPlaying && currentlyPlaying.index !== index) {
                const prevAudio = audioRefs.current[currentlyPlaying.index]?.current;
                if (prevAudio) prevAudio.pause();
              }
              
              // Play this track
              const audio = audioRefs.current[index]?.current;
              if (audio) {
                audio.play();
                setCurrentlyPlaying({ track, index });
                setIsPlaying(true);
              }
            }}
            onPause={() => {
              const audio = audioRefs.current[index]?.current;
              if (audio) {
                audio.pause();
                setIsPlaying(false);
              }
            }}
            onSeek={(time) => {
              const audio = audioRefs.current[index]?.current;
              if (audio) {
                audio.currentTime = time;
                setCurrentTime(time);
              }
            }}
            onPlayInterval={() => handlePlayInterval(track, index)}
            onDownloadInterval={() => handleDownloadInterval(track, index)}
            onUseForVideo={() => {
              setSelectedTrack(track);
              setCurrentStep(2);
            }}
            intervalStart={track.start}
            intervalEnd={track.end}
            intervalDuration={track.duration }
          />
        );
      })
    ) : (
      // Original track display for when renderMusicVideo is TRUE
      tracks.map((track, index) => {
        // ... your existing track display code for video mode
      })
    )}

    {/* Hidden audio elements */}
    {tracks.map((track, index) => (
      <audio
        key={index}
        ref={audioRefs.current[index]}
        src={track.audioUrl || track.url || track.audio_url}
        onTimeUpdate={(e) => {
          if (currentlyPlaying?.index === index) {
            setCurrentTime(e.target.currentTime);
          }
        }}
        onLoadedMetadata={(e) => {
          setTrackDuration(e.target.duration);
        }}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentlyPlaying(null);
        }}
        style={{ display: 'none' }}
      />
    ))}

    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
      <Button 
        variant="danger" 
        onClick={handleStartOver}
        style={{ fontSize: '1.2rem', padding: '1.5rem 3rem' }}
      >
        🔄 Start Over
      </Button>
    </div>
  </div>
)}

        {/* Step 5: Video Preview with Volume Control */}
    {/* Step 5: Professionally Redesigned Video Preview with Volume Control */}



{currentStep === 5 && (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2rem',
    padding: '2rem',
    boxSizing: 'border-box'
  }}>
    {/* ClipTune Header */}
    <div style={{
      textAlign: 'center',
      marginBottom: '1rem'
    }}>
      <h1 style={{
        fontSize: '4rem',
        fontWeight: 'bold',
        color: 'white',
        textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
        margin: 0,
        letterSpacing: '2px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        ClipTune
      </h1>
    </div>

    {/* Loading State */}
    {isGeneratingPreview && (
      <div style={{ 
        textAlign: 'center'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          border: '6px solid rgba(255, 255, 255, 0.2)',
          borderTop: '6px solid #667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 2rem'
        }} />
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: 600,
          color: '#667eea',
          marginBottom: '0.5rem',
          margin: 0
        }}>
          {isGeneratingPreview ? 'Updating Volume...' : 'Creating Your Video'}
        </h3>
        <p style={{ 
          fontSize: '1.1rem', 
          color: 'rgba(255, 255, 255, 0.7)',
          margin: 0
        }}>
          {isGeneratingPreview ? 'Please wait while we adjust the music volume...' : 'Please wait while we combine your music with the video...'}
        </p>
      </div>
    )}

    {/* Video Player and Volume Control Container */}
   {/* Volume Control Section - Made More Compact */}
{!isGeneratingPreview && combinedVideoUrl && (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
    width: '100%',
    maxWidth: '900px'
  }}>
    {/* Video Player */}
    <video
      src={combinedVideoUrl}
      controls
      style={{
        width: '90vw',
        maxWidth: '800px',
        maxHeight: '60vh',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)'
      }}
    />

    {/* Compact Volume Control Section */}
    <div style={{
      width: '100%',
      maxWidth: '400px', // Reduced from 500px
      background: 'rgba(30, 41, 59, 0.9)',
      backdropFilter: 'blur(20px)',
      borderRadius: '12px', // Reduced from 16px
      padding: '1rem', // Reduced from 1.5rem
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)' // Reduced shadow
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.75rem' // Reduced from 1rem
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem', // Reduced from 0.75rem
          fontSize: '0.95rem', // Reduced from 1.1rem
          color: '#e2e8f0',
          fontWeight: 600
        }}>
          <span style={{ fontSize: '1.2rem' }}>🎵</span>
          Volume
        </div>
        <div style={{
          fontSize: '0.95rem', // Reduced from 1.1rem
          fontWeight: 'bold',
          padding: '0.4rem 0.8rem', // Reduced padding
          borderRadius: '6px', // Reduced from 8px
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          minWidth: '60px', // Reduced from 70px
          textAlign: 'center'
        }}>
          {Math.round(previewMusicVolume * 100)}%
        </div>
      </div>
      
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={previewMusicVolume}
        onChange={(e) => {
          const newVolume = parseFloat(e.target.value);
          handleVolumeChange(newVolume);
        }}
        disabled={isGeneratingPreview}
        style={{
          width: '100%',
          height: '6px', // Reduced from 8px
          borderRadius: '3px', // Reduced from 4px
          background: `linear-gradient(to right, #667eea 0%, #667eea ${previewMusicVolume * 100}%, #4b5563 ${previewMusicVolume * 100}%, #4b5563 100%)`,
          outline: 'none',
          cursor: isGeneratingPreview ? 'not-allowed' : 'pointer',
          WebkitAppearance: 'none',
          appearance: 'none',
          opacity: isGeneratingPreview ? 0.5 : 1
        }}
      />
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.8rem', // Reduced from 0.9rem
        color: '#94a3b8',
        marginTop: '0.5rem' // Reduced from 0.75rem
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          🔇 <span>0%</span>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          🔊 <span>100%</span>
        </span>
      </div>
    </div>
  </div>
)}

{/* Action Buttons - Now with more space */}
{!isGeneratingPreview && combinedVideoUrl && (
  <div style={{
    display: 'flex',
    gap: '1.5rem',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: '1rem' // Added margin top for better spacing
  }}>
    {/* Save Button */}
    {!hasBeenSaved ? (
      <button
        onClick={handleManualSave}
        style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          border: 'none',
          padding: '1.2rem 2.5rem',
          borderRadius: '50px',
          fontSize: '1.1rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          letterSpacing: '0.5px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(16, 185, 129, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(16, 185, 129, 0.3)';
        }}
      >
        <span style={{ fontSize: '1.2rem' }}>💾</span>
        Save Combined Video
      </button>
    ) : (
      <div style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        padding: '1.2rem 2.5rem',
        borderRadius: '50px',
        fontSize: '1.1rem',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
        letterSpacing: '0.5px'
      }}>
        <span style={{ fontSize: '1.2rem' }}>✅</span>
        Video Saved Successfully!
      </div>
    )}
    
    {/* Download Button */}
    <button
      onClick={handleFinalDownload}
      disabled={isGeneratingPreview}
      style={{
        background: isGeneratingPreview 
          ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
          : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
        color: 'white',
        border: 'none',
        padding: '1.2rem 2.5rem',
        borderRadius: '50px',
        fontSize: '1.1rem',
        fontWeight: 600,
        cursor: isGeneratingPreview ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        boxShadow: isGeneratingPreview 
          ? '0 8px 25px rgba(156, 163, 175, 0.3)'
          : '0 8px 25px rgba(5, 150, 105, 0.3)',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        opacity: isGeneratingPreview ? 0.7 : 1,
        letterSpacing: '0.5px'
      }}
      onMouseEnter={(e) => {
        if (!isGeneratingPreview) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 12px 35px rgba(5, 150, 105, 0.4)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isGeneratingPreview) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(5, 150, 105, 0.3)';
        }
      }}
    >
      <span style={{ fontSize: '1.2rem' }}>
        {isGeneratingPreview ? '⏳' : '⬇️'}
      </span>
      {isGeneratingPreview ? 'Preparing Download...' : 'Download Video'}
    </button>
  </div>
)}

{/* Updated CSS for smaller slider thumb */}
<style>{`
  input[type="range"]::-webkit-slider-thumb {
    appearance: none;
    height: 16px; /* Reduced from 20px */
    width: 16px; /* Reduced from 20px */
    border-radius: 50%;
    background: white;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    border: 2px solid #667eea;
  }

  input[type="range"]::-moz-range-thumb {
    height: 16px; /* Reduced from 20px */
    width: 16px; /* Reduced from 20px */
    border-radius: 50%;
    background: white;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    border: 2px solid #667eea;
  }

  input[type="range"]:disabled::-webkit-slider-thumb {
    cursor: not-allowed;
    opacity: 0.5;
  }

  input[type="range"]:disabled::-moz-range-thumb {
    cursor: not-allowed;
    opacity: 0.5;
  }
`}</style>

    {/* Action Buttons */}
    {!isGeneratingPreview && combinedVideoUrl && (
      <div style={{
        display: 'flex',
        gap: '1.5rem',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        {/* Save Button */}
        {!hasBeenSaved ? (
          <button
            onClick={handleManualSave}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              padding: '1.2rem 2.5rem',
              borderRadius: '50px',
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              letterSpacing: '0.5px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(16, 185, 129, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(16, 185, 129, 0.3)';
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>💾</span>
            Save Combined Video
          </button>
        ) : (
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            padding: '1.2rem 2.5rem',
            borderRadius: '50px',
            fontSize: '1.1rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
            letterSpacing: '0.5px'
          }}>
            <span style={{ fontSize: '1.2rem' }}>✅</span>
            Video Saved Successfully!
          </div>
        )}
        
        {/* Download Button */}
        <button
          onClick={handleFinalDownload}
          disabled={isGeneratingPreview}
          style={{
            background: isGeneratingPreview 
              ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
              : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            color: 'white',
            border: 'none',
            padding: '1.2rem 2.5rem',
            borderRadius: '50px',
            fontSize: '1.1rem',
            fontWeight: 600,
            cursor: isGeneratingPreview ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            boxShadow: isGeneratingPreview 
              ? '0 8px 25px rgba(156, 163, 175, 0.3)'
              : '0 8px 25px rgba(5, 150, 105, 0.3)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            opacity: isGeneratingPreview ? 0.7 : 1,
            letterSpacing: '0.5px'
          }}
          onMouseEnter={(e) => {
            if (!isGeneratingPreview) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(5, 150, 105, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isGeneratingPreview) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(5, 150, 105, 0.3)';
            }
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>
            {isGeneratingPreview ? '⏳' : '⬇️'}
          </span>
          {isGeneratingPreview ? 'Preparing Download...' : 'Download Video'}
        </button>
      </div>
    )}

    {/* Add CSS for the custom slider styling */}
    <style>{`
      input[type="range"]::-webkit-slider-thumb {
        appearance: none;
        height: 20px;
        width: 20px;
        border-radius: 50%;
        background: white;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        border: 2px solid #667eea;
      }

      input[type="range"]::-moz-range-thumb {
        height: 20px;
        width: 20px;
        border-radius: 50%;
        background: white;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        border: 2px solid #667eea;
      }

      input[type="range"]:disabled::-webkit-slider-thumb {
        cursor: not-allowed;
        opacity: 0.5;
      }

      input[type="range"]:disabled::-moz-range-thumb {
        cursor: not-allowed;
        opacity: 0.5;
      }
    `}</style>
  </div>
)}
</div>

      {/* Video Editing Modal */}
      {showVideoEditModal && (
        <div style={{
          ...STYLES.modal.overlay,
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            ...STYLES.modal.container,
            width: '1100px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <button
              onClick={handleStartOver}
              style={STYLES.modal.closeButton}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f4f8'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              ×
            </button>

            <div style={{ textAlign: 'center', marginBottom: '3rem', width: '100%' }}>
              <h2 style={STYLES.modal.title}>
                ✂️ Select Video Segment
              </h2>
              <p style={STYLES.modal.subtitle}>
                Choose the exact portion of your video to generate music from
              </p>
            </div>

            {/* Video Preview Container */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              marginBottom: '3rem'
            }}>
              <div style={{
                width: '70%',
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center'
              }}>
                <video
                  ref={videoPreviewRef}
                  src={videoUrl}
                  controls
                  style={{
                    width: '100%',
                    maxHeight: '400px',
                    borderRadius: '16px',
                    boxShadow: '0 15px 50px rgba(0, 0, 0, 0.3)'
                  }}
                />
              </div>
            </div>

            {/* Loading Indicator */}
            {isLoadingVideoData && (
                <div style={{ textAlign: 'center', padding: '3rem 0', width: '100%' }}>
                    <div style={{
                        border: '4px solid #4A5568',
                        borderTop: '4px solid #4299E1',
                        borderRadius: '50%',
                        width: '60px',
                        height: '60px',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 2rem'
                    }} />
                    <p style={{ fontSize: '1.1rem', color: '#A0AEC0' }}>
                        Analyzing video and generating timeline...
                    </p>
                </div>
            )}

            {/* Timeline */}
            {!isLoadingVideoData && thumbnails.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  ref={trackRef}
                  style={{
                    position: 'relative',
                    width: THUMB_WIDTH * NUM_THUMBS,
                    height: THUMB_HEIGHT,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    userSelect: 'none',
                    background: '#1A202C',
                    boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  {/* Thumbnails */}
                  <div style={{ display: 'flex', height: '100%' }}>
                    {thumbnails.map((thumb, i) => (
                      <img key={i} src={thumb} style={{ width: THUMB_WIDTH, height: THUMB_HEIGHT, objectFit: 'cover' }} alt={`thumb-${i}`} />
                    ))}
                  </div>

                  {/* Selection overlay */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: startX,
                    width: endX - startX,
                    height: '100%',
                    background: 'rgba(66, 153, 225, 0.4)',
                    borderLeft: '3px solid #4299E1',
                    borderRight: '3px solid #4299E1',
                    pointerEvents: 'none',
                    boxSizing: 'border-box'
                  }} />

                  {/* Start handle */}
                  <div
              onMouseDown={createDragHandlerWithOverlapDetection("start")}
                  >
                    <span style={{color: 'white', transform: 'rotate(90deg)', fontSize: '10px'}}>|||</span>
                  </div>

                  {/* End handle */}
                  <div
                   onMouseDown={createDragHandlerWithOverlapDetection("end")}

                  >
                    <span style={{color: 'white', transform: 'rotate(90deg)', fontSize: '10px'}}>|||</span>
                  </div>
                </div>

                {/* Time indicators */}
                <div style={{
                display: 'grid',
                  gridTemplateColumns: '1fr auto 1fr',
                  gap: '1.5rem',
                  alignItems: 'center',
                  marginTop: '2rem',
                  width: THUMB_WIDTH * NUM_THUMBS,
                  color: '#E2E8F0'
                }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem 1rem', borderRadius: '12px', textAlign: 'center' }}>
                    <strong>Start:</strong> {formatTime(startTime)}
                  </div>
                  <div style={{ 
                    background: '#000000', 
                    padding: '1rem 1.5rem', 
                    borderRadius: '0px', 
                    fontWeight: '500', 
                    color: 'white',
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                    fontSize: '1.1rem',
                    letterSpacing: '0.5px'
                  }}>
                    Duration: {formatTime(selectionDuration)}
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem 1rem', borderRadius: '12px', textAlign: 'center' }}>
                    <strong>End:</strong> {formatTime(endTime)}
                  </div>
                </div>

                {/* Proceed Button */}
                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                  <Button
                    variant="primary"
                    onClick={handleVideoEditConfirm}
                    style={{
                      background: '#28a745',
                      fontSize: '1.1rem',
                      padding: '1.25rem 2.5rem',
                      borderRadius: '0px',
                      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                      fontWeight: '500',
                      letterSpacing: '1px',
                      textTransform: 'uppercase'
                    }}
                  >
                    Confirm
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

        {/* Configuration Modal */}
 

{/* Configuration Modal */}
{showConfigModal && (
  <div style={{
    ...STYLES.modal.overlay,
    background: 'rgba(20, 24, 31, 0.85)',
    backdropFilter: 'blur(6px)'
  }}>
    <div style={{
      ...STYLES.modal.container,
      width: '480px',
      background: 'linear-gradient(135deg, #23272f 0%, #1a202c 100%)',
      border: 'none',
      boxShadow: '0 8px 40px rgba(0,0,0,0.45)',
      padding: '2.5rem 2.5rem 2rem 2.5rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
    
      <button
        onClick={() => setShowConfigModal(false)}
        style={{
          position: 'absolute',
          top: '0.01rem',
          right: '1.5rem',
          background: 'none',
          border: 'none',
          fontSize: '1.7rem',
          color: '#a0aec0',
          cursor: 'pointer',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#23272f'}
        onMouseLeave={e => e.currentTarget.style.background = 'none'}
      >
        ×
      </button>
     

      {/* 🚨 NEW: Track Name Field */}
      <div style={{ width: '100%', marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block',
          fontSize: '1rem',
          fontWeight: 600,
          color: '#cbd5e1',
          marginBottom: '0.5rem',
          letterSpacing: '0.2px',
          textAlign: 'center'
        }}>
          🎶 Track Name <span style={{color:'#4299e1', fontWeight:400, fontSize:'0.95em'}}>(required)</span>
        </label>
        <input
          type="text"
          value={trackName || ''}
          onChange={e => setTrackName(e.target.value)}
          placeholder="Enter your track name (e.g., 'Epic Adventure Theme', 'Calm Morning Vibes')"
          style={{
            width: '100%',
            padding: '0.85rem 1rem',
            border: '1.5px solid #2d3748',
            borderRadius: '8px',
            fontSize: '1rem',
            background: '#23272f',
            color: '#e2e8f0',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            transition: 'border 0.2s',
            outline: 'none',
            marginBottom: 0
          }}
          onFocus={e => e.target.style.border = '1.5px solid #4299e1'}
          onBlur={e => e.target.style.border = '1.5px solid #2d3748'}
        />
        <div style={{
          fontSize: '0.75rem',
          color: '#718096',
          marginTop: '0.25rem',
          textAlign: 'center',
          fontStyle: 'italic'
        }}>
          This will be the name of your generated soundtrack
        </div>
      </div>

   
      {/* Extra Description */}
    
     
      
      {/* Render Music Video Checkbox */}
      <div style={{
        marginBottom: '2.2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.8rem',
        background: 'rgba(56, 161, 105, 0.07)',
        padding: '1.1rem 1.5rem',
        borderRadius: '12px',
        border: '1.5px solid #2d3748',
        width: '100%'
      }}>
        <input
          type="checkbox"
          id="renderMusicVideo"
          checked={renderMusicVideo}
          onChange={e => setRenderMusicVideo(e.target.checked)}
          style={{
            width: '22px',
            height: '22px',
            cursor: 'pointer',
            accentColor: '#38a169',
            marginRight: '0.5rem'
          }}
        />
        <label htmlFor="renderMusicVideo" style={{
          color: '#e2e8f0',
          fontWeight: 500,
          fontSize: '1.08rem',
          cursor: 'pointer',
          marginBottom: 0
        }}>
          🎬 Render Music With Video
        </label>
      </div>

      {/* Generate Button */}
      <div style={{ width: '100%', textAlign: 'center', marginTop: '0.5rem' }}>
        <Button
          variant="primary"
          onClick={() => {
            // 🚨 NEW: Validate track name before proceeding
            if (!trackName || trackName.trim() === '') {
              showMessage('Please enter a track name before generating music', 'error');
              return;
            }
            handleGenerate();
          }}
          disabled={isProcessing}
          style={{
            fontSize: '1.15rem',
            padding: '1.1rem 0',
            width: '100%',
            borderRadius: '8px',
            background: isProcessing 
              ? 'linear-gradient(90deg, #6b7280 0%, #4b5563 100%)'
              : 'linear-gradient(90deg, #4299e1 0%, #667eea 100%)',
            color: 'white',
            fontWeight: 700,
            letterSpacing: '1px',
            boxShadow: '0 2px 12px rgba(66,153,225,0.13)',
            border: 'none',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            opacity: isProcessing ? 0.7 : 1
          }}
        >
          {isProcessing ? (
            <>
              <span style={{ 
                display: 'inline-block', 
                width: '16px', 
                height: '16px', 
                border: '2px solid transparent',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginRight: '0.5rem'
              }} />
              Generating "{trackName || 'Your Track'}"...
            </>
          ) : (
            <> Generate </>
          )}
        </Button>
      </div>

      {/* Helper Text */}
      <div style={{
        marginTop: '1rem',
        fontSize: '0.8rem',
        color: '#718096',
        textAlign: 'center',
        lineHeight: 1.4
      }}>
        💡 <strong>Tip:</strong> The more detailed your description, the better your AI-generated soundtrack will match your vision!
      </div>
    </div>
  </div>
)}
{/* Timeline Editor Modal */}
{showTimelineEditor && (
  <div style={{
    ...STYLES.modal.overlay,
    background: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(3px)'
  }}>
    <div style={{
      ...STYLES.modal.container,
      width: '1100px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      // 🚨 CHANGED: From white to dark gradient background like main screen
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
      color: 'white' // Added to ensure text is visible on dark background
    }}>
      <button
        onClick={() => setShowTimelineEditor(false)}
        style={{
          ...STYLES.modal.closeButton,
          color: 'rgba(255, 255, 255, 0.7)' // Changed close button color for dark background
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        ×
      </button>

      <div style={{ textAlign: 'center', marginBottom: '3rem', width: '100%' }}>
        <h2 style={{
          ...STYLES.modal.title,
          color: 'white' // Changed title color for dark background
        }}>
          ✂️ Set Video Timeline
        </h2>
        <p style={{
          ...STYLES.modal.subtitle,
          color: 'rgba(255, 255, 255, 0.8)' // Changed subtitle color for dark background
        }}>
          Choose the exact portion of your video for music generation
        </p>
      </div>

      {/* Video Preview Container */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginBottom: '3rem'
      }}>
        <div style={{
          width: '70%',
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <video
            ref={videoPreviewRef}
            src={videoUrl}
            controls
            style={{
              width: '100%',
              maxHeight: '400px',
              borderRadius: '16px',
              boxShadow: '0 15px 50px rgba(0, 0, 0, 0.3)'
            }}
          />
        </div>
      </div>

      {/* Timeline */}
      {!isLoadingVideoData && thumbnails.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            ref={trackRef}
            style={{
              position: 'relative',
              width: THUMB_WIDTH * NUM_THUMBS,
              height: THUMB_HEIGHT,
              borderRadius: '12px',
              overflow: 'hidden',
              userSelect: 'none',
              background: '#1A202C',
              boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* Thumbnails */}
            <div style={{ display: 'flex', height: '100%' }}>
              {thumbnails.map((thumb, i) => (
                <img key={i} src={thumb} style={{ width: THUMB_WIDTH, height: THUMB_HEIGHT, objectFit: 'cover' }} alt={`thumb-${i}`} />
              ))}
            </div>

            {/* Selection overlay */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: startX,
              width: endX - startX,
              height: '100%',
              background: 'rgba(66, 153, 225, 0.4)',
              borderLeft: '3px solid #4299E1',
              borderRight: '3px solid #4299E1',
              pointerEvents: 'none',
              boxSizing: 'border-box'
            }} />

            {/* Start handle */}
            <div
              style={{
                position: 'absolute',
                left: startX - 8,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 16,
                height: 'calc(100% + 16px)',
                background: '#4299E1',
                cursor: 'ew-resize',
                borderRadius: '6px',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(66, 153, 225, 0.5)'
              }}
              onMouseDown={createDragHandler("start")}
            >
              <span style={{color: 'white', transform: 'rotate(90deg)', fontSize: '10px'}}>|||</span>
            </div>

            {/* End handle */}
            <div
              style={{
                position: 'absolute',
                left: endX - 8,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 16,
                height: 'calc(100% + 16px)',
                background: '#4299E1',
                cursor: 'ew-resize',
                borderRadius: '6px',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(66, 153, 225, 0.5)'
              }}
              onMouseDown={createDragHandler("end")}
            >
              <span style={{color: 'white', transform: 'rotate(90deg)', fontSize: '10px'}}>|||</span>
            </div>
          </div>

          {/* Time indicators */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            gap: '1.5rem',
            alignItems: 'center',
            marginTop: '2rem',
            width: THUMB_WIDTH * NUM_THUMBS,
            color: '#E2E8F0'
          }}>
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', // Made slightly more visible on dark background
              padding: '0.75rem 1rem', 
              borderRadius: '12px', 
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.1)' // Added subtle border
            }}>
              <strong>Start:</strong> {formatTime(startTime)}
            </div>
            <div style={{ 
              background: '#4299E1', 
              padding: '1rem 1.5rem', 
              borderRadius: '12px', 
              fontWeight: '500', 
              color: 'white',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontSize: '1.1rem',
              letterSpacing: '0.5px'
            }}>
              Duration: {formatTime(selectionDuration)}
            </div>
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', // Made slightly more visible on dark background
              padding: '0.75rem 1rem', 
              borderRadius: '12px', 
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.1)' // Added subtle border
            }}>
              <strong>End:</strong> {formatTime(endTime)}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ 
            textAlign: 'center', 
            marginTop: '3rem',
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center'
          }}>
            <Button
              variant="secondary"
              onClick={() => setShowTimelineEditor(false)}
              style={{
                fontSize: '1.1rem',
                padding: '1.25rem 2rem'
              }}
            >
              Cancel
            </Button>
            
            <Button
              variant="success"
              onClick={() => {
                // Save the timeline settings
                const [start, end] = getTrimRange();
                
                // 🚨 FIXED: Only collect chat messages for customPrompt (NO video segment info)
                const userChatMessages = chatHistory
                  .filter(msg => msg.type === 'user')
                  .map(msg => msg.message);
                
                // Set description to ONLY chat messages (for customPrompt)
                if (userChatMessages.length > 0) {
                  const chatOnlyDescription = userChatMessages.join('. ');
                  setDescription(chatOnlyDescription); // This goes to customPrompt
                  console.log('📝 Chat-only description for customPrompt:', chatOnlyDescription);
                } else {
                  setDescription(''); // No chat = empty customPrompt
                }
                
                // Save video segment info separately (NOT in customPrompt)
                setSavedVideoSegment({
                  startTime: formatTime(start),
                  endTime: formatTime(end),
                  duration: Math.round(end - start),
                  start: start,
                  end: end
                  // No description field here - we handle chat separately
                });
                
                setShowTimelineEditor(false);
                
                // Show user feedback
                if (userChatMessages.length > 0) {
                  const confirmMessage = {
                    id: Date.now(),
                    type: 'ai',
                    message: `✅ Timeline saved! Your chat messages "${userChatMessages.join(', ')}" will be used for music style. Video segment: ${formatTime(start)} - ${formatTime(end)}.`,
                    timestamp: new Date().toLocaleTimeString()
                  };
                  setChatHistory(prev => [...prev, confirmMessage]);
                  showMessage('Timeline and chat messages saved!', 'success');
                } else {
                  showMessage('Timeline saved! Add music style in chat for better results.', 'success');
                }
              }}
              style={{
                background: '#28a745',
                fontSize: '1.1rem',
                padding: '1.25rem 2rem'
              }}
            >
              ✅ Set Timeline
            </Button>
          </div>
        </div>
      )}
    </div>
  </div>
)}
      {/* Message Pop-up */}
      {message.text && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          background: message.type === 'error' ? '#f56565' : message.type === 'success' ? '#48bb78' : '#667eea',
          color: 'white',
          padding: '1.5rem 2.5rem',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          zIndex: 1001,
          fontWeight: 600,
          fontSize: '1.1rem',
          opacity: 0.95,
          animation: 'fadeIn 0.3s ease-out',
          textAlign: 'center',
          maxWidth: '500px'
        }}>
          {message.text}
        </div>
      )}
      
      {/* Fixed downloutton at the bottom of the page when renderMusicVideo is true and tracks are available */}
    
    </div>
  );
}

export default App;