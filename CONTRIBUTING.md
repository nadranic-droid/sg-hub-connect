# Contributing to Humble Halal

Thank you for your interest in contributing to Humble Halal! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different viewpoints and experiences

## Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/nadranic-droid/sg-hub-connect.git
   cd sg-hub-connect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file with the required variables (see README.md)

4. **Start development server**
   ```bash
   npm run dev
   ```

## Development Workflow

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation as needed

3. **Test your changes**
   ```bash
   npm run lint
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

   Use conventional commit messages:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `style:` for formatting
   - `refactor:` for code refactoring
   - `test:` for tests
   - `chore:` for maintenance

5. **Push and create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

## Coding Standards

### TypeScript
- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` types when possible

### React Components
- Use functional components with hooks
- Keep components small and focused
- Use meaningful prop names
- Add PropTypes or TypeScript types

### Styling
- Use Tailwind CSS utility classes
- Follow existing design patterns
- Ensure mobile responsiveness

### File Structure
- Keep related files together
- Use descriptive file names
- Follow the existing directory structure

## Pull Request Process

1. **Update documentation** if needed
2. **Ensure all tests pass**
3. **Update CHANGELOG.md** if applicable
4. **Request review** from maintainers
5. **Address feedback** promptly

## Reporting Bugs

Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md) and include:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details

## Suggesting Features

Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md) and include:
- Clear description of the feature
- Problem it solves
- Proposed solution
- Benefits

## Questions?

Feel free to open an issue for questions or reach out to the maintainers.

Thank you for contributing! 🎉

