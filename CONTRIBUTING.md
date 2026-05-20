# Contributing to nodedump

First off, thank you for considering contributing to nodedump! 🎉

## Philosophy

Before contributing, understand the core principles of nodedump:

- **Zero dependencies** – No external packages. Ever.
- **Zero config** – No environment variables, no config files. Works out of the box.
- **Simple by design** – Prefer clarity over cleverness.
- **Separation of concerns** – Generate debug output without caring where it goes.
- **Functional over OOP** – Pure functions, no classes, no side effects when possible.

If your contribution aligns with these principles, you're in the right place.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and constructive environment for everyone.

## How Can I Contribute?

### Reporting Bugs

Before creating a bug report, please check the existing issues to avoid duplicates.

**A good bug report includes:**
- Node.js version
- Operating system
- Expected behavior vs actual behavior
- Minimal code example to reproduce
- Any relevant error messages

### Suggesting Enhancements

We welcome suggestions! Please include:
- A clear description of the feature
- Use case examples
- Why this aligns with the project's philosophy
- Why this would be valuable to others

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development Setup

```bash
# Clone the repository
git clone https://github.com/justino-code/nodedump.git
cd nodedump

# Install dependencies
yarn install

# Run tests
yarn test

# Run tests in watch mode
yarn test --watch

# Build the project
yarn build

# Run documentation locally
yarn docs:dev
```

## Project Structure

```
nodedump/
├── src/           # Source code
│   ├── shared/    # Shared utilities and types
│   ├── core/      # Core formatting logic
│   ├── dump/      # dump() and dd()
│   ├── trace/     # trace()
│   └── measure/   # measure()
├── tests/         # Test files
├── docs/          # Documentation (VitePress)
│   ├── pt/        # Portuguese
│   └── en/        # English
└── dist/          # Built output
```

## Coding Guidelines

- **TypeScript** – All code must be typed
- **Tests** – Include tests for new features
- **No dependencies** – Keep the library zero-dependency
- **No classes** – Prefer pure functions and simple types
- **No environment variables** – All config via function parameters
- **Documentation** – Update docs for any API changes (both PT and EN)

## Testing

```bash
# Run all tests
yarn test:run

# Run with coverage
yarn test:coverage

# Run specific test file
yarn test tests/core/inspect.test.ts
```

## Documentation

Documentation uses VitePress with i18n support (Portuguese and English).

```bash
# Run docs locally
yarn docs:dev

# Build docs
yarn docs:build
```

When adding or changing features, update both Portuguese (`docs/pt/`) and English (`docs/en/`) documentation.

## Commit Messages

Use clear and descriptive commit messages:

- `feat:` – New feature
- `fix:` – Bug fix
- `docs:` – Documentation changes
- `test:` – Test updates
- `chore:` – Maintenance tasks
- `refactor:` – Code refactoring

Example: `feat: add support for WeakMap inspection`

## Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create a pull request
4. After merge, tag the release
5. Publish to npm (`npm publish`)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.