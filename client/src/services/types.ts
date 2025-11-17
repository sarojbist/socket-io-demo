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

export type TUserPlayground = {
  id: string;
  username: string;
  email: string;
  isOnline: boolean;
  createdAt: string;
}

export type IGetAllUsersResponse = {
  success: boolean;
  users: TUserPlayground[];
}
