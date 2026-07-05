export interface PaginatedResult<T> {
  data: T[];
  metadata: {
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export function createPaginatedResult<T>(
  data: T[],
  totalCount: number,
  params: PaginationParams
): PaginatedResult<T> {
  const limit = params.limit ?? 20;
  const page = params.page ?? 1;
  const totalPages = Math.ceil(totalCount / limit);

  return {
    data,
    metadata: {
      totalCount,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

export function getPrismaPagination(params: PaginationParams) {
  const limit = params.limit ?? 20;
  const page = params.page ?? 1;
  const skip = (page - 1) * limit;

  return {
    skip,
    take: limit,
  };
}
