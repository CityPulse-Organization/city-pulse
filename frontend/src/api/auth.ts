import { tokenStorage, axios } from "../config";
import { AuthRequest, AuthResponse, User } from "../types";

const decodeJWT = (token: string): User | null => {
  try {
    const base64Payload = token
      .split(".")[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const padded =
      base64Payload + "=".repeat((4 - (base64Payload.length % 4)) % 4);
    const payload = JSON.parse(atob(padded));
    return { id: String(payload.sub), role: payload.role ?? "USER" };
  } catch {
    return null;
  }
};

export const register = async (data: AuthRequest): Promise<AuthResponse> => {
  await axios.post("/auth/register", data);
  return login({ username: data.username, password: data.password });
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

export const loginWithGoogle = async (token: string): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>("/oauth2/google", { token });
  const { accessToken, refreshToken } = response.data || {};

  if (accessToken && refreshToken) {
    await tokenStorage.setTokens(accessToken, refreshToken);
    const user = decodeJWT(accessToken);
    await tokenStorage.setUser(user);
  }

  return response.data;
};

export const completeGoogleRegistration = async (
  token: string,
  username: string
): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>("/oauth2/google/complete", {
    token,
    username,
  });
  const { accessToken, refreshToken } = response.data || {};

  if (accessToken && refreshToken) {
    await tokenStorage.setTokens(accessToken, refreshToken);
    const user = decodeJWT(accessToken);
    await tokenStorage.setUser(user);
  }

  return response.data;
};

export const logout = async (): Promise<void> => {
  try {
    const refreshToken = await tokenStorage.getRefreshToken();
    if (refreshToken) {
      await axios.post("/auth/logout", { token: refreshToken });
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
