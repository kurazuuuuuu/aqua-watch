import React, { useState, useEffect } from 'react';
import { createPost } from '../services/api';

interface PostFormProps {
  onClose: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    latitude: '',
    longitude: '',
    nickname: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState('位置情報を取得中...');

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const accuracy = position.coords.accuracy;
          console.log('投稿フォーム GPS取得:', { lat, lng, accuracy: `${accuracy}m` });
          
          setFormData(prev => ({
            ...prev,
            latitude: lat.toString(),
            longitude: lng.toString(),
          }));
          setLocationStatus(`現在位置を取得しました（精度: ${Math.round(accuracy)}m）`);
        },
        (error) => {
          console.error('GPS取得エラー:', error);
          setLocationStatus('位置情報の取得に失敗しました');
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0
        }
      );
    } else {
      setLocationStatus('位置情報がサポートされていません');
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.latitude || !formData.longitude) {
      alert('位置情報が取得できていません。しばらく待ってから再試行してください。');
      return;
    }
    
    setLoading(true);

    try {
      const postData = new FormData();
      postData.append('title', formData.title);
      postData.append('description', formData.description);
      postData.append('latitude', formData.latitude);
      postData.append('longitude', formData.longitude);
      postData.append('nickname', formData.nickname || 'Anonymous');
      if (image) {
        postData.append('image', image);
      }

      await createPost(postData);
      alert('投稿が完了しました！');
      onClose();
    } catch (error) {
      alert('投稿に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>水質情報を投稿</h2>
        <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f0f8ff', borderRadius: '5px' }}>
          📍 {locationStatus}
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label>ニックネーム:</label>
            <input
              type="text"
              value={formData.nickname}
              onChange={(e) => setFormData({...formData, nickname: e.target.value})}
              placeholder="匿名で投稿する場合は空欄"
            />
          </div>
          
          <div>
            <label>タイトル:</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label>説明:</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
            />
          </div>
          
          <div>
            <label>画像:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </div>
          
          <div className="form-buttons">
            <button type="submit" disabled={loading || !formData.latitude}>
              {loading ? '投稿中...' : '投稿する'}
            </button>
            <button type="button" onClick={onClose}>
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm;
