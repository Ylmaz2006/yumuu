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
const [bulkGenerateSegmentCount, setBulkGenerateSegmentCount] = useState(0);
const [completeVideoSegmentCount, setCompleteVideoSegmentCount] = useState(0);
// ADD THESE MISSING FUNCTIONS TO ClipTuneGenerator.js

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

// 3. Create drag handler with overlap detection
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
};// ADD THESE ADDITIONAL MISSING FUNCTIONS TO ClipTuneGenerator.js

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
};const showSegmentBoundaries = (segmentIndex) => {
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

// 3. Add this function to handle setting the current timeline
const handleSetCurrentTimeline = () => {
  if (!selectedSegmentForEdit) return;
  
  const [newStart, newEnd] = getTrimRange();
  const newDuration = newEnd - newStart;
  const segmentIndex = selectedSegmentForEdit.index;
  
  console.log(`🔍 Validating timeline for segment ${segmentIndex + 1}:`);
  console.log(`   New timing: ${formatTimeFromSeconds(newStart)} - ${formatTimeFromSeconds(newEnd)}`);
  
  // ✅ CHECK FOR OVERLAPS (including end time after another segment's start)
  const overlaps = detectSegmentOverlaps(processedVideoResult.segments, segmentIndex, newStart, newEnd);

  // Strict check: segment's end time must not exceed the start time of any other segment
  let strictConflict = false;
  let strictConflictMsg = '';
  processedVideoResult.segments.forEach((seg, idx) => {
    if (idx !== segmentIndex) {
      const segStart = seg.parsed_start !== undefined ? seg.parsed_start : parseFloat(seg.start_time || 0);
      // If newEnd > segStart, that's not allowed
      if (newEnd > segStart) {
        strictConflict = true;
        strictConflictMsg += `Segment ${idx + 1} (starts at ${formatTimeFromSeconds(segStart)})`;
      }
    }
  });

  if (overlaps.length > 0 || strictConflict) {
    let conflictMessages = overlaps.map(overlap => 
      `Segment ${overlap.segmentNumber} (${formatTimeFromSeconds(overlap.start)} - ${formatTimeFromSeconds(overlap.end)})`
    ).join(', ');
    if (strictConflict) {
      conflictMessages += (conflictMessages ? ', ' : '') + strictConflictMsg;
    }
    showMessage(`Timeline overlaps detected with: ${conflictMessages}. Please adjust the timing.`, 'error');
    logToTerminal(`❌ Cannot save: Timeline overlaps with existing segments`, 'error');
    // Optionally, suggest safe boundaries
    const boundaries = calculateSegmentBoundaries(processedVideoResult.segments, segmentIndex);
    logToTerminal(`💡 Safe range: ${formatTimeFromSeconds(boundaries.maxStart)} - ${formatTimeFromSeconds(boundaries.minEnd)}`, 'info');
    return; // Don't save if there are overlaps
  }
  
  // ✅ CHECK VIDEO DURATION BOUNDS
  if (newStart < 0 || newEnd > duration) {
    showMessage(`Timeline extends beyond video bounds (0s - ${formatTimeFromSeconds(duration)}). Please adjust.`, 'error');
    logToTerminal(`❌ Timeline extends beyond video duration`, 'error');
    return;
  }
  
  // ✅ CHECK MINIMUM DURATION
  if (newDuration < 1) {
    showMessage('Segment must be at least 1 second long. Please increase the duration.', 'error');
    logToTerminal(`❌ Segment too short: ${formatTimeFromSeconds(newDuration)}`, 'error');
    return;
  }
  
  console.log(`✅ Timeline validation passed for segment ${segmentIndex + 1}`);
  
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
  
  showMessage(`Timeline updated for segment ${selectedSegmentForEdit.index + 1} - No overlaps detected!`, 'success');
};

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

// 1. FIXED: Remove debouncing and make volume updates immediate
const handleSegmentVolumeChange = async (segmentIndex, newVolume) => {
  const volumeValue = parseFloat(newVolume);
  
  console.log(`🎚️ IMMEDIATE volume change for segment ${segmentIndex + 1}: ${volumeValue}`);
  
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
  
  // Clear any existing timeout
  if (window.volumeUpdateTimeout) {
    clearTimeout(window.volumeUpdateTimeout);
  }
  
  // Set new timeout for regeneration with updated data (NO timeline editing)
  window.volumeUpdateTimeout = setTimeout(async () => {
    await regenerateCompleteVideoWithVolumes(updatedMusicData);
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
// REPLACE your generateMusicForSegment function with this fixed version
// REPLACE your generateMusicForSegment function with this DEBUGGED version:

// REPLACE your generateMusicForSegment function in ClipTuneGenerator.js with this enhanced version
// This automatically combines the generated music with video for immediate playback

// REPLACE your generateMusicForSegment function in ClipTuneGenerator.js with this enhanced version
// This automatically combines the generated music with video for immediate playback

// REPLACE your existing generateMusicForSegment function with this version
// REPLACE your existing generateMusicForSegment function with this updated version
// This adds percentage loading from 0% to 100% and removes the success message

// REPLACE your existing generateMusicForSegment function with this updated version
// This adds percentage loading from 0% to 100% and removes the success message
// REPLACE your existing generateMusicForSegment function with this updated version
// This adds percentage loading from 0% to 100% and removes the success message

// REPLACE your existing generateMusicForSegment function with this updated version
// This adds percentage loading from 0% to 100% and removes the success message

// REPLACE your existing generateMusicForSegment function with this updated version
// This adds percentage loading from 0% to 100% and removes the success message

// REPLACE your existing generateMusicForSegment function with this updated version
// This adds percentage loading from 0% to 100% and removes the success message

// REPLACE your existing generateMusicForSegment function with this updated version
// REPLACE your existing generateMusicForSegment function with this COMPLETE version:

// REPLACE your existing generateMusicForSegment function with this COMPLETE version:

const generateMusicForSegment = async (segment, segmentIndex) => {
  try {
    setSegmentMusicGeneration(prev => ({
      ...prev,
      [segmentIndex]: true,
      [`${segmentIndex}_progress`]: 0
    }));
    
    console.log(`🔍 GENERATING MUSIC FOR SEGMENT ${segmentIndex + 1} WITH TRACK NAME - TRIMMED VIDEO SUPPORT`);
    
    // 🚨 NEW: Get the track name for this segment
    const trackName = getTrackName(segmentIndex);
    console.log(`🎵 Track name: "${trackName}"`);
    
    // 🚨 Handle both trimmed and full video segments
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
      // 🚨 For trimmed video, use segment timing relative to trimmed video
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
    
    const formData = new FormData();
    formData.append('video', selectedFile);
    formData.append('youtubeUrls', JSON.stringify(youtubeUrls.filter(url => url.trim() !== '')));
    formData.append('lyrics', lyrics || '');
    formData.append('extra_description', segment.music_summary || segment.music_details || 'Background music for video segment');
    formData.append('instrumental', 'true');
    
    // 🚨 NEW: Include the track name in the song_title and as separate field
    const songTitle = trackName || `segment_${segmentIndex + 1}${usingAdjustedTiming ? '_adjusted' : ''}${isTrimmedVideo ? '_trimmed' : ''}_${segment.format_used || 'processed'}`;
    formData.append('song_title', songTitle);
    formData.append('track_name', trackName); // 🚨 NEW: Send track name as separate field
    
    formData.append('video_start', segmentStart.toString());
    formData.append('video_end', segmentEnd.toString());

    logToTerminal(`📤 Sending music generation request for "${trackName}"...`, 'info');

    // Call the music generation endpoint
    const response = await fetch(`${API_BASE_URL}/api/generate-segment-music`, {
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
    
    console.log(`✅ RECEIVED MUSIC DATA FOR "${trackName}" (SEGMENT ${segmentIndex + 1}):`, {
      musicData,
      hasUrl: !!musicData.url,
      hasAudioUrl: !!musicData.audio_url,
      hasTrackName: !!musicData.track_name
    });
    
    logToTerminal(`✅ "${trackName}" generated successfully for segment ${segmentIndex + 1}!`, 'success');

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
      throw new Error('No audio URL found in the response');
    }

    console.log(`🎶 EXTRACTED AUDIO URL FOR "${trackName}" (SEGMENT ${segmentIndex + 1}):`, audioUrl);

    // 🚨 Store music data with track name and trimmed video information
    const newMusicData = {
      ...musicData,
      audioUrl: audioUrl,
      trackName: trackName, // 🚨 NEW: Store the track name
      segment: {
        ...segment,
        start_time: segmentStart.toString(),
        end_time: segmentEnd.toString(),
        adjusted_timing: usingAdjustedTiming,
        is_trimmed_video: isTrimmedVideo,
        track_name: trackName // 🚨 NEW: Store track name in segment info too
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
        trackName: trackName, // 🚨 NEW: Include track name in timing info
        trimmedVideoInfo: isTrimmedVideo ? {
          originalTrimStart: processedVideoResult.trim_info.original_start,
          originalTrimEnd: processedVideoResult.trim_info.original_end,
          relativeStart: isTrimmedVideo ? (segmentStart - processedVideoResult.trim_info.original_start) : segmentStart,
          relativeEnd: isTrimmedVideo ? (segmentEnd - processedVideoResult.trim_info.original_start) : segmentEnd
        } : null
      }
    };

    // Store the music data
    setGeneratedSegmentMusic(prev => {
      const updated = {
        ...prev,
        [segmentIndex]: newMusicData
      };
      
      console.log(`🔄 UPDATED generatedSegmentMusic STATE WITH TRACK NAME:`, {
        trackName: trackName,
        segmentIndex: segmentIndex,
        totalSegments: Object.keys(updated).length,
        isTrimmedVideo,
        trimInfo: isTrimmedVideo ? processedVideoResult.trim_info : 'Full video'
      });
      
      return updated;
    });

    logToTerminal(`💾 "${trackName}" data stored for segment ${segmentIndex + 1}`, 'success');

    // Clear loading states
    setSegmentMusicGeneration(prev => {
      const updated = { ...prev };
      delete updated[segmentIndex];
      delete updated[`${segmentIndex}_progress`];
      return updated;
    });

    // ✅ CRITICAL FIX: Update progressive video and WAIT for completion before showing buttons
    logToTerminal(`🎬 Creating progressive video with "${trackName}" (segment ${segmentIndex + 1})...`, 'info');
    
    try {
      const allSegments = processedVideoResult.segments;
      const allMusicData = {
        ...generatedSegmentMusic,
        [segmentIndex]: newMusicData
      };
      
      console.log('📊 Progressive video update data:', {
        totalSegments: allSegments.length,
        segmentsWithMusic: Object.keys(allMusicData).length,
        newSegmentIndex: segmentIndex,
        newTrackName: trackName,
        isTrimmedVideo
      });

      const progressiveFormData = new FormData();
      progressiveFormData.append('video', selectedFile);
      progressiveFormData.append('segments', JSON.stringify(allSegments));
      progressiveFormData.append('musicData', JSON.stringify(allMusicData));
      progressiveFormData.append('videoDuration', duration.toString());
      progressiveFormData.append('newSegmentIndex', segmentIndex.toString());
      
      // Add trimmed video info if applicable
      if (isTrimmedVideo) {
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

      // ✅ ONLY UPDATE STATE AFTER SUCCESSFUL PROGRESSIVE VIDEO CREATION
      setCombinedVideoUrl(progressiveResult.combinedUrl);
      setShowProcessedVideo(true);

      logToTerminal(`✅ Progressive video created successfully with "${trackName}"!`, 'success');
      logToTerminal(`🎵 Active segments: [${progressiveResult.allActiveSegments?.join(', ') || segmentIndex + 1}]`, 'info');
      logToTerminal(`🔗 Video URL: ${progressiveResult.combinedUrl}`, 'success');

      // ✅ NOW UPDATE THE MUSIC DATA WITH PROGRESSIVE VIDEO READY FLAG
      setGeneratedSegmentMusic(prev => ({
        ...prev,
        [segmentIndex]: {
          ...prev[segmentIndex],
          progressiveVideoReady: true, // ✅ ADD THIS FLAG
          progressiveVideoUrl: progressiveResult.combinedUrl
        }
      }));

      // Auto-play the progressive video
      setTimeout(() => {
        const progressiveVideo = document.querySelector('#progressive-video-container video');
        if (progressiveVideo) {
          const playbackStart = newMusicData.actualMusicTiming?.start || segmentStart;
          progressiveVideo.currentTime = playbackStart;
          progressiveVideo.play().catch(err => {
            console.log('Autoplay blocked, user will need to click play');
          });
          logToTerminal(`🎬 Auto-playing "${trackName}" (segment ${segmentIndex + 1}) from progressive video`, 'success');
        }
      }, 500);

      // Show success message with track name
      showMessage(`"${trackName}" generated and video updated for segment ${segmentIndex + 1}!`, 'success');

      // 🚨 NEW: Save to recent tracks with track name
      try {
        await fetch(`${API_BASE_URL}/api/save-recent-track`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: localStorage.getItem('userId'),
            audioUrl: audioUrl,
            duration: `${segmentDuration}s`,
            description: segment.music_summary || description,
            lyrics: lyrics || '',
            youtubeUrls: youtubeUrls.filter(url => url.trim() !== ''),
            start: formatTime(segmentStart),
            end: formatTime(segmentEnd),
            trackName: trackName, // 🚨 NEW: Include track name
            segmentIndex: segmentIndex,
            originalFileName: selectedFile?.name || 'unknown_video'
          })
        });
        logToTerminal(`💾 "${trackName}" saved to recent tracks`, 'success');
      } catch (saveError) {
        console.warn('Failed to save to recent tracks:', saveError);
      }

    } catch (progressiveError) {
      console.error(`❌ Progressive video update failed:`, progressiveError);
      logToTerminal(`⚠️ "${trackName}" generated but video update failed: ${progressiveError.message}`, 'warning');
      showMessage(`"${trackName}" generated for segment ${segmentIndex + 1} but video update failed`, 'warning');
      
      // ✅ STILL MARK MUSIC AS GENERATED BUT WITHOUT PROGRESSIVE VIDEO
      setGeneratedSegmentMusic(prev => ({
        ...prev,
        [segmentIndex]: {
          ...prev[segmentIndex],
          progressiveVideoReady: false, // ✅ MARK AS NOT READY
          progressiveVideoError: progressiveError.message
        }
      }));
    }

    // Clear the selected segment for edit since music has been generated
    if (selectedSegmentForEdit && selectedSegmentForEdit.index === segmentIndex) {
      setSelectedSegmentForEdit(null);
      logToTerminal(`✂️ Segment timing adjustment completed and cleared`, 'info');
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
const debugSegmentMusicData = () => {
  console.log('🔍 DEBUGGING ALL SEGMENT MUSIC DATA:');
  console.log('Current generatedSegmentMusic state:', generatedSegmentMusic);
  
  Object.entries(generatedSegmentMusic).forEach(([index, data]) => {
    console.log(`Segment ${parseInt(index) + 1}:`, {
      hasAudioUrl: !!data.audioUrl,
      audioUrl: data.audioUrl,
      hasActualMusicTiming: !!data.actualMusicTiming,
      actualMusicTiming: data.actualMusicTiming,
      segmentStart: data.segmentStart,
      segmentEnd: data.segmentEnd,
      customVolume: data.customVolume
    });
  });
};
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
const handleDownloadCurrentVideo = async () => {
  try {
    if (!selectedFile || !processedVideoResult || !processedVideoResult.segments) {
      showMessage('Cannot download video – missing video or segment data', 'error');
      return;
    }

    logToTerminal('🎬 Generating complete video from current state...', 'info');
    setIsDownloading(true);

    const formData = new FormData();
    formData.append('video', selectedFile);
    formData.append('segments', JSON.stringify(processedVideoResult.segments));
    formData.append('musicData', JSON.stringify(generatedSegmentMusic));
    formData.append('userId', localStorage.getItem('userId'));

    const response = await fetch(`${API_BASE_URL}/api/create-complete-video`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (!response.ok || !data?.videoUrl) {
      throw new Error(data.error || 'Failed to generate video');
    }

    const downloadUrl = data.videoUrl;
    logToTerminal('✅ Video ready, downloading...', 'success');

    // Trigger download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'cliptune_video.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showMessage('Video downloaded successfully!', 'success');
  } catch (err) {
    console.error('❌ Download failed:', err);
    showMessage(`Download failed: ${err.message}`, 'error');
  } finally {
    setIsDownloading(false);
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
const createDragHandlerWithChangeDetection = (type) => {
  return (e) => {
    e.preventDefault();
    
    const rect = trackRef.current.getBoundingClientRect();
    
    const move = (moveEvent) => {
      const currentX = Math.max(0, Math.min(moveEvent.clientX - rect.left, THUMB_WIDTH * NUM_THUMBS));
      const width = THUMB_WIDTH * NUM_THUMBS;
      
      if (type === "start") {
        const newStartX = Math.min(currentX, endX - 10);
        setStartX(newStartX);
        const newTime = (newStartX / width) * duration;
        if (videoPreviewRef.current && !isNaN(newTime)) {
          videoPreviewRef.current.currentTime = newTime;
        }
      } else {
        const newEndX = Math.max(currentX, startX + 10);
        setEndX(newEndX);
        const newTime = (newEndX / width) * duration;
        if (videoPreviewRef.current && !isNaN(newTime)) {
          videoPreviewRef.current.currentTime = newTime;
        }
      }
      
      // Mark as having unsaved changes if we're in edit mode
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

// 7. Add keyboard support with useEffect
// REPLACE the existing keyboard useEffect with this fixed version:

// ALSO ADD this helper function to provide visual feedback when keyboard movement is blocked:

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

    // 🚨 NEW: Get the current timeline selection (trimmed section)
    const [trimStart, trimEnd] = getTrimRange();
    const trimmedDuration = trimEnd - trimStart;
    
    logToTerminal(`✂️ Trimmed section: ${formatTimeFromSeconds(trimStart)} - ${formatTimeFromSeconds(trimEnd)}`, 'info');
    logToTerminal(`⏱️ Trimmed duration: ${formatTimeFromSeconds(trimmedDuration)}`, 'info');
    
    if (trimmedDuration <= 0) {
      throw new Error('Invalid trim selection. Please select a valid time range.');
    }

    // 🚨 NEW: Create FormData with the TRIMMED video section
    const formData = new FormData();
    formData.append('video', selectedFile);
    formData.append('extra_prompt', processingInstructions);
    formData.append('video_start', trimStart.toString()); // 🚨 ADD: Trim start time
    formData.append('video_end', trimEnd.toString());     // 🚨 ADD: Trim end time
    formData.append('total_seconds', Math.floor(trimmedDuration)); // 🚨 CHANGE: Send trimmed duration

    logToTerminal('📤 Uploading and analyzing TRIMMED video section...', 'info');
    logToTerminal(`📊 Trimmed duration sent: ${Math.floor(trimmedDuration)} seconds`, 'info');
    logToTerminal(`📊 Trim range: ${trimStart}s - ${trimEnd}s`, 'info');

    // 🚨 NEW: Use the updated backend endpoint that handles trimming
    const response = await fetch('http://localhost:3001/api/cliptune-upload-trimmed', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.details || errorData.error || 'ClipTune processing failed');
    }

    const result = await response.json();
    
    logToTerminal('✅ ClipTune analysis completed successfully!', 'success');
    
    if (!result.success || !result.result || !result.result.segments) {
      throw new Error('No segments found in ClipTune result');
    }

    const rawSegments = result.result.segments;
    logToTerminal(`📋 Received ${rawSegments.length} segments from ClipTune (for trimmed video)`, 'info');
    
    // 🚨 CHANGE: Process segments with trimmed duration instead of full duration
    logToTerminal('🔄 Processing segments for trimmed video...', 'info');
    
    const processedSegments = processClipTuneSegments(rawSegments, trimmedDuration);
    
    if (processedSegments.length === 0) {
      logToTerminal('⚠️ No valid segments after processing - all segments had timing issues', 'error');
      showMessage('No valid segments found. Check video duration and segment timings.', 'warning');
      return;
    }
    
    if (processedSegments.length < rawSegments.length) {
      const skipped = rawSegments.length - processedSegments.length;
      logToTerminal(`⚠️ Skipped ${skipped} invalid segments due to timing issues`, 'info');
    }
    
    logToTerminal(`🎯 Successfully processed ${processedSegments.length} valid music segments`, 'success');
    
    // Log processed segment details (relative to trimmed video)
    processedSegments.forEach((segment, index) => {
      logToTerminal(
        `   Segment ${index + 1}: ${formatTimeFromSeconds(segment.parsed_start)} - ${formatTimeFromSeconds(segment.parsed_end)} ` +
        `(${formatTimeFromSeconds(segment.duration)}) [TRIMMED VIDEO]`, 
        'info'
      );
      
      if (segment.music_summary) {
        logToTerminal(`      🎵 AI Description: ${segment.music_summary.slice(0, 60)}...`, 'info');
      }
    });
    
    // Store the PROCESSED segments for display
    setVideoSegments(processedSegments);
    setShowFullVideoAnalysis(true);
    
    // 🚨 NEW: Store trimmed video information
    setProcessedVideoResult({
      ...result.result,
      segments: processedSegments,
      original_segments: rawSegments,
      trimmed_info: {
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
        processing_timestamp: new Date().toISOString()
      }
    });
    setShowProcessedVideo(true);
    
    // 🚨 NEW: Update the video preview to show only trimmed section
    if (videoPreviewRef.current) {
      videoPreviewRef.current.currentTime = trimStart;
      // Optional: Set up video to loop within trimmed range
      const handleTimeUpdate = () => {
        if (videoPreviewRef.current.currentTime >= trimEnd) {
          videoPreviewRef.current.currentTime = trimStart;
        }
      };
      videoPreviewRef.current.addEventListener('timeupdate', handleTimeUpdate);
    }
    
    // Clear any existing generated music data since we have new segments
    setGeneratedSegmentMusic({});
    setSegmentMusicGeneration({});
    
    logToTerminal('✅ Trimmed video analysis complete! Ready for music generation.', 'success');
    logToTerminal(`📊 Processing Summary:`, 'info');
    logToTerminal(`   • Analyzed trimmed section: ${formatTimeFromSeconds(trimStart)} - ${formatTimeFromSeconds(trimEnd)}`, 'info');
    logToTerminal(`   • Trimmed duration: ${formatTimeFromSeconds(trimmedDuration)}`, 'info');
    logToTerminal(`   • Valid segments found: ${processedSegments.length}`, 'info');
    
    showMessage(
      `Found ${processedSegments.length} segments in trimmed video${processedSegments.length < rawSegments.length ? ` (${rawSegments.length - processedSegments.length} skipped)` : ''}. Click "Generate Music" on each segment.`, 
      'success'
    );

  } catch (error) {
    console.error('❌ ClipTune processing error:', error);
    logToTerminal(`❌ Error: ${error.message}`, 'error');
    
    if (error.message.includes('fetch')) {
      logToTerminal(`🔧 Suggestion: Check if the ClipTune backend is running`, 'info');
    } else if (error.message.includes('segments')) {
      logToTerminal(`🔧 Suggestion: Try different processing instructions or check video content`, 'info');
    }
    
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
const OverlapWarningBanner = () => {
  if (!selectedSegmentForEdit || !processedVideoResult?.segments) return null;
  
  const [currentStart, currentEnd] = getTrimRange();
  const overlaps = detectSegmentOverlaps(
    processedVideoResult.segments, 
    selectedSegmentForEdit.index, 
    currentStart, 
    currentEnd
  );
  
  if (overlaps.length === 0) return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      color: 'white',
      padding: '1rem 2rem',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(239, 68, 68, 0.4)',
      zIndex: 1001,
      border: '2px solid rgba(255, 255, 255, 0.2)',
      animation: 'slideDown 0.3s ease-out, pulse 2s infinite',
      maxWidth: '90vw',
      textAlign: 'center'
    }}>
      <style>{`
        @keyframes slideDown {
          0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: translateX(-50%) scale(1); }
          50% { transform: translateX(-50%) scale(1.02); }
        }
      `}</style>
      
      <div style={{
        fontSize: '1.1rem',
        fontWeight: 'bold',
        marginBottom: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem'
      }}>
        ⚠️ TIMELINE OVERLAP DETECTED!
      </div>
      
      <div style={{ fontSize: '0.9rem', opacity: 0.95 }}>
        Segment {selectedSegmentForEdit.index + 1} overlaps with: {' '}
        <strong>
          {overlaps.map(o => `Segment ${o.segmentNumber}`).join(', ')}
        </strong>
      </div>
      
      <div style={{
        fontSize: '0.8rem',
        marginTop: '0.5rem',
        opacity: 0.9,
        fontStyle: 'italic'
      }}>
        Adjust the timeline handles to remove overlaps before saving
      </div>
    </div>
  );
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
  const x = Math.max(0, Math.min(e.clientX - rect.left, THUMB_WIDTH * NUM_THUMBS));

  setLastDragged(type);
  
  if (type === "start") {
    const newStartX = Math.min(x, endX - 10);
    setStartX(newStartX);
    
    // Immediately update video time for start handle
    const width = THUMB_WIDTH * NUM_THUMBS;
    const newTime = (newStartX / width) * duration;
    if (videoPreviewRef.current && !isNaN(newTime)) {
      videoPreviewRef.current.currentTime = newTime;
    }
  } else {
    const newEndX = Math.max(x, startX + 10);
    setEndX(newEndX);
    
    // Immediately update video time for end handle
    const width = THUMB_WIDTH * NUM_THUMBS;
    const newTime = (newEndX / width) * duration;
    if (videoPreviewRef.current && !isNaN(newTime)) {
      videoPreviewRef.current.currentTime = newTime;
    }
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
// 🚨 NEW: Function to calculate segment constraints and detect overlaps
const calculateSegmentConstraints = (allSegments, currentIndex) => {
  const currentSegment = allSegments[currentIndex];
  if (!currentSegment) return { hasOverlap: false, conflicts: [], maxAllowedEnd: Infinity };
  
  const currentStart = currentSegment.parsed_start !== undefined 
    ? currentSegment.parsed_start 
    : parseFloat(currentSegment.start_time || 0);
  const currentEnd = currentSegment.parsed_end !== undefined 
    ? currentSegment.parsed_end 
    : parseFloat(currentSegment.end_time || currentStart + 30);
  
  const conflicts = [];
  let maxAllowedEnd = duration; // Default to video duration
  
  // Check against all other segments
  allSegments.forEach((otherSegment, otherIndex) => {
    if (otherIndex === currentIndex || !otherSegment) return;
    
    const otherStart = otherSegment.parsed_start !== undefined 
      ? otherSegment.parsed_start 
      : parseFloat(otherSegment.start_time || 0);
    const otherEnd = otherSegment.parsed_end !== undefined 
      ? otherSegment.parsed_end 
      : parseFloat(otherSegment.end_time || otherStart + 30);
    
    // Check for temporal overlap
    const hasOverlap = (currentStart < otherEnd && currentEnd > otherStart);
    
    if (hasOverlap) {
      conflicts.push({
        segmentIndex: otherIndex,
        conflictStart: Math.max(currentStart, otherStart),
        conflictEnd: Math.min(currentEnd, otherEnd),
        otherSegmentStart: otherStart,
        otherSegmentEnd: otherEnd
      });
    }
    
    // If the other segment starts after our segment starts,
    // our segment can't end after the other segment starts
    if (otherStart > currentStart && otherStart < maxAllowedEnd) {
      maxAllowedEnd = otherStart;
    }
  });
  
  return {
    hasOverlap: conflicts.length > 0,
    conflicts,
    maxAllowedEnd,
    suggestedEnd: Math.min(maxAllowedEnd, currentEnd)
  };
};

// 🚨 NEW: Enhanced timeline edit function with constraints
const handleStartTimelineEditWithConstraints = (segment, segmentIndex, constraints) => {
  // Store the constraints for use during editing
  setSelectedSegmentForEdit({ 
    segment, 
    index: segmentIndex, 
    constraints 
  });
  
  // Store original timeline state
  setOriginalTimelineState({ startX, endX });
  
  // Jump to segment but respect constraints
  jumpToClipTuneSegmentWithConstraints(segment, segmentIndex, constraints);
  
  setHasUnsavedTimelineChanges(false);
  
  logToTerminal(`✂️ Started editing timeline for segment ${segmentIndex + 1} with overlap constraints`, 'info');
  if (constraints.hasOverlap) {
    logToTerminal(`⚠️ Warning: Segment has ${constraints.conflicts.length} overlap(s). Max end time: ${formatTimeFromSeconds(constraints.maxAllowedEnd)}`, 'warning');
  }
  logToTerminal(`💡 Tip: Use arrow keys for fine adjustments (Shift+← → for start handle, ← → for end handle)`, 'info');
};

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

// ✅ REPLACE your handleRestoreSegmentMusic function with this FIXED version:

// ✅ FIXED: handleRestoreSegmentMusic function
// ✅ COMPLETE FIXED VERSION: Restores previously removed music for a segment


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

    // ✅ SEND TO BACKEND with proper handling for no music segments
    const completeVideoFormData = new FormData();
    completeVideoFormData.append('video', selectedFile);
    completeVideoFormData.append('segments', JSON.stringify(validatedSegments));
    completeVideoFormData.append('musicData', JSON.stringify(validatedMusicData));
    completeVideoFormData.append('videoDuration', duration.toString());
    completeVideoFormData.append('allowEmptyMusic', 'true'); // Flag for backend

    logToTerminal(`📤 Sending regeneration request: ${activeSegmentCount} music segments...`, 'info');

    const completeVideoResponse = await fetch(`${API_BASE_URL}/api/create-complete-video`, {
      method: 'POST',
      body: completeVideoFormData,
    });

    if (!completeVideoResponse.ok) {
      const errorData = await completeVideoResponse.json();
      throw new Error(errorData.error || 'Failed to regenerate video');
    }

    const completeVideoResult = await completeVideoResponse.json();

    if (completeVideoResult.combinedUrl) {
      setCombinedVideoUrl(completeVideoResult.combinedUrl);
      logToTerminal('✅ Video regenerated successfully!', 'success');
      
      if (removedSegmentCount > 0 && activeSegmentCount > 0) {
        showMessage(`Video updated! ${removedSegmentCount} segment(s) removed, ${activeSegmentCount} active`, 'success');
      } else if (removedSegmentCount > 0 && activeSegmentCount === 0) {
        showMessage(`Video updated! All music removed (${removedSegmentCount} segments)`, 'success');
      } else {
        showMessage('Video updated successfully!', 'success');
      }
    } else {
      throw new Error('No combined video URL received');
    }

  } catch (error) {
    console.error('❌ Error in regenerateCompleteVideoWithoutRemovedSegments:', error);
    logToTerminal(`❌ Failed to regenerate video: ${error.message}`, 'error');
    throw error; // Re-throw for caller handling
  } finally {
    setIsGeneratingPreview(false);
  }
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
const renderOverlapIndicators = () => {
  if (!selectedSegmentForEdit || !processedVideoResult?.segments) return null;
  
  const [currentStart, currentEnd] = getTrimRange();
  const overlaps = detectSegmentOverlaps(
    processedVideoResult.segments, 
    selectedSegmentForEdit.index, 
    currentStart, 
    currentEnd
  );
  
  if (overlaps.length === 0) return null;
  
  const width = THUMB_WIDTH * NUM_THUMBS;
  
  return overlaps.map((overlap, index) => {
    const overlapStartX = (overlap.overlapStart / duration) * width;
    const overlapEndX = (overlap.overlapEnd / duration) * width;
    const overlapWidth = overlapEndX - overlapStartX;
    
    return (
      <div
        key={index}
        style={{
          position: 'absolute',
          top: 0,
          left: overlapStartX,
          width: overlapWidth,
          height: '100%',
          background: 'rgba(255, 0, 0, 0.7)',
          border: '2px solid #ff0000',
          borderRadius: '4px',
          pointerEvents: 'none',
          zIndex: 15,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <span style={{
          color: 'white',
          fontSize: '0.7rem',
          fontWeight: 'bold',
          textShadow: '0 1px 2px rgba(0,0,0,0.8)'
        }}>
          OVERLAP!
        </span>
      </div>
    );
  });
};
const enhancedTimelineControlButtons = () => {
  if (!selectedSegmentForEdit) return null;
  
  const [currentStart, currentEnd] = getTrimRange();
  const currentDuration = currentEnd - currentStart;
  const hasChanges = hasUnsavedTimelineChanges;
  
  // Check for potential overlaps in real-time
  const overlaps = detectSegmentOverlaps(
    processedVideoResult?.segments || [], 
    selectedSegmentForEdit.index, 
    currentStart, 
    currentEnd
  );
  const hasOverlaps = overlaps.length > 0;
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(30, 41, 59, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '16px',
      padding: '1.5rem 2rem',
      border: hasOverlaps ? '2px solid #ef4444' : '2px solid rgba(102, 126, 234, 0.3)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      zIndex: 1002,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      color: 'white',
      minWidth: '400px',
      animation: 'slideUpIn 0.3s ease-out'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
        <div style={{
          fontSize: '1.1rem',
          fontWeight: 'bold',
          color: hasOverlaps ? '#ef4444' : '#667eea',
          marginBottom: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          <span>{hasOverlaps ? '⚠️' : '✂️'}</span>
          Editing Segment {selectedSegmentForEdit.index + 1}
          {hasOverlaps && <span style={{ fontSize: '0.8rem', color: '#ef4444' }}>- OVERLAP DETECTED!</span>}
        </div>
        
        <div style={{
          fontSize: '0.9rem',
          color: 'rgba(255, 255, 255, 0.8)'
        }}>
          {formatTimeFromSeconds(currentStart)} - {formatTimeFromSeconds(currentEnd)} 
          <span style={{ color: hasOverlaps ? '#ef4444' : '#48bb78', marginLeft: '0.5rem' }}>
            ({formatTimeFromSeconds(currentDuration)})
          </span>
        </div>
        
        {hasOverlaps && (
          <div style={{
            fontSize: '0.75rem',
            color: '#ef4444',
            marginTop: '0.5rem',
            background: 'rgba(239, 68, 68, 0.1)',
            padding: '0.5rem',
            borderRadius: '6px',
            border: '1px solid rgba(239, 68, 68, 0.3)'
          }}>
            ⚠️ Overlaps with: {overlaps.map(o => `Segment ${o.segmentNumber}`).join(', ')}
          </div>
        )}
      </div>
      
      {/* Buttons */}
      <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
        <button
          onClick={handleCancelTimelineEdit}
          style={{
            flex: '1',
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
        >
          <span>❌</span>
          Cancel (Esc)
        </button>
        
        <button
          onClick={handleSetCurrentTimeline}
          disabled={hasOverlaps} // Disable if overlaps detected
          style={{
            flex: '1',
            padding: '0.75rem 1.5rem',
            background: hasOverlaps 
              ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
              : hasChanges 
              ? 'linear-gradient(135deg, #38a169 0%, #48bb78 100%)'
              : 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: hasOverlaps ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            opacity: hasOverlaps ? 0.6 : 1
          }}
        >
          <span>{hasOverlaps ? '🚫' : hasChanges ? '💾' : '✅'}</span>
          {hasOverlaps ? 'Fix Overlaps First' : hasChanges ? 'Save Changes (Enter)' : 'Set Timeline (Enter)'}
        </button>
      </div>
    </div>
  );
};
// ✅ ADDITIONAL: Debug function to check segment data
const debugSegmentData = () => {
  console.log('🔍 DEBUGGING SEGMENT DATA:');
  console.log('processedVideoResult.segments:', processedVideoResult?.segments);
  
  processedVideoResult?.segments?.forEach((segment, index) => {
    console.log(`Segment ${index + 1}:`, {
      segment: segment,
      start_time: segment?.start_time,
      end_time: segment?.end_time,
      parsed_start: segment?.parsed_start,
      parsed_end: segment?.parsed_end,
      music_summary: segment?.music_summary
    });
  });
  
  console.log('generatedSegmentMusic:', generatedSegmentMusic);
};

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
const createDragHandlerWithConstraints = (type) => {
  return (e) => {
    e.preventDefault();
    
    const rect = trackRef.current.getBoundingClientRect();
    const constraints = selectedSegmentForEdit?.constraints;
    
    const move = (moveEvent) => {
      const currentX = Math.max(0, Math.min(moveEvent.clientX - rect.left, THUMB_WIDTH * NUM_THUMBS));
      const width = THUMB_WIDTH * NUM_THUMBS;
      
      if (type === "start") {
        const newStartX = Math.min(currentX, endX - 10);
        setStartX(newStartX);
        const newTime = (newStartX / width) * duration;
        if (videoPreviewRef.current && !isNaN(newTime)) {
          videoPreviewRef.current.currentTime = newTime;
        }
      } else {
        let newEndX = Math.max(currentX, startX + 10);
        
        // 🚨 Apply constraints to end handle
        if (constraints && constraints.maxAllowedEnd < duration) {
          const maxEndPosition = (constraints.maxAllowedEnd / duration) * width;
          newEndX = Math.min(newEndX, maxEndPosition);
        }
        
        setEndX(newEndX);
        const newTime = (newEndX / width) * duration;
        if (videoPreviewRef.current && !isNaN(newTime)) {
          videoPreviewRef.current.currentTime = newTime;
        }
      }
      
      setHasUnsavedTimelineChanges(true);
    };
    
    const up = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
    
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  };
};
const createDragHandlerWithFeedback = (type) => {
  return (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragType(type);
    
    const rect = trackRef.current.getBoundingClientRect();
    
    const move = (moveEvent) => {
      const currentX = Math.max(0, Math.min(moveEvent.clientX - rect.left, THUMB_WIDTH * NUM_THUMBS));
      const width = THUMB_WIDTH * NUM_THUMBS;
      
      if (type === "start") {
        const newStartX = Math.min(currentX, endX - 10);
        setStartX(newStartX);
        throttledVideoUpdate((newStartX / width) * duration);
      } else {
        const newEndX = Math.max(currentX, startX + 10);
        setEndX(newEndX);
        throttledVideoUpdate((newEndX / width) * duration);
      }
    };
    
    const up = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
      setIsDragging(false);
      setDragType(null);
      
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

  // 🚨 NEW: Validate track name
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
  
  // 🚨 NEW: Include track name in the generation
  formData.append('song_title', trackName.trim());
  formData.append('track_name', trackName.trim());
  
  formData.append('video_start', start.toString());
  formData.append('video_end', end.toString());

  try {
    setIsProcessing(true);
    setShowConfigModal(false);
    setCurrentStep(1);

    logToTerminal(`🎵 Generating "${trackName.trim()}" with AI guidance...`, 'info');
    logToTerminal(`📊 Settings: ${instrumental ? 'Instrumental' : 'With vocals'}, ${renderMusicVideo ? 'With video' : 'Audio only'}`, 'info');

    const res = await fetch(`${API_BASE_URL}/api/process-video`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Music generation failed. Please try again.');
    }

    const tracksToProcess = Array.isArray(data.tracks) ? data.tracks : [data];
    
    // 🚨 NEW: Add track name to each generated track
    const tracksWithNames = tracksToProcess.map((track, index) => ({
      ...track,
      trackName: tracksToProcess.length > 1 ? `${trackName.trim()}_${index + 1}` : trackName.trim(),
      title: tracksToProcess.length > 1 ? `${trackName.trim()} (Version ${index + 1})` : trackName.trim(),
      originalTrackName: trackName.trim()
    }));

    setTracks(tracksWithNames);

    // Save each generated track as recent track with track name
    for (const track of tracksWithNames) {
      await saveRecentTrack(track, start, end);
    }

    showMessage(`"${trackName.trim()}" generated successfully!`, 'success');
    logToTerminal(`✅ "${trackName.trim()}" generation completed with ${tracksWithNames.length} version(s)`, 'success');

    // After saving, fetch updated recent tracks
    if (userId) fetchRecentTracks(userId);

  } catch (err) {
    console.error('Error generating music:', err);
    showMessage(err.message, 'error');
    logToTerminal(`❌ Failed to generate "${trackName}": ${err.message}`, 'error');
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

      {/* Selected for editing indicator */}
{selectedSegmentForEdit && selectedSegmentForEdit.index === index && (
  <div style={{
    position: 'absolute',
    top: '-8px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#667eea',
    color: 'white',
    padding: '0.3rem 0.8rem',
    borderRadius: '12px',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    border: '2px solid white',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
    zIndex: 10
  }}>
    ✂️ SELECTED FOR EDITING
  </div>
)}
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
{showDropdownMenu && (
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

      {/* Content Area with proper visibility */}
      <div style={{
        maxHeight: '300px', // Limit content height
        overflowY: 'auto', // Enable scrolling for content
        paddingRight: '0.5rem' // Space for scrollbar
      }}>
        {showRecentTracks ? (
          recentTracks.length === 0 ? (
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
          border: '2px dashed rgba(255, 255, 255, 0.3)',
          borderRadius: '20px',
          padding: '3rem 2rem',
          transition: 'all 0.3s ease',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(15px)',
          cursor: 'pointer',
          textAlign: 'center',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          maxWidth: '400px',
          width: '100%',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => {
          e.target.style.borderColor = 'rgba(102, 126, 234, 0.6)';
          e.target.style.background = 'rgba(102, 126, 234, 0.1)';
          e.target.style.transform = 'translateY(-4px)';
          e.target.style.boxShadow = '0 12px 40px rgba(102, 126, 234, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          e.target.style.background = 'rgba(255, 255, 255, 0.05)';
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
        }}
      >
        <div style={{ 
          fontSize: '4rem', 
          marginBottom: '1rem',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
        }}>📁</div>
        <div style={{ 
          fontSize: '1.5rem', 
          color: 'white', 
          fontWeight: 700, 
          marginBottom: '0.5rem',
          textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
        }}>
          Upload Your Video
        </div>
        <div style={{ 
          color: 'rgba(255, 255, 255, 0.7)', 
          fontSize: '1rem',
          fontWeight: 400,
          textShadow: '0 1px 4px rgba(0, 0, 0, 0.2)'
        }}>
          MP4, MOV, AVI, WebM supported
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

    {/* ✅ FIXED: Generated Tracks Display with interval play/download */}
    {tracks.length > 0 && !isProcessing && (
      <div style={{
        width: '100%',
        maxWidth: '800px'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <h2 style={{
            color: 'white',
            fontSize: '2rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
            textShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
          }}>
            🎉 Music Generated Successfully!
          </h2>
          <p style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '1.1rem',
            margin: 0
          }}>
            Your AI-generated tracks are ready to play and download
          </p>
        </div>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          {tracks.map((track, index) => {
            // ✅ FIX: Ensure audioRefs are properly initialized
            if (!audioRefs.current[index]) {
              audioRefs.current[index] = React.createRef();
            }

            // ✅ FIX: Get the correct audio URL from different possible properties
            const audioUrl = track.audioUrl || track.url || track.audio_url || track.audio;
            const trackTitle = track.trackName || track.title || `Track ${index + 1}`;
            
            console.log(`🎵 Track ${index + 1} data:`, {
              audioUrl,
              trackTitle,
              hasAudioUrl: !!audioUrl,
              trackObject: track
            });

            // ✅ HELPER: Convert timestamp to seconds
            const convertTimestampToSeconds = (timestamp) => {
              if (typeof timestamp === 'number') return timestamp;
              if (!timestamp || typeof timestamp !== 'string') return 0;
              
              const parts = timestamp.split(':').map(Number);
              if (parts.length === 2) {
                return parts[0] * 60 + parts[1]; // MM:SS
              } else if (parts.length === 3) {
                return parts[0] * 3600 + parts[1] * 60 + parts[2]; // HH:MM:SS
              }
              return 0;
            };

            // ✅ FIXED: Play ONLY the interval
            const handlePlayInterval = async () => {
              const audio = audioRefs.current[index]?.current;
              if (!audio || !audioUrl) {
                showMessage('Audio not available', 'error');
                return;
              }

              try {
                // Parse start and end times
                const startSeconds = convertTimestampToSeconds(track.start || '0:00');
                const endSeconds = convertTimestampToSeconds(track.end || '0:30');
                
                console.log(`🎵 Playing interval: ${track.start} (${startSeconds}s) to ${track.end} (${endSeconds}s)`);
                
                // Set audio source if needed
                if (audio.src !== audioUrl) {
                  audio.src = audioUrl;
                }

                // Jump to start time and play
                audio.currentTime = startSeconds;
                await audio.play();
                
                showMessage(`Playing "${trackTitle}" interval: ${track.start} - ${track.end}`, 'success');

                // Stop at end time
                const stopAtEndTime = () => {
                  if (audio.currentTime >= endSeconds) {
                    audio.pause();
                    audio.removeEventListener('timeupdate', stopAtEndTime);
                    console.log(`⏸️ Stopped at ${audio.currentTime}s (target: ${endSeconds}s)`);
                    showMessage('Interval playback finished', 'info');
                  }
                };
                
                audio.addEventListener('timeupdate', stopAtEndTime);

                // Cleanup listeners
                const cleanup = () => {
                  audio.removeEventListener('timeupdate', stopAtEndTime);
                  audio.removeEventListener('ended', cleanup);
                  audio.removeEventListener('pause', cleanup);
                };
                
                audio.addEventListener('ended', cleanup);
                audio.addEventListener('pause', cleanup);

              } catch (error) {
                console.error('❌ Interval play error:', error);
                showMessage(`Failed to play interval: ${error.message}`, 'error');
              }
            };

            // ✅ FIXED: Download ONLY the interval
            const handleDownloadInterval = async () => {
              if (!audioUrl) {
                showMessage('Audio URL not available for download.', 'error');
                return;
              }

              try {
                // Parse start and end times
                const startSeconds = convertTimestampToSeconds(track.start || '0:00');
                const endSeconds = convertTimestampToSeconds(track.end || '0:30');
                const duration = endSeconds - startSeconds;

                console.log(`📥 Downloading interval: ${track.start} (${startSeconds}s) to ${track.end} (${endSeconds}s)`);
                console.log(`⏰ Duration: ${duration}s`);
                
                showMessage(`Preparing interval download: ${track.start} - ${track.end}...`, 'info');

                // Try server-side trimming first
                try {
                  const trimResponse = await fetch(`${API_BASE_URL}/api/trim-audio`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                      audioUrl: audioUrl,
                      start: startSeconds,
                      duration: duration,
                      trackName: trackTitle
                    })
                  });

                  if (trimResponse.ok) {
                    const trimData = await trimResponse.json();
                    
                    if (trimData.trimmedUrl) {
                      // Download the trimmed audio
                      const fileResponse = await fetch(trimData.trimmedUrl);
                      const blob = await fileResponse.blob();
                      
                      const blobUrl = window.URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = blobUrl;
                      link.download = `${trackTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}_${track.start.replace(':', '-')}-${track.end.replace(':', '-')}.mp3`;
                      link.style.display = 'none';
                      
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      
                      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
                      
                      showMessage(`Interval downloaded: ${track.start} - ${track.end}`, 'success');
                      return;
                    }
                  }
                  
                  throw new Error('Server trimming failed');
                  
                } catch (serverError) {
                  console.warn('Server trimming failed, trying direct download with time markers...');
                  
                  // Fallback: Download full audio with time info in filename
                  const response = await fetch(audioUrl);
                  const blob = await response.blob();
                  
                  const blobUrl = window.URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = blobUrl;
                  link.download = `${trackTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}_FULL_AUDIO_Interval_${track.start.replace(':', '-')}-${track.end.replace(':', '-')}.mp3`;
                  link.style.display = 'none';
                  
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  
                  setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
                  
                  showMessage(`Full audio downloaded with interval info: ${track.start} - ${track.end}`, 'warning');
                }

              } catch (error) {
                console.error('❌ Interval download error:', error);
                
                // Last resort: open in new tab with time fragment
                try {
                  const startSeconds = convertTimestampToSeconds(track.start || '0:00');
                  const endSeconds = convertTimestampToSeconds(track.end || '0:30');
                  const urlWithTime = `${audioUrl}#t=${startSeconds},${endSeconds}`;
                  window.open(urlWithTime, '_blank');
                  showMessage('Download failed. Opened in new tab with time markers.', 'warning');
                } catch (openError) {
                  showMessage(`Download failed: ${error.message}`, 'error');
                }
              }
            };

            return (
              <div
                key={index}
                style={{
                  background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  padding: '1.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.3s ease'
                }}
              >
                {/* Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)'
                    }}>
                      🎵
                    </div>
                    <div>
                      <h4 style={{
                        color: 'white',
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        margin: 0,
                        textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                      }}>
                        {trackTitle}
                      </h4>
                      <p style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.85rem',
                        margin: 0,
                        fontWeight: 500
                      }}>
                        {track.start || '0:00'} → {track.end || '0:30'} • {track.duration || '30s'}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    padding: '0.375rem 0.875rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    ✓ Ready
                  </div>
                </div>

                {/* ✅ FIXED: Audio element with proper error handling */}
                {audioUrl ? (
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '12px',
                    padding: '1rem',
                    marginBottom: '1rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <audio
                      ref={audioRefs.current[index]}
                      controls
                      style={{
                        width: '100%',
                        borderRadius: '8px',
                        height: '50px'
                      }}
                      onError={(e) => {
                        console.error(`❌ Audio error for track ${index + 1}:`, e);
                        showMessage(`Audio loading failed for "${trackTitle}"`, 'error');
                      }}
                      onLoadedData={() => {
                        console.log(`✅ Audio loaded successfully for track ${index + 1}`);
                      }}
                    >
                      <source src={audioUrl} type="audio/mpeg" />
                      <source src={audioUrl} type="audio/wav" />
                      <source src={audioUrl} type="audio/ogg" />
                      Your browser does not support the audio element.
                    </audio>
                    
                    {/* Debug info (remove in production) */}
                    <div style={{
                      fontSize: '0.7rem',
                      color: 'rgba(255, 255, 255, 0.5)',
                      marginTop: '0.5rem',
                      fontFamily: 'monospace',
                      textAlign: 'center'
                    }}>
                      Audio URL: {audioUrl.substring(0, 50)}...
                    </div>
                  </div>
                ) : (
                  <div style={{
                    background: '#fed7d7',
                    color: '#c53030',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    textAlign: 'center'
                  }}>
                    ⚠️ Audio URL not available for this track
                  </div>
                )}

                {/* ✅ NEW: Interval Info Display */}
                <div style={{
                  marginBottom: '1rem',
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  border: '1px solid rgba(59, 130, 246, 0.2)'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontSize: '0.85rem',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontWeight: 500
                  }}>
                    <span style={{ fontSize: '1rem' }}>⏱️</span>
                    Interval: {track.start || '0:00'} → {track.end || '0:30'} 
                    <span style={{ 
                      background: 'rgba(59, 130, 246, 0.3)',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      {(() => {
                        const startSec = convertTimestampToSeconds(track.start || '0:00');
                        const endSec = convertTimestampToSeconds(track.end || '0:30');
                        return `${endSec - startSec}s duration`;
                      })()}
                    </span>
                  </div>
                </div>

                {/* ✅ UPDATED: Action buttons with interval functionality */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '0.75rem'
                }}>
                  {/* ✅ FIXED: Play Interval Button */}
                  <button
                    onClick={handlePlayInterval}
                    disabled={!audioUrl}
                    style={{
                      background: audioUrl 
                        ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                        : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem',
                      color: 'white',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: audioUrl ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: audioUrl 
                        ? '0 4px 16px rgba(59, 130, 246, 0.3)'
                        : '0 4px 16px rgba(107, 114, 128, 0.3)',
                      opacity: audioUrl ? 1 : 0.5
                    }}
                    onMouseEnter={(e) => {
                      if (audioUrl) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (audioUrl) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.3)';
                      }
                    }}
                    title={`Play interval: ${track.start || '0:00'} - ${track.end || '0:30'}`}
                  >
                    <span>▶️</span>
                    Play Interval
                  </button>

                  {/* ✅ FIXED: Download Interval Button */}
                  <button
                    onClick={handleDownloadInterval}
                    disabled={!audioUrl}
                    style={{
                      background: audioUrl 
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem',
                      color: 'white',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: audioUrl ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: audioUrl 
                        ? '0 4px 16px rgba(16, 185, 129, 0.3)'
                        : '0 4px 16px rgba(107, 114, 128, 0.3)',
                      opacity: audioUrl ? 1 : 0.5
                    }}
                    onMouseEnter={(e) => {
                      if (audioUrl) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (audioUrl) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 16px rgba(16, 185, 129, 0.3)';
                      }
                    }}
                    title={`Download interval: ${track.start || '0:00'} - ${track.end || '0:30'}`}
                  >
                    <span>⬇️</span>
                    Download Interval
                  </button>

                  {/* Use for Video Button - unchanged */}
                  <button
                    onClick={() => {
                      setSelectedTrack(track);
                      setCurrentStep(2);
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem',
                      color: 'white',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
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

                {/* Video with Music Button - if renderMusicVideo is enabled */}
                {renderMusicVideo && (
                  <div style={{
                    marginTop: '1rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    paddingTop: '1rem'
                  }}>
                    <button
                      onClick={() => handleDownloadVideoWithMusic(track)}
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #1a365d 0%, #2b6cb0 100%)',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '1rem',
                        color: 'white',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.75rem',
                        boxShadow: '0 6px 20px rgba(43, 108, 176, 0.4)',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(43, 108, 176, 0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(43, 108, 176, 0.4)';
                      }}
                    >
                      {/* New Badge */}
                      <div style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '1rem',
                        background: '#ef4444',
                        color: 'white',
                        borderRadius: '12px',
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        border: '2px solid white',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)'
                      }}>
                        NEW ✓
                      </div>
                      <span style={{ fontSize: '1.2rem' }}>🎬</span>
                      Download Video + Music
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Panel */}
        <div style={{
          background: 'rgba(255, 140, 0, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '2rem',
          border: '2px solid rgba(255, 140, 0, 0.3)',
          boxShadow: '0 8px 32px rgba(255, 140, 0, 0.2)',
          marginTop: '2rem',
          textAlign: 'center'
        }}>
        
       
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
          
          </div>
        </div>
      </div>
    )}

    {/* Quick Actions Panel */}
    {tracks.length === 0 && !isProcessing && (
      <div style={{
        marginTop: '3rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <div style={{
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '0.9rem',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '2rem',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
       
     
        </div>
      </div>
    )}

   

    {/* Feature Highlights */}

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
      {hasGeneratedMusic && !isRemoved && (
        <div 
          style={{
            marginTop: '0.75rem',
            padding: '0.75rem',
            background: 'rgba(17, 24, 39, 0.5)',
            borderRadius: '0.25rem',
            border: '1px solid #4b5563'
          }}
          onClick={(e) => e.stopPropagation()} // CRITICAL FIX
          onMouseDown={(e) => e.stopPropagation()} // ADDITIONAL SAFETY
          onMouseUp={(e) => e.stopPropagation()} // ADDITIONAL SAFETY
        >
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
            style={{
              width: '100%',
              accentColor: '#2563eb',
              cursor: 'pointer'
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
          🎬 Create Complete Video ({Object.keys(generatedSegmentMusic).length})
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
<div id="video-preview-container" style={{ 
  width: '100%', 
  textAlign: 'center', 
  marginBottom: '2rem',
  display: 'flex',
  gap: '2rem',
  alignItems: 'flex-start',
  justifyContent: 'center'
}}>
  {/* If you have a progressive video, add this container too */}
  <div id="progressive-video-container" style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: '2rem'
  }}>
    <div style={{
      width: '60%',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {/* Your existing video title div */}
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
        {processedVideoResult?.trim_info ? (
          <>
            🎬 Trimmed Video Preview ({formatTimeFromSeconds(processedVideoResult.trim_info.original_start)} - {formatTimeFromSeconds(processedVideoResult.trim_info.original_end)})
          </>
        ) : (
          <>
           
           
          </>
        )}
      </div>

          <video
            ref={videoPreviewRef}
            src={combinedVideoUrl || videoUrl}
            controls
            autoPlay={false}
            style={{
              width: '800px',
              maxWidth: '90vw',
              maxHeight: '500px',
              minHeight: '300px',
              borderRadius: processedVideoResult?.trim_info ? '0 0 16px 16px' : '16px',
              boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4)',
              margin: '0 auto 2rem auto',
              display: 'block',
            }}
            // 🚨 NEW: Set up trimmed video playback constraints
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
              // 🚨 NEW: Constrain seeking to trimmed range
              if (processedVideoResult?.trim_info && videoPreviewRef.current) {
                const { original_start, original_end } = processedVideoResult.trim_info;
                const currentTime = videoPreviewRef.current.currentTime;
                
                if (currentTime < original_start || currentTime >= original_end) {
                  videoPreviewRef.current.currentTime = original_start;
                }
              }
            }}
          />

          {/* 🚨 NEW: Trimmed video info display */}
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
              <div style={{ 
                fontSize: '0.9rem', 
                fontWeight: 600, 
                marginBottom: '0.5rem',
                color: '#48bb78'
              }}>
                📹 Video Analysis Complete
              </div>
              <div style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>
                Analyzed trimmed section: <strong>{formatTimeFromSeconds(processedVideoResult.trim_info.original_start)} - {formatTimeFromSeconds(processedVideoResult.trim_info.original_end)}</strong>
                <br />
                Duration: <strong>{formatTimeFromSeconds(processedVideoResult.trim_info.trimmed_duration)}</strong>
                <br />
                All segments are relative to this trimmed portion
              </div>
            </div>
          )}
        </div>
      </div>
    
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

      {/* 🚨 NEW: Trimmed video overlay indicator */}
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

      {/* Selection label for editing */}


<style>{`
  @keyframes editingPulse {
    0%, 100% { 
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4), 0 0 0 1px rgba(102, 126, 234, 0.2);
      transform: scale(1);
    }
    50% { 
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6), 0 0 0 2px rgba(102, 126, 234, 0.4);
      transform: scale(1.02);
    }
  }
  
  @keyframes dotPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(1.2); }
  }
  
  @keyframes slideInDown {
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
      {/* Start handle - DISABLED for trimmed video */}
      <div
        style={{
          position: 'absolute',
          left: startX - 8,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 16,
          height: 'calc(100% + 16px)',
          background: selectedSegmentForEdit 
            ? '#667eea'
            : processedVideoResult?.trim_info
            ? '#6b7280'  // Gray when disabled for trimmed video
            : '#4299E1',
          cursor: selectedSegmentForEdit && !processedVideoResult?.trim_info
            ? 'ew-resize'
            : processedVideoResult?.trim_info
            ? 'not-allowed'
            : 'ew-resize',
          borderRadius: '6px',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: selectedSegmentForEdit && !processedVideoResult?.trim_info
            ? '0 0 15px rgba(102, 126, 234, 0.5)'
            : processedVideoResult?.trim_info
            ? '0 0 15px rgba(107, 114, 128, 0.5)' 
            : '0 0 15px rgba(66, 153, 225, 0.5)',
          opacity: processedVideoResult?.trim_info ? 0.7 : 1,
          pointerEvents: processedVideoResult?.trim_info ? 'none' : 'auto'
        }}
   onMouseDown={(e) => {
    // 🚨 REPLACE this entire onMouseDown with:
    if (processedVideoResult?.trim_info) {
      showMessage('Timeline editing is disabled for trimmed video analysis. Use the original timeline before processing.', 'warning');
      return;
    }
    
    if (selectedSegmentForEdit || (!processedVideoResult?.segments)) {
      e.preventDefault();
      const rect = trackRef.current.getBoundingClientRect();
      
      const move = (moveEvent) => {
        const currentX = Math.max(0, Math.min(moveEvent.clientX - rect.left, THUMB_WIDTH * NUM_THUMBS));
        const width = THUMB_WIDTH * NUM_THUMBS;
        const newStartX = Math.min(currentX, endX - 10);
        
        // 🚨 CHECK FOR OVERLAPS BEFORE UPDATING
        const newStart = (newStartX / width) * duration;
        const currentEnd = (endX / width) * duration;
        
        if (selectedSegmentForEdit && processedVideoResult?.segments) {
          const overlaps = detectSegmentOverlaps(
            processedVideoResult.segments, 
            selectedSegmentForEdit.index, 
            newStart, 
            currentEnd
          );
          
          if (overlaps.length > 0) {
            console.warn(`⚠️ Start handle blocked: Would overlap with ${overlaps.length} segment(s)`);
            return; // Don't update if overlap detected
          }
        }
        
        // Only update if no overlaps
        setStartX(newStartX);
        setLastDragged("start");
        
        // Real-time video update
        const newTime = (newStartX / width) * duration;
        if (videoPreviewRef.current && !isNaN(newTime)) {
          videoPreviewRef.current.currentTime = newTime;
        }
        
        if (selectedSegmentForEdit) {
          setHasUnsavedTimelineChanges(true);
        }
      };
      
      const up = () => {
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", up);
        
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
    }
  }}
      >
        <span style={{color: 'white', transform: 'rotate(90deg)', fontSize: '10px'}}>|||</span>
      </div>

      {/* End handle - DISABLED for trimmed video */}
      <div
        style={{
          position: 'absolute',
          left: endX - 8,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 16,
          height: 'calc(100% + 16px)',
          background: selectedSegmentForEdit 
            ? '#667eea'
            : processedVideoResult?.trim_info
            ? '#6b7280'  // Gray when disabled for trimmed video
            : '#4299E1',
          cursor: selectedSegmentForEdit && !processedVideoResult?.trim_info
            ? 'ew-resize'
            : processedVideoResult?.trim_info
            ? 'not-allowed'
            : 'ew-resize',
          borderRadius: '6px',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: selectedSegmentForEdit && !processedVideoResult?.trim_info
            ? '0 0 15px rgba(102, 126, 234, 0.5)'
            : processedVideoResult?.trim_info
            ? '0 0 15px rgba(107, 114, 128, 0.5)' 
            : '0 0 15px rgba(66, 153, 225, 0.5)',
          opacity: processedVideoResult?.trim_info ? 0.7 : 1,
          pointerEvents: processedVideoResult?.trim_info ? 'none' : 'auto'
        }}
onMouseDown={(e) => {
  // 🚨 REPLACE this entire onMouseDown with:
  if (processedVideoResult?.trim_info) {
    showMessage('Timeline editing is disabled for trimmed video analysis. Use the original timeline before processing.', 'warning');
    return;
  }
  
  if (selectedSegmentForEdit || (!processedVideoResult?.segments)) {
    e.preventDefault();
    const rect = trackRef.current.getBoundingClientRect();
    
    const move = (moveEvent) => {
      const currentX = Math.max(0, Math.min(moveEvent.clientX - rect.left, THUMB_WIDTH * NUM_THUMBS));
      const width = THUMB_WIDTH * NUM_THUMBS;
      const newEndX = Math.max(currentX, startX + 10);
      
      // Convert to time values
      const currentStart = (startX / width) * duration;
      const newEnd = (newEndX / width) * duration;
      
      if (selectedSegmentForEdit && processedVideoResult?.segments) {
        // 🚨 FIXED: Only check for actual overlaps using the detectSegmentOverlaps function
        const overlaps = detectSegmentOverlaps(
          processedVideoResult.segments, 
          selectedSegmentForEdit.index, 
          currentStart, 
          newEnd
        );
        
        if (overlaps.length > 0) {
          console.warn(`⚠️ End handle blocked: Would overlap with ${overlaps.length} segment(s)`);
          return; // Don't update if overlap detected
        }
        
        // 🚨 REMOVED the overly strict "hasStrictConflict" check
        // The detectSegmentOverlaps function already handles proper overlap detection
      }
      
      // ✅ Update position if no overlaps
      setEndX(newEndX);
      setLastDragged("end");
      
      // Real-time video update
      const newTime = (newEndX / width) * duration;
      if (videoPreviewRef.current && !isNaN(newTime)) {
        videoPreviewRef.current.currentTime = newTime;
      }
      
      if (selectedSegmentForEdit) {
        setHasUnsavedTimelineChanges(true);
      }
    };
    
    const up = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
      
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
  }
}}
      >
        <span style={{color: 'white', transform: 'rotate(90deg)', fontSize: '10px'}}>|||</span>
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
{/* Main Process Button */}
{!processedVideoResult?.trim_info ? (
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
     
    {/* Complete Video Button with Hover Tooltip */}
    <div style={{ position: 'relative' }}>
      <Button
        variant="success"
        onClick={processVideoWithClipTune}
        disabled={isProcessingVideo || isLoadingVideoData}
        title=""
        style={{
          opacity: isProcessingVideo ? 0.7 : 1,
          transform: isProcessingVideo ? 'scale(0.98)' : 'scale(1)',
          background: isProcessingVideo
            ? '#6b7280'
            : '#2563eb',
          color: 'white',
          border: 'none',
          padding: '1.25rem 2.5rem',
          borderRadius: '6px',
          fontSize: '1.1rem',
          fontWeight: '600',
          cursor: isProcessingVideo ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: 'none',
          textAlign: 'center',
          outline: 'none',
          fontFamily: "'SF Pro Display', 'Segoe UI', 'Helvetica Neue', 'Arial', 'Roboto', sans-serif",
          letterSpacing: '0.3px',
          position: 'relative'
        }}
        onMouseEnter={(e) => {
          // Show tooltip
          const tooltip = e.currentTarget.parentElement.querySelector('.hover-tooltip');
          if (tooltip) {
            tooltip.style.opacity = '1';
            tooltip.style.visibility = 'visible';
            tooltip.style.transform = 'translateX(-50%) translateY(-5px)';
          }
        }}
        onMouseLeave={(e) => {
          // Hide tooltip
          const tooltip = e.currentTarget.parentElement.querySelector('.hover-tooltip');
          if (tooltip) {
            tooltip.style.opacity = '0';
            tooltip.style.visibility = 'hidden';
            tooltip.style.transform = 'translateX(-50%) translateY(0px)';
          }
        }}
        className="no-tooltip-button"
      >
        complete video
      </Button>
      
      {/* Hover Tooltip with Shadow Text */}
      <div 
        className="hover-tooltip"
        style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%) translateY(0px)',
          marginBottom: '10px',
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '8px',
          fontSize: '0.9rem',
          fontWeight: '600',
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 15px rgba(251, 191, 36, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          opacity: '0',
          visibility: 'hidden',
          transition: 'all 0.3s ease',
          zIndex: 1000,
          pointerEvents: 'none',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' // Shadow text effect
        }}
      >
        ⭐ Premium Feature Only
        {/* Arrow pointing down */}
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '0',
          height: '0',
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: '6px solid #f59e0b'
        }} />
      </div>
    </div>
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
    <div style={{
      fontSize: '1.2rem',
      fontWeight: 600,
      marginBottom: '0.5rem',
      color: '#48bb78'
    }}>
      ✅ Trimmed Video Analysis Complete
    </div>
    <div style={{ fontSize: '0.9rem', lineHeight: 1.4 }}>
      Found <strong>{processedVideoResult.segments?.length || 0}</strong> music segments in the trimmed video.
      <br />
      Timeline editing is now disabled. Generate music for individual segments.
    </div>
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
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.2rem', width: '100%' }}>
        <h2 style={{
          fontSize: '1.8rem',
          fontWeight: 700,
          color: '#ffffff',
          marginBottom: '0.5rem',
          letterSpacing: '0.5px'
        }}>
          🎵 Guide AI to Create Your Perfect Soundtrack
        </h2>
        <p style={{
          color: '#a0aec0',
          fontSize: '1.08rem',
          fontWeight: 400,
          margin: 0
        }}>
          Customize your music generation with detailed instructions
        </p>
      </div>

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

      {/* YouTube Reference URLs */}
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
          🎵 YouTube Reference URLs <span style={{color:'#4299e1', fontWeight:400, fontSize:'0.95em'}}>(optional)</span>
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

      {/* Lyrics */}
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
          📝 Lyrics <span style={{color:'#4299e1', fontWeight:400, fontSize:'0.95em'}}>(optional)</span>
        </label>
        <textarea
          value={lyrics}
          onChange={e => setLyrics(e.target.value)}
          placeholder="Enter specific lyrics or vocal themes for your track..."
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

      {/* Extra Description */}
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
          🎨 Music Style & Description <span style={{color:'#4299e1', fontWeight:400, fontSize:'0.95em'}}>(optional)</span>
        </label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Describe the style and mood (e.g., 'An upbeat, synthwave track for a party scene', 'A calm, ambient background score for meditation')"
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

      {/* Instrumental Checkbox */}
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
          🎼 Generate Instrumental Only
        </label>
      </div>
      
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
            <>✨ Generate "{trackName || 'Your Perfect Soundtrack'}"</>
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
         
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
