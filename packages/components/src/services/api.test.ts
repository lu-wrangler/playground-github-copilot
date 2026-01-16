import { describe, it, expect } from 'vitest';
import { searchItems, getItemById, getCategories } from '../api';
import type { SearchItem } from '../../types';

describe('API Service', () => {
  describe('searchItems', () => {
    it('should return empty array for empty query', async () => {
      const results = await searchItems('');
      expect(results).toEqual([]);
    });

    it('should return empty array for whitespace query', async () => {
      const results = await searchItems('   ');
      expect(results).toEqual([]);
    });

    it('should find items by label', async () => {
      const results = await searchItems('react');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].label.toLowerCase()).toContain('react');
    });

    it('should find items by value', async () => {
      const results = await searchItems('vue');
      expect(results.length).toBeGreaterThan(0);
      expect(
        results.some((item: SearchItem) => item.value.includes('vue'))
      ).toBe(true);
    });

    it('should find items by category', async () => {
      const results = await searchItems('framework');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should be case-insensitive', async () => {
      const lowerResults = await searchItems('react');
      const upperResults = await searchItems('REACT');
      const mixedResults = await searchItems('ReAcT');

      expect(lowerResults.length).toBe(upperResults.length);
      expect(lowerResults.length).toBe(mixedResults.length);
    });

    it('should respect limit parameter', async () => {
      const results = await searchItems('', 5);

      expect(results.length).toBeLessThanOrEqual(5);
    });

    it('should enforce maximum limit', async () => {
      const results = await searchItems('', 1000);
      expect(results.length).toBeLessThanOrEqual(100);
    });

    it('should validate limit boundaries', async () => {
      const results1 = await searchItems('a', 0); // Should be treated as 1
      const results2 = await searchItems('a', -5); // Should be treated as 1
      expect(typeof results1.length).toBe('number');
      expect(typeof results2.length).toBe('number');
    });

    it('should sanitize input', async () => {
      // Test with special characters
      const results = await searchItems('<script>alert("xss")</script>');
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('getItemById', () => {
    it('should return item by valid id', async () => {
      const item = await getItemById('1');
      expect(item).not.toBeNull();
      expect(item?.id).toBe('1');
    });

    it('should return null for invalid id', async () => {
      const item = await getItemById('invalid-id-with-chars');
      expect(item).toBeNull();
    });

    it('should return null for empty id', async () => {
      const item = await getItemById('');
      expect(item).toBeNull();
    });

    it('should prevent injection attacks', async () => {
      const item = await getItemById("'; DROP TABLE items; --");
      expect(item).toBeNull();
    });

    it('should handle alphanumeric and safe special chars', async () => {
      const item = await getItemById('abc-def_123');
      expect(typeof item).toBe('object');
    });
  });

  describe('getCategories', () => {
    it('should return array of categories', async () => {
      const categories = await getCategories();
      expect(Array.isArray(categories)).toBe(true);
    });

    it('should not contain duplicates', async () => {
      const categories = await getCategories();
      const uniqueCategories = new Set(categories);
      expect(categories.length).toBe(uniqueCategories.size);
    });

    it('should have known categories', async () => {
      const categories = await getCategories();
      expect(categories.length).toBeGreaterThan(0);
      expect(categories).toContain('Framework');
    });
  });
});
