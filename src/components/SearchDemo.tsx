import { useState, type JSX } from 'react';
import { Typeahead } from './Typeahead';
import { searchItems } from '@/services/api';
import {
  CardItemRenderer,
  IconItemRenderer,
  MinimalItemRenderer,
} from './ItemRenderers';
import type { SearchItem } from '@/types';

interface SearchDemoProps {
  className?: string;
}

type RendererType = 'default' | 'minimal' | 'card' | 'icon';

export const SearchDemo = ({
  className = '',
}: SearchDemoProps): JSX.Element => {
  const [selectedItem, setSelectedItem] = useState<SearchItem | null>(null);
  const [rendererType, setRendererType] = useState<RendererType>('default');

  // Get the renderer based on selection
  const getRenderer = () => {
    switch (rendererType) {
      case 'minimal':
        return MinimalItemRenderer;
      case 'card':
        return CardItemRenderer;
      case 'icon':
        return IconItemRenderer;
      default:
        return undefined; // Use default renderer
    }
  };

  return (
    <div className={`w-full max-w-4xl ${className}`}>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Extensible Typeahead Demo
        </h1>
        <p className="text-gray-600">
          This demonstrates the refactored Typeahead component with custom fetch
          functions and item renderers. Try searching for "react", "framework",
          or any JavaScript tool.
        </p>
      </div>

      {/* Renderer Selection */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Choose Item Renderer Style:
        </label>
        <div className="flex flex-wrap gap-2">
          {(['default', 'minimal', 'card', 'icon'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setRendererType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                rendererType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Typeahead Component */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Search Input
        </h2>
        <Typeahead<SearchItem>
          onFetch={async (query, limit) => await searchItems(query, limit)}
          itemRenderer={getRenderer()}
          onSelect={setSelectedItem}
          placeholder="Search for frameworks, tools, languages..."
          maxResults={10}
          debounceMs={300}
          ariaLabel="Search for development tools"
          onError={(error) => console.error('Search error:', error)}
        />
      </div>

      {/* Selected Item Display */}
      {selectedItem && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-green-900">
            Selected Item
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">
                <strong>Label:</strong>
              </p>
              <p className="text-gray-900">{selectedItem.label}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                <strong>Value:</strong>
              </p>
              <p className="text-gray-900">{selectedItem.value}</p>
            </div>
            {selectedItem.category && (
              <div>
                <p className="text-sm text-gray-600">
                  <strong>Category:</strong>
                </p>
                <p className="text-gray-900">{selectedItem.category}</p>
              </div>
            )}
            {selectedItem.description && (
              <div className="col-span-2">
                <p className="text-sm text-gray-600">
                  <strong>Description:</strong>
                </p>
                <p className="text-gray-900">{selectedItem.description}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Documentation */}
      <div className="mt-10 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          How to Use the Extensible Typeahead
        </h3>
        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              1. Custom Fetch Function
            </h4>
            <p className="text-gray-600">
              Pass an `onFetch` prop to connect to any data source (API, static
              list, composite properties):
            </p>
            <pre className="mt-2 bg-white p-3 rounded border border-gray-300 text-xs overflow-x-auto">
              {`const fetchUsers: FetchFunction<User> = async (q, limit) => {
  const res = await fetch(\`/api/users?q=\${q}&limit=\${limit}\`);
  return res.json();
};`}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              2. Custom Item Renderer
            </h4>
            <p className="text-gray-600">
              Create a custom `ItemRenderer` component to style dropdown items
              differently:
            </p>
            <pre className="mt-2 bg-white p-3 rounded border border-gray-300 text-xs overflow-x-auto">
              {`const MyRenderer: ItemRenderer<User> = ({
  item,
  isSelected,
  onClick,
  onMouseEnter,
}) => (
  <li onClick={onClick} onMouseEnter={onMouseEnter}>
    <strong>{item.name}</strong>
    <p>{item.email}</p>
  </li>
);`}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              3. Use Generic Types
            </h4>
            <p className="text-gray-600">
              Specify your custom data type with TypeScript generics:
            </p>
            <pre className="mt-2 bg-white p-3 rounded border border-gray-300 text-xs overflow-x-auto">
              {`<Typeahead<User>
  onFetch={fetchUsers}
  itemRenderer={MyRenderer}
  onSelect={(user) => console.log(user)}
/>`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
