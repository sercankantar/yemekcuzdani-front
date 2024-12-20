import axios from 'axios';
const API_URL = 'https://api.yemekcuzdani.com/api/v1';
async function refreshAccessToken(refreshToken: string): Promise<string> {
  try {
    const response = await axios.post(`${API_URL}/refresh-token`, {
      refreshToken: refreshToken,
    });

    if (response.status === 200) {
      const { accessToken } = response.data;
      return accessToken;
    } else {
      throw new Error('Failed to refresh access token');
    }
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
}
export default refreshAccessToken;