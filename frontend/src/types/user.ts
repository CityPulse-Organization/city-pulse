export type UserSearchResponse = {
  id: string;
  username: string;
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

export type DiscoverUser = {
  id: string;
  username: string;
  profileImageUrl: string;
  job: string;
};
