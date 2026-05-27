import React, { useState } from "react";

interface HeroVideo {
  url: string;
  enabled: boolean;
}

interface Props {
  videos: HeroVideo[];
  onChange: (videos: HeroVideo[]) => void;
}

const HeroVideoManager: React.FC<Props> = ({ videos, onChange }) => {
  const [localVideos, setLocalVideos] = useState<HeroVideo[]>(videos ?? []);

  const updateParent = (updated: HeroVideo[]) => {
    setLocalVideos(updated);
    onChange(updated);
  };

  const handleAdd = () => {
    const newVideo: HeroVideo = { url: "", enabled: true };
    updateParent([...localVideos, newVideo]);
  };

  const handleDelete = (index: number) => {
    const updated = localVideos.filter((_, i) => i !== index);
    updateParent(updated);
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= localVideos.length) return;
    const updated = [...localVideos];
    const [item] = updated.splice(from, 1);
    updated.splice(to, 0, item);
    updateParent(updated);
  };

  const handleUrlChange = (index: number, url: string) => {
    const updated = localVideos.map((v, i) =>
      i === index ? { ...v, url } : v,
    );
    updateParent(updated);
  };

  const handleEnabledChange = (index: number, enabled: boolean) => {
    const updated = localVideos.map((v, i) =>
      i === index ? { ...v, enabled } : v,
    );
    updateParent(updated);
  };

  return (
    <div className="hero-video-manager" style={{ marginBottom: "2rem" }}>
      <h3>Hero Videos</h3>
      {localVideos.map((video, idx) => (
        <div
          key={idx}
          style={{
            border: "1px solid #ddd",
            padding: "0.5rem",
            marginBottom: "0.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <input
            type="text"
            placeholder="Video URL"
            value={video.url}
            onChange={(e) => handleUrlChange(idx, e.target.value)}
            style={{ flex: 1 }}
          />
          <label
            style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}
          >
            <input
              type="checkbox"
              checked={video.enabled}
              onChange={(e) => handleEnabledChange(idx, e.target.checked)}
            />
            Enabled
          </label>
          <button
            type="button"
            onClick={() => move(idx, idx - 1)}
            disabled={idx === 0}
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => move(idx, idx + 1)}
            disabled={idx === localVideos.length - 1}
          >
            ↓
          </button>
          <button
            type="button"
            onClick={() => handleDelete(idx)}
            style={{ color: "red" }}
          >
            ✕
          </button>
        </div>
      ))}
      <button type="button" onClick={handleAdd} className="primary-btn">
        Add Video
      </button>
    </div>
  );
};

export default HeroVideoManager;
