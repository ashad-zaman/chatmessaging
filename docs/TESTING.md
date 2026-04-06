# Testing Guide

## Overview

This project uses multiple levels of testing:
- **Unit Tests**: Jest for component and store testing
- **E2E Tests**: Playwright for end-to-end browser testing

## Prerequisites

```bash
# Install dependencies (includes testing libraries)
npm install

# Install Playwright browsers (first time only)
npx playwright install --with-deps
```

## Running Tests

### Unit Tests (Jest)

```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test -- src/__tests__/components/MessageBubble.test.tsx
```

### E2E Tests (Playwright)

```bash
# Run all e2e tests
npm run test:e2e

# Run specific e2e test file
npm run test:e2e -- e2e/auth.spec.ts

# Run with UI (headed mode)
npm run test:e2e -- --headed

# Run specific test
npm run test:e2e -- --grep "should display login form"
```

### Both Tests

```bash
# Run all tests (unit + e2e)
npm run test && npm run test:e2e
```

## Test Structure

```
frontend/
├── src/
│   ├── __tests__/
│   │   ├── components/      # Component unit tests
│   │   │   ├── MessageBubble.test.tsx
│   │   │   ├── MessageInput.test.tsx
│   │   │   └── ConversationItem.test.tsx
│   │   ├── store/           # Zustand store tests
│   │   │   └── chatStore.test.ts
│   │   └── api/             # API service tests
│   │       └── api.test.ts
│   └── ...
├── e2e/                     # Playwright e2e tests
│   ├── auth.spec.ts         # Authentication tests
│   └── chat.spec.ts        # Chat page tests
├── jest.config.js
├── jest.setup.ts
└── playwright.config.ts
```

## Test Categories

### 1. Authentication Tests (E2E)

| Test | Description |
|------|-------------|
| Login form display | Verify login page renders correctly |
| Validation errors | Test empty/invalid email handling |
| Invalid credentials | Test wrong password error message |
| Register navigation | Test link to registration page |
| Submit button loading | Test button state during submission |

### 2. Component Tests (Unit)

| Component | Tests |
|-----------|-------|
| `MessageBubble` | Message rendering, timestamps, status icons, alignment |
| `MessageInput` | Input handling, send functionality, typing indicator |
| `ConversationItem` | Display name, avatar, unread count, click handler |

### 3. Store Tests (Unit)

| Store | Tests |
|-------|-------|
| `AuthStore` | Login, register, logout, checkAuth |
| `ChatStore` | Conversations, messages, typing, presence |

### 4. API Tests (Unit)

| API | Tests |
|-----|-------|
| `authApi` | Login, register, logout, refresh |
| `usersApi` | Get user, update user, search users |
| `conversationsApi` | Get, create, direct conversations |
| `messagesApi` | Get messages, send, mark as read |

## CI/CD Testing

The project uses GitHub Actions for automated testing. See [ci-cd.yml](../.github/workflows/ci-cd.yml):

```yaml
# Runs on every push
- Run unit tests
- Run type checking
- Run ESLint

# Runs on pull requests
- Run e2e tests
- Build application
```

## Debugging

### Jest Debugging

```bash
# Add breakpoints in tests and run
npm run test -- --inspect-brk

# Run single test
npm run test -- --testNamePattern="test name"
```

### Playwright Debugging

```bash
# Open Playwright UI
npx playwright test --ui

# Show test traces
npx playwright show-trace test-results/

# Debug specific test
npx playwright test e2e/auth.spec.ts --debug
```

## Test Coverage

Current coverage targets:
- Branches: 50%
- Functions: 50%
- Lines: 50%
- Statements: 50%

View coverage report:
```bash
npm run test:coverage
# Open coverage/lcov-report/index.html
```

## Writing New Tests

### Component Test Template

```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import YourComponent from '@/path/to/Component';

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent prop="value" />);
    expect(screen.getByText('expected')).toBeInTheDocument();
  });
});
```

### E2E Test Template

```ts
import { test, expect } from '@playwright/test';

test.describe('Feature', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/page');
    await page.click('#element');
    await expect(page.locator('#result')).toBeVisible();
  });
});
```

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| `Cannot find module` | Run `npm install` |
| `Timeout errors` | Increase timeout in config |
| `Port already in use` | Kill existing processes |
| `Playwright not installed` | Run `npx playwright install` |

### Reset Testing Environment

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Jest cache
npm run test -- --clearCache

# Clear Playwright cache
rm -rf test-results/ playwright-report/
```