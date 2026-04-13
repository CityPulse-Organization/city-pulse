export type UserSearchResponse = {
  id: string;
  username: string;
  bio?: string;
  jobTitle?: string;
  avatarUrl?: string;
};

export type PageResponse<T> = {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
};

export type PagedModelResponse<T> = {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};

export type DiscoverUser = {
  id: string;
  username: string;
  profileImageUrl: string;
  job: string;
};

export type BffPostResponse = {
  id: number;
  imageUrl: string;
  caption: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  isLikedByMe: boolean;
  isSavedByMe: boolean;
  authorId: string;
  authorUsername: string;
  authorAvatarUrl: string | null;
};

export type BffProfileResponse = {
  id: string;
  username: string;
  bio?: string;
  jobTitle?: string;
  avatarUrl?: string | null;
  posts: PagedModelResponse<BffPostResponse>;
};
