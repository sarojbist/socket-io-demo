import axios from "axios";
import type { TGetMyDetailsResponse } from "./types";

const API_URL = import.meta.env.VITE_BASE_URL;
// const API_URL = "https://socket-backend-928159139419.asia-south1.run.app/api/v1/"

export const registerService = async (data: {
  username: string;
  email: string;
  password: string;
}) => {
  const res = await axios.post(`${API_URL}users/register`, data);
  return res.data;
};

export const loginService = async (payload: { email: string; password: string }) => {
  const res = await axios.post(`${API_URL}users/login`, payload);
  return res.data; // { success, token, user }
};

export const getMyDetails = async (): Promise<TGetMyDetailsResponse | null> => {
  const rawUser = localStorage.getItem("user");
  if (!rawUser) {
    return null;
  }
  const getUserInfo = JSON.parse(rawUser) as { id: string };
  const res = await axios.post(`${API_URL}users/get-my-details`, { id: getUserInfo.id });
  console.log("getMyDetails", getUserInfo);
  return res.data;
}
