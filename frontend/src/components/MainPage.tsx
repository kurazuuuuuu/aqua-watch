import React, { useState } from 'react';
import MapView from './MapView';
import PostForm from './PostForm';
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
}

const MainPage: React.FC = () => {
  const [showPostForm, setShowPostForm] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const handlePostSelect = (post: Post) => {
    setSelectedPost(post);
  };

  return (
    <>
      <header className="header">
        <h1>Aqua Watch</h1>
        <div className="user-controls">
          <button onClick={() => setShowPostForm(true)}>投稿する</button>
          <a href="/admin" className="admin-link">管理画面</a>
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
        {showPostForm && (
          <PostForm 
            onClose={() => setShowPostForm(false)}
          />
        )}
      </main>
    </>
  );
};

export default MainPage;
