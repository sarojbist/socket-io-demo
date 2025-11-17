import axios from "axios";
import type { TUserPlayground } from "./types";

const API_URL = import.meta.env.VITE_BASE_URL;

export const fetchAllContacts = async (): Promise<TUserPlayground[]> => {
  const token = localStorage.getItem("token");

  const res = await axios.post(
    `${API_URL}users/get-all-contacts`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data.users;
};