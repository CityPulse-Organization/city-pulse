import { axios } from "../config";
import type {
  PagedModelResponse,
  PostResponse,
  CommentResponse,
} from "../types";

export const getPostsByUserId = async (
  userId: string,
  page: number = 0,
  size: number = 20,
): Promise<PagedModelResponse<PostResponse>> => {
  const { data } = await axios.get<PagedModelResponse<PostResponse>>(
    `/posts/user/${userId}`,
    { params: { page, size } },
  );
  return data;
};

export const getPostById = async (id: number): Promise<PostResponse> => {
  const { data } = await axios.get<PostResponse>(`/posts/${id}`);
  return data;
};

export const createPost = async (
  imageUrl: string,
  caption?: string,
): Promise<PostResponse> => {
  const { data } = await axios.post<PostResponse>("/posts", {
    imageUrl,
    caption,
  });
  return data;
};

export const updatePostCaption = async (
  postId: number,
  caption: string,
): Promise<PostResponse> => {
  const { data } = await axios.patch<PostResponse>(`/posts/${postId}`, {
    caption,
  });
  return data;
};

export const deletePost = async (postId: number): Promise<void> => {
  await axios.delete(`/posts/${postId}`);
};

export const likePost = async (id: number): Promise<void> => {
  await axios.post(`/posts/${id}/like`);
};

export const unlikePost = async (id: number): Promise<void> => {
  await axios.delete(`/posts/${id}/like`);
};

export const getComments = async (
  postId: number,
  page: number = 0,
  size: number = 20,
): Promise<PagedModelResponse<CommentResponse>> => {
  const { data } = await axios.get<PagedModelResponse<CommentResponse>>(
    `/posts/${postId}/comments`,
    { params: { page, size } },
  );
  return data;
};

export const createComment = async (
  postId: number,
  text: string,
): Promise<CommentResponse> => {
  const { data } = await axios.post<CommentResponse>(
    `/posts/${postId}/comments`,
    { text },
  );
  return data;
};

export const deleteComment = async (commentId: number): Promise<void> => {
  await axios.delete(`/comments/${commentId}`);
};

export const searchPosts = async (
  caption?: string,
  page: number = 0,
  size: number = 20,
): Promise<PagedModelResponse<PostResponse>> => {
  const { data } = await axios.get<PagedModelResponse<PostResponse>>(
    "/posts/search",
    {
      params: {
        caption: caption?.trim() || undefined,
        page,
        size,
      },
    },
  );
  return data;
};

export const getPulsePosts = async (
  search?: string,
  page: number = 0,
  size: number = 20,
): Promise<PagedModelResponse<PostResponse>> => {
  const { data } = await axios.get<PagedModelResponse<PostResponse>>(
    "/posts/search",
    {
      params: {
        caption: search?.trim() || undefined,
        page,
        size,
      },
    },
  );
  return data;
};
