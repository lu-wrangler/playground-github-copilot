import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type JSX,
  type ComponentType,
} from 'react';
import { Search, X } from 'lucide-react';
import type { AutocompleteItem } from '../types';
import { searchItems } from '../services/api';

const DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 1;
const MAX_RESULTS = 10;

/**
 * Generic fetch function type
 * Allows custom data sources (API, static list, composite properties)
 */
export type FetchFunction<T extends AutocompleteItem> = (
  query: string,
  limit: number
) => Promise<T[]>;

/**
 * Default item renderer component
 * Receives the item and highlight state, returns JSX
 */
export type ItemRenderer<T extends AutocompleteItem> = ComponentType<{
  item: T;
  isSelected: boolean;
  onMouseEnter: () => void;
  onClick: () => void;
}>;

interface TypeaheadProps<T extends AutocompleteItem = AutocompleteItem> {
  /**
   * Custom fetch function to retrieve items
   * @default Uses the default searchItems API function
   */
  onFetch?: FetchFunction<T>;

  /**
   * Custom component to render each autocomplete item
   * @default Uses default SearchItem renderer
   */
  itemRenderer?: ItemRenderer<T>;

  /**
   * Called when an item is selected
   */
  onSelect?: (item: T) => void;

  /**
   * Placeholder text for the input field
   */
  placeholder?: string;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Disable the input and dropdown
   */
  disabled?: boolean;

  /**
   * Maximum number of results to display
   * @default 10
   */
  maxResults?: number;

  /**
   * Debounce delay in milliseconds
   * @default 300
   */
  debounceMs?: number;

  /**
   * Minimum query length to trigger search
   * @default 1
   */
  minQueryLength?: number;

  /**
   * ARIA label for the input field
   */
  ariaLabel?: string;

  /**
   * Callback for errors
   */
  onError?: (error: Error) => void;
}

/**
 * Default item renderer for SearchItem
 */
const DefaultItemRenderer = ({
  item,
  isSelected,
  onMouseEnter,
  onClick,
}: {
  item: AutocompleteItem;
  isSelected: boolean;
  onMouseEnter: () => void;
  onClick: () => void;
}): JSX.Element => {
  const searchItem = item as unknown as {
    label?: string;
    value?: string;
    category?: string;
    description?: string;
  };
  return (
    <li
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      role="option"
      aria-selected={isSelected}
      className={`cursor-pointer border-b px-4 py-3 text-sm transition-colors last:border-b-0 ${
        isSelected ? 'bg-blue-50 text-blue-900' : 'hover:bg-gray-50'
      }`}
    >
      <div className="font-medium text-gray-900">{searchItem.label}</div>
      {searchItem.description && (
        <div className="text-xs text-gray-500">{searchItem.description}</div>
      )}
      {searchItem.category && (
        <div className="text-xs text-gray-400">{searchItem.category}</div>
      )}
    </li>
  );
};

/**
 * Generic Typeahead/Autocomplete search component with extensibility
 *
 * Features:
 * - Customizable fetch function (API endpoint, static list, composite data)
 * - Customizable item renderer for styling flexibility
 * - Debounced search with configurable delay
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - ARIA labels for accessibility
 * - XSS protection through React's built-in escaping
 * - Error handling and loading states
 */
export const Typeahead = <T extends AutocompleteItem = AutocompleteItem>({
  onFetch,
  itemRenderer: ItemRenderer = DefaultItemRenderer,
  onSelect,
  placeholder = 'Search...',
  className = '',
  disabled = false,
  maxResults = MAX_RESULTS,
  debounceMs = DEBOUNCE_MS,
  minQueryLength = MIN_QUERY_LENGTH,
  ariaLabel = 'Search items',
  onError,
}: TypeaheadProps<T>): JSX.Element => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Validate parameters
  const validMaxResults = Math.max(1, Math.min(maxResults, 100));
  const validDebounceMs = Math.max(0, debounceMs);
  const validMinQueryLength = Math.max(0, minQueryLength);

  // Default fetch function using the API service
  const defaultFetch: FetchFunction<T> = useCallback(
    async (q: string) => {
      const results = await searchItems(q, validMaxResults);
      return results as unknown as T[];
    },
    [validMaxResults]
  );

  const fetchFunction = onFetch || defaultFetch;

  // Search handler with security considerations
  const handleSearch = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.length < validMinQueryLength) {
        setResults([]);
        setIsOpen(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const items = await fetchFunction(searchQuery, validMaxResults);
        setResults(items);
        setIsOpen(items.length > 0);
        setSelectedIndex(-1);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError('Failed to fetch search results');
        console.error('Search error:', error);
        setResults([]);
        onError?.(error);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchFunction, validMaxResults, validMinQueryLength, onError]
  );

  // Debounced search
  const handleInputChange = useCallback(
    (value: string) => {
      setQuery(value);

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        handleSearch(value);
      }, validDebounceMs);
    },
    [handleSearch, validDebounceMs]
  );

  const handleSelectItem = useCallback(
    (item: T) => {
      setQuery(item.id);
      setIsOpen(false);
      setResults([]);
      setSelectedIndex(-1);
      onSelect?.(item);
    },
    [onSelect]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && results[selectedIndex]) {
            handleSelectItem(results[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          setSelectedIndex(-1);
          break;
        default:
          break;
      }
    },
    [results, selectedIndex, handleSelectItem]
  );

  const handleClear = useCallback(() => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <div className={`relative w-full ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setIsOpen(true)}
          disabled={disabled}
          placeholder={placeholder}
          aria-label={ariaLabel}
          aria-autocomplete="list"
          aria-controls="search-results"
          aria-expanded={isOpen}
          className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-10 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:bg-gray-100 disabled:text-gray-500"
        />
        {query && (
          <button
            onClick={handleClear}
            disabled={disabled}
            aria-label="Clear search"
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 disabled:text-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="mt-2 rounded-md bg-red-50 p-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Results Dropdown */}
      {isOpen && (
        <div
          ref={resultsRef}
          id="search-results"
          role="listbox"
          className="absolute top-full z-10 mt-2 w-full rounded-lg border border-gray-300 bg-white shadow-lg"
        >
          {isLoading && (
            <div className="px-4 py-3 text-center text-sm text-gray-500">
              Loading...
            </div>
          )}

          {!isLoading && results.length === 0 && (
            <div className="px-4 py-3 text-center text-sm text-gray-500">
              No results found
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <ul className="max-h-96 overflow-y-auto">
              {results.map((item, index) => (
                <ItemRenderer
                  key={item.id}
                  item={item}
                  isSelected={selectedIndex === index}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={() => handleSelectItem(item)}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
