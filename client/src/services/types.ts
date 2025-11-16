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
