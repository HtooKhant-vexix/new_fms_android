# Contributing to New FMS Android

Thank you for your interest in contributing to New FMS Android! This document provides guidelines and rules for contributing to this project.

## Development Rules

### Code Style

- Follow the TypeScript/React Native best practices
- Use ESLint and Prettier for code formatting
- Maximum line length: 100 characters
- Use meaningful variable and function names
- Write comments for complex logic
- Follow the existing code structure and patterns

### Git Workflow

1. Create a new branch for each feature/fix
2. Branch naming convention: `feature/description` or `fix/description`
3. Keep commits atomic and meaningful
4. Write clear commit messages following conventional commits
5. Always pull latest changes before starting new work

### Pull Request Process

1. Update documentation for any new features
2. Add tests for new functionality
3. Ensure all tests pass
4. Update the README.md if necessary
5. Follow the PR template

### Testing

- Write unit tests for new features
- Ensure all tests pass before submitting PR
- Maintain or improve test coverage

### Documentation

- Document all new features
- Update existing documentation when making changes
- Include JSDoc comments for functions and components

### Security

- Never commit sensitive data or credentials
- Follow security best practices
- Report security vulnerabilities privately

## Getting Started

1. Fork the repository
2. Clone your fork
3. Install dependencies:
   ```bash
   yarn install
   ```
4. Create a new branch
5. Make your changes
6. Run tests:
   ```bash
   yarn test
   ```
7. Submit a pull request

## Code Review Process

1. All PRs require at least one review
2. Address review comments promptly
3. Keep PRs focused and manageable in size
4. Respond to CI/CD feedback

## Commit Message Format

Follow the conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:

- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes
- refactor: Code refactoring
- test: Adding or modifying tests
- chore: Maintenance tasks

## Questions?

Feel free to open an issue for any questions or concerns.
