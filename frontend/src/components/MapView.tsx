import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getPosts } from '../services/api';

// Leafletアイコン修正
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

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

interface MapViewProps {
  selectedPost?: Post | null;
}

const MapView: React.FC<MapViewProps> = ({ selectedPost }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [center, setCenter] = useState<[number, number]>([35.6762, 139.6503]);
  const [mapKey, setMapKey] = useState(0);
  const mapRef = useRef<any>(null);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      console.log('GPS取得を開始します...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = Number(position.coords.latitude);
          const lng = Number(position.coords.longitude);
          const accuracy = position.coords.accuracy;
          console.log('GPS取得成功:', { lat, lng, accuracy: `${accuracy}m` });
          
          if (!isNaN(lat) && !isNaN(lng)) {
            setCenter([lat, lng]);
            setMapKey(prev => prev + 1);
          }
        },
        (error) => {
          console.error('GPS取得エラー:', error.code, error.message);
          console.log('デフォルト位置（東京）を使用します');
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0
        }
      );
    }
  };

  // 選択された投稿に地図を移動
  useEffect(() => {
    if (selectedPost) {
      const lat = parseFloat(selectedPost.latitude.toString());
      const lng = parseFloat(selectedPost.longitude.toString());
      
      if (!isNaN(lat) && !isNaN(lng)) {
        setCenter([lat, lng]);
        setMapKey(prev => prev + 1);
      }
    }
  }, [selectedPost]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        console.log('MapView: 取得した投稿データ:', data);
        setPosts(data);
      } catch (error) {
        console.error('MapView: 投稿取得失敗:', error);
      }
    };

    fetchPosts();
    setTimeout(() => {
      getCurrentLocation();
    }, 1000);
  }, []);

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <div style={{ height: '100%', width: '100%' }}>
        <MapContainer
          key={mapKey}
          center={center}
          zoom={selectedPost ? 16 : 13}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {posts.map((post) => {
            const lat = parseFloat(post.latitude.toString());
            const lng = parseFloat(post.longitude.toString());
            
            if (isNaN(lat) || isNaN(lng)) {
              return null;
            }
            
            return (
              <Marker
                key={post.id}
                position={[lat, lng]}
              >
                <Popup 
                  maxWidth={300} 
                  className="custom-popup"
                  autoPan={selectedPost?.id === post.id}
                >
                  <div style={{ 
                    padding: '8px',
                    fontFamily: 'Segoe UI, sans-serif'
                  }}>
                    <h3 style={{ 
                      margin: '0 0 8px 0',
                      color: '#1976d2',
                      fontSize: '16px',
                      fontWeight: '600'
                    }}>{post.title}</h3>
                    
                    <div style={{
                      background: 'linear-gradient(135deg, rgba(227, 242, 253, 0.8) 0%, rgba(187, 222, 251, 0.6) 100%)',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      marginBottom: '8px',
                      border: '1px solid rgba(129, 212, 250, 0.3)'
                    }}>
                      <div style={{ 
                        fontSize: '12px',
                        color: '#1976d2',
                        fontWeight: '500'
                      }}>
                        📝 {post.nickname} | 📅 {new Date(post.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    {post.description && (
                      <div style={{
                        background: 'rgba(255,255,255,0.9)',
                        padding: '8px',
                        borderRadius: '6px',
                        marginBottom: '8px',
                        border: '1px solid rgba(129, 212, 250, 0.2)'
                      }}>
                        <div style={{ 
                          fontSize: '11px',
                          color: '#666',
                          fontWeight: '500',
                          marginBottom: '4px'
                        }}>💬 コメント:</div>
                        <p style={{ 
                          margin: '0',
                          fontSize: '13px',
                          color: '#333',
                          lineHeight: '1.4'
                        }}>{post.description}</p>
                      </div>
                    )}
                    
                    {post.image_path && (
                      <img 
                        src={`http://localhost:11101/${post.image_path}`} 
                        alt={post.title}
                        style={{ 
                          width: '100%',
                          maxHeight: '150px',
                          objectFit: 'cover',
                          borderRadius: '6px',
                          border: '1px solid rgba(129, 212, 250, 0.3)'
                        }}
                      />
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          }).filter(Boolean)}
        </MapContainer>
      </div>
      
      <button
        onClick={getCurrentLocation}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          padding: '8px 12px',
          backgroundColor: '#81d4fa',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: '600'
        }}
      >
        📍 現在地
      </button>
      
      <div style={{ 
        position: 'absolute',
        bottom: '10px',
        left: '10px',
        fontSize: '13px',
        color: '#1976d2',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(227,242,253,0.9) 100%)',
        padding: '6px 10px',
        borderRadius: '8px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(129, 212, 250, 0.3)',
        fontWeight: '500'
      }}>
        投稿数: {posts.length}件
      </div>
    </div>
  );
};

export default MapView;
