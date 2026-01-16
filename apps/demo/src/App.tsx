import { useState } from 'react';
import {
  Typeahead,
  searchItems,
  ItemRenderer,
  SearchItem,
} from '@typeahead/components';

type RendererOption = 'default' | 'minimal' | 'card' | 'icon' | 'tag';

interface MinimalItemProps {
  item: SearchItem;
}

interface CardItemProps {
  item: SearchItem;
}

interface IconItemProps {
  item: SearchItem;
}

interface TagItemProps {
  item: SearchItem;
}

const MinimalItemRenderer: ItemRenderer<SearchItem> = ({ item }: MinimalItemProps) => (
  <div className="py-1 px-2">
    <div className="font-medium text-gray-900">{item.label}</div>
  </div>
);

const CardItemRenderer: ItemRenderer<SearchItem> = ({ item }: CardItemProps) => (
  <div className="py-2 px-3 border-b border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <div className="font-semibold text-gray-900">{item.label}</div>
        <div className="text-sm text-gray-600">{item.category}</div>
      </div>
      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
        {item.category}
      </span>
    </div>
  </div>
);

const IconItemRenderer: ItemRenderer<SearchItem> = ({ item }: IconItemProps) => (
  <div className="py-2 px-3 flex items-center gap-3">
    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
      <span className="text-white text-xs font-bold">{item.label[0]}</span>
    </div>
    <div>
      <div className="font-medium text-gray-900">{item.label}</div>
      <div className="text-xs text-gray-500">{item.category}</div>
    </div>
  </div>
);

const TagItemRenderer: ItemRenderer<SearchItem> = ({ item }: TagItemProps) => (
  <div className="py-2 px-3 inline-block bg-purple-50 rounded-lg border border-purple-200 m-1">
    <div className="font-medium text-purple-900">{item.label}</div>
    <div className="text-xs text-purple-600">{item.description}</div>
  </div>
);

export default function App() {
  const [selectedRenderer, setSelectedRenderer] = useState<RendererOption>('default');
  const [selectedItem, setSelectedItem] = useState<SearchItem | null>(null);

  const renderers: Record<RendererOption, ItemRenderer<SearchItem> | undefined> = {
    default: undefined,
    minimal: MinimalItemRenderer,
    card: CardItemRenderer,
    icon: IconItemRenderer,
    tag: TagItemRenderer,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Typeahead Search</h1>
          <p className="text-purple-200">Explore different renderer styles</p>
        </div>

        {/* Renderer Selector */}
        <div className="mb-8 bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
          <label className="block text-white font-semibold mb-4">
            Select Renderer Style:
          </label>
          <div className="flex flex-wrap gap-2">
            {(['default', 'minimal', 'card', 'icon', 'tag'] as const).map((renderer) => (
              <button
                key={renderer}
                onClick={() => setSelectedRenderer(renderer)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedRenderer === renderer
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {renderer.charAt(0).toUpperCase() + renderer.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Search Component */}
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20">
          <Typeahead<SearchItem>
            onFetch={searchItems}
            onSelect={(item) => {
              setSelectedItem(item);
            }}
            placeholder="Search for React, Vue, Angular, Svelte..."
            itemRenderer={renderers[selectedRenderer]}
            debounceMs={300}
          />

          {/* Selected Item Display */}
          {selectedItem && (
            <div className="mt-8 p-6 bg-green-500/20 border border-green-500/50 rounded-lg">
              <h3 className="text-white font-bold mb-2">Selected:</h3>
              <div className="text-green-100">
                <p>
                  <span className="font-semibold">Label:</span> {selectedItem.label}
                </p>
                <p>
                  <span className="font-semibold">Category:</span> {selectedItem.category}
                </p>
                <p>
                  <span className="font-semibold">Description:</span>{' '}
                  {selectedItem.description}
                </p>
                <p>
                  <span className="font-semibold">ID:</span> {selectedItem.id}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 text-center">
          <p className="text-purple-200 text-sm">
            Type to search through the available items. Use arrow keys to navigate and Enter to select.
          </p>
        </div>
      </div>
    </div>
  );
}
