import { axios, bffAxios } from "../config";
import type {
  PagedModelResponse,
  PostResponse,
  CommentResponse,
  CommentRequest,
  BffPostResponse,
  GeoJSONFeatureCollection,
} from "../types";

export const getPostsByUserId = async (
  userId: string,
  page: number = 0,
  size: number = 20,
): Promise<PagedModelResponse<PostResponse>> => {
  const { data } = await axios.get<PagedModelResponse<PostResponse>>(`/posts`, {
    params: { authorId: userId, page, size },
  });
  return data;
};

export const getPostById = async (id: number): Promise<PostResponse> => {
  const { data } = await axios.get<PostResponse>(`/posts/${id}`);
  return data;
};

export const createPost = async (
  imageUrl: string,
  caption?: string,
  latitude?: number,
  longitude?: number,
): Promise<PostResponse> => {
  const { data } = await axios.post<PostResponse>("/posts", {
    imageUrl,
    caption,
    latitude,
    longitude,
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

export const savePost = async (id: number): Promise<void> => {
  await axios.post(`/posts/${id}/save`);
};

export const unsavePost = async (id: number): Promise<void> => {
  await axios.delete(`/posts/${id}/save`);
};

export const getSavedPosts = async (
  page: number = 0,
  size: number = 20,
): Promise<PagedModelResponse<BffPostResponse>> => {
  const { data } = await bffAxios.get<PagedModelResponse<BffPostResponse>>(
    `/posts/saved`,
    { params: { page, size } },
  );
  return data;
};

export const getComments = async (
  postId: number,
  page: number = 0,
  size: number = 20,
): Promise<PagedModelResponse<CommentResponse>> => {
  const { data } = await bffAxios.get<PagedModelResponse<CommentResponse>>(
    `/posts/${postId}/comments`,
    { params: { page, size } },
  );
  return data;
};

export const getReplies = async (
  commentId: number,
  page: number = 0,
  size: number = 20,
): Promise<PagedModelResponse<CommentResponse>> => {
  const { data } = await bffAxios.get<PagedModelResponse<CommentResponse>>(
    `/comments/${commentId}/replies`,
    { params: { page, size } },
  );
  return data;
};

export const createComment = async (
  postId: number,
  request: CommentRequest,
): Promise<CommentResponse> => {
  const { data } = await axios.post<CommentResponse>(
    `/posts/${postId}/comments`,
    request,
  );
  return data;
};

export const deleteComment = async (commentId: number): Promise<void> => {
  await axios.delete(`/comments/${commentId}`);
};

export const likeComment = async (commentId: number): Promise<void> => {
  await axios.post(`/comments/${commentId}/like`);
};

export const unlikeComment = async (commentId: number): Promise<void> => {
  await axios.delete(`/comments/${commentId}/like`);
};

export const searchPosts = async (
  caption?: string,
  page: number = 0,
  size: number = 20,
): Promise<PagedModelResponse<BffPostResponse>> => {
  const { data } = await bffAxios.get<PagedModelResponse<BffPostResponse>>(
    "/feed",
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
): Promise<PagedModelResponse<BffPostResponse>> => {
  const { data } = await bffAxios.get<PagedModelResponse<BffPostResponse>>(
    "/feed",
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

export const getMapPosts = async (
  minLon: number,
  minLat: number,
  maxLon: number,
  maxLat: number,
): Promise<GeoJSONFeatureCollection> => {
  console.log(
    `[getMapPosts] GET /posts/map/bounds bbox=${minLon},${minLat},${maxLon},${maxLat}`,
  );
  const { data } = await axios.get<GeoJSONFeatureCollection>(
    "/posts/map/bounds",
    {
      params: {
        bbox: `${minLon},${minLat},${maxLon},${maxLat}`,
      },
    },
  );
  console.log(
    `[getMapPosts] Response: ${data?.features?.length ?? 0} features`,
  );
  return data;
};
