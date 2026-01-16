// Export all components
export * from './typeahead';

// Export types
export type {
  AutocompleteItem,
  SearchItem,
  SearchRequest,
  SearchResponse,
  ApiError,
} from './types';

// Export services
export { searchItems, getItemById, getCategories } from './services/api';
