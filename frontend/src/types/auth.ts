export type AuthRequest = {
  email?: string;
  password: string;
  username?: string;
};

export type User = {
  id: string;
  role: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
};
