import axios from "axios";

const API_URL = import.meta.env.VITE_BASE_URL;

export const registerService = async (data: {
  username: string;
  email: string;
  password: string;
}) => {
  const res = await axios.post(`${API_URL}users/register`, data);
  return res.data;
};
