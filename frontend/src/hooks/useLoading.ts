import { useState } from 'react';

export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);

  const withLoading = async <T>(asyncFn: () => Promise<T>): Promise<T> => {
    setIsLoading(true);
    try {
      const result = await asyncFn();
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, setIsLoading, withLoading };
};
