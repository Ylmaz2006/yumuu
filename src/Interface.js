import React, {useState, useRef} from "react";
import "./interface.css";

function Interface() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [textPrompt, setTextPrompt] = useState("");
  const [lyricsEnabled, setLyricsEnabled] = useState(false);
  const [lyrics, setLyrics] = useState("");
  const [similarTracks, setSimilarTracks] = useState(["", "", "", "", ""]);
  const [description, setDescription] = useState("");
  const [redirectToCrop, setRedirectToCrop] = useState(false);
  const fileInputRef = useRef(null);

  const handleVideoChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedVideo(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (!selectedVideo) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowModal(true);
    }, 2000); // Simulate a longer loading time for the animation
  };

  const removeVideo = () => {
    setSelectedVideo(null);
    setVideoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleGenerateTrack = () => {
    setShowModal(false);
    setRedirectToCrop(true);
  };

  if (redirectToCrop) {
    return (
      <div className="crop-page">
        <h2>Choose Cropping Option</h2>
        <button className="crop-btn">Auto Crop</button>
        <button className="crop-btn">Crop Yourself</button>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="upload-section">
        <div className="logo-circle-static">🎵</div>
        <p className="upload-prompt">Upload your video to generate music</p>

        {videoPreview && (
          <div className="media-preview">
            <video src={videoPreview} controls width="100%" />
            <button onClick={removeVideo} className="remove-btn">×</button>
          </div>
        )}

        <label className="upload-btn">
          Select Video
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4"
            onChange={handleVideoChange}
            hidden
          />
        </label>

        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={!selectedVideo || isLoading}
        >
          {isLoading ? "Generating..." : "Generate Music"}
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content-wrapper">
            <div className="modal-header">
              <label>
                <input
                  type="checkbox"
                  checked={lyricsEnabled}
                  onChange={() => setLyricsEnabled(!lyricsEnabled)}
                />{" "}
                Do you want to add lyrics?
              </label>
              <button className="close-modal" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="modal-section">
                <h3>Your track is instrumental</h3>
                <textarea
                  value={textPrompt}
                  onChange={(e) => setTextPrompt(e.target.value)}
                  placeholder="Describe the mood, genre, or instruments..."
                />
              </div>
              <div className="modal-section">
                <h3>Similar Tracks</h3>
                {similarTracks.map((track, i) => (
                  <input
                    key={i}
                    type="text"
                    value={track}
                    placeholder={`Similar Track ${i + 1}`}
                    onChange={(e) => {
                      const copy = [...similarTracks];
                      copy[i] = e.target.value;
                      setSimilarTracks(copy);
                    }}
                  />
                ))}
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description of the track..."
                />
                {lyricsEnabled && (
                  <textarea
                    value={lyrics}
                    onChange={(e) => setLyrics(e.target.value)}
                    placeholder="Add your track lyrics..."
                  />
                )}
                <button className="submit-btn" onClick={handleGenerateTrack}>Generate Track</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Interface;
