# Typeahead Monorepo

This is a monorepo project managed with [pnpm workspaces](https://pnpm.io/workspaces) and [Turbo](https://turbo.build/). It contains a reusable React component library, shared configuration, and a demo application.

## Project Structure

```
.
├── packages/
│   ├── components/          # Reusable React components library
│   │   ├── src/
│   │   │   ├── typeahead/   # Typeahead component
│   │   │   ├── services/    # API service layer
│   │   │   ├── types.ts     # Shared type definitions
│   │   │   └── index.ts     # Main export
│   │   ├── dist/            # Built library (ESM + UMD)
│   │   └── package.json
│   └── config/              # Shared configuration (ESLint, Prettier, TypeScript, Tailwind)
│       ├── eslint.config.js
│       ├── prettier.config.js
│       ├── tsconfig.base.json
│       ├── tailwind.config.js
│       ├── postcss.config.js
│       └── package.json
├── apps/
│   └── demo/                # Demo application showcasing components
│       ├── src/
│       ├── dist/            # Built demo application
│       └── package.json
├── pnpm-workspace.yaml      # pnpm workspace configuration
├── turbo.json               # Turbo build pipeline configuration
└── package.json             # Root package with shared scripts
```

## Workspaces

### packages/components
Reusable React component library that exports the Typeahead component.

**Features:**
- Generic, extensible Typeahead component (`Typeahead<T>`)
- Custom fetch function support (`FetchFunction<T>`)
- Custom item renderer support (`ItemRenderer<T>`)
- Debounced search (300ms by default)
- Keyboard navigation (Arrow keys, Enter, Escape)
- Accessibility-first design (ARIA labels, semantic HTML)
- 35+ comprehensive tests

**Build outputs:**
- ES module: `dist/index.js`
- UMD bundle: `dist/index.umd.js`
- TypeScript declarations: `dist/index.d.ts`

**Exports:**
- Components: `Typeahead`
- Types: `AutocompleteItem`, `SearchItem`, `SearchRequest`, `SearchResponse`, `ApiError`, `FetchFunction`, `ItemRenderer`
- Services: `searchItems`, `getItemById`, `getCategories`

### packages/config
Shared configuration for all workspaces. This eliminates duplication across the monorepo.

**Exported configs:**
- `eslint.config.js` - ESLint rules (TypeScript, React, Prettier integration)
- `prettier.config.js` - Code formatting rules
- `tsconfig.base.json` - Base TypeScript configuration with strict mode
- `tailwind.config.js` - TailwindCSS configuration
- `postcss.config.js` - PostCSS configuration with Tailwind support

### apps/demo
Demo application that showcases the Typeahead component with multiple renderer styles.

**Features:**
- Interactive renderer selection (Default, Minimal, Card, Icon, Tag)
- Real-time search with mock data
- Selected item display
- Responsive design with TailwindCSS v4
- Deployed demo of component capabilities

## Getting Started

### Prerequisites
- Node.js 18+ (recommended 20+)
- pnpm 9.0.0+

### Installation

```bash
# Install pnpm globally (if not already installed)
npm install -g pnpm@latest

# Install monorepo dependencies
pnpm install

# Verify installation
pnpm run build
pnpm run test
```

## Development

### Running the Demo App

```bash
# Start demo app dev server
pnpm run dev --filter @typeahead/demo

# Demo will be available at http://localhost:5173
```

### Running Component Library in Dev Mode

```bash
# Watch mode for component library
pnpm run dev --filter @typeahead/components
```

### Developing with Both Apps Together

```bash
# Run dev for all apps (component library and demo in watch mode)
pnpm run dev
```

## Building

### Build All Packages

```bash
pnpm run build
```

This uses Turbo's caching to skip unchanged packages.

### Build Specific Package

```bash
# Build only component library
pnpm run build --filter @typeahead/components

# Build only demo app
pnpm run build --filter @typeahead/demo
```

## Testing

### Run All Tests

```bash
pnpm run test
```

### Run Tests in Watch Mode

```bash
pnpm run test --filter @typeahead/components -- --watch
```

### Run Specific Test File

```bash
pnpm run test --filter @typeahead/components -- typeahead.test.tsx
```

### View Test Coverage

```bash
pnpm run test --filter @typeahead/components -- --coverage
```

## Code Quality

### Linting

```bash
# Run ESLint across all workspaces
pnpm run lint

# Auto-fix linting errors
pnpm run lint:fix
```

### Code Formatting

```bash
# Check code formatting
pnpm run format:check

# Auto-format code
pnpm run format
```

### Type Checking

```bash
# Type-check all workspaces
pnpm run type-check
```

### Pre-commit Checks

```bash
# Run all quality checks before committing
pnpm run lint
pnpm run format:check
pnpm run type-check
pnpm run test
```

## Using the Component Library

### In External Projects

Once `@typeahead/components` is published to npm:

```bash
npm install @typeahead/components
```

### Usage Example

```typescript
import { Typeahead, type SearchItem } from '@typeahead/components';
import '@typeahead/components/styles';

export function MySearch() {
  return (
    <Typeahead<SearchItem>
      onFetch={async (query) => {
        // Your API call here
        const response = await fetch(`/api/search?q=${query}`);
        return response.json();
      }}
      onSelect={(item) => console.log('Selected:', item)}
      placeholder="Search..."
    />
  );
}
```

### Custom Renderer

```typescript
import { Typeahead, ItemRenderer, type SearchItem } from '@typeahead/components';

const CustomRenderer: ItemRenderer<SearchItem> = ({ item, isSelected, onMouseEnter, onClick }) => (
  <div
    onClick={onClick}
    onMouseEnter={onMouseEnter}
    className={isSelected ? 'bg-blue-100' : 'bg-white'}
  >
    <strong>{item.label}</strong>
    <p>{item.description}</p>
  </div>
);

export function MySearch() {
  return (
    <Typeahead<SearchItem>
      onFetch={fetchData}
      itemRenderer={CustomRenderer}
      onSelect={handleSelect}
    />
  );
}
```

## Adding New Components

To add a new component to the library:

1. Create component file in `packages/components/src/components/`
2. Add component tests in `packages/components/src/components/YourComponent.test.tsx`
3. Export from `packages/components/src/index.ts`
4. Update TypeScript types if needed in `packages/components/src/types.ts`
5. Run `pnpm run build` to verify compilation

Example:

```bash
# Create component
touch packages/components/src/components/MyComponent.tsx

# Add tests
touch packages/components/src/components/MyComponent.test.tsx

# Add to exports in src/index.ts
# export { MyComponent } from './components/MyComponent';
```

## Adding New Applications

To add a new application (e.g., `apps/dashboard`):

1. Create app directory: `mkdir apps/dashboard`
2. Create `package.json` with `@typeahead/components` dependency using `workspace:*` protocol
3. Create `vite.config.ts` with appropriate configuration
4. Create `tsconfig.json` extending `../../packages/config/tsconfig.base.json`
5. Add app-specific scripts to `package.json`
6. Add app scripts to root `package.json` if needed
7. Update `pnpm-workspace.yaml` if using different pattern

Example `package.json`:
```json
{
  "name": "@typeahead/dashboard",
  "dependencies": {
    "@typeahead/components": "workspace:*",
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  },
  "devDependencies": {
    "@typeahead/config": "workspace:*"
  }
}
```

## Turbo Build Pipeline

Turbo manages the build process with intelligent caching. The pipeline is configured in `turbo.json`:

### Tasks
- **build**: Compile component library and applications
- **dev**: Development mode with live reload
- **lint**: ESLint checks
- **format**: Auto-format code with Prettier
- **format:check**: Verify code formatting
- **test**: Run test suites
- **type-check**: TypeScript type checking

### Task Dependencies
- `build` depends on `^build` (upstream builds must complete first)
- `dev` runs in parallel without caching (persistent mode)
- `format` doesn't use cache (always runs)

### Caching
Turbo uses content-based caching to skip tasks that haven't changed:

```bash
# View cache information
pnpm run build -- --verbose

# Force rebuild (bypass cache)
pnpm run build -- --force
```

## Scripts Reference

### Development
```bash
pnpm run dev              # Start all dev servers
pnpm run build            # Build all packages
pnpm run preview          # Preview production build
```

### Quality Checks
```bash
pnpm run lint             # Run ESLint
pnpm run lint:fix         # Fix ESLint errors
pnpm run format           # Auto-format code
pnpm run format:check     # Check formatting
pnpm run type-check       # Run TypeScript check
pnpm run test             # Run tests
```

### Filtering
```bash
pnpm run build --filter @typeahead/components
pnpm run test --filter @typeahead/components
pnpm run dev --filter @typeahead/demo
```

## Environment Variables

Create `.env.local` files in specific workspaces as needed:

```bash
# apps/demo/.env.local
VITE_API_URL=http://localhost:3000/api
```

Root `.env.local` variables are available to all workspaces.

## Troubleshooting

### Dependency Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Build Failures
```bash
# Clean build artifacts
pnpm run build -- --force

# Check for TypeScript errors
pnpm run type-check
```

### Port Already in Use
```bash
# Demo app defaults to port 5173, specify different port:
pnpm run dev -- --port 5174
```

### Import Errors
Ensure component imports use correct paths relative to workspace roots:
- ✅ Good: `import { Typeahead } from '@typeahead/components'`
- ❌ Bad: `import { Typeahead } from '../../packages/components/src'`

## Technology Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 19.2.0 | UI framework |
| TypeScript | 5.9.3 | Type safety |
| Vite | 7.3.1 | Build tool & dev server |
| Vitest | 4.0.17 | Unit testing |
| TailwindCSS | 4.1.18 | Styling |
| ESLint | 9.39.2 | Linting |
| Prettier | 3.8.0 | Code formatting |
| pnpm | 9.0.0 | Package manager |
| Turbo | 2.7.4 | Build orchestration |

## Performance Targets

- Build time: < 10 seconds (full build)
- Dev server startup: < 1 second
- Test execution: < 10 seconds (35 tests)
- Bundle size (component library gzipped): < 6 KB

## Contributing

1. Create feature branch from `main`
2. Make changes following code style guidelines
3. Run quality checks: `pnpm run lint` `pnpm run test`
4. Commit changes with clear messages
5. Create pull request with description

## License

MIT

## Resources

- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Turbo Documentation](https://turbo.build/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
