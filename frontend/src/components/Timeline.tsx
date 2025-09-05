import React, { useEffect, useState } from 'react';

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

interface TimelineProps {
  onPostSelect: (post: Post) => void;
}

const Timeline: React.FC<TimelineProps> = ({ onPostSelect }) => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchDemoPosts = async () => {
      try {
        const response = await fetch('/api/demo/posts');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('デモ投稿取得失敗:', error);
      }
    };

    fetchDemoPosts();
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

  const getQualityColor = (score?: number) => {
    if (!score) return '#gray';
    if (score >= 80) return '#4CAF50';
    if (score >= 70) return '#8BC34A';
    if (score >= 60) return '#FFC107';
    return '#FF5722';
  };

  const getQualityLabel = (score?: number) => {
    if (!score) return '未測定';
    if (score >= 80) return '良好';
    if (score >= 70) return 'やや良好';
    if (score >= 60) return '注意';
    return '要改善';
  };

  return (
    <div className="timeline">
      <h3>博多区 水質調査レポート</h3>
      <div className="timeline-list">
        {posts.map((post) => (
          <div 
            key={post.id} 
            className="timeline-item clickable"
            onClick={() => {
              console.log('Timeline clicked post:', post.title, 'Coordinates:', post.latitude, post.longitude);
              onPostSelect(post);
            }}
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
              <div className="water-quality-indicator">
                <span 
                  className="quality-score"
                  style={{ backgroundColor: getQualityColor(post.water_quality_score) }}
                >
                  {post.water_quality_score || 0}点
                </span>
                <span className="quality-label">
                  {getQualityLabel(post.water_quality_score)}
                </span>
              </div>
              <div className="click-hint">📍 クリックして地図で表示</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
