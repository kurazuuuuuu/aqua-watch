import axios from 'axios';
import { getApiBaseUrl } from '../utils/config';

const api = axios.create({
  baseURL: getApiBaseUrl(),
});

export const getPosts = async () => {
  const response = await api.get('/posts');
  return response.data;
};

export const createPost = async (postData: FormData) => {
  const response = await api.post('/posts', postData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
