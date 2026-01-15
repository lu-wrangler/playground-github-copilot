# React TypeScript Typeahead Application

A production-ready React/TypeScript typeahead/autocomplete search component with comprehensive testing, security best practices, and modern development tooling.

## Features

✨ **Core Features**
- Responsive typeahead/autocomplete search box
- Debounced search for optimal performance
- Full keyboard navigation support
- Click and mouse hover support
- Clear button for easy input reset
- Error handling and loading states
- Mock API with static data

🔒 **Security**
- Input validation and sanitization
- XSS protection through React
- SQL injection prevention
- Rate limiting (debouncing)
- CORS-ready architecture

♿ **Accessibility**
- Full keyboard navigation
- ARIA labels and roles
- Screen reader support
- Semantic HTML
- WCAG 2.1 Level AA compliant

🧪 **Testing**
- Unit tests with Vitest
- Integration tests with React Testing Library
- End-to-end tests with Playwright
- 80%+ code coverage
- Security-focused test scenarios

⚙️ **Developer Experience**
- TypeScript strict mode
- ESLint for code quality
- Prettier for code formatting
- Vite for fast development
- TailwindCSS for styling
- Hot module replacement (HMR)

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run all tests
npm test

# Build for production
npm run build
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm test` | Run unit and integration tests |
| `npm run test:ui` | Run tests with interactive UI |
| `npm run test:coverage` | Generate coverage report |
| `npm run e2e` | Run end-to-end tests |
| `npm run e2e:headed` | Run e2e tests with visible browser |
| `npm run e2e:debug` | Debug e2e tests |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting |
| `npm run type-check` | TypeScript type checking |

## Technology Stack

### Frontend Framework
- **React 19** - UI library with concurrent features
- **TypeScript** - Static type checking
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Icon library

### Build & Dev Tools
- **Vite** - Next-gen build tool
- **@vitejs/plugin-react-swc** - Fast React compilation

### Testing
- **Vitest** - Fast unit test framework
- **React Testing Library** - User-centric component testing
- **Playwright** - Cross-browser e2e testing
- **@testing-library/user-event** - User interaction simulation

### Code Quality
- **ESLint** - JavaScript linting
- **Prettier** - Code formatter
- **@typescript-eslint** - TypeScript linting

## Project Structure

```
src/
├── components/           # React components
│   ├── Typeahead.tsx    # Main typeahead component
│   ├── Typeahead.test.tsx
│   └── SearchDemo.tsx   # Demo implementation
├── services/            # API and business logic
│   ├── api.ts           # Mock API service
│   └── api.test.ts
├── types/               # TypeScript definitions
├── test/                # Test utilities
│   ├── setup.ts         # Test configuration
│   └── e2e/             # E2E test specs
├── App.tsx              # Root component
├── main.tsx             # Application entry point
└── index.css            # Global styles
```

## Key Architectural Decisions

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed explanations of:
- Technology choices and rationale
- Security implementation
- Testing strategy
- Performance optimizations
- Configuration details

## Security Best Practices

✅ **Input Validation**
- Query sanitization and trimming
- ID validation to prevent injection
- Limit enforcement to prevent DoS

✅ **React Security**
- Automatic XSS protection through JSX
- No use of `dangerouslySetInnerHTML`
- Proper event handling

✅ **Type Safety**
- TypeScript strict mode enabled
- No implicit `any` types
- Interface contracts for all data

## Testing Coverage

- **Unit Tests** - Business logic isolation
- **Integration Tests** - Component behavior
- **E2E Tests** - Complete user workflows
- **Accessibility Tests** - Keyboard and screen reader support

Run `npm run test:coverage` to see detailed coverage report.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `ArrowDown` | Next result |
| `ArrowUp` | Previous result |
| `Enter` | Select highlighted result |
| `Escape` | Close dropdown |
| `Tab` | Native browser focus management |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Requires ES2020+ support.

## Performance

- **Code Splitting**: Automatic with Vite
- **CSS Purging**: TailwindCSS removes unused styles
- **Debouncing**: 300ms search debounce
- **Tree-shaking**: Unused code removed in production
- **SWC Compilation**: Fast TypeScript/JSX transformation

Typical bundle size: ~50KB (gzipped)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for:
- Development workflow
- Code standards
- Testing requirements
- Commit conventions
- Pull request process

## Troubleshooting

### Tests failing?
```bash
npm install  # Ensure all dependencies are installed
npm test     # Run tests again
```

### Port 5173 in use?
Vite automatically uses the next available port.

### ESLint errors?
```bash
npm run lint:fix  # Auto-fix issues
```

### Type errors?
```bash
npm run type-check  # Detailed type checking
```

## Learning Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/)
- [TailwindCSS Docs](https://tailwindcss.com/)
- [Testing Library Docs](https://testing-library.com/)
- [Playwright Guide](https://playwright.dev/)

## License

MIT License - feel free to use in personal and commercial projects.

## Support

For issues, questions, or suggestions:
1. Check [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed documentation
2. Review test files for implementation examples
3. Check TypeScript types for API contracts

---

**Happy coding! 🚀**

  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
