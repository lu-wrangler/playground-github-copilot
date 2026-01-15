import { useState, type JSX } from 'react';
import { Typeahead } from './Typeahead';
import type { SearchItem } from '@/types';

interface SearchDemoProps {
  className?: string;
}

export const SearchDemo = ({
  className = '',
}: SearchDemoProps): JSX.Element => {
  const [selectedItem, setSelectedItem] = useState<SearchItem | null>(null);

  return (
    <div className={`w-full max-w-2xl ${className}`}>
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Search Demo</h1>
        <p className="text-gray-600">
          Start typing to see search results. Try searching for "react",
          "framework", or any JavaScript tool.
        </p>
      </div>

      <Typeahead
        onSelect={setSelectedItem}
        placeholder="Search for JavaScript frameworks and tools..."
        className="mb-8"
      />

      {selectedItem && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <h2 className="mb-2 font-semibold text-green-900">Selected Item</h2>
          <div className="space-y-1 text-sm text-green-800">
            <p>
              <strong>Label:</strong> {selectedItem.label}
            </p>
            <p>
              <strong>Value:</strong> {selectedItem.value}
            </p>
            {selectedItem.category && (
              <p>
                <strong>Category:</strong> {selectedItem.category}
              </p>
            )}
            {selectedItem.description && (
              <p>
                <strong>Description:</strong> {selectedItem.description}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
