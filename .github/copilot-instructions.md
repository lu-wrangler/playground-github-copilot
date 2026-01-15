# GitHub Copilot Project Instructions

## Project Overview
This is a React/TypeScript typeahead/autocomplete search application with comprehensive testing, security best practices, and modern tooling.

## Core Technologies
- React 19 with TypeScript
- Vite for bundling
- TailwindCSS for styling
- Vitest + React Testing Library for unit/integration tests
- Playwright for E2E tests
- ESLint + Prettier for code quality

## Key Files & Responsibilities

### Components
- `src/components/Typeahead.tsx` - Main search component with debouncing, keyboard navigation
- `src/components/SearchDemo.tsx` - Demo page showing component usage
- `src/components/Typeahead.test.tsx` - Component tests (80+ test cases)

### Services
- `src/services/api.ts` - Mock API with input validation and security
- `src/services/api.test.ts` - API service tests

### Testing
- `src/test/setup.ts` - Vitest configuration and mocks
- `src/test/e2e/typeahead.spec.ts` - End-to-end tests with Playwright

### Configuration
- `vite.config.ts` - Vite build configuration with SWC plugin
- `vitest.config.ts` - Unit test configuration
- `playwright.config.ts` - E2E test configuration
- `tailwind.config.js` - TailwindCSS configuration
- `.eslintrc.cjs` - ESLint rules
- `.prettierrc.json` - Code formatting rules

### Documentation
- `README.md` - Quick start and feature overview
- `ARCHITECTURE.md` - Detailed technical documentation
- `CONTRIBUTING.md` - Development guidelines

## Development Workflow

1. **Install & Setup**
   ```bash
   npm install
   npm run dev
   ```

2. **Development** (with HMR enabled)
   ```bash
   npm run dev
   ```

3. **Testing Before PR**
   ```bash
   npm run lint
   npm run format:check
   npm run type-check
   npm test
   npm run e2e
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## Code Quality Standards

### TypeScript
- Strict mode enabled
- All functions must have explicit return types
- Use `type` imports for type-only definitions
- No `any` types (use `unknown` with narrowing)

### Security Requirements
- Input validation required for all user inputs
- No `eval()` or `new Function()`
- No `dangerouslySetInnerHTML`
- All API inputs must be sanitized and validated

### Testing Requirements
- Unit tests for API service functions
- Integration tests for components
- E2E tests for critical user workflows
- Accessibility tests for keyboard navigation and ARIA
- Mock external API calls in component tests

### Accessibility
- ARIA labels on interactive elements
- Semantic HTML structure
- Keyboard-only navigation support
- Screen reader compatible

### Performance
- Debounce search input (300ms)
- Memoize components if needed
- Lazy load routes
- Tree-shake unused code

## Common Tasks

### Adding a New Component
1. Create file in `src/components/`
2. Export as default
3. Add test file with same name + `.test.tsx`
4. Write tests for:
   - Rendering
   - User interactions
   - Error states
   - Accessibility

### Adding API Functionality
1. Add function to `src/services/api.ts`
2. Add input validation
3. Add tests to `src/services/api.test.ts`
4. Document in JSDoc comment

### Writing Tests
- Use `render()` from Testing Library for component tests
- Use `vi.mock()` to mock API calls
- Use `screen.getByRole()` for accessibility
- Test user behavior, not implementation
- Include error and edge cases

### Linting & Formatting
- Run `npm run lint:fix` to auto-fix issues
- Run `npm run format` to auto-format code
- Prettier and ESLint run on save with proper IDE setup

## Important Rules

❌ **Don't do this:**
- Don't commit code without running tests
- Don't use `console.log()` in production code
- Don't bypass TypeScript with `any` types
- Don't skip input validation
- Don't hardcode secrets or API keys

✅ **Do this:**
- Write tests alongside new code
- Use TypeScript strict mode
- Validate and sanitize all inputs
- Follow CONTRIBUTING.md guidelines
- Reference ARCHITECTURE.md for decisions

## Debugging

### Dev Server Issues
- Clear `.vite` cache: `rm -rf .vite`
- Clear node_modules: `rm -rf node_modules && npm install`
- Rebuild types: `npm run type-check`

### Test Issues
- Run single test: `npm test -- --reporter=verbose api.test.ts`
- Debug tests: `npm test -- --inspect-brk`
- Run with coverage: `npm run test:coverage`

### E2E Issues
- Run headed: `npm run e2e:headed`
- Debug: `npm run e2e:debug`
- Check Playwright reports: `npx playwright show-report`

## Performance Targets
- Build time: < 1 second
- Dev server startup: < 500ms
- Search debounce: 300ms
- Bundle size (gzipped): < 100KB

## Key Concepts

### Debouncing
Search input is debounced at 300ms to reduce API calls while typing.

### API Validation
All API inputs are validated to:
- Prevent injection attacks
- Enforce reasonable limits
- Provide meaningful errors

### Accessibility First
Components use semantic HTML and ARIA attributes to be accessible by default.

### Type Safety
TypeScript strict mode catches most bugs at compile time, not runtime.

## Resources
- `ARCHITECTURE.md` - Technical decisions and rationale
- `CONTRIBUTING.md` - Development guidelines
- `src/services/api.test.ts` - Example unit tests
- `src/components/Typeahead.test.tsx` - Example component tests
- `src/test/e2e/typeahead.spec.ts` - Example e2e tests

## Questions?
Refer to ARCHITECTURE.md for detailed explanations of technology choices, security implementation, testing strategy, and configuration details.
