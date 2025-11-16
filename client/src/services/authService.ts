import axios from "axios";
import type { TGetMyDetailsResponse } from "./types";

const API_URL = import.meta.env.VITE_BASE_URL;

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
