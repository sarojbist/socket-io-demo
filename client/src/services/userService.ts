import axios from "axios";
import type { CreateConversationResponse, GetMessagesResponse, TUserPlayground } from "./types";

// const API_URL = import.meta.env.VITE_BASE_URL;
const API_URL = "https://socket-backend-928159139419.asia-south1.run.app/api/v1"

export const fetchAllContacts = async (): Promise<TUserPlayground[]> => {
    const token = localStorage.getItem("token");

    const res = await axios.post(
        `${API_URL}/users/get-all-contacts`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return res.data.users;
};

export const createConversation = async ({
    userId1,
    userId2,
}: {
    userId1: string;
    userId2: string;
}): Promise<CreateConversationResponse["conversation"]> => {
    const token = localStorage.getItem("token");

    const res = await axios.post<CreateConversationResponse>(
        `${API_URL}/users/create-conversation`,
        { userId1, userId2 },
        { headers: { Authorization: `Bearer ${token}` } }
    );

    return res.data.conversation;
};

export const getMessages = async (
    { conversationId,
        page = 1,
        limit = 50 }:
        {
            conversationId: string;
            page?: number;
            limit?: number;
        }
): Promise<GetMessagesResponse> => {

    const token = localStorage.getItem("token");

    const res = await axios.get<GetMessagesResponse>(
        `${API_URL}/users/get-messages/${conversationId}?page=${page}&limit=${limit}`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );

    return res.data;
};


export const sendFileMessage = async ({
    file,
    conversationId,
    senderId,
}: {
    file: File;
    conversationId: string;
    senderId: string;
}) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("file", file);
    formData.append("conversationId", conversationId);
    formData.append("senderId", senderId);

    const res = await axios.post(
        `${API_URL}/users/send-file`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return res.data;
};
