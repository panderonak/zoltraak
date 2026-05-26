export interface PaginatedResult<T> {
	items: T[];
	currentPage: number;
	totalPages: number;
	totalItems: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
}
