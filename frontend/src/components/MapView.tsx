import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { getPosts } from '../services/api';
import { getBaseUrl } from '../utils/config';

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

const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return <div>地図を読み込み中...</div>;
    case Status.FAILURE:
      return <div>地図の読み込みに失敗しました</div>;
    case Status.SUCCESS:
      return <div>地図を読み込み中...</div>;
  }
};

interface GoogleMapProps {
  posts: Post[];
  selectedPost?: Post | null;
  onLocationUpdate: (lat: number, lng: number) => void;
}

const GoogleMapComponent: React.FC<GoogleMapProps> = ({ posts, selectedPost, onLocationUpdate }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);

  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      console.log('GPS取得を開始します...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          console.log('GPS取得成功:', { lat, lng });
          onLocationUpdate(lat, lng);
          if (map) {
            map.setCenter({ lat, lng });
            map.setZoom(16);
          }
        },
        (error) => {
          console.error('GPS取得エラー:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0
        }
      );
    }
  }, [map, onLocationUpdate]);

  useEffect(() => {
    if (mapRef.current && !map) {
      const newMap = new google.maps.Map(mapRef.current, {
        center: { lat: 35.6762, lng: 139.6503 },
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      });
      setMap(newMap);
      setInfoWindow(new google.maps.InfoWindow());
    }
  }, [mapRef, map]);

  // 地図が作成された後に現在地を取得
  useEffect(() => {
    if (map) {
      setTimeout(() => {
        getCurrentLocation();
      }, 1000);
    }
  }, [map, getCurrentLocation]);

  useEffect(() => {
    if (selectedPost && map) {
      const lat = parseFloat(selectedPost.latitude.toString());
      const lng = parseFloat(selectedPost.longitude.toString());
      
      if (!isNaN(lat) && !isNaN(lng)) {
        map.setCenter({ lat, lng });
        map.setZoom(16);
      }
    }
  }, [selectedPost, map]);

  useEffect(() => {
    if (map && posts.length > 0) {
      markers.forEach(marker => marker.setMap(null));
      
      const newMarkers = posts.map((post) => {
        const lat = parseFloat(post.latitude.toString());
        const lng = parseFloat(post.longitude.toString());
        
        if (isNaN(lat) || isNaN(lng)) return null;
        
        // 水質状態に応じた色分け
        const getWaterQualityColor = (description: string) => {
          const desc = description.toLowerCase();
          if (desc.includes('汚い') || desc.includes('濁っ') || desc.includes('臭い')) {
            return '#f44336';
          } else if (desc.includes('普通') || desc.includes('まあまあ')) {
            return '#ff9800';
          } else {
            return '#4caf50';
          }
        };

        // カスタム水滴アイコンを作成
        const customIcon = {
          path: 'M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2C20 10.48 17.33 6.55 12 2z',
          fillColor: getWaterQualityColor(post.description || ''),
          fillOpacity: 0.9,
          strokeColor: '#ffffff',
          strokeWeight: 3,
          scale: 1.8,
          anchor: new google.maps.Point(12, 22)
        };

        const marker = new google.maps.Marker({
          position: { lat, lng },
          map: map,
          title: post.title,
          icon: customIcon,
          animation: google.maps.Animation.DROP
        });

        // スムーズなホバー効果
        let animationFrame: number;
        let currentScale = 1.8;
        let targetScale = 1.8;

        const animateScale = () => {
          const diff = targetScale - currentScale;
          if (Math.abs(diff) > 0.01) {
            currentScale += diff * 0.15;
            marker.setIcon({
              ...customIcon,
              scale: currentScale,
              strokeWeight: currentScale > 2 ? 4 : 3
            });
            animationFrame = requestAnimationFrame(animateScale);
          }
        };

        marker.addListener('mouseover', () => {
          targetScale = 2.4;
          cancelAnimationFrame(animationFrame);
          animateScale();
        });

        marker.addListener('mouseout', () => {
          targetScale = 1.8;
          cancelAnimationFrame(animationFrame);
          animateScale();
        });

        marker.addListener('click', () => {
          if (infoWindow) {
            const content = `
              <div style="padding: 8px; font-family: 'Segoe UI', sans-serif; max-width: 300px;">
                <h3 style="margin: 0 0 8px 0; color: #1976d2; font-size: 16px; font-weight: 600;">${post.title}</h3>
                
                <div style="background: linear-gradient(135deg, rgba(227, 242, 253, 0.8) 0%, rgba(187, 222, 251, 0.6) 100%); padding: 6px 10px; border-radius: 8px; margin-bottom: 8px; border: 1px solid rgba(129, 212, 250, 0.3);">
                  <div style="font-size: 12px; color: #1976d2; font-weight: 500;">
                    📝 ${post.nickname} | 📅 ${new Date(post.created_at).toLocaleDateString()}
                  </div>
                </div>

                ${post.description ? `
                  <div style="background: rgba(255,255,255,0.9); padding: 8px; border-radius: 6px; margin-bottom: 8px; border: 1px solid rgba(129, 212, 250, 0.2);">
                    <div style="font-size: 11px; color: #666; font-weight: 500; margin-bottom: 4px;">💬 コメント:</div>
                    <p style="margin: 0; font-size: 13px; color: #333; line-height: 1.4;">${post.description}</p>
                  </div>
                ` : ''}
                
                ${post.image_path ? `
                  <img src="${getBaseUrl()}/${post.image_path}" alt="${post.title}" 
                       style="width: 100%; max-height: 150px; object-fit: cover; border-radius: 6px; border: 1px solid rgba(129, 212, 250, 0.3);" />
                ` : ''}
              </div>
            `;
            
            infoWindow.setContent(content);
            infoWindow.open(map, marker);
          }
        });

        return marker;
      }).filter(Boolean) as any[];
      
      setMarkers(newMarkers);
    }
  }, [map, posts, infoWindow]);

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
      
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

const MapView: React.FC<MapViewProps> = ({ selectedPost }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [center, setCenter] = useState<{ lat: number; lng: number }>({ lat: 35.6762, lng: 139.6503 });

  const handleLocationUpdate = useCallback((lat: number, lng: number) => {
    setCenter({ lat, lng });
  }, []);

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
  }, []);

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    return (
      <div style={{ 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#d32f2f',
        fontSize: '16px'
      }}>
        Google Maps APIキーが設定されていません
      </div>
    );
  }

  return (
    <Wrapper apiKey={apiKey} render={render}>
      <GoogleMapComponent 
        posts={posts} 
        selectedPost={selectedPost}
        onLocationUpdate={handleLocationUpdate}
      />
    </Wrapper>
  );
};

export default MapView;
