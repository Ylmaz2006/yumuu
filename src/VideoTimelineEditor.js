import React from 'react';
import { formatTime } from './formatTime'; // Use your helper function

const VideoTimelineEditor = ({ duration, zoom, setZoom, API_BASE_URL }) => {
  const frames = Array.from({ length: Math.ceil(duration / zoom) });

  return (
    <div className="timeline-editor bg-gray-800 p-4 rounded-lg mt-6 text-white">
      <h3 className="text-lg font-semibold mb-2">🎞 Video Editor Timeline</h3>

      <div className="flex items-center mb-3">
        <label className="mr-2">Zoom:</label>
        <input
          type="range"
          min="1"
          max="5"
          step="0.1"
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="relative overflow-x-auto whitespace-nowrap border-t border-b border-gray-600 py-2 mb-4">
        {frames.map((_, idx) => {
          const timestamp = Math.floor(idx * zoom);
          return (
            <div
              key={idx}
              className="inline-block w-24 h-16 mr-1 bg-black text-xs text-center text-gray-300 border border-gray-500 relative"
            >
              <img
                src={`${API_BASE_URL}/thumbnails/thumb_${idx}.jpg`}
                alt={`Thumb ${idx}`}
                className="object-cover w-full h-full"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50">
                {formatTime(timestamp)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 justify-between">
        <button className="px-4 py-2 bg-red-600 rounded hover:bg-red-700">✂ Split</button>
        <button className="px-4 py-2 bg-yellow-600 rounded hover:bg-yellow-700">🗑 Delete</button>
        <button className="px-4 py-2 bg-green-600 rounded hover:bg-green-700">➕ Add Clip</button>
      </div>
    </div>
  );
};

export default VideoTimelineEditor;
