export class PagingResponseModel {
  items: any[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number = 0;
  hasPrevious: boolean;
  hasNext: boolean;
}
