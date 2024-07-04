import axios from "axios";

const API_URL = "/api/request/";

// Get user goals
const getRequest = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);

  return response.data;
};

const requestService = {
  getRequest,
};

export default requestService;
