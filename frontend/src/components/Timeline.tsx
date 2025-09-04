import React, { useEffect, useState } from 'react';
import { getPosts } from '../services/api';

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

interface TimelineProps {
  onPostSelect: (post: Post) => void;
}

const Timeline: React.FC<TimelineProps> = ({ onPostSelect }) => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (error) {
        console.error('投稿取得失敗:', error);
      }
    };

    fetchPosts();
    const interval = setInterval(fetchPosts, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'たった今';
    if (minutes < 60) return `${minutes}分前`;
    if (hours < 24) return `${hours}時間前`;
    return `${days}日前`;
  };

  return (
    <div className="timeline">
      <h3>最新の投稿</h3>
      <div className="timeline-list">
        {posts.map((post) => (
          <div 
            key={post.id} 
            className="timeline-item clickable"
            onClick={() => onPostSelect(post)}
          >
            <div className="timeline-content">
              <div className="timeline-header">
                <span className="timeline-nickname">{post.nickname}</span>
                <span className="timeline-time">{formatDate(post.created_at)}</span>
              </div>
              <h4 className="timeline-title">{post.title}</h4>
              {post.description && (
                <p className="timeline-description">{post.description}</p>
              )}
              {post.image_path && (
                <img 
                  src={`http://localhost:11101/${post.image_path}`} 
                  alt={post.title}
                  className="timeline-image"
                />
              )}
              <div className="click-hint">📍 クリックして地図で表示</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
