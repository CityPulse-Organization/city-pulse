export type AuthRequest = {
  email: string;
  password: string;
  username?: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    username: string;
  };
};
