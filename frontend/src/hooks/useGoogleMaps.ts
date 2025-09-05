import { useState, useEffect } from 'react';

interface UseGoogleMapsReturn {
  isLoaded: boolean;
  loadError: string | null;
}

export const useGoogleMaps = (): UseGoogleMapsReturn => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (window.google?.maps) {
      setIsLoaded(true);
      return;
    }

    const loadGoogleMaps = async () => {
      try {
        const response = await fetch('/api/maps/js');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to get Maps URL');
        }

        const script = document.createElement('script');
        script.src = data.url;
        script.async = true;
        script.defer = true;
        
        script.onload = () => setIsLoaded(true);
        script.onerror = () => setLoadError('Failed to load Google Maps');
        
        document.head.appendChild(script);
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : 'Unknown error');
      }
    };

    loadGoogleMaps();
  }, []);

  return { isLoaded, loadError };
};
