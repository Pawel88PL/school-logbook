export interface PagedRequestParams {
    pageNumber: number;
    pageSize: number;
    sortColumn: string;
    sortDirection: string;
    searchQuery?: string;
    userId?: string | null;
    dateFrom?: string;
    dateTo?: string;
}