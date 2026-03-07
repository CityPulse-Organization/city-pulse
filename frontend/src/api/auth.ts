import { tokenStorage, axios } from "../config";
import { AuthRequest, AuthResponse } from "../types";

export const register = async (data: AuthRequest): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>("/auth/register", data);
  const { accessToken, refreshToken } = response.data || {};
  
  if (accessToken && refreshToken) {
    await tokenStorage.setTokens(accessToken, refreshToken);
  }
  
  return response.data;
};

export const login = async (
  credentials: AuthRequest,
): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>("/auth/login", credentials);
  const { accessToken, refreshToken } = response.data || {};
  
  if (accessToken && refreshToken) {
    await tokenStorage.setTokens(accessToken, refreshToken);
  }
  
  return response.data;
};

export const logout = async (): Promise<void> => {
  try {
    await axios.post("/auth/logout");
  } finally {
    await tokenStorage.clearTokens();
  }
};

export const refreshToken = async (): Promise<string> => {
  const currentRefreshToken = await tokenStorage.getRefreshToken();
  if (!currentRefreshToken) throw new Error("No refresh token available");

  const response = await axios.post("/auth/refresh", {
    refreshToken: currentRefreshToken,
  });

  const { accessToken, refreshToken: newRefreshToken } = response.data;
  await tokenStorage.setTokens(accessToken, newRefreshToken);

  return accessToken;
};
