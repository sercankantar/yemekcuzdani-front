import axios from 'axios';

const API_URL = 'https://api.yemekcuzdani.com/api/v1/users';

export const getCurrentUser = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // API'den gelen veriyi döndürüyoruz
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error; // Hata durumunda fırlatıyoruz
  }
};
