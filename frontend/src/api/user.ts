import { axios } from "../config";
import type { PageResponse, UserSearchResponse } from "../types";

export const searchUsers = async (
  username: string,
  page: number = 0,
  size: number = 24,
): Promise<PageResponse<UserSearchResponse>> => {
  const { data } = await axios.get<PageResponse<UserSearchResponse>>("/users/search", {
    params: { username: username || undefined, page, size },
  });
  return data;
};
