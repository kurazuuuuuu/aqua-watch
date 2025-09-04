import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api/auth';

const authApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const verifyAuth = async () => {
  try {
    const response = await authApi.get('/verify');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await authApi.post('/logout');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getGitHubAuthUrl = () => {
  return 'http://localhost:5001/api/auth/github';
};
