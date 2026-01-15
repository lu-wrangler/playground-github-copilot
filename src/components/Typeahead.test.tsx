import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Typeahead } from '@/components/Typeahead';
import * as api from '@/services/api';

// Mock the API
vi.mock('@/services/api', () => ({
  searchItems: vi.fn(),
}));

describe('Typeahead Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render input field', () => {
      render(<Typeahead />);
      const input = screen.getByRole('textbox', { name: /search items/i });
      expect(input).toBeInTheDocument();
    });

    it('should render with custom placeholder', () => {
      render(<Typeahead placeholder="Custom placeholder" />);
      const input = screen.getByPlaceholderText('Custom placeholder');
      expect(input).toBeInTheDocument();
    });

    it('should render disabled when disabled prop is true', () => {
      render(<Typeahead disabled={true} />);
      const input = screen.getByRole('textbox', { name: /search items/i });
      expect(input).toBeDisabled();
    });

    it('should have proper ARIA attributes', () => {
      render(<Typeahead />);
      const input = screen.getByRole('textbox', { name: /search items/i });
      expect(input).toHaveAttribute('aria-autocomplete', 'list');
      expect(input).toHaveAttribute('aria-label', 'Search items');
    });
  });

  describe('Search Functionality', () => {
    it('should not search for empty queries', async () => {
      const mockSearch = vi.mocked(api.searchItems);
      mockSearch.mockResolvedValue([]);

      render(<Typeahead />);
      const input = screen.getByRole('textbox', { name: /search items/i });

      await userEvent.type(input, ' ');

      // Mock implementation returns empty array, so no results should be shown
      expect(mockSearch).not.toHaveBeenCalled();
    });

    it('should debounce search input', async () => {
      const mockSearch = vi.mocked(api.searchItems);
      mockSearch.mockResolvedValue([
        {
          id: '1',
          label: 'React',
          value: 'react',
          category: 'Library',
          description: 'A JS library',
        },
      ]);

      render(<Typeahead />);
      const input = screen.getByRole('textbox', { name: /search items/i });

      await userEvent.type(input, 'r');
      await userEvent.type(input, 'e');
      await userEvent.type(input, 'a');

      // Should not be called immediately
      expect(mockSearch).not.toHaveBeenCalled();

      // Wait for debounce
      await waitFor(
        () => {
          expect(mockSearch).toHaveBeenCalledTimes(1);
        },
        { timeout: 500 }
      );
    });

    it('should display search results', async () => {
      const mockSearch = vi.mocked(api.searchItems);
      mockSearch.mockResolvedValue([
        {
          id: '1',
          label: 'React',
          value: 'react',
          category: 'Library',
          description: 'A JS library',
        },
      ]);

      render(<Typeahead />);
      const input = screen.getByRole('textbox', { name: /search items/i });

      await userEvent.type(input, 'react');

      await waitFor(() => {
        expect(screen.getByText('React')).toBeInTheDocument();
      });
    });

    it('should handle search errors gracefully', async () => {
      const mockSearch = vi.mocked(api.searchItems);
      mockSearch.mockRejectedValue(new Error('Network error'));

      render(<Typeahead />);
      const input = screen.getByRole('textbox', { name: /search items/i });

      await userEvent.type(input, 'test');

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(
          'Failed to fetch search results'
        );
      });
    });
  });

  describe('Keyboard Navigation', () => {
    beforeEach(() => {
      const mockSearch = vi.mocked(api.searchItems);
      mockSearch.mockResolvedValue([
        {
          id: '1',
          label: 'React',
          value: 'react',
          category: 'Library',
          description: 'A JS library',
        },
        {
          id: '2',
          label: 'Vue',
          value: 'vue',
          category: 'Framework',
          description: 'Another framework',
        },
      ]);
    });

    it('should navigate with arrow keys', async () => {
      render(<Typeahead />);
      const input = screen.getByRole('textbox', { name: /search items/i });

      await userEvent.type(input, 'a');

      await waitFor(() => {
        expect(screen.getByText('React')).toBeInTheDocument();
      });

      // Press ArrowDown
      fireEvent.keyDown(input, { key: 'ArrowDown' });

      await waitFor(() => {
        const reactItem = screen.getByText('React').closest('[role="option"]');
        expect(reactItem).toHaveClass('bg-blue-50');
      });
    });

    it('should select item with Enter key', async () => {
      const onSelect = vi.fn();
      const mockSearch = vi.mocked(api.searchItems);
      mockSearch.mockResolvedValue([
        {
          id: '1',
          label: 'React',
          value: 'react',
          category: 'Library',
          description: 'A JS library',
        },
      ]);

      render(<Typeahead onSelect={onSelect} />);
      const input = screen.getByRole('textbox', { name: /search items/i });

      await userEvent.type(input, 'react');

      await waitFor(() => {
        expect(screen.getByText('React')).toBeInTheDocument();
      });

      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'Enter' });

      await waitFor(() => {
        expect(onSelect).toHaveBeenCalledWith(
          expect.objectContaining({
            label: 'React',
          })
        );
      });
    });

    it('should close dropdown with Escape key', async () => {
      const mockSearch = vi.mocked(api.searchItems);
      mockSearch.mockResolvedValue([
        {
          id: '1',
          label: 'React',
          value: 'react',
          category: 'Library',
          description: 'A JS library',
        },
      ]);

      render(<Typeahead />);
      const input = screen.getByRole('textbox', { name: /search items/i });

      await userEvent.type(input, 'react');

      await waitFor(() => {
        expect(screen.getByText('React')).toBeInTheDocument();
      });

      fireEvent.keyDown(input, { key: 'Escape' });

      // Results should still be in DOM but dropdown should be closed
      // (Results component should not be visible)
      expect(input).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Mouse Interactions', () => {
    it('should select item on click', async () => {
      const onSelect = vi.fn();
      const mockSearch = vi.mocked(api.searchItems);
      mockSearch.mockResolvedValue([
        {
          id: '1',
          label: 'React',
          value: 'react',
          category: 'Library',
          description: 'A JS library',
        },
      ]);

      render(<Typeahead onSelect={onSelect} />);
      const input = screen.getByRole('textbox', { name: /search items/i });

      await userEvent.type(input, 'react');

      await waitFor(() => {
        expect(screen.getByText('React')).toBeInTheDocument();
      });

      const reactItem = screen.getByText('React');
      fireEvent.click(reactItem);

      expect(onSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          label: 'React',
        })
      );
    });

    it('should highlight item on hover', async () => {
      const mockSearch = vi.mocked(api.searchItems);
      mockSearch.mockResolvedValue([
        {
          id: '1',
          label: 'React',
          value: 'react',
          category: 'Library',
          description: 'A JS library',
        },
      ]);

      render(<Typeahead />);
      const input = screen.getByRole('textbox', { name: /search items/i });

      await userEvent.type(input, 'react');

      await waitFor(() => {
        expect(screen.getByText('React')).toBeInTheDocument();
      });

      const reactItem = screen.getByText('React').closest('[role="option"]');
      fireEvent.mouseEnter(reactItem!);

      expect(reactItem).toHaveClass('bg-blue-50');
    });
  });

  describe('Clear Button', () => {
    it('should show clear button when input has value', async () => {
      const mockSearch = vi.mocked(api.searchItems);
      mockSearch.mockResolvedValue([]);

      render(<Typeahead />);
      const input = screen.getByRole('textbox', { name: /search items/i });

      await userEvent.type(input, 'test');

      const clearButton = screen.getByRole('button', { name: /clear search/i });
      expect(clearButton).toBeInTheDocument();
    });

    it('should clear input when clear button is clicked', async () => {
      const mockSearch = vi.mocked(api.searchItems);
      mockSearch.mockResolvedValue([]);

      render(<Typeahead />);
      const input = screen.getByRole('textbox', { name: /search items/i });

      await userEvent.type(input, 'test');
      const clearButton = screen.getByRole('button', { name: /clear search/i });
      fireEvent.click(clearButton);

      expect(input).toHaveValue('');
    });
  });

  describe('Accessibility', () => {
    it('should have correct ARIA role for results', async () => {
      const mockSearch = vi.mocked(api.searchItems);
      mockSearch.mockResolvedValue([
        {
          id: '1',
          label: 'React',
          value: 'react',
          category: 'Library',
          description: 'A JS library',
        },
      ]);

      render(<Typeahead />);
      const input = screen.getByRole('textbox', { name: /search items/i });

      await userEvent.type(input, 'react');

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });
    });

    it('should have aria-selected on highlighted items', async () => {
      const mockSearch = vi.mocked(api.searchItems);
      mockSearch.mockResolvedValue([
        {
          id: '1',
          label: 'React',
          value: 'react',
          category: 'Library',
          description: 'A JS library',
        },
      ]);

      render(<Typeahead />);
      const input = screen.getByRole('textbox', { name: /search items/i });

      await userEvent.type(input, 'react');

      await waitFor(() => {
        expect(screen.getByText('React')).toBeInTheDocument();
      });

      fireEvent.keyDown(input, { key: 'ArrowDown' });

      await waitFor(() => {
        const reactItem = screen.getByText('React').closest('[role="option"]');
        expect(reactItem).toHaveAttribute('aria-selected', 'true');
      });
    });
  });
});
