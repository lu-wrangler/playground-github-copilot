import { type JSX } from 'react';
import type { SearchItem, AutocompleteItem } from '@/types';
import { type ItemRenderer } from './Typeahead';

/**
 * Custom renderer examples for different data structures and styles
 * These show how to implement custom ItemRenderer components
 */

/**
 * Minimalist renderer - just shows the label
 */
export const MinimalItemRenderer: ItemRenderer<SearchItem> = ({
  item,
  isSelected,
  onMouseEnter,
  onClick,
}): JSX.Element => (
  <li
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    role="option"
    aria-selected={isSelected}
    className={`cursor-pointer px-3 py-2 text-sm ${
      isSelected
        ? 'bg-indigo-600 text-white'
        : 'hover:bg-gray-100 text-gray-900'
    }`}
  >
    {item.label}
  </li>
);

/**
 * Card-style renderer - shows item with visual separation
 */
export const CardItemRenderer: ItemRenderer<SearchItem> = ({
  item,
  isSelected,
  onMouseEnter,
  onClick,
}): JSX.Element => (
  <li
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    role="option"
    aria-selected={isSelected}
    className={`cursor-pointer m-2 rounded-lg p-3 transition-all ${
      isSelected
        ? 'bg-blue-100 border-2 border-blue-500 shadow-md'
        : 'bg-white border border-gray-200 hover:shadow-sm'
    }`}
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <h4 className="font-semibold text-gray-900">{item.label}</h4>
        {item.description && (
          <p className="text-xs text-gray-600 mt-1">{item.description}</p>
        )}
      </div>
      {item.category && (
        <span className="ml-2 inline-block bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-full">
          {item.category}
        </span>
      )}
    </div>
  </li>
);

/**
 * Icon + label renderer - adds visual emphasis
 */
export const IconItemRenderer: ItemRenderer<SearchItem> = ({
  item,
  isSelected,
  onMouseEnter,
  onClick,
}): JSX.Element => {
  // Map categories to icons (emoji for simplicity)
  const categoryIcons: Record<string, string> = {
    Library: '📚',
    Framework: '⚙️',
    Language: '💻',
    'CSS Framework': '🎨',
    'Build Tool': '🔨',
  };

  const icon = categoryIcons[item.category || ''] || '📌';

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
      <div className="flex items-center">
        <span className="text-lg mr-3">{icon}</span>
        <div>
          <div className="font-medium text-gray-900">{item.label}</div>
          {item.description && (
            <div className="text-xs text-gray-500">{item.description}</div>
          )}
        </div>
      </div>
    </li>
  );
};

/**
 * Two-column layout renderer
 */
export const TwoColumnItemRenderer: ItemRenderer<SearchItem> = ({
  item,
  isSelected,
  onMouseEnter,
  onClick,
}): JSX.Element => (
  <li
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    role="option"
    aria-selected={isSelected}
    className={`cursor-pointer border-b px-4 py-3 text-sm transition-colors last:border-b-0 ${
      isSelected ? 'bg-blue-50 text-blue-900' : 'hover:bg-gray-50'
    }`}
  >
    <div className="grid grid-cols-3 gap-4 items-start">
      <div className="col-span-2">
        <div className="font-medium text-gray-900">{item.label}</div>
        {item.description && (
          <div className="text-xs text-gray-500 mt-1">{item.description}</div>
        )}
      </div>
      {item.category && (
        <div className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded text-right">
          {item.category}
        </div>
      )}
    </div>
  </li>
);

/**
 * User/Profile-style renderer for custom data structures
 */
export interface UserItem extends AutocompleteItem {
  name: string;
  email: string;
  avatar?: string;
}

export const UserItemRenderer: ItemRenderer<UserItem> = ({
  item,
  isSelected,
  onMouseEnter,
  onClick,
}): JSX.Element => (
  <li
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    role="option"
    aria-selected={isSelected}
    className={`cursor-pointer border-b px-4 py-3 transition-colors last:border-b-0 ${
      isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
    }`}
  >
    <div className="flex items-center">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center text-sm font-bold mr-3">
        {item.name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{item.name}</p>
        <p className="text-xs text-gray-500 truncate">{item.email}</p>
      </div>
    </div>
  </li>
);

/**
 * Rich content renderer with badges and tags
 */
export interface TaggedItem extends SearchItem {
  tags?: string[];
}

export const TaggedItemRenderer: ItemRenderer<TaggedItem> = ({
  item,
  isSelected,
  onMouseEnter,
  onClick,
}): JSX.Element => (
  <li
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    role="option"
    aria-selected={isSelected}
    className={`cursor-pointer border-b px-4 py-3 transition-colors last:border-b-0 ${
      isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
    }`}
  >
    <div className="font-medium text-gray-900">{item.label}</div>
    {item.description && (
      <div className="text-xs text-gray-500 mt-1">{item.description}</div>
    )}
    {item.tags && item.tags.length > 0 && (
      <div className="flex gap-1 mt-2 flex-wrap">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded"
          >
            {tag}
          </span>
        ))}
      </div>
    )}
  </li>
);
