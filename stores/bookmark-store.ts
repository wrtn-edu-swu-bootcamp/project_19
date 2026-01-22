'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface BookmarkStore {
  bookmarks: string[]; // 북마크된 날짜 배열 (예: ['2026-01-22'])
  isBookmarked: (date: string) => boolean;
  toggleBookmark: (date: string) => void;
  addBookmark: (date: string) => void;
  removeBookmark: (date: string) => void;
  getBookmarks: () => string[];
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set, get) => ({
      bookmarks: [],

      isBookmarked: (date: string) => {
        return get().bookmarks.includes(date);
      },

      toggleBookmark: (date: string) => {
        const { bookmarks } = get();
        if (bookmarks.includes(date)) {
          set({ bookmarks: bookmarks.filter((d) => d !== date) });
        } else {
          set({ bookmarks: [...bookmarks, date] });
        }
      },

      addBookmark: (date: string) => {
        const { bookmarks } = get();
        if (!bookmarks.includes(date)) {
          set({ bookmarks: [...bookmarks, date] });
        }
      },

      removeBookmark: (date: string) => {
        set({ bookmarks: get().bookmarks.filter((d) => d !== date) });
      },

      getBookmarks: () => {
        return get().bookmarks;
      },
    }),
    {
      name: 'insight-bookmarks', // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);
