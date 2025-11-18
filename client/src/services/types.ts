export type TUser = {
  id: string;
  username: string;
  email: string;
  isOnline: boolean;
  createdAt: string;
};

export type TGetMyDetailsResponse = {
  success: boolean;
  user: TUser;
};

export type TUserPlaygroundApi = {
  _id: string;
  username: string;
  email: string;
  // isOnline: boolean;
  createdAt: string;
}
export type TUserPlayground = {
  _id: string;
  username: string;
  email: string;
  isOnline: boolean;
  createdAt: string;
}
export type IGetAllUsersResponse = {
  success: boolean;
  users: TUserPlaygroundApi[];
}


// chats
export interface TConversation {
  _id: string;
  participants: string[];
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
}

// Message model
export interface TMessage {
  _id: string;
  conversationId: string;
  senderId: string;
  type: "text" | "image" | "file";
  content: string;
  createdAt: string;
}

export interface CreateConversationResponse {
  success: boolean;
  conversation: TConversation;
}

export interface GetMessagesResponse {
  success: boolean;
  page: number;
  limit: number;
  messages: TMessage[];
}

