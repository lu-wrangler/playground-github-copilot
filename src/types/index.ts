export interface SearchItem {
  id: string;
  label: string;
  value: string;
  category?: string;
  description?: string;
}

export interface SearchRequest {
  query: string;
  limit?: number;
}

export interface SearchResponse {
  results: SearchItem[];
  total: number;
}

export interface ApiError {
  code: string;
  message: string;
}
