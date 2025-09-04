import React, { useState, useEffect } from 'react';
import MapView from './MapView';
import PostForm from './PostForm';
import Timeline from './Timeline';
import { verifyAuth } from '../services/auth';

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

interface User {
  id: number;
  login: string;
  name: string;
  avatar_url: string;
}

const MainPage: React.FC = () => {
  const [showPostForm, setShowPostForm] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authData = await verifyAuth();
      setUser(authData.user);
    } catch (error) {
      console.log('未認証ユーザー');
    } finally {
      setAuthLoading(false);
    }
  };

  const handlePostSelect = (post: Post) => {
    setSelectedPost(post);
  };

  return (
    <>
      <header className="header">
        <h1>Aqua Watch</h1>
        <div className="user-controls">
          {user && (
            <div className="user-info">
              <img src={user.avatar_url} alt={user.name} className="user-avatar" />
              <span>{user.name || user.login}</span>
            </div>
          )}
          <button 
            onClick={() => {
              if (user) {
                setShowPostForm(true);
              } else {
                window.location.href = '/api/auth/github';
              }
            }}
          >
            {user ? '💧 投稿する' : '🔐 ログインして投稿'}
          </button>
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
