# React TypeScript Typeahead Application

## Overview

This is a production-ready React/TypeScript application featuring a typeahead/autocomplete search box with comprehensive testing, security best practices, and modern development tooling.

## Project Structure

```
src/
├── components/          # React components
│   ├── Typeahead.tsx   # Main typeahead component
│   ├── Typeahead.test.tsx  # Component tests
│   └── SearchDemo.tsx   # Demo component
├── services/           # Business logic and API calls
│   ├── api.ts          # Mock API service
│   └── api.test.ts     # API service tests
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared interfaces
├── test/               # Test utilities
│   ├── setup.ts        # Test environment setup
│   └── e2e/            # End-to-end tests
│       └── typeahead.spec.ts
├── ui/                 # UI components (future Shadcn components)
├── App.tsx             # Main app component
├── App.css             # App styles
├── index.css           # Global styles with Tailwind
└── main.tsx            # Entry point
```

## Technology Choices & Rationale

### Core Framework

- **React 19**: Modern React with concurrent rendering and better performance
- **TypeScript**: Provides type safety, better IDE support, and catches errors at compile time
- **Vite**: Lightning-fast build tool and dev server, much faster than traditional webpack

### Styling

- **TailwindCSS**: Utility-first CSS framework for rapid UI development with:
  - Consistent design tokens
  - Small bundle size with CSS purging
  - Easy responsive design with breakpoints
  - Built-in accessibility features

### UI Components

- **Shadcn/ui**: Headless, unstyled component library that:
  - Gives full control over styling and behavior
  - Components copied into project (no external dependencies)
  - Built on Radix UI with accessibility built-in
  - Easy to customize without CSS conflicts

- **Lucide React**: Icon library with:
  - Tree-shakeable SVG icons
  - Consistent design
  - Small bundle footprint

### State Management

- **React Hooks** (useState, useRef, useCallback, useEffect): 
  - No external state management library needed for this use case
  - Built-in React features are sufficient
  - Reduces bundle size and complexity

### Development & Linting

- **ESLint** with:
  - TypeScript support
  - Prettier integration
  - Best practice rules
  - Auto-fix capabilities

- **Prettier**: Code formatter for:
  - Consistent code style
  - Reduced style debates
  - Automatic formatting on save

### Testing Strategy

#### Unit Tests (Vitest)
- **Why Vitest**: 
  - Built on Vite, uses same config
  - Much faster than Jest
  - Native ESM support
  - Better TypeScript support
  - Compatible with existing testing libraries

Tests cover:
- API service functions (search, filtering, validation)
- Component rendering
- User interactions
- Error handling
- Input sanitization

#### Integration Tests (React Testing Library)
- **Why RTL**:
  - Tests behavior, not implementation
  - Mirrors how users interact with app
  - Encourages accessible code practices
  - Best practice for React testing

Tests cover:
- Component state management
- API integration
- Keyboard navigation
- Accessibility features

#### E2E Tests (Playwright)
- **Why Playwright**:
  - Cross-browser testing (Chrome, Firefox, Safari)
  - Better performance than Cypress
  - True headless browser
  - Good for testing real user workflows
  - Screenshots and videos on failure

Tests cover:
- Full user workflows
- Search functionality end-to-end
- Keyboard and mouse interactions
- Accessibility compliance
- Results display

## Security Best Practices

### Input Validation & Sanitization

1. **Query Validation** (`api.ts`):
   ```typescript
   const sanitizedQuery = String(query || '').trim().toLowerCase();
   ```
   - Converts to string to prevent type-based attacks
   - Trims whitespace to prevent bypass
   - Normalizes case for consistent searching

2. **ID Validation** (prevents SQL injection):
   ```typescript
   if (!String(id).match(/^[a-zA-Z0-9\-_]+$/)) {
     return null;
   }
   ```
   - Only allows safe characters
   - Prevents malicious input

3. **Limit Enforcement** (prevents DoS):
   ```typescript
   const validLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
   ```
   - Ensures reasonable request sizes
   - Prevents unbounded data returns

### React Security

1. **XSS Protection**:
   - React automatically escapes JSX content
   - No `dangerouslySetInnerHTML` used
   - All dynamic content safely rendered

2. **Event Handlers**:
   - Controlled input for all form elements
   - Proper event propagation handling
   - No eval() or string-based code execution

3. **API Error Handling**:
   - User-friendly error messages
   - No sensitive data in error messages
   - Errors logged server-side (console.error for now)

### TypeScript Benefits

1. **Type Safety**:
   - Prevents type coercion bugs
   - Enforces correct function signatures
   - Better refactoring support

2. **Interface Contracts**:
   - Clear API specifications
   - Compile-time validation
   - Self-documenting code

## Configuration Files

### `vite.config.ts`
- Path aliases for clean imports (`@/`)
- React SWC plugin for fast transformation
- Dev server configuration

### `vitest.config.ts`
- JSDOM environment for DOM testing
- Test setup file for global configuration
- Coverage reporting configuration
- Path aliases matching vite

### `playwright.config.ts`
- Headless browser configuration
- Automatic dev server startup
- Tracing on failure for debugging
- HTML reporter for test results

### `eslint.config.js` (ESLintrc format)
- TypeScript parser and plugin
- Prettier integration
- Strict type checking rules
- Unused variable detection (with `_` prefix ignore)
- No console.log in production (warn level)

### `prettier.config.json`
- 80 character line width for readability
- 2-space indentation for React
- Single quotes for consistency
- Trailing commas for clean diffs
- LF line endings for cross-platform

### `tsconfig.json`
- Module: ES2020 for modern JavaScript
- Target: ES2020 for modern browsers
- Strict mode for type safety
- Path aliases for imports

### `tailwind.config.js`
- Content paths for CSS purging
- JIT compilation for optimal bundle size
- Extensible theme configuration

## Running the Application

### Development

```bash
# Install dependencies
npm install

# Start dev server with hot reload
npm run dev
```

Server runs on `http://localhost:5173`

### Building

```bash
# Type check and build
npm run build

# Preview production build
npm run preview
```

### Testing

```bash
# Run all unit and integration tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run e2e tests
npm run e2e

# Run e2e tests in headed mode (see browser)
npm run e2e:headed

# Debug e2e tests
npm run e2e:debug
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check format without changing
npm run format:check

# Type check without emitting
npm run type-check
```

## Component Behavior

### Typeahead Component Features

1. **Debounced Search** (300ms):
   - Reduces unnecessary API calls
   - Improves performance with rapid typing
   - Prevents overwhelming the backend

2. **Keyboard Navigation**:
   - Arrow Up/Down: Navigate results
   - Enter: Select highlighted result
   - Escape: Close dropdown

3. **Mouse Support**:
   - Click to select
   - Hover to highlight
   - Click outside to close

4. **Accessibility**:
   - ARIA roles and labels
   - aria-expanded for state
   - aria-selected for highlight
   - Semantic HTML structure

5. **Error Handling**:
   - Graceful error display
   - User-friendly messages
   - Automatic recovery

6. **Loading States**:
   - Loading message during search
   - Prevents UI jumping

## Generic Typeahead Component Design

The Typeahead component has been refactored to be fully generic and extensible, allowing developers to use it with any data source and custom rendering styles.

### Generic Type Parameter

```typescript
export const Typeahead = <T extends AutocompleteItem = AutocompleteItem>({
  ...
}: TypeaheadProps<T>): JSX.Element
```

The component accepts a generic type parameter `T` that extends `AutocompleteItem`:

```typescript
interface AutocompleteItem {
  id: string;
  [key: string]: unknown;
}
```

This allows the component to work with any data structure as long as it has a unique `id` property.

### Custom Fetch Function

The `onFetch` prop accepts a custom fetch function for flexible data sourcing:

```typescript
type FetchFunction<T> = (query: string, limit: number) => Promise<T[]>;
```

**Examples**:

```typescript
// REST API
const fetchUsers: FetchFunction<User> = async (q, limit) => {
  const res = await fetch(`/api/users?q=${q}&limit=${limit}`);
  return res.json();
};

// GraphQL API
const fetchProducts: FetchFunction<Product> = async (q, limit) => {
  const res = await fetch('/graphql', {
    method: 'POST',
    body: JSON.stringify({
      query: `query { searchProducts(q: "${q}", limit: ${limit}) { ... } }`
    })
  });
  const data = await res.json();
  return data.data.searchProducts;
};

// Static data with filtering
const fetchCategories: FetchFunction<Category> = async (q, limit) => {
  return CATEGORIES.filter(c => 
    c.name.toLowerCase().includes(q.toLowerCase())
  ).slice(0, limit);
};

// Composite data from multiple sources
const fetchDocuments: FetchFunction<Document> = async (q, limit) => {
  const [docs, wikis] = await Promise.all([
    fetch(`/api/docs?q=${q}`).then(r => r.json()),
    fetch(`/api/wikis?q=${q}`).then(r => r.json())
  ]);
  return [...docs, ...wikis].slice(0, limit);
};
```

### Custom Item Renderer

The `itemRenderer` prop accepts a custom React component for flexible styling:

```typescript
type ItemRenderer<T> = React.ComponentType<{
  item: T;
  isSelected: boolean;
  onMouseEnter: () => void;
  onClick: () => void;
}>;
```

**Examples**:

```typescript
// Minimal renderer
const MinimalRenderer: ItemRenderer<SearchItem> = ({
  item,
  isSelected,
  onClick,
  onMouseEnter,
}) => (
  <li 
    onClick={onClick} 
    onMouseEnter={onMouseEnter}
    className={isSelected ? 'bg-indigo-600 text-white' : ''}
  >
    {item.label}
  </li>
);

// Card-style renderer
const CardRenderer: ItemRenderer<SearchItem> = ({
  item,
  isSelected,
  onClick,
  onMouseEnter,
}) => (
  <li 
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    className={`rounded-lg p-3 ${
      isSelected ? 'bg-blue-100 shadow-md' : 'hover:bg-gray-100'
    }`}
  >
    <h4 className="font-semibold">{item.label}</h4>
    {item.description && (
      <p className="text-xs text-gray-600">{item.description}</p>
    )}
  </li>
);

// User profile renderer
const UserRenderer: ItemRenderer<User> = ({
  item,
  isSelected,
  onClick,
  onMouseEnter,
}) => (
  <li
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    className={`flex items-center p-3 ${
      isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
    }`}
  >
    <img
      src={item.avatar}
      alt={item.name}
      className="w-8 h-8 rounded-full mr-3"
    />
    <div>
      <p className="font-medium">{item.name}</p>
      <p className="text-xs text-gray-500">{item.email}</p>
    </div>
  </li>
);
```

### Complete Example with Custom Type

```typescript
// Define your data type
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

// Create custom fetch function
const fetchProducts: FetchFunction<Product> = async (q, limit) => {
  const res = await fetch(`/api/products?q=${q}&limit=${limit}`);
  return res.json();
};

// Create custom renderer
const ProductRenderer: ItemRenderer<Product> = ({
  item,
  isSelected,
  onClick,
  onMouseEnter,
}) => (
  <li
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    className={`p-3 border-b ${isSelected ? 'bg-blue-50' : ''}`}
  >
    <div className="flex justify-between items-center">
      <div>
        <h4 className="font-semibold">{item.name}</h4>
        <p className="text-xs text-gray-500">{item.category}</p>
      </div>
      <div className="text-right">
        <p className="font-medium">${item.price}</p>
        <p className={`text-xs ${item.inStock ? 'text-green-600' : 'text-red-600'}`}>
          {item.inStock ? 'In Stock' : 'Out of Stock'}
        </p>
      </div>
    </div>
  </li>
);

// Use with custom type
<Typeahead<Product>
  onFetch={fetchProducts}
  itemRenderer={ProductRenderer}
  onSelect={(product) => addToCart(product)}
  placeholder="Search products..."
  maxResults={8}
/>
```

### Backward Compatibility

The component maintains full backward compatibility with existing implementations:

```typescript
// All of these still work without changes
<Typeahead />
<Typeahead placeholder="Custom placeholder" />
<Typeahead<SearchItem> maxResults={20} />
<Typeahead onSelect={handleSelect} />
```

Default behavior:
- Uses built-in `searchItems()` API for fetching
- Uses `DefaultItemRenderer` for rendering SearchItem objects
- Maintains original styling and behavior

### Configuration Options

```typescript
interface TypeaheadProps<T extends AutocompleteItem> {
  // Custom fetch function (optional, uses searchItems by default)
  onFetch?: FetchFunction<T>;
  
  // Custom item renderer (optional, uses DefaultItemRenderer by default)
  itemRenderer?: ItemRenderer<T>;
  
  // Selection callback
  onSelect?: (item: T) => void;
  
  // Error callback
  onError?: (error: Error) => void;
  
  // UI configuration
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
  
  // Behavior configuration
  maxResults?: number;        // 1-100, default 10
  debounceMs?: number;       // default 300ms
  minQueryLength?: number;   // default 1
}
```

## API Service

The mock API (`api.ts`) simulates a real backend with:

- **searchItems()**: Full-text search with debounce support
- **getItemById()**: Safe item lookup by ID
- **getCategories()**: Returns available categories

All functions include:
- Input validation
- Error handling
- Security checks
- 50-100ms simulated latency

## Testing Philosophy

### Coverage Goals

- **API Service**: 100% coverage
  - All code paths tested
  - Security validation tested
  - Edge cases covered

- **Components**: Core functionality and accessibility
  - User interactions
  - State changes
  - Error scenarios
  - Keyboard support

- **E2E**: Critical user flows
  - Search workflow
  - Selection workflow
  - Keyboard alternative paths

### Test Patterns

1. **Mocking**:
   - API functions mocked in component tests
   - Prevents external dependencies
   - Enables failure scenario testing

2. **Async Handling**:
   - `waitFor()` for async operations
   - Debounce timing considered
   - User event simulation

3. **Accessibility Testing**:
   - Queries by accessible roles
   - ARIA attributes verified
   - Keyboard-only workflows tested

## Performance Considerations

1. **Code Splitting**:
   - Vite automatically chunks code
   - React components lazy-loadable

2. **Bundling**:
   - TailwindCSS purges unused styles
   - Tree-shaking removes unused code
   - SWC provides fast transpilation

3. **Runtime**:
   - Debounced search prevents excessive renders
   - useCallback optimizes function references
   - useRef prevents unnecessary re-renders

4. **Network**:
   - Debouncing reduces request frequency
   - Simulated 100ms latency represents typical API

## Future Enhancements

- Add Shadcn/ui components (Dialog, Dropdown, etc.)
- Implement real API calls with fetch/axios
- Add search history/recent searches
- Implement filtering by category
- Add theming support
- Performance monitoring
- Analytics integration
- Internationalization (i18n)
- Server-side pagination
- Caching with React Query/SWR

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020 features required
- No IE11 support

## Development Guidelines

1. **Type Everything**: Use strict TypeScript
2. **Test New Features**: Write tests alongside code
3. **Follow ESLint**: Auto-fix on save
4. **Format with Prettier**: Consistent style
5. **Accessibility First**: Use semantic HTML, ARIA
6. **Security**: Validate all inputs

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Testing Library Best Practices](https://testing-library.com/docs/queries/about)
- [Playwright Documentation](https://playwright.dev)
- [ESLint Rules](https://eslint.org/docs/rules/)

## License

This project is open source and available under the MIT License.
