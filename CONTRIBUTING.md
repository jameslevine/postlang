# Contributing to PostLang

Thanks for your interest in contributing to PostLang! This document outlines how to get started.

## Philosophy

PostLang is intentionally minimal. Before proposing new features, consider:

1. **Does it enforce better writing?** Features should constrain, not enable.
2. **Is it necessary?** The language should stay small.
3. **Does it prevent AI slop?** That's the core mission.

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Setup

```bash
git clone https://github.com/jameslevine/postlang.git
cd postlang
npm install
```

### Running Tests

```bash
npm test
```

### Building

```bash
npm run build
```

## How to Contribute

### Reporting Bugs

1. Check existing issues first
2. Include a minimal `.post` file that reproduces the bug
3. Include expected vs actual output

### Suggesting Features

1. Open an issue with the `enhancement` label
2. Explain the problem it solves
3. Show example syntax and output
4. Explain why it fits the philosophy

### Submitting Code

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass: `npm test`
6. Commit with a clear message
7. Push and open a Pull Request

## Code Style

- TypeScript with strict mode
- No external runtime dependencies (dev dependencies are fine)
- Clear, readable code over clever code
- Comments for non-obvious logic

## Areas for Contribution

### High Priority

- **More banned phrases**: Add AI slop patterns we've missed
- **Better error messages**: Make validation errors more helpful
- **Test coverage**: Add unit tests for edge cases

### Medium Priority

- **Editor plugins**: VS Code syntax highlighting
- **Documentation**: Improve examples and guides
- **Performance**: Optimize for large files

### Ideas to Explore

- **Templates**: Pre-built structures for common post types
- **Linting rules**: Configurable validation strictness
- **Output formats**: Twitter, blog, etc.

## Pull Request Guidelines

- Keep PRs focused on a single change
- Update documentation if needed
- Add tests for new features
- Don't break existing functionality

## Code of Conduct

- Be respectful and constructive
- Focus on the code, not the person
- Help others learn

## Questions?

Open an issue with the `question` label.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
