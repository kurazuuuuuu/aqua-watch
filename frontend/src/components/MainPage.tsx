import React, { useState } from 'react';
import MapView from './MapView';
import Timeline from './Timeline';

interface Post {
  id: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  image_path: string;
  nickname: string;
  created_at: string;
  water_quality_score?: number;
}

const MainPage: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const handlePostSelect = (post: Post) => {
    setSelectedPost(post);
  };

  return (
    <>
      <header className="header">
        <h1>Aqua Watch - デモ版</h1>
        <div className="demo-notice">
          <span className="demo-badge">🚧 DEMO</span>
          <span>福岡市博多区の水質監視デモンストレーション</span>
        </div>
      </header>

      <main className="main-content">
        <div className="content-layout">
          <div className="map-section">
            <MapView selectedPost={selectedPost} />
          </div>
          <div className="timeline-section">
            <Timeline onPostSelect={handlePostSelect} />
          </div>
        </div>
      </main>
    </>
  );
};

export default MainPage;
