import type { SearchItem } from '../types';

// Static mock data - represents items from a real API
const MOCK_ITEMS: SearchItem[] = [
  {
    id: '1',
    label: 'React',
    value: 'react',
    category: 'Library',
    description: 'A JavaScript library for building user interfaces',
  },
  {
    id: '2',
    label: 'Vue',
    value: 'vue',
    category: 'Framework',
    description: 'The Progressive JavaScript Framework',
  },
  {
    id: '3',
    label: 'Angular',
    value: 'angular',
    category: 'Framework',
    description: 'Platform for building mobile and desktop web applications',
  },
  {
    id: '4',
    label: 'Svelte',
    value: 'svelte',
    category: 'Framework',
    description: 'Cybernetically enhanced web apps',
  },
  {
    id: '5',
    label: 'Next.js',
    value: 'nextjs',
    category: 'Framework',
    description: 'The React Framework for Production',
  },
  {
    id: '6',
    label: 'TypeScript',
    value: 'typescript',
    category: 'Language',
    description: 'Typed superset of JavaScript',
  },
  {
    id: '7',
    label: 'TailwindCSS',
    value: 'tailwindcss',
    category: 'CSS Framework',
    description: 'Utility-first CSS framework',
  },
  {
    id: '8',
    label: 'Vite',
    value: 'vite',
    category: 'Build Tool',
    description: 'Next Generation Frontend Tooling',
  },
];

/**
 * Simulates an API search call with minimal latency
 * In a real app, this would be an HTTP request with proper error handling
 */
export const searchItems = async (
  query: string,
  limit: number = 10
): Promise<SearchItem[]> => {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Add security: sanitize and validate input
  const sanitizedQuery = String(query || '')
    .trim()
    .toLowerCase();

  // Return empty array for empty queries
  if (!sanitizedQuery) {
    return [];
  }

  // Validate limit to prevent DoS
  const validLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);

  // Filter items based on query (search in label and description)
  const filtered = MOCK_ITEMS.filter((item) => {
    const searchableText =
      `${item.label} ${item.value} ${item.category} ${item.description || ''}`.toLowerCase();
    return searchableText.includes(sanitizedQuery);
  });

  // Return limited results
  return filtered.slice(0, validLimit);
};

/**
 * Get a single item by ID (secure lookup)
 */
export const getItemById = async (id: string): Promise<SearchItem | null> => {
  // Validate ID to prevent injection attacks
  if (!String(id).match(/^[a-zA-Z0-9\-_]+$/)) {
    return null;
  }

  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 50));

  return MOCK_ITEMS.find((item) => item.id === id) || null;
};

/**
 * Get all available categories
 */
export const getCategories = async (): Promise<string[]> => {
  await new Promise((resolve) => setTimeout(resolve, 50));

  const categories = new Set(
    MOCK_ITEMS.map((item) => item.category).filter((cat): cat is string =>
      Boolean(cat)
    )
  );
  return Array.from(categories);
};
