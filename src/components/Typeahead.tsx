import { useCallback, useEffect, useRef, useState, type JSX } from 'react';
import { Search, X } from 'lucide-react';
import type { SearchItem } from '@/types';
import { searchItems } from '@/services/api';

const DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 1;
const MAX_RESULTS = 10;

interface TypeaheadProps {
  onSelect?: (item: SearchItem) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * Typeahead/Autocomplete search component with accessibility support
 * Features:
 * - Debounced search
 * - Keyboard navigation
 * - ARIA labels for accessibility
 * - XSS protection through React's built-in escaping
 * - Loading states
 */
export const Typeahead = ({
  onSelect,
  placeholder = 'Search...',
  className = '',
  disabled = false,
}: TypeaheadProps): JSX.Element => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Search handler with security considerations
  const handleSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setIsOpen(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const items = await searchItems(searchQuery, MAX_RESULTS);
      setResults(items);
      setIsOpen(items.length > 0);
      setSelectedIndex(-1);
    } catch (err) {
      setError('Failed to fetch search results');
      console.error('Search error:', err);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search
  const handleInputChange = useCallback(
    (value: string) => {
      setQuery(value);

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        handleSearch(value);
      }, DEBOUNCE_MS);
    },
    [handleSearch]
  );

  const handleSelectItem = useCallback(
    (item: SearchItem) => {
      setQuery(item.label);
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
          aria-label="Search items"
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
                <li
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  role="option"
                  aria-selected={selectedIndex === index}
                  className={`cursor-pointer border-b px-4 py-3 text-sm transition-colors last:border-b-0 ${
                    selectedIndex === index
                      ? 'bg-blue-50 text-blue-900'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium text-gray-900">{item.label}</div>
                  {item.description && (
                    <div className="text-xs text-gray-500">
                      {item.description}
                    </div>
                  )}
                  {item.category && (
                    <div className="text-xs text-gray-400">{item.category}</div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
