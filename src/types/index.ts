/**
 * Generic type for any autocomplete item
 * Allows developers to use custom data structures
 */
export interface AutocompleteItem {
  id: string;
  [key: string]: unknown;
}

export interface SearchItem extends AutocompleteItem {
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
