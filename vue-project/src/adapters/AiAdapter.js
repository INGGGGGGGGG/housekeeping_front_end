import axios from 'axios';

const useChatAdapter = (config) => {
  return {
    sendRequest: async (data) => {
      try {
        const response = await axios.post(config.url, data);
        return response.data;
      } catch (error) {
        console.error('请求失败', error);
        throw error;
      }
    }
  };
};

export { useChatAdapter };