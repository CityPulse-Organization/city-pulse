import { tokenStorage, axios, bffAxios } from "../config";
import { AuthRequest, AuthResponse, User } from "../types";

import { jwtDecode } from "jwt-decode";

const decodeJWT = (token: string): User | null => {
  try {
    const payload = jwtDecode<{ sub: string; role?: string }>(token);
    return { id: String(payload.sub), role: payload.role ?? "USER" };
  } catch {
    return null;
  }
};

export const register = async (data: AuthRequest): Promise<AuthResponse> => {
  const response = await bffAxios.post<AuthResponse>("/signup", data);
  const { accessToken, refreshToken } = response.data || {};

  if (accessToken && refreshToken) {
    await tokenStorage.setTokens(accessToken, refreshToken);
    const user = decodeJWT(accessToken);
    await tokenStorage.setUser(user);
  }

  return response.data;
};

export const login = async (data: AuthRequest): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>("/auth/login", data);
  const { accessToken, refreshToken } = response.data || {};

  if (accessToken && refreshToken) {
    await tokenStorage.setTokens(accessToken, refreshToken);
    const user = decodeJWT(accessToken);
    await tokenStorage.setUser(user);
  }

  return response.data;
};

export const loginWithGoogle = async (
  token: string,
): Promise<{ status: number; data: AuthResponse }> => {
  const response = await axios.post<AuthResponse>("/oauth2/google", {
    idToken: token,
  });

  if (response.status === 200) {
    const { accessToken, refreshToken } = response.data || {};
    if (accessToken && refreshToken) {
      await tokenStorage.setTokens(accessToken, refreshToken);
      const user = decodeJWT(accessToken);
      await tokenStorage.setUser(user);
    }
  }

  return { status: response.status, data: response.data };
};

export const completeGoogleRegistration = async (
  token: string,
  username: string,
  idToken: string,
): Promise<AuthResponse> => {
  await axios.post(
    "/registration/oauth2",
    { username },
    { headers: { Authorization: `Bearer ${token}` } },
  );

  const loginResponse = await axios.post<AuthResponse>("/oauth2/google", {
    idToken,
  });

  const { accessToken, refreshToken } = loginResponse.data || {};
  if (accessToken && refreshToken) {
    await tokenStorage.setTokens(accessToken, refreshToken);
    const user = decodeJWT(accessToken);
    await tokenStorage.setUser(user);
  }

  return loginResponse.data;
};

export const logout = async (): Promise<void> => {
  try {
    const refreshToken = await tokenStorage.getRefreshToken();
    if (refreshToken) {
      await axios.post("/auth/logout", { refreshToken });
    }
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
