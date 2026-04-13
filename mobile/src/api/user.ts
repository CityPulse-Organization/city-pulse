import { axios, bffAxios } from "../config";
import type { PageResponse, BffProfileResponse, UserSearchResponse } from "../types";

export const searchUsers = async (
  username: string,
  page: number = 0,
  size: number = 24,
  sort?: string | string[],
): Promise<PageResponse<UserSearchResponse>> => {
  const { data } = await axios.get<PageResponse<UserSearchResponse>>(
    "/users/search",
    {
      params: { username: username || undefined, page, size, sort },
    },
  );
  return data;
};

export const followUser = async (targetId: string): Promise<void> => {
  await axios.post(`/users/${targetId}/follow`);
};

export const unfollowUser = async (targetId: string): Promise<void> => {
  await axios.delete(`/users/${targetId}/unfollow`);
};

export const getFollowers = async (
  userId: string,
  page: number = 0,
  size: number = 24,
): Promise<PageResponse<UserSearchResponse>> => {
  const { data } = await axios.get<PageResponse<UserSearchResponse>>(
    `/users/${userId}/followers`,
    { params: { page, size } },
  );
  return data;
};

export const getFollowing = async (
  userId: string,
  page: number = 0,
  size: number = 24,
): Promise<PageResponse<UserSearchResponse>> => {
  const { data } = await axios.get<PageResponse<UserSearchResponse>>(
    `/users/${userId}/following`,
    { params: { page, size } },
  );
  return data;
};

export const getMyProfile = async (): Promise<UserSearchResponse> => {
  const { data } = await axios.get<UserSearchResponse>("/users/me");
  return data;
};

export const getUserProfile = async (
  userId: string,
): Promise<UserSearchResponse> => {
  const { data } = await bffAxios.get<BffProfileResponse>(
    `/users/${userId}/profile`,
  );
  return {
    id: data.id,
    username: data.username,
    bio: data.bio,
    jobTitle: data.jobTitle,
    avatarUrl: data.avatarUrl ?? undefined,
  };
};

export const updateCurrentUser = async (
  profile: Partial<UserSearchResponse>,
): Promise<UserSearchResponse> => {
  const { data } = await axios.put<UserSearchResponse>("/users/me", profile);
  return data;
};
