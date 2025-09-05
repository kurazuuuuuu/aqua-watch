import React, { useEffect, useState, useRef } from 'react';
import { useGoogleMaps } from '../hooks/useGoogleMaps';

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

interface MapViewProps {
  selectedPost?: Post | null;
}

interface GoogleMapProps {
  posts: Post[];
  selectedPost?: Post | null;
}

const GoogleMapComponent: React.FC<GoogleMapProps> = ({ posts, selectedPost }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);

  useEffect(() => {
    if (mapRef.current && !map) {
      const container = mapRef.current;
      console.log('Map container size:', {
        width: container.offsetWidth,
        height: container.offsetHeight,
        clientWidth: container.clientWidth,
        clientHeight: container.clientHeight
      });
      
      setTimeout(() => {
        if (mapRef.current) {
          console.log('Map container size after timeout:', {
            width: mapRef.current.offsetWidth,
            height: mapRef.current.offsetHeight
          });
          
          const newMap = new google.maps.Map(mapRef.current, {
            center: { lat: 33.5904, lng: 130.4017 },
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
          });
          setMap(newMap);
          setInfoWindow(new google.maps.InfoWindow());
          
          google.maps.event.addListenerOnce(newMap, 'idle', () => {
            google.maps.event.trigger(newMap, 'resize');
            newMap.setCenter({ lat: 33.5904, lng: 130.4017 });
          });
        }
      }, 100);
    }
  }, [mapRef, map]);

  useEffect(() => {
    if (selectedPost && map) {
      const lat = parseFloat(selectedPost.latitude.toString());
      const lng = parseFloat(selectedPost.longitude.toString());
      
      console.log('Selected post:', selectedPost.title, 'Coordinates:', lat, lng);
      
      if (!isNaN(lat) && !isNaN(lng)) {
        const currentCenter = map.getCenter();
        console.log('Current map center:', currentCenter?.lat(), currentCenter?.lng());
        
        map.panTo({ lat, lng });
        map.setZoom(17);
        
        setTimeout(() => {
          const newCenter = map.getCenter();
          if (newCenter) {
            console.log('New map center:', newCenter.lat(), newCenter.lng());
            console.log('Target coordinates:', lat, lng);
            console.log('Difference:', 
              'lat:', newCenter.lat() - lat, 
              'lng:', newCenter.lng() - lng
            );
          }
        }, 1000);
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
        
        const getWaterQualityColor = (score?: number) => {
          if (!score) return '#9e9e9e';
          if (score >= 80) return '#4caf50';
          if (score >= 70) return '#8bc34a';
          if (score >= 60) return '#ffc107';
          return '#f44336';
        };

        const customIcon = {
          path: 'M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2C20 10.48 17.33 6.55 12 2z',
          fillColor: getWaterQualityColor(post.water_quality_score),
          fillOpacity: 0.9,
          strokeColor: '#ffffff',
          strokeWeight: 3,
          scale: 1.8,
          anchor: new google.maps.Point(12, 20)
        };

        const marker = new google.maps.Marker({
          position: { lat, lng },
          map: map,
          title: post.title,
          icon: customIcon,
          animation: google.maps.Animation.DROP
        });

        marker.addListener('click', () => {
          if (infoWindow) {
            const getQualityLabel = (score?: number) => {
              if (!score) return '未測定';
              if (score >= 80) return '良好';
              if (score >= 70) return 'やや良好';
              if (score >= 60) return '注意';
              return '要改善';
            };

            const content = `
              <div style="padding: 12px; font-family: 'Segoe UI', sans-serif; max-width: 320px;">
                <h3 style="margin: 0 0 8px 0; color: #1976d2; font-size: 16px; font-weight: 600;">${post.title}</h3>
                
                <div style="background: linear-gradient(135deg, rgba(227, 242, 253, 0.8) 0%, rgba(187, 222, 251, 0.6) 100%); padding: 8px 12px; border-radius: 8px; margin-bottom: 10px; border: 1px solid rgba(129, 212, 250, 0.3);">
                  <div style="font-size: 12px; color: #1976d2; font-weight: 500; margin-bottom: 4px;">
                    📝 ${post.nickname} | 📅 ${new Date(post.created_at).toLocaleDateString()}
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="background: ${getWaterQualityColor(post.water_quality_score)}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600;">
                      ${post.water_quality_score || 0}点
                    </span>
                    <span style="font-size: 12px; color: #333; font-weight: 500;">
                      ${getQualityLabel(post.water_quality_score)}
                    </span>
                  </div>
                </div>

                ${post.description ? `
                  <div style="background: rgba(255,255,255,0.9); padding: 10px; border-radius: 6px; margin-bottom: 8px; border: 1px solid rgba(129, 212, 250, 0.2);">
                    <div style="font-size: 11px; color: #666; font-weight: 500; margin-bottom: 4px;">💬 調査結果:</div>
                    <p style="margin: 0; font-size: 13px; color: #333; line-height: 1.4;">${post.description}</p>
                  </div>
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
      
      <div style={{ 
        position: 'absolute',
        top: '10px',
        left: '10px',
        fontSize: '14px',
        color: '#1976d2',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(227,242,253,0.9) 100%)',
        padding: '8px 12px',
        borderRadius: '8px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(129, 212, 250, 0.3)',
        fontWeight: '600'
      }}>
        📍 福岡市博多区 水質監視マップ
      </div>
      
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
        調査地点: {posts.length}箇所
      </div>

      <div style={{ 
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        fontSize: '11px',
        color: '#666',
        background: 'rgba(255,255,255,0.9)',
        padding: '8px',
        borderRadius: '6px',
        border: '1px solid rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontWeight: '600', marginBottom: '4px' }}>水質スコア</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div><span style={{ background: '#4caf50', color: 'white', padding: '1px 6px', borderRadius: '8px', fontSize: '10px' }}>80+</span> 良好</div>
          <div><span style={{ background: '#8bc34a', color: 'white', padding: '1px 6px', borderRadius: '8px', fontSize: '10px' }}>70+</span> やや良好</div>
          <div><span style={{ background: '#ffc107', color: 'white', padding: '1px 6px', borderRadius: '8px', fontSize: '10px' }}>60+</span> 注意</div>
          <div><span style={{ background: '#f44336', color: 'white', padding: '1px 6px', borderRadius: '8px', fontSize: '10px' }}>60未満</span> 要改善</div>
        </div>
      </div>
    </div>
  );
};

const MapView: React.FC<MapViewProps> = ({ selectedPost }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const { isLoaded, loadError } = useGoogleMaps();

  useEffect(() => {
    const fetchDemoPosts = async () => {
      try {
        const response = await fetch('/api/demo/posts');
        const data = await response.json();
        console.log('MapView: デモ投稿データ取得:', data);
        setPosts(data);
      } catch (error) {
        console.error('MapView: デモ投稿取得失敗:', error);
      }
    };

    fetchDemoPosts();
  }, []);

  if (loadError) {
    return (
      <div style={{ 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#d32f2f',
        fontSize: '16px'
      }}>
        地図の読み込みに失敗しました: {loadError}
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div style={{ 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontSize: '16px'
      }}>
        地図を読み込み中...
      </div>
    );
  }

  return (
    <GoogleMapComponent 
      posts={posts} 
      selectedPost={selectedPost}
    />
  );
};

export default MapView;
