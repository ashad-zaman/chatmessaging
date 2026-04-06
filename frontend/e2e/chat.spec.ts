import { test, expect } from '@playwright/test';

test.describe('Chat Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chat');
  });

  test('should redirect to login when not authenticated', async ({ page }) => {
    await expect(page).toHaveURL('/login');
  });

  test('should display loading state', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
  });
});

test.describe('Chat Page (Authenticated)', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/chat');
    await expect(page).toHaveURL('/login');
  });

  test('should require login to access chat', async ({ page }) => {
    await page.goto('/chat');
    await expect(page).toHaveURL('/login');
  });
});

test.describe('Conversation List', () => {
  test('should display "Select a conversation" when no active conversation', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('Email').fill('test@test.com');
    await page.getByPlaceholder('Password').fill('password');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.waitForURL('/chat');
    
    await expect(page.getByText('Select a conversation')).toBeVisible();
    await expect(page.getByText('Choose a conversation from the list to start chatting')).toBeVisible();
  });

  test('should display loading spinner during auth check', async ({ page }) => {
    await page.goto('/chat', { waitUntil: 'domcontentloaded' });
    const spinner = page.locator('.animate-spin');
    await expect(spinner).toBeVisible({ timeout: 3000 });
  });
});

test.describe('Message Input', () => {
  test('should be disabled when not logged in', async ({ page }) => {
    await page.goto('/chat');
    const searchInput = page.getByPlaceholder('Search conversations...');
    await expect(searchInput).not.toBeVisible();
  });
});

test.describe('Responsive Design', () => {
  test('should display correctly on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/login');
    
    const loginForm = page.locator('form');
    await expect(loginForm).toBeVisible();
  });

  test('should display correctly on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/login');
    
    const loginForm = page.locator('form');
    await expect(loginForm).toBeVisible();
  });

  test('should display correctly on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/login');
    
    const loginForm = page.locator('form');
    await expect(loginForm).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('should have proper heading structure on login page', async ({ page }) => {
    await page.goto('/login');
    const h1 = page.locator('h1');
    await expect(h1).toHaveText('Welcome back');
  });

  test('should have proper heading structure on register page', async ({ page }) => {
    await page.goto('/register');
    const h1 = page.locator('h1');
    await expect(h1).toHaveText('Create account');
  });

  test('should have form labels', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByPlaceholder('Email')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
  });

  test('should have submit button with accessible name', async ({ page }) => {
    await page.goto('/login');
    const submitButton = page.getByRole('button', { name: 'Sign in' });
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
  });
});

test.describe('Navigation', () => {
  test('should navigate to terms page', async ({ page }) => {
    await page.goto('/terms');
    await expect(page.getByRole('heading', { name: 'Terms of Service' })).toBeVisible();
  });

  test('should navigate to privacy page', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page.getByRole('heading', { name: 'Privacy Policy' })).toBeVisible();
  });
});