
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

// Helper to get user key for localStorage
function getRecentTracksKey(user) {
  // Replace with your actual user identifier logic
  // e.g., user?.email or user?.id
  return user && user.email ? `recentTracks_${user.email}` : 'recentTracks_guest';
}

const App = () => {
  const navigate = useNavigate();
  // Current step in the workflow
  const [currentStep, setCurrentStep] = useState(1); // 1: Upload, 2: Video Edit, 4: Results, 5: Combined Video Preview

  // State variables for managing component data and UI
  // Add this line with your other useState declarations
  // Full video analysis state
  const [segmentMusicGeneration, setSegmentMusicGeneration] = useState({});
const [generatedSegmentMusic, setGeneratedSegmentMusic] = useState({});
const [playingSegment, setPlayingSegment] = useState(null);
const [isAnalyzingFullVideo, setIsAnalyzingFullVideo] = useState(false);
const [videoSegments, setVideoSegments] = useState([]);
const [showFullVideoAnalysis, setShowFullVideoAnalysis] = useState(false);
  const [showDropdownMenu, setShowDropdownMenu] = useState(false);
  const [hasBeenSaved, setHasBeenSaved] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState([]);
const terminalRef = useRef(null);

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
const [bulkGenerateSegmentCount, setBulkGenerateSegmentCount] = useState(0);
const [completeVideoSegmentCount, setCompleteVideoSegmentCount] = useState(0);

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

  // Modal control states
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showVideoEditModal, setShowVideoEditModal] = useState(false);

  // Timeline-related state
  const [duration, setDuration] = useState(0);
  const [thumbnails, setThumbnails] = useState([]);
  const [startX, setStartX] = useState(0);
  const [endX, setEndX] = useState(THUMB_WIDTH * NUM_THUMBS);
  const [lastDragged, setLastDragged] = useState("start");
  const [isLoadingVideoData, setIsLoadingVideoData] = useState(false);

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // State for currently playing track
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [trackDuration, setTrackDuration] = useState(0);

  // State for scroll-based player visibility
  const [lastScrollY, setLastScrollY] = useState(0);
  const [playerVisible, setPlayerVisible] = useState(true);
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

  // Base URL for the backend API
  const API_BASE_URL = 'http://localhost:3001';
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
const parseClipTuneTime = (timeString) => {
  if (!timeString) return 0;
  
  // Handle both string and number inputs
  if (typeof timeString === 'number') return timeString;
  
  // Handle string format like "5.2" or "10.5" (seconds with decimal)
  if (typeof timeString === 'string' && !timeString.includes(':')) {
    return parseFloat(timeString) || 0;
  }
  
  // Handle MM:SS or HH:MM:SS format
  const parts = timeString.split(':').map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1]; // MM:SS
  }
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2]; // HH:MM:SS
  }
  
  return 0; // Default fallback
};
// Add these functions to your ClipTuneGenerator.js file

// Function to regenerate complete video with updated volumes
const regenerateCompleteVideoWithVolumes = async () => {
  if (!selectedFile || !processedVideoResult || !processedVideoResult.segments) {
    showMessage('Cannot regenerate video - missing data', 'error');
    return;
  }

  try {
    setIsGeneratingPreview(true);
    logToTerminal('🎚️ Regenerating complete video with updated volumes...', 'info');

    // Log current volume settings for debugging
    console.log('🎚️ Current volume settings:', generatedSegmentMusic);
    
    // Debug volume info
    processedVideoResult.segments.forEach((segment, index) => {
      const effectiveVol = getEffectiveVolume(index, segment);
      const hasCustom = generatedSegmentMusic[index]?.hasCustomVolume;
      logToTerminal(`   Segment ${index + 1}: ${Math.round(effectiveVol * 100)}% ${hasCustom ? '(Custom)' : '(AI)'}`, 'info');
    });

    // Create FormData with current volume settings
    const completeVideoFormData = new FormData();
    completeVideoFormData.append('video', selectedFile);
    completeVideoFormData.append('segments', JSON.stringify(processedVideoResult.segments));
    completeVideoFormData.append('musicData', JSON.stringify(generatedSegmentMusic));
    completeVideoFormData.append('videoDuration', duration.toString());

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
      logToTerminal('✅ Complete video regenerated with new volumes!', 'success');
      showMessage('Video updated with new volume settings!', 'success');
    } else {
      throw new Error('No combined video URL received');
    }

  } catch (error) {
    logToTerminal(`❌ Failed to regenerate video: ${error.message}`, 'error');
    showMessage('Failed to update video volumes. Please try again.', 'error');
  } finally {
    setIsGeneratingPreview(false);
  }
};
const handleVolumeChangeWithRegeneration = useCallback(
  debounce(async () => {
    await regenerateCompleteVideoWithVolumes();
  }, 2000), // Wait 2 seconds after last volume change
  [selectedFile, processedVideoResult, generatedSegmentMusic, duration]
);

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
const handleSegmentVolumeChange = (segmentIndex, newVolume) => {
  const volumeValue = parseFloat(newVolume);
  
  console.log(`🎚️ Setting custom volume for segment ${segmentIndex + 1}: ${volumeValue}`);
  
  // ALWAYS set custom volume, even if it's 0 or lower than AI suggestion
  setGeneratedSegmentMusic(prev => ({
    ...prev,
    [segmentIndex]: {
      ...prev[segmentIndex],
      customVolume: volumeValue, // This will override AI suggestion
      hasCustomVolume: true // Flag to indicate user has made a change
    }
  }));
  
  logToTerminal(`🎚️ Custom volume set: Segment ${segmentIndex + 1} = ${Math.round(volumeValue * 100)}%`, 'info');
  
  // Trigger regeneration
  handleVolumeChangeWithRegeneration();
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
const jumpToClipTuneSegment = (segment) => {
  const segmentStartTime = parseFloat(segment.start_time || 0);
  const segmentEndTime = parseFloat(segment.end_time || segmentStartTime + 30);
  const width = THUMB_WIDTH * NUM_THUMBS;
  
  if (duration > 0) {
    const startPos = (segmentStartTime / duration) * width;
    const endPos = (segmentEndTime / duration) * width;
    setStartX(Math.max(0, startPos));
    setEndX(Math.min(width, endPos));
    
    // Also jump video to that time
    if (videoPreviewRef.current) {
      videoPreviewRef.current.currentTime = segmentStartTime;
    }
    
    // Log the action
    logToTerminal(`🎯 Jumped to ClipTune segment: ${formatTimeFromSeconds(segmentStartTime)} - ${formatTimeFromSeconds(segmentEndTime)}`, 'info');
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
// REPLACE your generateMusicForSegment function with this fixed version

// REPLACE your entire generateMusicForSegment function with this updated version:

const generateMusicForSegment = async (segment, segmentIndex) => {
  try {
    // Set loading state for this specific segment
    setSegmentMusicGeneration(prev => ({
      ...prev,
      [segmentIndex]: true
    }));
    
    logToTerminal(`🎵 Generating music for segment ${segmentIndex + 1}...`, 'info');
    logToTerminal(`🎯 Using AI description: ${segment.music_details || segment.music_summary}`, 'info');
    
    if (!selectedFile) {
      throw new Error('No video file available');
    }

    // Get segment timing
    const segmentStart = parseFloat(segment.start_time || 0);
    const segmentEnd = parseFloat(segment.end_time || segmentStart + 30);
    const segmentDuration = segmentEnd - segmentStart;
    
    logToTerminal(`⏱️ Segment: ${formatTimeFromSeconds(segmentStart)} to ${formatTimeFromSeconds(segmentEnd)} (${formatTimeFromSeconds(segmentDuration)})`, 'info');

    // 🚨 NEW: Use the separate music generation endpoint
    const formData = new FormData();
    formData.append('video', selectedFile);
    formData.append('youtubeUrls', JSON.stringify(youtubeUrls.filter(url => url.trim() !== '')));
    formData.append('lyrics', lyrics || '');
    
    // 🔧 UPDATED: Use music_details instead of music_summary
    formData.append('extra_description', segment.music_details || segment.music_summary || 'Background music for video segment');
    
    formData.append('instrumental', 'true');
    formData.append('song_title', `segment_${segmentIndex + 1}`);
    formData.append('video_start', segmentStart.toString());
    formData.append('video_end', segmentEnd.toString());

    logToTerminal(`📤 Sending music generation request for individual segment...`, 'info');

    // 🚨 NEW: Call the new separate music generation endpoint
    const response = await fetch(`${API_BASE_URL}/api/generate-segment-music`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Segment music generation failed');
    }

    const musicData = await response.json();
    logToTerminal(`✅ Music generated successfully for segment ${segmentIndex + 1}!`, 'success');

    // Extract audio URL from response
    let audioUrl = null;
    
    if (musicData.url) {
      audioUrl = musicData.url;
    } else if (musicData.audio_url) {
      audioUrl = musicData.audio_url;
    } else if (musicData.tracks && Array.isArray(musicData.tracks) && musicData.tracks.length > 0) {
      audioUrl = musicData.tracks[0].url || musicData.tracks[0].audio_url;
    } else if (musicData.data && musicData.data.url) {
      audioUrl = musicData.data.url;
    } else if (musicData.data && musicData.data.audio_url) {
      audioUrl = musicData.data.audio_url;
    }

    if (!audioUrl) {
      logToTerminal(`⚠️ No audio URL found in response. Response keys: ${Object.keys(musicData).join(', ')}`, 'error');
      throw new Error('No audio URL found in the response. Check the API response structure.');
    }

    logToTerminal(`🎶 Music URL: ${audioUrl}`, 'success');

    // Store the generated music with all necessary data
    setGeneratedSegmentMusic(prev => ({
      ...prev,
      [segmentIndex]: {
        ...musicData,
        audioUrl: audioUrl,
        segment,
        segmentStart,
        segmentEnd,
        segmentDuration,
        customVolume: segment.volume || 0.3  // Use AI suggested volume as default
      }
    }));

    showMessage(`Music generated for segment ${segmentIndex + 1}!`, 'success');

  } catch (error) {
    console.error('Error generating music for segment:', error);
    logToTerminal(`❌ Failed to generate music for segment ${segmentIndex + 1}: ${error.message}`, 'error');
    showMessage(`Failed to generate music: ${error.message}`, 'error');
  } finally {
    // Clear loading state
    setSegmentMusicGeneration(prev => ({
      ...prev,
      [segmentIndex]: false
    }));
  }
};

// 3. UPDATE the segment display UI to show individ

// ALSO UPDATE your playSegmentWithMusic function with better error handling

// REPLACE your playSegmentWithMusic function with this fixed version:

const playSegmentWithMusic = async (segmentIndex) => {
  const musicData = generatedSegmentMusic[segmentIndex];
  if (!musicData) {
    showMessage('No music generated for this segment yet', 'error');
    return;
  }

  const audioUrl = musicData.audioUrl || musicData.url || musicData.audio_url;
  if (!audioUrl) {
    logToTerminal(`❌ No valid audio URL found for segment ${segmentIndex + 1}`, 'error');
    showMessage('No valid audio URL found for this segment', 'error');
    return;
  }

  // 🔍 Determine what to send as video source
  const formData = new FormData();
  if (selectedFile) {
    formData.append('video', selectedFile); // Primary option: file
  } else if (combinedVideoUrl) {
    formData.append('videoUrl', combinedVideoUrl); // Fallback option
  } else if (videoUrl) {
    formData.append('videoUrl', videoUrl); // Final fallback
  } else {
    showMessage('No video source available for playback.', 'error');
    return;
  }

  try {
    setPlayingSegment(segmentIndex);
    logToTerminal(`🎬 Playing segment ${segmentIndex + 1} with music...`, 'info');
    logToTerminal(`🎵 Using audio URL: ${audioUrl}`, 'info');

    formData.append('audioUrl', audioUrl);
    formData.append('videoDuration', duration.toString());
    
    // 🚨 FIXED: Use segment start time for proper video positioning
    const segmentStartTime = parseFloat(musicData.segmentStart || musicData.segment?.start_time || 0);
    const segmentDuration = parseFloat(musicData.segmentDuration || (musicData.segmentEnd - musicData.segmentStart) || 30);
    
    formData.append('videoStart', segmentStartTime.toString()); // This tells backend where to start the music in the video
    formData.append('musicDuration', segmentDuration.toString());
    formData.append('audioStart', '0'); // Start from beginning of the audio file

    const volumeToUse = musicData.customVolume || musicData.segment?.volume || 0.3;
    formData.append('musicVolume', volumeToUse.toString());

    logToTerminal(`⏱️ Segment timing: Video starts at ${formatTimeFromSeconds(segmentStartTime)}, music plays for ${formatTimeFromSeconds(segmentDuration)}`, 'info');
    logToTerminal(`🎚️ Music volume: ${Math.round(volumeToUse * 100)}%`, 'info');

    const response = await fetch(`${API_BASE_URL}/api/combine-video-audio`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.details || errorData.error || 'Failed to combine video with music');
    }

    const result = await response.json();
    if (!result.combinedUrl) {
      throw new Error('No combined video URL received from server');
    }

    logToTerminal(`✅ Combined video created: ${result.combinedUrl}`, 'success');

    // 🚨 FIXED: Create video element that starts at the correct segment time
    const videoElement = document.createElement('video');
    videoElement.src = result.combinedUrl;
    videoElement.controls = true;
    videoElement.style.cssText = `
      width: 100%;
      max-width: 600px;
      border-radius: 12px;
      margin-top: 1rem;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
      border: 2px solid rgba(255, 140, 0, 0.3);
    `;

    // 🚨 FIXED: Set video to start at segment time and handle seeking properly
    videoElement.addEventListener('loadedmetadata', () => {
      videoElement.currentTime = segmentStartTime;
      
      const handleSeeked = () => {
        videoElement.removeEventListener('seeked', handleSeeked);
        videoElement.play().catch(err => {
          logToTerminal(`⚠️ Autoplay blocked: ${err.message}`, 'info');
        });
        
        // Set up automatic stop at segment end
        const segmentEndTime = segmentStartTime + segmentDuration;
        const stopAtEnd = () => {
          if (videoElement.currentTime >= segmentEndTime) {
            videoElement.pause();
            videoElement.removeEventListener('timeupdate', stopAtEnd);
            logToTerminal(`⏸️ Segment playback completed at ${formatTimeFromSeconds(videoElement.currentTime)}`, 'info');
          }
        };
        
        videoElement.addEventListener('timeupdate', stopAtEnd);
      };
      
      videoElement.addEventListener('seeked', handleSeeked);
      
      // If already at the right time, trigger immediately
      if (Math.abs(videoElement.currentTime - segmentStartTime) < 0.5) {
        handleSeeked();
      }
    });

    let videoContainer = document.getElementById('segment-video-player');
    if (!videoContainer) {
      videoContainer = document.createElement('div');
      videoContainer.id = 'segment-video-player';
      videoContainer.style.cssText = `
        margin-top: 2rem;
        text-align: center;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 12px;
      `;
      const orangeButtonsContainer = document.querySelector('[data-orange-buttons]');
      if (orangeButtonsContainer) {
        orangeButtonsContainer.parentNode.insertBefore(videoContainer, orangeButtonsContainer.nextSibling);
      }
    }

    const title = document.createElement('h3');
    title.textContent = `🎵 Segment ${segmentIndex + 1} with AI Music (${Math.round(volumeToUse * 100)}% volume)`;
    title.style.cssText = `
      color: #E2E8F0;
      margin-bottom: 1rem;
      font-size: 1.2rem;
    `;

    const timeInfo = document.createElement('p');
    timeInfo.textContent = `⏱️ Playing from ${formatTimeFromSeconds(segmentStartTime)} for ${formatTimeFromSeconds(segmentDuration)}`;
    timeInfo.style.cssText = `
      color: #A0AEC0;
      margin-bottom: 1rem;
      font-size: 0.9rem;
      font-style: italic;
    `;

    videoContainer.innerHTML = '';
    videoContainer.appendChild(title);
    videoContainer.appendChild(timeInfo);
    videoContainer.appendChild(videoElement);

    videoElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    logToTerminal(`🎵 Segment ${segmentIndex + 1} is now ready to play with mixed audio from ${formatTimeFromSeconds(segmentStartTime)}`, 'success');

  } catch (error) {
    console.error('Error playing segment with music:', error);
    logToTerminal(`❌ Failed to play segment with music: ${error.message}`, 'error');
    showMessage(`Failed to play segment with music: ${error.message}`, 'error');
  } finally {
    setPlayingSegment(null);
  }
};

// Function to play segment without music (original video only)
const playSegmentWithoutMusic = (segment, segmentIndex) => {
  if (!videoPreviewRef.current) {
    showMessage('Video player not available', 'error');
    return;
  }

  const segmentStart = parseFloat(segment.start_time || 0);
  const segmentEnd = parseFloat(segment.end_time || segmentStart + 30);
  
  logToTerminal(`🎬 Playing original segment ${segmentIndex + 1} (no music)`, 'info');
  
  // Jump to segment start
  videoPreviewRef.current.currentTime = segmentStart;
  videoPreviewRef.current.play();
  
  // Stop at segment end
  const stopPlayback = () => {
    if (videoPreviewRef.current.currentTime >= segmentEnd) {
      videoPreviewRef.current.pause();
      videoPreviewRef.current.removeEventListener('timeupdate', stopPlayback);
      logToTerminal(`⏸️ Segment playback completed`, 'info');
    }
  };
  
  videoPreviewRef.current.addEventListener('timeupdate', stopPlayback);
};

// Clear terminal function
const clearTerminal = () => {
  setTerminalLogs([]);
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

const processVideoWithClipTune = async () => {
  if (!selectedFile) {
    showMessage('Please select a video file first.', 'error');
    return;
  }

  // Check if user has provided instructions
  let processingInstructions = description || 'only add music to places where people do not speak';
  
  if (!description || description.trim() === '') {
    const userInstructions = prompt(
      "Please provide instructions for ClipTune processing:\n\n" +
      "Examples:\n" +
      "• 'only add music to places where people do not speak'\n" +
      "• 'add background music during action scenes'\n" +
      "• 'create ambient music for quiet moments'\n" +
      "• 'add energetic music to dialogue-free segments'\n\n" +
      "Enter your instructions:",
      'only add music to places where people do not speak'
    );
    
    if (userInstructions && userInstructions.trim() !== '') {
      processingInstructions = userInstructions;
      setDescription(userInstructions);
    }
  }

  try {
    setIsProcessingVideo(true);
    setTerminalLogs([]);
    
    logToTerminal('🎬 Starting ClipTune video analysis...', 'info');
    logToTerminal(`📁 Processing file: ${selectedFile.name}`, 'info');
    logToTerminal(`📊 File size: ${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`, 'info');
    logToTerminal(`🎯 Instructions: ${processingInstructions}`, 'info');

    // Step 1: Analyze video for segments ONLY (no music generation)
    const formData = new FormData();
    formData.append('video', selectedFile);
    formData.append('extra_prompt', processingInstructions);

    logToTerminal('📤 Uploading video and analyzing segments...', 'info');

    const response = await fetch('http://localhost:3001/api/cliptune-upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.details || errorData.error || 'ClipTune processing failed');
    }

    const result = await response.json();
    console.log('🔍 RAW CLIPTUNE RESPONSE:');
console.log(JSON.stringify(result, null, 2));

if (result.result && result.result.segments) {
  console.log('🎭 FADE ALGORITHM DEBUGGING:');
  result.result.segments.forEach((segment, index) => {
    console.log(`Segment ${index + 1}:`, {
      fade_algorithm: segment.fade_algorithm,
      fadein_duration: segment.fadein_duration,
      fadeout_duration: segment.fadeout_duration,
      volume: segment.volume,
      music_summary: segment.music_summary
    });
  });
}
    logToTerminal('✅ ClipTune analysis completed successfully!', 'success');
    
    if (!result.success || !result.result || !result.result.segments) {
      throw new Error('No segments found in ClipTune result');
    }

    const segments = result.result.segments;
    logToTerminal(`🎯 Found ${segments.length} optimal music segments`, 'success');
    
    // Store the segments for display
    setVideoSegments(segments);
    setShowFullVideoAnalysis(true);

    // 🚫 REMOVED: Automatic music generation
    // The segments are now ready for individual music generation
    
    // Set processed video result for segment display
    setProcessedVideoResult({
      ...result.result,
      segments: segments
    });
    setShowProcessedVideo(true);
    
    logToTerminal('✅ Video analysis complete! Ready for music generation.', 'success');
    showMessage(`Found ${segments.length} segments. Click "Generate Music" on each segment to create music.`, 'success');

  } catch (error) {
    logToTerminal(`❌ Error: ${error.message}`, 'error');
    showMessage(error.message || 'Failed to process video with ClipTune.', 'error');
  } finally {
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
  // Function to load recent tracks
  const loadRecentTracks = async (userId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/get-recent-tracks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      if (res.ok) {
        setRecentTracks(data);
      }
    } catch (err) {
      console.error('Error loading recent tracks:', err);
    }
  };

  // Function to add a track to recent tracks
  const addRecentTrack = (newTrack) => {
    setRecentTracks(prev => {
      const updated = [newTrack, ...prev.filter(t => t.id !== newTrack.id)].slice(0, 5);
      return updated;
    });
  };
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
const handleFullVideoAnalysis = async () => {
  if (!selectedFile) {
    showMessage('Please select a video file first.', 'error');
    return;
  }

  // Check if user has provided instructions
  if (!description || description.trim() === '') {
    const userInstructions = prompt(
      "Please provide instructions for the AI analysis:\n\n" +
      "Examples:\n" +
      "• 'Find scenes with dialogue for background music'\n" +
      "• 'Identify action sequences that need energetic music'\n" +
      "• 'Locate quiet moments for ambient soundtracks'\n" +
      "• 'Find emotional scenes for dramatic music'\n\n" +
      "Enter your instructions:"
    );
    
    if (!userInstructions || userInstructions.trim() === '') {
      showMessage('Analysis instructions are required for better results.', 'warning');
      return;
    }
    
    // Temporarily store the instructions
    setDescription(userInstructions);
  }

  try {
    setIsAnalyzingFullVideo(true);
    showMessage('Analyzing full video for optimal music segments...', 'info');

    console.log('🎬 Starting full video analysis via backend...');
    console.log('📝 AI Instructions:', description || 'Analyze this video for optimal music placement');

    // Create FormData to send video file to backend
    const formData = new FormData();
    formData.append('video', selectedFile);
    
    // Use the description field as extra instructions for the AI
    const analysisInstructions = description || 'Analyze this video for optimal music placement and identify key scenes that would benefit from background music';
    formData.append('extra_prompt', analysisInstructions);

    console.log('🤖 Sending analysis request with instructions:', analysisInstructions);

    // Call backend endpoint which will handle ClipTune API calls
    const response = await fetch(`${API_BASE_URL}/api/analyze-full-video`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.details || errorData.error || 'Video analysis failed');
    }

    const data = await response.json();
    console.log('✅ Video analysis complete:', data);

    if (data.success && data.result && data.result.segments && Array.isArray(data.result.segments)) {
      setVideoSegments(data.result.segments);
      setShowFullVideoAnalysis(true);
      showMessage(`Found ${data.result.segments.length} optimal music segments based on your instructions!`, 'success');
      
      // Log the segments for debugging
      console.log('🎯 Found segments:', data.result.segments);
      data.result.segments.forEach((segment, index) => {
        console.log(`Segment ${index + 1}:`, {
          start: segment.start_time,
          end: segment.end_time,
          description: segment.description
        });
      });
    } else {
      showMessage('Video analyzed but no segments were identified. Try different instructions.', 'warning');
    }

  } catch (error) {
    console.error('❌ Full video analysis error:', error);
    showMessage(error.message || 'Failed to analyze video. Please try again.', 'error');
  } finally {
    setIsAnalyzingFullVideo(false);
  }
};

// Function to get segment position on timeline
const getSegmentPosition = (segmentStartTime) => {
  if (!duration) return 0;
  const timelineWidth = THUMB_WIDTH * NUM_THUMBS;
  return (segmentStartTime / duration) * timelineWidth;
};
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
  const handleDrag = (e, type) => {
    const rect = trackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;

    setLastDragged(type);
    if (type === "start") {
      setStartX(Math.min(x, endX - 10));
    } else {
      setEndX(Math.max(x, startX + 10));
    }
  };

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
const handleFileSelect = async (e) => {
  const file = e.target.files[0];
  if (file && file.type.startsWith('video/')) {
    // Stop any currently playing music and hide the bottom player
    stopMusicAndHidePlayer();
    
    // Reset all video-related state
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setThumbnails([]);
    setDuration(0);
    setStartX(0);
    setEndX(THUMB_WIDTH * NUM_THUMBS);

    // Reset full video analysis state
    setVideoSegments([]); // Reset video segments
    setShowFullVideoAnalysis(false); // Reset full video analysis
    setIsAnalyzingFullVideo(false); // Reset analysis loading state
    
    // Reset other generation-related state
    setTracks([]); // Clear any previous generated tracks
    setIsProcessing(false); // Reset processing state
    setCombinedVideoUrl(''); // Clear any previous combined video
    setSelectedTrackForPreview(null); // Clear preview track
    setIsGeneratingPreview(false); // Reset preview generation state
    setHasBeenSaved(false); // Reset save state
    setMessage({ text: '', type: '' }); // Clear any messages

    setCurrentStep(2); // Move to video editing step
    setIsLoadingVideoData(true);

    const temp = document.createElement("video");
    temp.src = url;
    temp.onloadedmetadata = async () => {
      const dur = Math.floor(temp.duration);
      if (isNaN(dur) || dur === 0) {
        showMessage("Could not load video duration.", 'error');
        setIsLoadingVideoData(false);
        return;
      }

      setDuration(dur);
      
      try {
        const thumbs = await extractThumbnails(url);
        setThumbnails(thumbs);
        setEndX(THUMB_WIDTH * thumbs.length);
        setIsLoadingVideoData(false);
        
        // Show success message with video duration
        showMessage(`Video loaded successfully! Duration: ${formatTime(dur)}`, 'success');
      } catch (thumbError) {
        console.error("Error extracting thumbnails:", thumbError);
        showMessage("Video loaded but thumbnail extraction failed.", 'warning');
        setIsLoadingVideoData(false);
      }
    };
    
    temp.onerror = (err) => {
      console.error("Error loading video metadata:", err);
      showMessage("Failed to load video. Please try another file.", 'error');
      setIsLoadingVideoData(false);
      
      // Reset everything on error
      setSelectedFile(null);
      setVideoUrl('');
      setThumbnails([]);
      setDuration(0);
      setVideoSegments([]);
      setShowFullVideoAnalysis(false);
      setIsAnalyzingFullVideo(false);
      setTracks([]);
      setCombinedVideoUrl('');
      setSelectedTrackForPreview(null);
      setIsGeneratingPreview(false);
      setHasBeenSaved(false);
      setCurrentStep(1); // Go back to upload step
    };
    
    // Clean up the previous video URL if it exists to prevent memory leaks
    temp.onload = () => {
      // Check if there's an existing video URL and revoke it
      const existingVideoUrl = videoUrl;
      if (existingVideoUrl && existingVideoUrl.startsWith('blob:')) {
        URL.revokeObjectURL(existingVideoUrl);
      }
    };
    
  } else {
    showMessage('Please select a valid video file (e.g., MP4, WebM, AVI).', 'error');
  }
};
  // Handler for proceeding from video edit to config modal
  const handleVideoEditConfirm = () => {
    if (duration === 0 || thumbnails.length === 0) {
        showMessage("Please wait for video to load or select a valid video.", "error");
        return;
    }
    setCurrentStep(1); // Go back to step 1 to show config modal
    setShowConfigModal(true);
  };

  // Handler for going back to video segment selection
  const handleGoBackToVideoEdit = () => {
    // Stop any currently playing music and hide the bottom player
    stopMusicAndHidePlayer();
    
    setShowConfigModal(false);
    setCurrentStep(2); // Go back to video segment selection
  };

  // Handler for initiating music generation
  const handleGenerate = async () => {
    if (!selectedFile) {
      return showMessage('Please select a video file first.', 'error');
    }
    const [start, end] = getTrimRange();
    const formData = new FormData();
    formData.append('video', selectedFile);
    formData.append('youtubeUrls', JSON.stringify(youtubeUrls.filter(url => url.trim() !== '')));
    formData.append('lyrics', lyrics);
    formData.append('extra_description', description);
    formData.append('instrumental', instrumental.toString());
    formData.append('renderMusicVideo', renderMusicVideo.toString());
    formData.append('song_title', 'clip_gen');
    formData.append('video_start', start.toString());
    formData.append('video_end', end.toString());
    try {
      setIsProcessing(true);
      setShowConfigModal(false);
      setCurrentStep(1);
      const res = await fetch(`${API_BASE_URL}/api/process-video`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Music generation failed. Please try again.');
      }
      setTracks(Array.isArray(data.tracks) ? data.tracks : [data]);
      // Save each generated track as recent track and update recentTracks from backend
      const tracksToSave = Array.isArray(data.tracks) ? data.tracks : [data];
      for (const track of tracksToSave) {
        await saveRecentTrack(track, start, end);
      }
      showMessage('Music generated successfully!', 'success');
      // After saving, fetch updated recent tracks
      if (userId) fetchRecentTracks(userId);
    } catch (err) {
      console.error('Error generating music:', err);
      showMessage(err.message, 'error');
    } finally {
      setIsProcessing(false);
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
const EnhancedSegmentCard = ({ segment, index, hasGeneratedMusic, effectiveVolume, hasCustomVolume }) => {
  const startTimeVal = parseFloat(segment.start_time || 0);
  const endTimeVal = parseFloat(segment.end_time || startTimeVal + 30);
  const segmentDuration = endTimeVal - startTimeVal;
  const fadeInfo = getFadeAlgorithmInfo(segment.fade_algorithm);
  const hasFadeEffects = segment.fadein_duration || segment.fadeout_duration;
  
  return (
    <div
      style={{
        background: hasGeneratedMusic 
          ? 'linear-gradient(135deg, #38a169 0%, #48bb78 100%)'
          : 'linear-gradient(135deg, #ff8c00 0%, #ff6347 100%)',
        borderRadius: '16px',
        padding: '1rem',
        color: 'white',
        boxShadow: hasGeneratedMusic 
          ? '0 4px 15px rgba(56, 161, 105, 0.4)'
          : '0 4px 15px rgba(255, 140, 0, 0.4)',
        minWidth: '300px',
        position: 'relative',
        border: hasFadeEffects 
          ? `2px solid ${fadeInfo.color}80` 
          : '2px solid rgba(255, 255, 255, 0.2)',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Segment number badge */}
      <div style={{
        position: 'absolute',
        top: '0.5rem',
        right: '0.5rem',
        background: 'rgba(255, 255, 255, 0.3)',
        borderRadius: '50%',
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.8rem',
        fontWeight: 'bold'
      }}>
        {index + 1}
      </div>
      
      {/* Advanced fade effects indicator */}
      {hasFadeEffects && (
        <div style={{
          position: 'absolute',
          top: '0.5rem',
          left: '0.5rem',
          background: `${fadeInfo.color}40`,
          borderRadius: '6px',
          padding: '0.2rem 0.4rem',
          fontSize: '0.7rem',
          fontWeight: 'bold',
          color: fadeInfo.color,
          border: `1px solid ${fadeInfo.color}60`
        }}>
          {fadeInfo.icon} {fadeInfo.name}
        </div>
      )}
      
      {/* Enhanced Segment info */}
      <div style={{ 
        marginBottom: '1rem', 
        paddingRight: '2rem', 
        paddingTop: hasFadeEffects ? '1.5rem' : '0' 
      }}>
        <div style={{
          fontSize: '1.1rem',
          fontWeight: 'bold',
          textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
          marginBottom: '0.25rem'
        }}>
          {formatTimeFromSeconds(startTimeVal)} - {formatTimeFromSeconds(endTimeVal)}
        </div>
        
        <div style={{
          fontSize: '0.8rem',
          opacity: 0.9,
          marginBottom: '0.5rem'
        }}>
          Duration: {formatTimeFromSeconds(segmentDuration)}
        </div>
        
        {/* Advanced Fade Information */}
        <FadeInfoDisplay segment={segment} index={index} />
        
        {segment.music_summary && (
          <div style={{
            fontSize: '0.75rem',
            opacity: 0.8,
            fontStyle: 'italic',
            lineHeight: 1.3,
            marginBottom: '0.5rem'
          }}>
            🎵 {segment.music_summary}
          </div>
        )}
      </div>
      
      {/* Rest of the segment card (volume controls, etc.) */}
      {/* ... existing volume control code ... */}
      
    </div>
  );
};
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
          end: formatTime(end)
        })
      });
      const data = await res.json();
      if (res.ok && data.recentTracks) {
        setRecentTracks(data.recentTracks);
      }
    } catch (err) {
      // Optionally handle error
    }
  };

  // Handler for saving a generated track to the user's library
  const handleSaveToLibrary = async (track) => {
    if (!userId) {
      return showMessage('Please ensure a user ID is set to save tracks.', 'error');
    }

    const title = prompt("Enter a title for this track:", `Track ${new Date().toLocaleTimeString()}`);
    if (!title) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/save-track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          title,
          audioUrl: track.url || track.audio_url,
          duration: `${selectionDuration}s`,
          description,
          lyrics,
          youtubeUrls: youtubeUrls.filter(url => url.trim() !== '')
        })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to save track.');
      }
      showMessage('Track saved to library!', 'success');
    } catch (err) {
      console.error('Error saving track:', err);
      showMessage(err.message, 'error');
    }
  };

  // Handler for downloading a specific segment of an audio track
  const handleDownloadInterval = async (track, index) => {
    // Handle different track structures (recent tracks vs newly generated tracks)
    const audioUrl = track.audioUrl || track.url || track.audio_url;
    
    if (!audioUrl) {
      showMessage('Audio URL not available for download.', 'error');
      return;
    }

    // Parse timestamps - recent tracks already have MM:SS format, generated tracks may have different format
    let start, end;
    
    if (typeof track.start === 'string' && track.start.includes(':')) {
      // Already in MM:SS or HH:MM:SS format
      start = convertTimestampToSeconds(track.start);
      end = convertTimestampToSeconds(track.end);
    } else {
      // Assume it's in seconds already
      start = parseInt(track.start) || 0;
      end = parseInt(track.end) || start + 30; // Default to 30 seconds if end not available
    }
    
    const duration = end - start;

    if (duration <= 0) {
      showMessage('Invalid segment duration.', 'error');
      return;
    }

    try {
      console.log('🎵 Download request:', { audioUrl, start, end, duration });
      showMessage('Preparing download...', 'info');
      
      const res = await fetch(`${API_BASE_URL}/api/trim-audio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioUrl, start, duration })
      });
      
      console.log('📡 Server response status:', res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ Server error response:', errorText);
        throw new Error(`Server error: ${res.status} - ${errorText}`);
      }
      
      const responseData = await res.json();
      console.log('📦 Server response data:', responseData);
      
      if (!responseData.trimmedUrl) {
        throw new Error('No trimmed URL received from server');
      }

      console.log('📥 Downloading trimmed file from:', responseData.trimmedUrl);
      const fileRes = await fetch(responseData.trimmedUrl);
      
      if (!fileRes.ok) {
        throw new Error(`Failed to download trimmed audio file: ${fileRes.status}`);
      }
      
      const blob = await fileRes.blob();
      console.log('📁 Downloaded blob size:', blob.size, 'bytes');
      
      if (blob.size === 0) {
        throw new Error('Downloaded file is empty');
      }
      
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `segment_${formatTime(start)}-${formatTime(end)}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      showMessage('Segment download completed!', 'success');
    } catch (err) {
      console.error('Error downloading segment:', err);
      showMessage(err.message || 'Failed to download segment.', 'error');
    }
  };
  
  // Handle downloading combined video with audio
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

    // Set states for the combining process
    setIsGeneratingCombined(true);
    setSelectedTrackForCombine(track);
    showMessage('Combining video and music...', 'info');
    
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
      showMessage('Combining video and music...', 'info');
      
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
      formData.append('videoDuration', fullVideoDuration.toString()); // Backend expects 'videoDuration'
      formData.append('videoStart', segmentStart.toString()); // Backend expects 'videoStart' (where to start the music in the video)
      formData.append('musicDuration', Math.min(segmentDuration, audioDuration).toString()); // How long the music should play
      formData.append('audioStart', audioStart.toString()); // Starting point in the audio file
      formData.append('audioDuration', audioDuration.toString()); // Full audio duration
      
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
        videoStart: segmentStart, // This should be where music starts in the video (e.g., 5 seconds)
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
       // Automatically save the combined video

   // Automatically save the combined video

      setSelectedTrackForPreview(track);
      setCurrentStep(5); // Navigate to preview step
      
      // Show success message
      showMessage('Video with music generated! Adjust volume and preview below.', 'success');
      
      console.log('🎉 ===============================================');
      console.log('✅ COMBINED VIDEO WITH MUSIC READY FOR PREVIEW!');
      console.log('📁 Preview URL:', responseData.combinedUrl);
      console.log('📹 Full video duration:', formatTime(fullVideoDuration));
      console.log('🎵 Music overlay: starts at', formatTime(segmentStart), 'and plays for', formatTime(Math.min(segmentDuration, audioDuration)));
      console.log('🎶 Music volume:', Math.round(musicVolume * 100) + '%');
      console.log('===============================================');
      
    } catch (err) {
      console.error('Error creating video with music:', err);
      showMessage(err.message || 'Failed to create video with music.', 'error');
    } finally {
      setIsGeneratingCombined(false);
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
  const handleSidebarMouseEnter = () => {
    if (currentStep === 1 || currentStep === 2) {
      setIsSidebarOpen(true);
    }
  };

  const handleSidebarMouseLeave = () => {
    setIsSidebarOpen(false);
  };

  // Placeholder functions for sidebar buttons
  const goToLibrary = () => {
    showMessage("Navigating to Library (Not yet implemented)", "info");
  };

  const goToSettings = () => {
    navigate('/settings');
  };
  
  const handleLogout = () => {
    // Clear any user data from localStorage
    localStorage.removeItem('userId');
    // You might want to clear other user-related data as well
    
    // Navigate to login or landing page
    navigate('/');
    
    // Show a message
    showMessage("Successfully logged out", "success");
  };

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
          {showDropdownMenu && (
            <div style={{
              position: 'absolute',
              top: '70px',
              right: '0',
              width: '320px',
              background: 'rgba(30, 41, 59, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              padding: '0',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              maxHeight: '60vh',
              overflowY: 'auto',
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

              {/* Menu Content */}
                 <div style={{ padding: '1.5rem' }}>
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

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.5rem'
                }}>
                  <h3 style={{
                    fontSize: '1.2rem',
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

                {showRecentTracks ? (
                  recentTracks.length === 0 ? (
                    <div style={{
                      textAlign: 'center',
                      padding: '2rem 1rem',
                      color: 'rgba(255, 255, 255, 0.6)'
                    }}>
                      <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🎵</div>
                      <p style={{ fontSize: '0.9rem', margin: 0 }}>
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
                        <div style={{ flex: 1 }}>
                          <div style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.2rem' }}>
                            {track.title || `Track ${i + 1}`}
                          </div>
                          <div style={{ color: '#667eea', fontSize: '0.8rem', marginBottom: '0.1rem' }}>
                            {track.start} → {track.end}
                          </div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem' }}>
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
                          <div style={{ flex: 1 }}>
                            <div style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                              {video.title}
                            </div>
                            <div style={{ color: '#48bb78', fontSize: '0.75rem' }}>
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
                        >
                          View Video
                        </a>
                      </div>
                    ))
                  ) : (
                    <div style={{
                      textAlign: 'center',
                      padding: '2rem 1rem',
                      color: 'rgba(255, 255, 255, 0.6)'
                    }}>
                      <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🎬</div>
                      <p style={{ fontSize: '0.9rem', margin: 0 }}>
                        No saved videos yet.
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}{(currentStep === 1 || currentStep === 2) && (
        
        <div
          ref={sidebarRef}
          onMouseEnter={handleSidebarMouseEnter}
          onMouseLeave={handleSidebarMouseLeave}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            width: isSidebarOpen ? '200px' : '60px',
            backgroundColor: '#ffffff',
            color: '#2d3748',
            overflowX: 'hidden',
            transition: 'all 0.3s ease',
            zIndex: 99,
            paddingTop: '2rem',
            boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start'
          }}
          
        >
          {/* Sidebar indicator when collapsed */}
          {!isSidebarOpen && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(90deg)',
              color: '#4a5568',
              fontSize: '0.8rem',
              fontWeight: 'bold',
              letterSpacing: '2px',
              textShadow: '0 1px 3px rgba(0,0,0,0.1)',
              whiteSpace: 'nowrap'
            }}>
              MENU
            </div>
          )}
          
          {isSidebarOpen && (
            <div style={{
              padding: '2rem',
              width: '100%',
              textAlign: 'center',
              height: 'calc(100vh - 4rem)',
              display: 'flex',
              flexDirection: 'column',
            }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <li style={{ padding: '1rem 0' }}>
                  <button
                    onClick={goToLibrary}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#4a5568',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'center',
                      padding: '1rem',
                      borderRadius: '12px',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(102, 126, 234, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    📚 Library
                  </button>
                </li>
                <li style={{ padding: '1rem 0' }}>
                  <button
                    onClick={goToSettings}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#4a5568',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'center',
                      padding: '1rem',
                      borderRadius: '12px',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(102, 126, 234, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    ⚙️ Settings
                  </button>
                </li>
                {/* Spacer to push logout button to bottom */}
                <div style={{ flexGrow: 1 }}></div>
                <li style={{ padding: '1rem 0', marginTop: 'auto', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                  <button
                    onClick={handleLogout}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#e53e3e',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'center',
                      padding: '1rem',
                      borderRadius: '12px',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(229, 62, 62, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    🚪 Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Main Container */}
      <div style={{
        ...STYLES.container.main,
        marginLeft: (currentStep === 1 || currentStep === 2) ? (isSidebarOpen ? '200px' : '60px') : '0',
        transition: 'margin-left 0.3s ease',
        animation: 'fadeIn 0.6s ease-out',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: (currentStep === 1 || currentStep === 2) ? '0' : '2rem',
        paddingRight: (currentStep === 1 || currentStep === 2) ? '0' : '2rem'
      }}>

        {/* Step 1: Upload Video */}
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
            {/* ClipTune Title */}
            <div style={{ marginBottom: tracks.length > 0 ? '2rem' : '3rem' }}>
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

            {/* Processing State */}
            {isProcessing && (
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

            {/* Upload Area - Show only if no tracks are generated */}
            {tracks.length === 0 && !isProcessing && (
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  padding: '0.75rem 1rem',
                  transition: 'all 0.3s ease',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(15px)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                  maxWidth: '180px',
                  width: '100%',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 25px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
                }}
              >
                <div style={{ 
                  fontSize: '1.2rem', 
                  marginBottom: '0.25rem',
                  filter: 'drop-shadow(0 1px 5px rgba(0,0,0,0.3))'
                }}>📁</div>
                <div style={{ 
                  fontSize: '0.7rem', 
                  color: 'white', 
                  fontWeight: 600, 
                  marginBottom: '0.125rem',
                  textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
                  lineHeight: 1.2
                }}>
                  Upload Video
                </div>
                <div style={{ 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  fontSize: '0.6rem',
                  fontWeight: 400,
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                  lineHeight: 1
                }}>
                  MP4, MOV, AVI
                </div>
                <input
                  type="file"
                  accept="video/*"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
              </div>
            )}

            {/* Start Over Button - Show only when tracks are available */}
            {tracks.length > 0 && !isProcessing && (
              <Button 
                variant="danger" 
                onClick={handleStartOver}
                style={{ 
                  fontSize: '1.1rem', 
                  padding: '1rem 2rem',
                  marginTop: '1rem'
                }}
              >
                🔄 Create Another
              </Button>
            )}
          </div>
        )}

       {currentStep === 2 && (
  <div style={{
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    background: 'linear-gradient(145deg, #1A202C 0%, #2D3748 100%)',
    borderRadius: '24px',
    boxShadow: '0 25px 80px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.05)',
    color: '#E2E8F0',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  }}>
    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
      <p style={{ ...STYLES.modal.subtitle, color: '#A0AEC0', fontSize: '1.1rem' }}>
        Select the precise video segment to inspire your new soundtrack.
      </p>
    </div>

    {/* Video Preview */}
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2.5rem' }}>
      {/* Show complete video if available, otherwise show original video */}
      {combinedVideoUrl && showProcessedVideo ? (
        <div style={{ width: '100%', textAlign: 'center' }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#E2E8F0',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}>
            🎵 Complete Video with All Music Segments
          </h3>
          <div id="complete-video-player">
            <video
              controls
              src={combinedVideoUrl}
              style={{
                width: '100%',
                maxWidth: '800px',
                borderRadius: '16px',
                boxShadow: '0 15px 50px rgba(0, 0, 0, 0.3)',
                border: '2px solid rgba(56, 161, 105, 0.3)'
              }}
            />
          </div>
          <div style={{
            marginTop: '1rem',
            fontSize: '0.9rem',
            color: 'rgba(255, 255, 255, 0.7)',
            fontStyle: 'italic'
          }}>
            This video includes all AI-generated music segments mixed with the original audio
          </div>
        </div>
      ) : (
        <div style={{ width: '100%', textAlign: 'center' }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#E2E8F0',
            marginBottom: '1rem'
          }}>
            Original Video Preview
          </h3>
          <video
            ref={videoPreviewRef}
            src={videoUrl}
            controls
            style={{
              width: '100%',
              maxWidth: '800px',
              borderRadius: '16px',
              boxShadow: '0 15px 50px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          />
        </div>
      )}
    </div>

    {/* Action Buttons Section */}
    <div style={{
      textAlign: 'center',
      marginBottom: '1.5rem',
      position: 'relative',
      zIndex: 1
    }}>
      {/* Full Video Analysis Button */}
      <Button 
        variant="fullVideo" 
        onClick={handleFullVideoAnalysis}
        disabled={isAnalyzingFullVideo || isLoadingVideoData}
        style={{
          opacity: isAnalyzingFullVideo ? 0.7 : 1,
          transform: isAnalyzingFullVideo ? 'scale(0.98)' : 'scale(1)',
          marginRight: '1rem'
        }}
      >
        {isAnalyzingFullVideo ? (
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
            Analyzing Video...
          </>
        ) : (
          <>
            🎯 Analyze Full Video
          </>
        )}
      </Button>

      {/* ClipTune Processing Button */}
      <Button 
        variant="success" 
        onClick={processVideoWithClipTune}
        disabled={isProcessingVideo || isLoadingVideoData}
        style={{
          opacity: isProcessingVideo ? 0.7 : 1,
          transform: isProcessingVideo ? 'scale(0.98)' : 'scale(1)',
          background: isProcessingVideo 
            ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
            : 'linear-gradient(135deg, #38a169 0%, #48bb78 100%)',
          color: 'white',
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: '10px',
          fontSize: '0.9rem',
          fontWeight: 600,
          cursor: isProcessingVideo ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 20px rgba(56, 161, 105, 0.4)',
          textAlign: 'center'
        }}
      >
        {isProcessingVideo ? (
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
            Processing Video...
          </>
        ) : (
          <>
            🎵 Process with ClipTune
          </>
        )}
      </Button>

      {/* Clear logs button when processing */}
      {isProcessingVideo && terminalLogs.length > 0 && (
        <button
          onClick={clearTerminal}
          style={{
            marginLeft: '1rem',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            color: '#E2E8F0',
            padding: '0.75rem 1rem',
            fontSize: '0.8rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          🗑️ Clear Logs
        </button>
      )}

      {/* Status indicator for full video analysis */}
      {showFullVideoAnalysis && (
        <div style={{
          marginTop: '0.75rem',
          fontSize: '0.8rem',
          color: '#E2E8F0',
          background: 'rgba(255, 140, 0, 0.1)',
          padding: '0.5rem 1rem',
          borderRadius: '8px',
          border: '1px solid rgba(255, 140, 0, 0.3)'
        }}>
          🟠 Orange dots show optimal music segments ({videoSegments.length} found)
        </div>
      )}
    </div>

    {/* Terminal Logs Display */}
    {terminalLogs.length > 0 && (
      <div style={{
        marginTop: '2rem',
        marginBottom: '2rem',
        background: 'rgba(0, 0, 0, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '12px',
        padding: '1rem',
        maxHeight: '300px',
        overflowY: 'auto',
        fontFamily: 'monospace'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '0.5rem'
        }}>
          <h4 style={{
            color: '#E2E8F0',
            fontSize: '1rem',
            fontWeight: 600,
            margin: 0
          }}>
            🖥️ ClipTune Processing Logs
          </h4>
          <button
            onClick={clearTerminal}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              color: '#E2E8F0',
              padding: '0.25rem 0.5rem',
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
          >
            Clear
          </button>
        </div>
        
        <div 
          ref={terminalRef}
          style={{
            maxHeight: '200px',
            overflowY: 'auto'
          }}
        >
          {terminalLogs.map((log) => (
            <div 
              key={log.id} 
              style={{
                marginBottom: '0.5rem',
                fontSize: '0.85rem',
                color: log.type === 'error' ? '#f87171' : 
                       log.type === 'success' ? '#34d399' : '#e5e7eb',
                lineHeight: 1.4
              }}
            >
              <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                [{log.timestamp}]
              </span>{' '}
              {log.prefix} {log.message}
            </div>
          ))}
        </div>
      </div>
    )}

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

    {/* Complete Video with Music Segments Display */}
    {showProcessedVideo && processedVideoResult && (
      <div style={{
        marginTop: '3rem',
        background: 'rgba(56, 161, 105, 0.1)',
        border: '2px solid rgba(56, 161, 105, 0.3)',
        borderRadius: '16px',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          color: '#E2E8F0',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          🎉 ClipTune Processed Video Ready!
        </h3>
        
        {processedVideoResult.combined_video_url && (
          <div style={{
            marginBottom: '2rem'
          }}>
            <video 
              controls 
              src={processedVideoResult.combined_video_url} 
              style={{
                width: '100%',
                maxWidth: '800px',
                borderRadius: '12px',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
                border: '2px solid rgba(56, 161, 105, 0.2)'
              }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {/* Action buttons for the processed video */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {processedVideoResult.combined_video_url && (
            <>
              <a
                href={processedVideoResult.combined_video_url}
                download="cliptune_processed_video.mp4"
                style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #38a169 0%, #48bb78 100%)',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 15px rgba(56, 161, 105, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(56, 161, 105, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(56, 161, 105, 0.3)';
                }}
              >
                ⬇️ Download Video
              </a>
              
              <button
                onClick={async () => {
                  try {
                    await handleSaveCombinedVideo();
                    showMessage('ClipTune video saved successfully!', 'success');
                  } catch (err) {
                    showMessage('Failed to save ClipTune video', 'error');
                  }
                }}
                style={{
                  background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 15px rgba(66, 153, 225, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(66, 153, 225, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(66, 153, 225, 0.3)';
                }}
              >
                💾 Save Video
              </button>
            </>
          )}
          
          <button
            onClick={() => {
              setShowProcessedVideo(false);
              setProcessedVideoResult(null);
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#E2E8F0',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            ✕ Close
          </button>
        </div>

        {/* Debug info */}
        {processedVideoResult && (
          <div style={{
            marginTop: '1.5rem',
            fontSize: '0.8rem',
            color: 'rgba(255, 255, 255, 0.6)',
            textAlign: 'left',
            background: 'rgba(0, 0, 0, 0.2)',
            padding: '1rem',
            borderRadius: '8px',
            fontFamily: 'monospace'
          }}>
            <strong>ClipTune Result:</strong>
            <pre style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(processedVideoResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    )}
    {/* ⭐ ADD THE TERMINAL LOGS DISPLAY RIGHT HERE ⭐ */}
    {terminalLogs.length > 0 && (
      <div style={{
        marginTop: '2rem',
        marginBottom: '2rem',
        background: 'rgba(0, 0, 0, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '12px',
        padding: '1rem',
        maxHeight: '300px',
        overflowY: 'auto',
        fontFamily: 'monospace'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '0.5rem'
        }}>
          <h4 style={{
            color: '#E2E8F0',
            fontSize: '1rem',
            fontWeight: 600,
            margin: 0
          }}>
            🖥️ ClipTune Processing Logs
          </h4>
          <button
            onClick={clearTerminal}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              color: '#E2E8F0',
              padding: '0.25rem 0.5rem',
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
          >
            Clear
          </button>
        </div>
        
        <div 
          ref={terminalRef}
          style={{
            maxHeight: '200px',
            overflowY: 'auto'
          }}
        >
          {terminalLogs.map((log) => (
            <div 
              key={log.id} 
              style={{
                marginBottom: '0.5rem',
                fontSize: '0.85rem',
                color: log.type === 'error' ? '#f87171' : 
                       log.type === 'success' ? '#34d399' : '#e5e7eb',
                lineHeight: 1.4
              }}
            >
              <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                [{log.timestamp}]
              </span>{' '}
              {log.prefix} {log.message}
            </div>
          ))}
        </div>
      </div>
    )}


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
                  {showProcessedVideo && processedVideoResult && (
  <div style={{
    marginTop: '3rem',
    background: 'rgba(56, 161, 105, 0.1)',
    border: '2px solid rgba(56, 161, 105, 0.3)',
    borderRadius: '16px',
    padding: '2rem',
    textAlign: 'center'
  }}>
    <h3 style={{
      fontSize: '1.5rem',
      fontWeight: 700,
      color: '#E2E8F0',
      marginBottom: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem'
    }}>
      🎉 ClipTune Processed Video Ready!
    </h3>
    
    {processedVideoResult.combined_video_url && (
      <div style={{
        marginBottom: '2rem'
      }}>
        <video 
          controls 
          src={processedVideoResult.combined_video_url} 
          style={{
            width: '100%',
            maxWidth: '800px',
            borderRadius: '12px',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
            border: '2px solid rgba(56, 161, 105, 0.2)'
          }}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    )}

    {/* Action buttons for the processed video */}
    <div style={{
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      flexWrap: 'wrap'
    }}>
      {processedVideoResult.combined_video_url && (
        <>
          <a
            href={processedVideoResult.combined_video_url}
            download="cliptune_processed_video.mp4"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #38a169 0%, #48bb78 100%)',
              color: 'white',
              textDecoration: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontWeight: 600,
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 15px rgba(56, 161, 105, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(56, 161, 105, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(56, 161, 105, 0.3)';
            }}
          >
            ⬇️ Download Video
          </a>
          
          <button
            onClick={async () => {
              try {
                await handleSaveCombinedVideo();
                showMessage('ClipTune video saved successfully!', 'success');
              } catch (err) {
                showMessage('Failed to save ClipTune video', 'error');
              }
            }}
            style={{
              background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 15px rgba(66, 153, 225, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(66, 153, 225, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(66, 153, 225, 0.3)';
            }}
          >
            💾 Save Video
          </button>
        </>
      )}
      
      <button
        onClick={() => {
          setShowProcessedVideo(false);
          setProcessedVideoResult(null);
        }}
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          color: '#E2E8F0',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '0.75rem 1.5rem',
          borderRadius: '10px',
          fontSize: '0.9rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.2)';
          e.target.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.1)';
          e.target.style.transform = 'translateY(0)';
        }}
      >
        ✕ Close
      </button>
    </div>

    {/* Debug info */}
    {processedVideoResult && (
      <div style={{
        marginTop: '1.5rem',
        fontSize: '0.8rem',
        color: 'rgba(255, 255, 255, 0.6)',
        textAlign: 'left',
        background: 'rgba(0, 0, 0, 0.2)',
        padding: '1rem',
        borderRadius: '8px',
        fontFamily: 'monospace'
      }}>
        <strong>ClipTune Result:</strong>
        <pre style={{ margin: '0.5rem 0 0 0', fontSize: '0.75rem', whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(processedVideoResult, null, 2)}
        </pre>
      </div>
    )}
  </div>
)}
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

{/* Orange dots for video segments */}
{showFullVideoAnalysis && videoSegments.map((segment, index) => {
  const segmentStartTime = parseFloat(segment.start_time || 0);
  const dotPosition = getSegmentPosition(segmentStartTime);
  
  return (
    <div
      key={index}
      style={{
        position: 'absolute',
        left: dotPosition - 6, // Center the dot
        bottom: -15, // Position below the timeline
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #ff8c00 0%, #ff6347 100%)',
        border: '2px solid white',
        boxShadow: '0 2px 8px rgba(255, 140, 0, 0.6), 0 0 0 1px rgba(255, 140, 0, 0.3)',
        zIndex: 1000,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        animation: `pulse 2s infinite ${index * 0.2}s`
      }}
      title={`Segment ${index + 1}: ${formatTime(segmentStartTime)} - ${segment.description || 'Music segment'}`}
      onClick={() => {
        // Jump to this segment
        const width = THUMB_WIDTH * NUM_THUMBS;
        const newStartX = Math.max(0, dotPosition - 50);
        const newEndX = Math.min(width, dotPosition + 100);
        setStartX(newStartX);
        setEndX(newEndX);
        if (videoPreviewRef.current) {
          videoPreviewRef.current.currentTime = segmentStartTime;
        }
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.3)';
        e.target.style.boxShadow = '0 4px 12px rgba(255, 140, 0, 0.8), 0 0 0 2px rgba(255, 140, 0, 0.5)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1)';
        e.target.style.boxShadow = '0 2px 8px rgba(255, 140, 0, 0.6), 0 0 0 1px rgba(255, 140, 0, 0.3)';
      }}
    />
  );
})}
                  {/* Start handle */}
                  <div
                    onMouseDown={(e) => {
                      const move = (me) => handleDrag(me, "start");
                      const up = () => { document.removeEventListener("mousemove", move); document.removeEventListener("mouseup", up); };
                      document.addEventListener("mousemove", move);
                      document.addEventListener("mouseup", up);
                    }}
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
                  >
                    <span style={{color: 'white', transform: 'rotate(90deg)', fontSize: '10px'}}>|||</span>
                  </div>

                  {/* End handle */}
                  <div
                    onMouseDown={(e) => {
                      const move = (me) => handleDrag(me, "end");
                      const up = () => { document.removeEventListener("mousemove", move); document.removeEventListener("mouseup", up); };
                      document.addEventListener("mousemove", move);
                      document.addEventListener("mouseup", up);
                    }}
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
{/* 🆕 ClipTune Segment Buttons - ADD THIS HERE */}
{/* Updated ClipTune Segment Buttons with Complete Video Integration */}
{/* Updated ClipTune Segment Buttons with Working Volume Controls */}
{/* ClipTune Segment Buttons with Complete Video Integration */}
{processedVideoResult && processedVideoResult.segments && Array.isArray(processedVideoResult.segments) && (
  <div style={{
    marginTop: '2rem',
    width: THUMB_WIDTH * NUM_THUMBS,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }}>
    <div style={{
      fontSize: '1rem',
      fontWeight: 600,
      color: '#E2E8F0',
      marginBottom: '1rem',
      textAlign: 'center',
      background: 'rgba(255, 140, 0, 0.1)',
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      border: '1px solid rgba(255, 140, 0, 0.3)'
    }}>
      🎭 ClipTune AI Segments with Music Controls ({processedVideoResult.segments.length})
    </div>
    
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem',
      justifyContent: 'center',
      width: '100%'
    }}>
      {processedVideoResult.segments.map((segment, index) => {
        const startTimeVal = parseFloat(segment.start_time || 0);
        const endTimeVal = parseFloat(segment.end_time || startTimeVal + 30);
        const segmentDuration = endTimeVal - startTimeVal;
        const hasGeneratedMusic = generatedSegmentMusic[index];
        const isGenerating = segmentMusicGeneration[index];
        const effectiveVolume = getEffectiveVolume(index, segment);
        const hasCustomVolume = generatedSegmentMusic[index]?.hasCustomVolume || false;
    const fadeInfo = getFadeAlgorithmInfo(segment.fade_algorithm || segment.fade_type);
        const hasFadeEffects = segment.fadein_duration || segment.fadeout_duration;
        if (!segment) {
      console.warn(`Segment ${index} is undefined`);
      return null;
    }
        return (
          <div
            key={index}
            style={{
              background: hasGeneratedMusic 
                ? 'linear-gradient(135deg, #38a169 0%, #48bb78 100%)'
                : isGenerating
                ? 'linear-gradient(135deg, #4299e1 0%, #667eea 100%)'
                : 'linear-gradient(135deg, #ff8c00 0%, #ff6347 100%)',
              borderRadius: '16px',
              padding: '1rem',
              color: 'white',
              boxShadow: hasGeneratedMusic 
                ? '0 4px 15px rgba(56, 161, 105, 0.4)'
                : isGenerating
                ? '0 4px 15px rgba(66, 153, 225, 0.4)'
                : '0 4px 15px rgba(255, 140, 0, 0.4)',
              minWidth: '320px',
              position: 'relative',
              border: hasFadeEffects 
                ? `3px solid ${fadeInfo.color}80` 
                : '2px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease'
            }}
          >
            {/* Segment number badge */}
            <div style={{
              position: 'absolute',
              top: '0.5rem',
              right: '0.5rem',
              background: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              fontWeight: 'bold'
            }}>
              {index + 1}
            </div>
            
            {/* Segment info */}
            <div style={{ 
              marginBottom: '1rem', 
              paddingRight: '2rem'
            }}>
              <div style={{
                fontSize: '1.1rem',
                fontWeight: 'bold',
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
                marginBottom: '0.25rem'
              }}>
                {formatTimeFromSeconds(startTimeVal)} - {formatTimeFromSeconds(endTimeVal)}
              </div>
              
              <div style={{
                fontSize: '0.8rem',
                opacity: 0.9,
                marginBottom: '0.5rem'
              }}>
                Duration: {formatTimeFromSeconds(segmentDuration)}
              </div>
              
              {/* AI Music Summary */}
              {segment.music_summary && (
                <div style={{
                  fontSize: '0.75rem',
                  opacity: 0.9,
                  fontStyle: 'italic',
                  lineHeight: 1.3,
                  marginBottom: '0.5rem',
                  background: 'rgba(0, 0, 0, 0.2)',
                  padding: '0.5rem',
                  borderRadius: '6px'
                }}>
                  🎵 <strong>AI Suggestion:</strong> {segment.music_summary}
                </div>
              )}

              {/* AI Volume Suggestion */}
              {segment.volume && (
                <div style={{
                  fontSize: '0.75rem',
                  opacity: 0.9,
                  marginBottom: '0.5rem',
                  background: 'rgba(0, 0, 0, 0.2)',
                  padding: '0.5rem',
                  borderRadius: '6px'
                }}>
                  🎚️ <strong>AI Volume:</strong> {Math.round(segment.volume * 100)}%
                </div>
              )}

              {/* Advanced Fade Information */}
              {hasFadeEffects && (
                <div style={{
                  fontSize: '0.7rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '10px',
                  marginBottom: '0.5rem',
                  border: `2px solid ${fadeInfo.color}40`
                }}>
                  <div style={{ 
                    fontWeight: 'bold', 
                    marginBottom: '0.5rem',
                    color: fadeInfo.color,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.8rem'
                  }}>
                    {fadeInfo.icon} {fadeInfo.name} Fade Algorithm
                  </div>
                  
                  {segment.fadein_duration && parseFloat(segment.fadein_duration) > 0 && (
                    <div style={{ 
                      marginBottom: '0.3rem', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      background: 'rgba(76, 220, 196, 0.15)',
                      padding: '0.3rem 0.5rem',
                      borderRadius: '6px'
                    }}>
                      <span>🔊 Fade In:</span>
                      <span style={{ color: '#4ecdc4', fontWeight: 'bold' }}>
                        {segment.fadein_duration}s
                      </span>
                    </div>
                  )}
                  
                  {segment.fadeout_duration && parseFloat(segment.fadeout_duration) > 0 && (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem',
                      background: 'rgba(255, 140, 0, 0.15)',
                      padding: '0.3rem 0.5rem',
                      borderRadius: '6px'
                    }}>
                      <span>🔉 Fade Out:</span>
                      <span style={{ color: '#ff8c00', fontWeight: 'bold' }}>
                        {segment.fadeout_duration}s
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Action buttons */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              {/* Generate Music Button */}
              {!hasGeneratedMusic && !isGenerating && (
                <button
                  onClick={() => generateMusicForSegment(segment, index)}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
                  }}
                >
                  🎵 Generate Music
                </button>
              )}

              {/* Generating State */}
              {isGenerating && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}>
                  <span style={{ 
                    display: 'inline-block', 
                    width: '16px', 
                    height: '16px', 
                    border: '2px solid transparent',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Generating Music...
                </div>
              )}

              {/* Music Generated - Show Controls */}
              {hasGeneratedMusic && (
                <>
                  {/* Play Buttons */}
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem'
                  }}>
                    <button
                      onClick={() => playSegmentWithMusic(index)}
                      disabled={playingSegment === index}
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '8px',
                        padding: '0.5rem',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        transition: 'all 0.2s ease',
                        flex: 1,
                        opacity: playingSegment === index ? 0.7 : 1
                      }}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                      onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                    >
                      {playingSegment === index ? '🔄 Playing...' : '🎵 Play with Music'}
                    </button>
                    
                    <button
                      onClick={() => playSegmentWithoutMusic(segment, index)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '8px',
                        padding: '0.5rem',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        transition: 'all 0.2s ease',
                        flex: 1
                      }}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                      onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                    >
                      🎬 Play Original
                    </button>
                  </div>

                  {/* Volume Control */}
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '6px',
                    padding: '0.75rem'
                  }}>
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'rgba(255, 255, 255, 0.9)',
                      marginBottom: '0.5rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span>🎚️ Music Volume:</span>
                      <span style={{ 
                        fontWeight: 'bold', 
                        fontSize: '0.9rem',
                        color: hasCustomVolume ? '#4ecdc4' : 'white'
                      }}>
                        {Math.round(effectiveVolume * 100)}%
                        {hasCustomVolume && (
                          <span style={{ fontSize: '0.6rem', marginLeft: '0.3rem' }}>
                            (Custom)
                          </span>
                        )}
                      </span>
                    </div>
                    
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={effectiveVolume}
                      onChange={(e) => {
                        const newVolume = parseFloat(e.target.value);
                        handleSegmentVolumeChange(index, newVolume);
                      }}
                      style={{
                        width: '100%',
                        height: '8px',
                        borderRadius: '4px',
                        background: effectiveVolume === 0 
                          ? 'linear-gradient(to right, #ff4444 0%, #ff4444 100%)'
                          : `linear-gradient(to right, 
                              #333 0%, 
                              ${hasCustomVolume ? '#4ecdc4' : '#38a169'} ${effectiveVolume * 100}%, 
                              rgba(255,255,255,0.3) ${effectiveVolume * 100}%)`,
                        outline: 'none',
                        cursor: 'pointer',
                        appearance: 'none',
                        WebkitAppearance: 'none'
                      }}
                    />
                    
                    <div style={{
                      marginTop: '0.5rem',
                      fontSize: '0.65rem',
                      color: 'rgba(255, 255, 255, 0.7)',
                      textAlign: 'center'
                    }}>
                      {effectiveVolume === 0 ? (
                        <>🔇 <strong>MUTED</strong></>
                      ) : (
                        <>
                          {effectiveVolume <= 0.1 ? '🔉 Very Quiet' :
                           effectiveVolume <= 0.3 ? '🔉 Low' :
                           effectiveVolume <= 0.7 ? '🔊 Medium' : '📢 High'}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Regenerate Music Button */}
                  <button
                    onClick={() => generateMusicForSegment(segment, index)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '8px',
                      padding: '0.5rem',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                    onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                  >
                    🔄 Regenerate Music
                  </button>
                </>
              )}

              {/* Jump to segment button (always available) */}
              <button
                onClick={() => jumpToCompleteVideoSegment(segment, index)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  padding: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
              >
                🎯 Jump to Segment
              </button>
            </div>
          </div>
        );
      })}
    </div>
    
    {/* Generate All Music Button & Create Complete Video Button */}
    <div style={{
      marginTop: '2rem',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'center'
    }}>
      {/* Generate All Music Button */}
      <button
  onClick={() => {
    // Generate music for all segments that don't have music yet
    const segmentsToGenerate = processedVideoResult.segments.filter((_, index) => !generatedSegmentMusic[index]);
    
    if (segmentsToGenerate.length === 0) {
      showMessage('All segments already have music generated!', 'info');
      return;
    }
    
    // Store count and show confirmation modal instead of using confirm()
    setBulkGenerateSegmentCount(segmentsToGenerate.length);
    setShowBulkGenerateConfirm(true);
  }}
  style={{
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '1rem 2rem',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 600,
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
  }}
  onMouseEnter={(e) => {
    e.target.style.transform = 'translateY(-2px)';
    e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
  }}
  onMouseLeave={(e) => {
    e.target.style.transform = 'translateY(0)';
    e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
  }}
>
  🎵 Generate Music for All Segments
</button>
      {/* Create Complete Video Button - Show only when at least one segment has music */}
    {Object.keys(generatedSegmentMusic).length > 0 && (
  <button
    onClick={() => {
      const segmentsWithMusic = Object.keys(generatedSegmentMusic).length;
      const totalSegments = processedVideoResult.segments.length;
      
      // Store counts and show confirmation modal instead of using confirm()
      setCompleteVideoSegmentCount(segmentsWithMusic);
      setShowCompleteVideoConfirm(true);
    }}
    disabled={isGeneratingPreview}
    style={{
      background: isGeneratingPreview 
        ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
        : 'linear-gradient(135deg, #38a169 0%, #48bb78 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '1rem 2rem',
      cursor: isGeneratingPreview ? 'not-allowed' : 'pointer',
      fontSize: '1rem',
      fontWeight: 600,
      transition: 'all 0.2s ease',
      boxShadow: '0 4px 15px rgba(56, 161, 105, 0.3)',
      opacity: isGeneratingPreview ? 0.7 : 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem'
    }}
    onMouseEnter={(e) => {
      if (!isGeneratingPreview) {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 6px 20px rgba(56, 161, 105, 0.4)';
      }
    }}
    onMouseLeave={(e) => {
      if (!isGeneratingPreview) {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 4px 15px rgba(56, 161, 105, 0.3)';
      }
    }}
  >
    {isGeneratingPreview ? (
      <>
        <span style={{ 
          display: 'inline-block', 
          width: '16px', 
          height: '16px', 
          border: '2px solid transparent',
          borderTop: '2px solid white',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        Creating Complete Video...
      </>
    ) : (
      <>
        🎬 Create Complete Video ({Object.keys(generatedSegmentMusic).length} segments)
      </>
    )}
  </button>
)}
      {/* Status Info */}
      <div style={{
        fontSize: '0.8rem',
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'center',
        fontStyle: 'italic',
        background: 'rgba(0, 0, 0, 0.2)',
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        maxWidth: '500px'
      }}>
        {Object.keys(generatedSegmentMusic).length === 0 ? (
          <>
            ℹ️ Generate music for individual segments first, then create the complete video
          </>
        ) : (
          <>
            ✅ {Object.keys(generatedSegmentMusic).length}/{processedVideoResult.segments.length} segments have music generated
            {Object.keys(generatedSegmentMusic).length === processedVideoResult.segments.length && (
              <div style={{ marginTop: '0.25rem', color: '#48bb78', fontWeight: 'bold' }}>
                🎉 All segments ready! Create complete video now.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  </div>
)}
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
        🎬 Create Complete Video
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
              logToTerminal('🎬 Creating complete video with all generated music segments...', 'info');
              
              const formData = new FormData();
              formData.append('video', selectedFile);
              formData.append('segments', JSON.stringify(processedVideoResult.segments));
              formData.append('musicData', JSON.stringify(generatedSegmentMusic));
              formData.append('videoDuration', duration.toString());

              const response = await fetch(`${API_BASE_URL}/api/create-complete-video-from-segments`, {
                method: 'POST',
                body: formData,
              });

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create complete video');
              }

              const result = await response.json();
              
              if (result.combinedUrl) {
                setCombinedVideoUrl(result.combinedUrl);
                setShowProcessedVideo(true);
                
                logToTerminal('✅ Complete video with all music segments created!', 'success');
                logToTerminal(`🎬 Video URL: ${result.combinedUrl}`, 'success');
                logToTerminal(`📊 Active segments: ${result.activeSegments}/${result.totalSegments}`, 'info');
                
                showMessage(`Complete video created with ${result.activeSegments} music segments!`, 'success');
                
                // Update the processed video result with the combined URL
                setProcessedVideoResult(prev => ({
                  ...prev,
                  combined_video_url: result.combinedUrl
                }));
                
              } else {
                throw new Error('No combined video URL received');
              }

            } catch (error) {
              logToTerminal(`❌ Failed to create complete video: ${error.message}`, 'error');
              showMessage('Failed to create complete video. Please try again.', 'error');
            } finally {
              setIsGeneratingPreview(false);
            }
          }}
        >
          Create Video
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
          onClick={async () => {
            setShowBulkGenerateConfirm(false);
            
            logToTerminal(`🎵 Starting bulk generation for ${bulkGenerateSegmentCount} segments...`, 'info');
            
            for (let i = 0; i < processedVideoResult.segments.length; i++) {
              if (!generatedSegmentMusic[i]) {
                await generateMusicForSegment(processedVideoResult.segments[i], i);
                // Add small delay between generations
                await new Promise(resolve => setTimeout(resolve, 1000));
              }
            }
            
            logToTerminal('✅ Bulk music generation completed!', 'success');
            showMessage('All music segments generated successfully!', 'success');
          }}
        >
          Generate Music
        </Button>
      </div>
    </div>
  </div>
)}

{/* Segments Information Panel for Full Video Analysis (when no ClipTune processing) */}
{showFullVideoAnalysis && videoSegments.length > 0 && !processedVideoResult && (
  <div style={{
    marginTop: '2rem',
    background: 'rgba(255, 140, 0, 0.05)',
    border: '1px solid rgba(255, 140, 0, 0.2)',
    borderRadius: '12px',
    padding: '1.5rem',
    position: 'relative',
    zIndex: 1
  }}>
    <h4 style={{
      fontSize: '1.1rem',
      fontWeight: 600,
      color: '#E2E8F0',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    }}>
      🎯 Detected Music Segments ({videoSegments.length})
    </h4>
    <div style={{
      maxHeight: '200px',
      overflowY: 'auto',
      display: 'grid',
      gap: '0.75rem'
    }}>
      {videoSegments.map((segment, index) => (
        <div 
          key={index}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 140, 0, 0.2)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onClick={() => {
            const segmentStartTime = parseFloat(segment.start_time || 0);
            const segmentEndTime = parseFloat(segment.end_time || segmentStartTime + 30);
            const width = THUMB_WIDTH * NUM_THUMBS;
            const startPos = (segmentStartTime / duration) * width;
            const endPos = (segmentEndTime / duration) * width;
            setStartX(Math.max(0, startPos));
            setEndX(Math.min(width, endPos));
            if (videoPreviewRef.current) {
              videoPreviewRef.current.currentTime = segmentStartTime;
            }
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 140, 0, 0.2)';
            e.target.style.transform = 'translateX(4px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            e.target.style.transform = 'translateX(0)';
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '1rem'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#E2E8F0',
                marginBottom: '0.25rem'
              }}>
                Segment {index + 1}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#A0AEC0',
                marginBottom: '0.25rem'
              }}>
                {formatTime(parseFloat(segment.start_time || 0))} → {formatTime(parseFloat(segment.end_time || 0))}
              </div>
              {segment.description && (
                <div style={{
                  fontSize: '0.75rem',
                  color: '#CBD5E1',
                  fontStyle: 'italic'
                }}>
                  {segment.description}
                </div>
              )}
            </div>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff8c00 0%, #ff6347 100%)',
              border: '2px solid white',
              boxShadow: '0 2px 6px rgba(255, 140, 0, 0.5)',
              flexShrink: 0
            }} />
          </div>
        </div>
      ))}
    </div>
    <div style={{
      marginTop: '1rem',
      fontSize: '0.75rem',
      color: '#A0AEC0',
      textAlign: 'center'
    }}>
      Click any segment to jump to that time range • Orange dots show segment positions
    </div>
  </div>
)}
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
        )}
{/* Segments Information Panel */}
{showFullVideoAnalysis && videoSegments.length > 0 && (
  <div style={{
    marginTop: '2rem',
    background: 'rgba(255, 140, 0, 0.05)',
    border: '1px solid rgba(255, 140, 0, 0.2)',
    borderRadius: '12px',
    padding: '1.5rem',
    position: 'relative',
    zIndex: 1
  }}>
    <h4 style={{
      fontSize: '1.1rem',
      fontWeight: 600,
      color: '#E2E8F0',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    }}>
      🎯 Detected Music Segments ({videoSegments.length})
    </h4>
    <div style={{
      maxHeight: '200px',
      overflowY: 'auto',
      display: 'grid',
      gap: '0.75rem'
    }}>
      {videoSegments.map((segment, index) => (
        <div 
          key={index}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: '1px solid rgba(255, 140, 0, 0.2)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onClick={() => {
            const segmentStartTime = parseFloat(segment.start_time || 0);
            const segmentEndTime = parseFloat(segment.end_time || segmentStartTime + 30);
            const width = THUMB_WIDTH * NUM_THUMBS;
            const startPos = (segmentStartTime / duration) * width;
            const endPos = (segmentEndTime / duration) * width;
            setStartX(Math.max(0, startPos));
            setEndX(Math.min(width, endPos));
            if (videoPreviewRef.current) {
              videoPreviewRef.current.currentTime = segmentStartTime;
            }
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 140, 0, 0.2)';
            e.target.style.transform = 'translateX(4px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            e.target.style.transform = 'translateX(0)';
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '1rem'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#E2E8F0',
                marginBottom: '0.25rem'
              }}>
                Segment {index + 1}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#A0AEC0',
                marginBottom: '0.25rem'
              }}>
                {formatTime(parseFloat(segment.start_time || 0))} → {formatTime(parseFloat(segment.end_time || 0))}
              </div>
              {segment.description && (
                <div style={{
                  fontSize: '0.75rem',
                  color: '#CBD5E1',
                  fontStyle: 'italic'
                }}>
                  {segment.description}
                </div>
              )}
            </div>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff8c00 0%, #ff6347 100%)',
              border: '2px solid white',
              boxShadow: '0 2px 6px rgba(255, 140, 0, 0.5)',
              flexShrink: 0
            }} />
          </div>
        </div>
      ))}
    </div>
    <div style={{
      marginTop: '1rem',
      fontSize: '0.75rem',
      color: '#A0AEC0',
      textAlign: 'center'
    }}>
      Click any segment to jump to that time range • Orange dots show segment positions
    </div>
  </div>
)}
        {/* Step 4: Results */}
        {currentStep === 4 && (
          <div style={STYLES.container.card}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={STYLES.modal.title}>
                {isProcessing ? '🎵 Generating Your Music...' : '🎉 Music Generated Successfully!'}
              </h2>
              <p style={STYLES.modal.subtitle}>
                {isProcessing ? 'Please wait while our AI creates your custom soundtrack' : 'Your AI-generated music is ready!'}
              </p>
            </div>

            {isProcessing && (
              <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <div style={{
                  border: '4px solid #f3f4f6',
                  borderTop: '4px solid #667eea',
                  borderRadius: '50%',
                  width: '60px',
                  height: '60px',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 2rem'
                }} />
                <p style={{ fontSize: '1.1rem', color: '#718096' }}>
                  This may take a few minutes...
                </p>
              </div>
            )}

            {/* Generated Tracks */}
            {tracks.length > 0 && (
              <div style={{ gap: '2rem' }}>
                {tracks.map((track, i) => {
                  const startTime = convertTimestampToSeconds(track.start);
                  const endTime = convertTimestampToSeconds(track.end);
                  if (!audioRefs.current[i]) audioRefs.current[i] = React.createRef();

                  const handlePlaySegment = () => {
                    const audio = audioRefs.current[i]?.current;
                    if (!audio) return;
                    audio.currentTime = startTime;
                    audio.play();
                    const stopAt = () => {
                      if (audio.currentTime >= endTime) {
                        audio.pause();
                        audio.removeEventListener('timeupdate', stopAt);
                      }
                    };
                    audio.addEventListener('timeupdate', stopAt);
                  };

                  return (
                    <div key={i} style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: '2px solid #e2e8f0',
                      borderRadius: '24px',
                      padding: '3rem',
                      margin: '2rem 0',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '2rem'
                      }}>
                        <h4 style={{
                          fontSize: '1.5rem',
                          fontWeight: 700,
                          color: '#2d3748',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          🎵 Track {i + 1}
                        </h4>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem'
                        }}>
                          {/* Video with music button moved to top right */}
                          {renderMusicVideo && (
                            <div style={{ position: 'relative' }}>
                              {/* New badge indicator */}
                              <div style={{
                                position: 'absolute',
                                top: '-12px',
                                right: '-12px',
                                background: '#e53e3e',
                                color: 'white',
                                borderRadius: '50%',
                                width: '24px',
                                height: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                border: '2px solid white',
                                zIndex: 2,
                                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)'
                              }}>
                                ✓
                              </div>
                              <Button 
                                variant="primary" 
                                onClick={() => handleDownloadVideoWithMusic(track)}
                                style={{
                                  background: 'linear-gradient(135deg, #1a365d 0%, #2b6cb0 100%)',
                                  padding: '0.75rem 1.5rem',
                                  borderRadius: '20px',
                                  fontSize: '1rem',
                                  fontWeight: 600,
                                  boxShadow: '0 8px 16px rgba(43, 108, 176, 0.4)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  position: 'relative',
                                  color: 'white',
                                  border: '2px solid rgba(255, 255, 255, 0.3)',
                                  animation: 'pulse 2s infinite',
                                  transition: 'all 0.3s ease',
                                  zIndex: 1
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.transform = 'translateY(-2px)';
                                  e.currentTarget.style.boxShadow = '0 12px 20px rgba(43, 108, 176, 0.5)';
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.transform = 'translateY(0)';
                                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(43, 108, 176, 0.4)';
                                }}
                              >
                                🎬 Download Video + Music
                              </Button>
                            </div>
                          )}
                          <span style={{
                            background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
                            color: '#4a5568',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '20px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            boxShadow: '0 4px 12px rgba(74, 85, 104, 0.1)',
                            border: '1px solid #e2e8f0'
                          }}>
                            {track.start} → {track.end}
                          </span>
                        </div>
                      </div>

                      <audio
                        ref={audioRefs.current[i]}
                        controls
                        src={track.url || track.audio_url}
                        style={{
                          width: '100%',
                          margin: '2rem 0',
                          borderRadius: '12px',
                          height: '60px'
                        }}
                      />

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1.5rem',
                        marginTop: '2rem'
                      }}>
                        <Button 
                          variant="secondary" 
                          onClick={handlePlaySegment}
                        >
                          ▶ Play Segment
                        </Button>
                        <Button 
                          variant="success" 
                          onClick={() => handleSaveToLibrary(track)}
                        >
                          💾 Save to Library
                        </Button>
                        <Button 
                          variant="warning" 
                          onClick={() => handleDownloadInterval(track, i)}
                        >
                          ⬇️ Download Segment
                        </Button>
                        
                        {/* Video with music download button moved to the top right corner */}
                      </div>
                      
                      {/* Video preview section with music - only shown when renderMusicVideo is enabled */}
                      {renderMusicVideo && (
                        <div style={{
                          marginTop: '2rem',
                          borderTop: '1px solid #e2e8f0',
                          paddingTop: '2rem'
                        }}>
                          <h5 style={{
                            fontSize: '1.4rem',
                            fontWeight: 700,
                            color: '#2c5282',
                            marginBottom: '1.2rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.75rem 1.5rem',
                            background: 'rgba(235, 244, 255, 0.5)',
                            borderRadius: '12px',
                            border: '1px solid #bee3f8',
                            width: 'fit-content'
                          }}>
                            🎬 Video with Music Preview
                          </h5>
                          <div style={{ 
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '1rem'
                          }}>
                            <video
                              src={videoUrl}
                              controls
                              style={{
                                width: '100%',
                                maxWidth: '800px',
                                borderRadius: '12px',
                                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)'
                              }}
                            />
                            <p style={{
                              fontSize: '0.9rem',
                              color: '#718096',
                              fontStyle: 'italic'
                            }}>
                              Note: This is a preview. Audio mixing happens when you download the combined video.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            
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
        {currentStep === 5 && (
          <div style={{
            width: '100%',
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '2rem',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '24px',
            boxShadow: '0 25px 80px rgba(0, 0, 0, 0.15)',
            color: '#2d3748'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                color: '#2d3748',
                marginBottom: '1rem'
              }}>
                🎬 Video Preview
              </h2>
              <p style={{
                color: '#718096',
                fontSize: '1.2rem'
              }}>
                Adjust the music volume and download when ready
              </p>
            </div>

            {/* Loading State */}
            {isGeneratingPreview && (
              <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <div style={{
                  border: '4px solid #f3f4f6',
                  borderTop: '4px solid #667eea',
                  borderRadius: '50%',
                  width: '60px',
                  height: '60px',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 2rem'
                }} />
                <p style={{ fontSize: '1.1rem', color: '#718096' }}>
                  Generating preview video...
                </p>
              </div>
            )}

            {/* Video Player */}
            {!isGeneratingPreview && combinedVideoUrl && (
              <div style={{ marginBottom: '3rem' }}>
                console.log("📹 Combined Video URL:", combinedVideoUrl);

                <video
                  src={combinedVideoUrl}
                  controls
                  style={{
                    width: '100%',
                    maxHeight: '500px',
                    borderRadius: '16px',
                    boxShadow: '0 15px 50px rgba(0, 0, 0, 0.2)'
                  }}
                />
              </div>
            )}
          {!hasBeenSaved ? (
  <Button
    onClick={handleManualSave}
    style={{
      marginTop: '1rem',
      background: '#4299e1',
      color: 'white',
      padding: '0.5rem 1.5rem',
      borderRadius: '8px',
      fontWeight: 'bold',
    }}
  >
    💾 Save Combined Video
  </Button>
) : (
  <div style={{
    marginTop: '1rem',
    background: '#48bb78',
    color: 'white',
    padding: '0.5rem 1.5rem',
    borderRadius: '8px',
    fontWeight: 'bold',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  }}>
    ✅ Saved Successfully!
  </div>
)}
            {/* Volume Control */}
            {!isGeneratingPreview && combinedVideoUrl && (
              <div style={{
                background: 'rgba(102, 126, 234, 0.1)',
                borderRadius: '16px',
                padding: '2rem',
                marginBottom: '3rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <span style={{
                    fontSize: '1.5rem',
                    color: '#667eea'
                  }}>🔊</span>
                  <span style={{
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: '#2d3748'
                  }}>
                    Music Volume: {Math.round(previewMusicVolume * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={previewMusicVolume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '4px',
                    background: '#e2e8f0',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                />
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '0.5rem',
                  fontSize: '0.9rem',
                  color: '#718096'
                }}>
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {!isGeneratingPreview && combinedVideoUrl && (
              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center'
              }}>
                <Button
                  variant="secondary"
                  onClick={() => setCurrentStep(4)}
                  style={{
                    fontSize: '1.1rem',
                    padding: '1rem 2rem'
                  }}
                >
                  ⬅️ Back to Tracks
                </Button>
                
                <Button
                  variant="success"
                  onClick={handleFinalDownload}
                  disabled={isGeneratingPreview}
                  style={{
                    fontSize: '1.1rem',
                    padding: '1rem 2rem'
                  }}
                >
                  {isGeneratingPreview ? 'Preparing...' : '⬇️ Download Video'}
                </Button>
              </div>
            )}
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
                    onMouseDown={(e) => {
                      const move = (me) => handleDrag(me, "start");
                      const up = () => { document.removeEventListener("mousemove", move); document.removeEventListener("mouseup", up); };
                      document.addEventListener("mousemove", move);
                      document.addEventListener("mouseup", up);
                    }}
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
                  >
                    <span style={{color: 'white', transform: 'rotate(90deg)', fontSize: '10px'}}>|||</span>
                  </div>

                  {/* End handle */}
                  <div
                    onMouseDown={(e) => {
                      const move = (me) => handleDrag(me, "end");
                      const up = () => { document.removeEventListener("mousemove", move); document.removeEventListener("mouseup", up); };
                      document.addEventListener("mousemove", move);
                      document.addEventListener("mouseup", up);
                    }}
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
                onClick={handleGoBackToVideoEdit}
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  background: 'rgba(66,153,225,0.08)',
                  border: 'none',
                  color: '#4299e1',
                  borderRadius: '0 0 8px 0',
                  width: '48px',
                  height: '48px',
                  cursor: 'pointer',
                  fontSize: '1.3rem',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '2px 2px 12px rgba(66,153,225,0.12)'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(66,153,225,0.18)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(66,153,225,0.18)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(66,153,225,0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(66,153,225,0.12)';
                }}
                aria-label="Go back to video editing"
              >
                ⬅
              </button>
              <button
                onClick={() => setShowConfigModal(false)}
                style={{
                  position: 'absolute',
                  top: '1.5rem',
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
              <div style={{ textAlign: 'center', marginBottom: '2.2rem', width: '100%' }}>
                <p style={{
                  color: '#a0aec0',
                  fontSize: '1.08rem',
                  fontWeight: 400,
                  margin: 0
                }}>
                  Guide the AI to create your perfect soundtrack
                </p>
              </div>
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
                  YouTube Reference URLs <span style={{color:'#4299e1', fontWeight:400, fontSize:'0.95em'}}>(optional)</span>
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {youtubeUrls.map((url, index) => (
                    <input
                      key={index}
                      type="text"
                      value={url}
                      onChange={e => {
                        const newUrls = [...youtubeUrls];
                        newUrls[index] = e.target.value;
                        setYoutubeUrls(newUrls);
                      }}
                      placeholder={`YouTube URL ${index + 1}`}
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
                  ))}
                </div>
              </div>
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
                  Lyrics <span style={{color:'#4299e1', fontWeight:400, fontSize:'0.95em'}}>(optional)</span>
                </label>
                <textarea
                  value={lyrics}
                  onChange={e => setLyrics(e.target.value)}
                  placeholder="Enter any specific lyrics or themes for your song..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    border: '1.5px solid #2d3748',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    background: '#23272f',
                    color: '#e8e8f0',
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                    transition: 'border 0.2s',
                    outline: 'none',
                    resize: 'vertical',
                    minHeight: '70px',
                    maxHeight: '180px'
                  }}
                  onFocus={e => e.target.style.border = '1.5px solid #4299e1'}
                  onBlur={e => e.target.style.border = '1.5px solid #2d3748'}
                />
              </div>
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
                  Extra Description <span style={{color:'#4299e1', fontWeight:400, fontSize:'0.95em'}}>(optional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="e.g., 'An upbeat, synthwave track for a party scene', 'A calm, ambient background score'"
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    border: '1.5px solid #2d3748',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    background: '#23272f',
                    color: '#e8e8f0',
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                    transition: 'border 0.2s',
                    outline: 'none',
                    resize: 'vertical',
                    minHeight: '50px',
                    maxHeight: '120px'
                  }}
                  onFocus={e => e.target.style.border = '1.5px solid #4299e1'}
                  onBlur={e => e.target.style.border = '1.5px solid #2d3748'}
                />
              </div>
            <div style={{
              marginBottom: '1.2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.8rem',
              background: 'rgba(66,153,225,0.07)',
              padding: '1.1rem 1.5rem',
              borderRadius: '12px',
              border: '1.5px solid #2d3748',
              width: '100%'
            }}>
              <input
                type="checkbox"
                id="instrumental"
                checked={instrumental}
                onChange={e => setInstrumental(e.target.checked)}
                style={{
                  width: '22px',
                  height: '22px',
                  cursor: 'pointer',
                  accentColor: '#4299e1',
                  marginRight: '0.5rem'
                }}
              />
              <label htmlFor="instrumental" style={{
                color: '#e2e8f0',
                fontWeight: 500,
                fontSize: '1.08rem',
                cursor: 'pointer',
                marginBottom: 0
              }}>
                Generate Instrumental Only
              </label>
            </div>
            
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
                Render Music With Video
              </label>
            </div>
            <div style={{ width: '100%', textAlign: 'center', marginTop: '0.5rem' }}>
              <Button
                variant="primary"
                onClick={handleGenerate}
                disabled={isProcessing}
                style={{
                  fontSize: '1.15rem',
                  padding: '1.1rem 0',
                  width: '100%',
                  borderRadius: '8px',
                  background: 'linear-gradient(90deg, #4299e1 0%, #667eea 100%)',
                  color: 'white',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  boxShadow: '0 2px 12px rgba(66,153,225,0.13)',
                  border: 'none',
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
                }}
              >
                {isProcessing ? 'Generating...' : '✨ Generate Music'}
              </Button>
            </div>
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
      
      {/* Fixed download button at the bottom of the page when renderMusicVideo is true and tracks are available */}
      {renderMusicVideo && tracks.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'rgba(0, 0, 0, 0.8)',
          padding: '15px 30px',
          borderRadius: '15px',
          boxShadow: '0 5px 20px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{ color: 'white', marginBottom: '10px', fontWeight: 'bold' }}>
            {isDownloading ? downloadProgress : 'Download Video With Music'}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {tracks.map((track, i) => (
              <Button
                key={i}
                variant="primary"
                onClick={() => handleDownloadVideoWithMusic(track)}
                disabled={isDownloading}
                style={{
                  background: isDownloading 
                    ? 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)'
                    : 'linear-gradient(135deg, #3182CE 0%, #2C5282 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  animation: isDownloading ? 'pulse 2s infinite' : 'none',
                  cursor: isDownloading ? 'not-allowed' : 'pointer',
                  opacity: isDownloading ? 0.7 : 1
                }}
              >
                <span style={{ fontSize: '20px' }}>
                  {isDownloading ? '⏳' : '🎬'}
                </span> 
                {isDownloading ? 'Processing...' : `Track ${i + 1}`}
              </Button>
            ))}
            {currentStep === 5 && combinedVideoUrl && (
          <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '15px 20px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            maxWidth: '300px',
            border: '1px solid #e0e0e0'
          }}>
            <h4 style={{
              margin: '0 0 10px 0',
              color: '#2d3748',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}>
              Last Combined Video
            </h4>
            <a
              href={combinedVideoUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#4c51bf',
                textDecoration: 'none',
                fontSize: '0.9rem',
                wordBreak: 'break-all'
              }}
            >
              View Combined Video
            </a>
          </div>
        )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;