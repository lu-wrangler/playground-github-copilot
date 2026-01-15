# Contributing to Typeahead Application

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Run tests: `npm test`

## Code Standards

### TypeScript

- Use strict mode
- Provide explicit return types for functions
- Avoid `any` type (use `unknown` with type narrowing)
- Use type imports: `import type { MyType } from '...'`

### Naming Conventions

- **Components**: PascalCase (`Typeahead.tsx`)
- **Functions/Variables**: camelCase (`handleSearch`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RESULTS`)
- **Types/Interfaces**: PascalCase (`SearchItem`)

### Comments

- Document complex logic
- Explain security measures
- Use JSDoc for public functions
- Keep comments up-to-date with code

```typescript
/**
 * Searches items with input validation
 * @param query - Search query string
 * @param limit - Maximum results to return (1-100)
 * @returns Array of matching items
 */
export const searchItems = async (
  query: string,
  limit?: number
): Promise<SearchItem[]> => {
  // Implementation
};
```

### Git Workflow

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "feat: description"`
3. Push: `git push origin feature/your-feature`
4. Create Pull Request with description

### Commit Messages

Follow Conventional Commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `test:` Test additions/changes
- `refactor:` Code refactoring
- `style:` Formatting changes
- `chore:` Dependencies, config changes

## Testing Requirements

All new code must include tests:

```bash
# Before submitting PR, ensure all tests pass
npm test
npm run test:coverage
npm run e2e
npm run lint
npm run format:check
npm run type-check
```

### Test Guidelines

1. **Unit Tests**: Test business logic in isolation
2. **Integration Tests**: Test component behavior
3. **E2E Tests**: Test complete user workflows
4. **Accessibility**: Always test keyboard navigation and ARIA

## Code Review Checklist

- [ ] TypeScript compiles without errors
- [ ] All tests pass
- [ ] ESLint passes
- [ ] Prettier formatting applied
- [ ] No console errors or warnings
- [ ] Accessibility requirements met
- [ ] Security best practices followed
- [ ] Documentation updated

## Performance

- Avoid unnecessary re-renders
- Use React.memo for expensive components
- Implement debouncing for input
- Lazy load routes/components when possible
- Profile with React DevTools

## Accessibility

- Use semantic HTML
- Add ARIA labels where needed
- Test keyboard navigation
- Maintain color contrast
- Support screen readers
- Follow WCAG 2.1 Level AA

## Security

- Always validate and sanitize input
- Never use `dangerouslySetInnerHTML`
- Avoid dynamic `eval()` or `new Function()`
- Keep dependencies updated
- Use Content Security Policy
- Never expose secrets in code

## Documentation

- Update README.md for feature changes
- Add JSDoc comments for functions
- Document complex algorithms
- Update ARCHITECTURE.md if structure changes
- Include examples for new components

## Release Process

1. Update version in package.json
2. Update CHANGELOG
3. Create git tag
4. Push to production

---

Questions? Check ARCHITECTURE.md for detailed information.
