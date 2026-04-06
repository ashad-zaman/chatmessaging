import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
    await expect(page.getByPlaceholder('Email')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  });

  test('should display register link', async ({ page }) => {
    const signUpLink = page.getByRole('link', { name: 'Sign up' });
    await expect(signUpLink).toBeVisible();
    await expect(signUpLink).toHaveAttribute('href', '/register');
  });

  test('should show validation error for empty email', async ({ page }) => {
    await page.getByPlaceholder('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByPlaceholder('Email')).toBeInvalid();
  });

  test('should show validation error for invalid email format', async ({ page }) => {
    await page.getByPlaceholder('Email').fill('invalid-email');
    await page.getByPlaceholder('Password').fill('password123');
    await expect(page.getByPlaceholder('Email')).toHaveCSS('border-color', 'rgb(209, 213, 219)');
  });

  test('should disable submit button during loading', async ({ page }) => {
    await page.getByPlaceholder('Email').fill('test@test.com');
    await page.getByPlaceholder('Password').fill('password123');
    const submitButton = page.getByRole('button', { name: 'Sign in' });
    await submitButton.click();
    await expect(submitButton).toBeDisabled();
    await expect(submitButton).toContainText('Signing in...');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.getByPlaceholder('Email').fill('invalid@test.com');
    await page.getByPlaceholder('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByText('Invalid credentials')).toBeVisible({ timeout: 5000 });
  });

  test('should navigate to register page on sign up click', async ({ page }) => {
    await page.getByRole('link', { name: 'Sign up' }).click();
    await expect(page).toHaveURL('/register');
    await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible();
  });
});

test.describe('Register Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  test('should display registration form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible();
    await expect(page.getByPlaceholder('Email')).toBeVisible();
    await expect(page.getByPlaceholder('Username')).toBeVisible();
    await expect(page.getByPlaceholder('Display name (optional)')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
  });

  test('should show validation error for empty required fields', async ({ page }) => {
    await page.getByRole('button', { name: 'Create account' }).click();
    await expect(page.getByPlaceholder('Email')).toBeInvalid();
    await expect(page.getByPlaceholder('Username')).toBeInvalid();
    await expect(page.getByPlaceholder('Password')).toBeInvalid();
  });

  test('should show validation error for short password', async ({ page }) => {
    await page.getByPlaceholder('Email').fill('test@test.com');
    await page.getByPlaceholder('Username').fill('testuser');
    await page.getByPlaceholder('Password').fill('123');
    await page.getByRole('button', { name: 'Create account' }).click();
    await expect(page.getByPlaceholder('Password')).toBeInvalid();
  });

  test('should display login link', async ({ page }) => {
    const signInLink = page.getByRole('link', { name: 'Sign in' });
    await expect(signInLink).toBeVisible();
    await expect(signInLink).toHaveAttribute('href', '/login');
  });

  test('should navigate to login page on sign in click', async ({ page }) => {
    await page.getByRole('link', { name: 'Sign in' }).click();
    await expect(page).toHaveURL('/login');
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
  });
});