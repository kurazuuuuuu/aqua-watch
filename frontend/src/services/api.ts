import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
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
