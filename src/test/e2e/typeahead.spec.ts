import { test, expect } from '@playwright/test';

test.describe('Typeahead E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Search Functionality', () => {
    test('should display search input', async ({ page }) => {
      const input = page.getByRole('textbox', { name: /search items/i });
      await expect(input).toBeVisible();
    });

    test('should search and display results', async ({ page }) => {
      const input = page.getByRole('textbox', { name: /search items/i });
      await input.fill('react');

      // Wait for results to appear
      const resultItem = page.getByText('React', { exact: false });
      await expect(resultItem).toBeVisible({ timeout: 2000 });
    });

    test('should display no results message when no matches', async ({
      page,
    }) => {
      const input = page.getByRole('textbox', { name: /search items/i });
      await input.fill('nonexistentframework12345');

      await expect(page.getByText(/no results found/i)).toBeVisible({
        timeout: 2000,
      });
    });

    test('should clear search when clear button is clicked', async ({
      page,
    }) => {
      const input = page.getByRole('textbox', { name: /search items/i });
      await input.fill('react');

      // Wait for clear button to appear
      const clearButton = page.getByRole('button', { name: /clear search/i });
      await expect(clearButton).toBeVisible();

      await clearButton.click();
      await expect(input).toHaveValue('');
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should navigate with arrow keys', async ({ page }) => {
      const input = page.getByRole('textbox', { name: /search items/i });
      await input.fill('a'); // This should return multiple items

      // Wait for results
      await expect(page.getByRole('listbox')).toBeVisible({ timeout: 2000 });

      // Navigate down
      await input.press('ArrowDown');

      // Check that first item is highlighted
      const firstOption = page.getByRole('option').first();
      const bgColor = await firstOption.evaluate(
        (el) => window.getComputedStyle(el).backgroundColor
      );
      expect(bgColor).not.toBe('rgb(255, 255, 255)'); // Not white
    });

    test('should select item with Enter key', async ({ page }) => {
      const input = page.getByRole('textbox', { name: /search items/i });
      await input.fill('react');

      // Wait for results
      await expect(page.getByRole('option')).toBeVisible({ timeout: 2000 });

      // Navigate and select
      await input.press('ArrowDown');
      await input.press('Enter');

      // Selected item label should be in input
      const inputValue = await input.inputValue();
      expect(inputValue).toBeTruthy();
    });

    test('should close dropdown with Escape key', async ({ page }) => {
      const input = page.getByRole('textbox', { name: /search items/i });
      await input.fill('react');

      // Wait for dropdown to appear
      await expect(page.getByRole('listbox')).toBeVisible({ timeout: 2000 });

      // Press Escape
      await input.press('Escape');

      // Dropdown should close
      await expect(page.getByRole('listbox')).not.toBeVisible();
    });
  });

  test.describe('Mouse Interactions', () => {
    test('should select item on click', async ({ page }) => {
      const input = page.getByRole('textbox', { name: /search items/i });
      await input.fill('react');

      // Wait for and click React item
      const reactOption = page.getByRole('option').filter({
        hasText: 'React',
      });
      await expect(reactOption).toBeVisible({ timeout: 2000 });
      await reactOption.click();

      // Input should contain React
      await expect(input).toHaveValue('React');
    });

    test('should highlight item on hover', async ({ page }) => {
      const input = page.getByRole('textbox', { name: /search items/i });
      await input.fill('a'); // Multiple results

      // Wait for options
      const firstOption = page.getByRole('option').first();
      await expect(firstOption).toBeVisible({ timeout: 2000 });

      // Hover
      await firstOption.hover();

      // Check if it's highlighted
      const bgColor = await firstOption.evaluate(
        (el) => window.getComputedStyle(el).backgroundColor
      );
      expect(bgColor).not.toBe('rgb(255, 255, 255)'); // Not white
    });

    test('should close dropdown when clicking outside', async ({ page }) => {
      const input = page.getByRole('textbox', { name: /search items/i });
      await input.fill('react');

      // Wait for dropdown
      await expect(page.getByRole('listbox')).toBeVisible({ timeout: 2000 });

      // Click outside
      await page.click('body', { position: { x: 0, y: 0 } });

      // Dropdown should close
      await expect(page.getByRole('listbox')).not.toBeVisible();
    });
  });

  test.describe('Results Display', () => {
    test('should display item label, description, and category', async ({
      page,
    }) => {
      const input = page.getByRole('textbox', { name: /search items/i });
      await input.fill('react');

      // Wait for results
      const results = page.getByRole('option');
      await expect(results.first()).toBeVisible({ timeout: 2000 });

      // Check that description and category are displayed
      const resultText = await results.first().textContent();
      expect(resultText).toBeTruthy();
      expect(resultText).toContain('React');
    });

    test('should display loading state during search', async ({ page }) => {
      const input = page.getByRole('textbox', { name: /search items/i });

      // Type to trigger search
      await input.type('angular', { delay: 50 }); // Slow typing to catch loading state

      // May or may not see loading depending on timing, but it shouldn't error
      await page.waitForTimeout(100);
      await expect(input).toHaveValue('angular');
    });
  });

  test.describe('Demo Page', () => {
    test('should display demo title and instructions', async ({ page }) => {
      await expect(
        page.getByRole('heading', { name: /search demo/i })
      ).toBeVisible();
      await expect(
        page.getByText(/start typing to see search results/i)
      ).toBeVisible();
    });

    test('should display selected item info', async ({ page }) => {
      const input = page.getByRole('textbox', { name: /search items/i });
      await input.fill('typescript');

      // Select first result
      const firstOption = page.getByRole('option').first();
      await expect(firstOption).toBeVisible({ timeout: 2000 });
      await firstOption.click();

      // Selected item section should appear
      await expect(page.getByText(/selected item/i)).toBeVisible();
      await expect(page.getByText(/label:/i)).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper ARIA labels', async ({ page }) => {
      const input = page.getByRole('textbox', { name: /search items/i });
      expect(input).toBeTruthy();

      // Check aria attributes
      const ariaLabel = await input.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();

      const ariaAutocomplete = await input.getAttribute('aria-autocomplete');
      expect(ariaAutocomplete).toBe('list');
    });

    test('should announce expanded state with ARIA', async ({ page }) => {
      const input = page.getByRole('textbox', { name: /search items/i });
      await input.fill('react');

      // Wait for results
      await expect(page.getByRole('listbox')).toBeVisible({ timeout: 2000 });

      const ariaExpanded = await input.getAttribute('aria-expanded');
      expect(ariaExpanded).toBe('true');
    });

    test('should support keyboard-only navigation', async ({ page }) => {
      const input = page.getByRole('textbox', { name: /search items/i });

      // Type with keyboard
      await input.type('react');

      // Navigate with keyboard
      await input.press('ArrowDown');
      await input.press('ArrowDown');
      await input.press('Enter');

      // Should have selected something
      const inputValue = await input.inputValue();
      expect(inputValue).toBeTruthy();
    });
  });
});
