import axios from 'axios';
import { getApiBaseUrl, getBaseUrl } from '../utils/config';

const authApi = axios.create({
  baseURL: `${getApiBaseUrl()}/auth`,
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
  return `${getBaseUrl()}/api/auth/github`;
};
