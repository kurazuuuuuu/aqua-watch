import React, { useEffect, useState } from 'react';
import { getPosts } from '../services/api';
import { verifyAuth, logout, getGitHubAuthUrl } from '../services/auth';
import { getBaseUrl, getApiBaseUrl } from '../utils/config';

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
  pollution_level?: string;
}

interface User {
  id: number;
  login: string;
  name: string;
  avatar_url: string;
  accessDenied?: boolean;
}

const Admin: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
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
      fetchPosts();
    } catch (error) {
      console.log('認証が必要です');
    } finally {
      setAuthLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/posts/admin`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('ORGANIZATION_ACCESS_DENIED');
        }
        throw new Error('Failed to fetch posts');
      }
      
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('投稿取得失敗:', error);
      if (error instanceof Error && error.message === 'ORGANIZATION_ACCESS_DENIED' && user) {
        setUser({ ...user, accessDenied: true });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setPosts([]);
    } catch (error) {
      console.error('ログアウト失敗:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ja-JP');
  };

  const getLocationString = (lat: number, lng: number) => {
    try {
      console.log('Processing coordinates:', { lat, lng, latType: typeof lat, lngType: typeof lng });
      
      const latNum = typeof lat === 'number' ? lat : parseFloat(lat);
      const lngNum = typeof lng === 'number' ? lng : parseFloat(lng);
      
      console.log('Converted coordinates:', { latNum, lngNum });
      
      if (isNaN(latNum) || isNaN(lngNum)) {
        console.warn('Invalid coordinates detected:', { lat, lng });
        return '座標不明';
      }
      
      return `${latNum.toFixed(6)}, ${lngNum.toFixed(6)}`;
    } catch (error) {
      console.error('Error in getLocationString:', error, { lat, lng });
      return '座標エラー';
    }
  };

  if (user?.accessDenied) {
    return (
      <div className="admin-container">
        <div className="access-denied">
          <h2>🚫 アクセス拒否</h2>
          <p>申し訳ございませんが、管理画面にアクセスするには Krz-Tech Organization のメンバーである必要があります。</p>
          <div className="user-info">
            <img src={user.avatar_url} alt={user.name} className="avatar" />
            <p>ログイン中: {user.name || user.login}</p>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            ログアウト
          </button>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="admin-container">
        <div className="loading">認証を確認中...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="admin-container">
        <div className="auth-container">
          <div className="auth-card">
            <h1>🛡️ Aqua Watch 管理画面</h1>
            <p>管理画面にアクセスするにはGitHubアカウントでログインしてください。</p>
            <a href={getGitHubAuthUrl()} className="github-login-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHubでログイン
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">データを読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div>
          <h1>🛡️ Aqua Watch 管理画面</h1>
          <div className="user-info">
            <img src={user.avatar_url} alt={user.name} className="user-avatar" />
            <span>ようこそ、{user.name || user.login}さん</span>
            <button onClick={handleLogout} className="logout-btn">ログアウト</button>
          </div>
        </div>
        <div className="admin-stats">
          <div className="stat-card">
            <span className="stat-number">{posts.length}</span>
            <span className="stat-label">総投稿数</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{posts.filter(p => p.image_path).length}</span>
            <span className="stat-label">画像付き投稿</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{new Set(posts.map(p => p.nickname)).size}</span>
            <span className="stat-label">ユニークユーザー</span>
          </div>
        </div>
      </header>

      <div className="admin-content">
        <div className="posts-table">
          <h2>📋 投稿一覧</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>タイトル</th>
                  <th>投稿者</th>
                  <th>位置情報</th>
                  <th>投稿日時</th>
                  <th>画像</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => {
                  try {
                    console.log('Rendering post:', post);
                    return (
                      <tr key={post.id}>
                        <td>{post.id}</td>
                        <td className="title-cell">{post.title}</td>
                        <td>{post.nickname}</td>
                        <td className="location-cell">
                          {getLocationString(post.latitude, post.longitude)}
                        </td>
                        <td>{formatDate(post.created_at)}</td>
                        <td>
                          {post.image_path ? (
                            <span className="has-image">📷 あり</span>
                          ) : (
                            <span className="no-image">❌ なし</span>
                          )}
                        </td>
                        <td>
                          <button 
                            className="detail-btn"
                            onClick={() => setSelectedPost(post)}
                          >
                            詳細
                          </button>
                        </td>
                      </tr>
                    );
                  } catch (error) {
                    console.error('Error rendering post:', error, post);
                    return (
                      <tr key={post.id || 'error'}>
                        <td colSpan={7}>投稿の表示でエラーが発生しました</td>
                      </tr>
                    );
                  }
                })}
              </tbody>
            </table>
          </div>
        </div>

        {selectedPost && (
          <div className="modal-overlay" onClick={() => setSelectedPost(null)}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>📄 投稿詳細 (ID: {selectedPost.id})</h3>
                <button 
                  className="close-btn"
                  onClick={() => setSelectedPost(null)}
                >
                  ✕
                </button>
              </div>
              
              <div className="modal-body">
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>タイトル:</label>
                    <span>{selectedPost.title}</span>
                  </div>
                  
                  <div className="detail-item">
                    <label>投稿者:</label>
                    <span>{selectedPost.nickname}</span>
                  </div>
                  
                  <div className="detail-item">
                    <label>投稿日時:</label>
                    <span>{formatDate(selectedPost.created_at)}</span>
                  </div>
                  
                  <div className="detail-item">
                    <label>緯度:</label>
                    <span>{selectedPost.latitude}</span>
                  </div>
                  
                  <div className="detail-item">
                    <label>経度:</label>
                    <span>{selectedPost.longitude}</span>
                  </div>
                  
                  <div className="detail-item full-width">
                    <label>説明:</label>
                    <span>{selectedPost.description || '説明なし'}</span>
                  </div>
                  
                  {selectedPost.image_path && (
                    <div className="detail-item full-width">
                      <label>画像:</label>
                      <img 
                        src={`${getBaseUrl()}/${selectedPost.image_path}`}
                        alt={selectedPost.title}
                        className="detail-image"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
