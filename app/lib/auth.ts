import axios from 'axios';
import refreshAccessToken from './refresh';
import { useAuthStore } from '../store/auth';

const API_URL = 'https://api.yemekcuzdani.com/api/v1/users';

export const getCurrentUser = async (token: string) => {
  try {
    if(token){
    let response = await axios.get(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      const { setToken, setRefreshToken } = useAuthStore();
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        const newToken = await refreshAccessToken(refreshToken);
        setToken(newToken);
        localStorage.setItem('token', newToken);

        // Yeni token ile isteği tekrar yap
        response = await axios.get(`${API_URL}/me`, {
          headers: {
            Authorization: `Bearer ${newToken}`,
          },
        });
      } else {
        throw new Error('Refresh token not found');
      }
    }

    console.log('User data:', response.data); // API'den gelen veriyi logluyoruz
    return response.data; // API'den gelen veriyi döndürüyoruz
  }
  else {
    return null;
  }
  } catch (error) {
    console.error('Error fetching current user:', error);
  }
};
