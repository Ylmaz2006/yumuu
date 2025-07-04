import React, { useState, useRef } from 'react';

const VideoMusicGenerator = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [youtubeUrls, setYoutubeUrls] = useState(['']);
  const [lyrics, setLyrics] = useState('');
  const [description, setDescription] = useState('');
  const [instrumental, setInstrumental] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });

  const fileInputRef = useRef(null);
  const API_BASE_URL = 'http://localhost:3001';

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
    } else {
      showMessage('Please select a valid video file.', 'error');
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const handleGenerate = async () => {
    if (!selectedFile) return showMessage('Select a video first.', 'error');

    const formData = new FormData();
    formData.append('video', selectedFile);
    formData.append('youtubeUrls', JSON.stringify(youtubeUrls.filter(url => url.trim() !== '')));
    formData.append('lyrics', lyrics);
    formData.append('extra_description', description);
    formData.append('instrumental', instrumental.toString());
    formData.append('song_title', 'clip_gen');
    formData.append('video_duration', '30');

    try {
      setIsProcessing(true);
      const res = await fetch(`${API_BASE_URL}/api/process-video`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Music generation failed');
      setTracks(Array.isArray(data.tracks) ? data.tracks : [data]);
      showMessage('Music generated!', 'success');
    } catch (err) {
      showMessage(err.message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">🎬 Video to Music Generator</h2>

      <input type="file" accept="video/*" ref={fileInputRef} onChange={handleFileSelect} className="mb-4" />

      {youtubeUrls.map((url, idx) => (
        <input
          key={idx}
          type="text"
          placeholder={`YouTube URL ${idx + 1}`}
          value={url}
          onChange={(e) => {
            const copy = [...youtubeUrls];
            copy[idx] = e.target.value;
            setYoutubeUrls(copy);
          }}
          className="block mb-2 border p-2 w-full"
        />
      ))}
      <button onClick={() => setYoutubeUrls([...youtubeUrls, ''])} className="text-blue-600 text-sm mb-4">+ Add another URL</button>

      <textarea
        placeholder="Extra description (optional)"
        value={description}
        onChange={e => setDescription(e.target.value)}
        className="block mb-4 w-full p-2 border"
        rows="3"
      />

      <textarea
        placeholder="Lyrics (optional)"
        value={lyrics}
        onChange={e => setLyrics(e.target.value)}
        className="block mb-4 w-full p-2 border"
        rows="3"
      />

      <label className="block mb-4">
        <input type="checkbox" checked={instrumental} onChange={() => setInstrumental(!instrumental)} /> Instrumental Only
      </label>

      <button
        onClick={handleGenerate}
        disabled={isProcessing || !selectedFile}
        className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
      >
        {isProcessing ? 'Generating...' : 'Generate Music'}
      </button>

      {message.text && <p className={`mt-4 ${message.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>{message.text}</p>}

      <div className="mt-6">
        {tracks.map((track, i) => (
          <div key={i} className="mb-4">
            <p className="font-semibold">{track.title || `Track ${i + 1}`}</p>
            <audio controls src={track.url || track.audio_url} className="w-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoMusicGenerator;
