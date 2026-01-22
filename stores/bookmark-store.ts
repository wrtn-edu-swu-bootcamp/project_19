'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface BookmarkItem {
  date: string; // YYYY-MM-DD
  insightText: string; // 인사이트 한줄
}

interface BookmarkStore {
  bookmarks: BookmarkItem[];
  isBookmarked: (date: string) => boolean;
  toggleBookmark: (date: string, insightText?: string) => void;
  addBookmark: (date: string, insightText: string) => void;
  updateBookmark: (date: string, insightText: string) => void;
  removeBookmark: (date: string) => void;
  getBookmark: (date: string) => BookmarkItem | undefined;
}

// 기존 문자열 배열을 새 형식으로 마이그레이션
function migrateBookmarks(stored: unknown): BookmarkItem[] {
  if (!stored || !Array.isArray(stored)) {
    return [];
  }
  
  return stored.map((item) => {
    // 이미 새 형식인 경우
    if (typeof item === 'object' && item !== null && 'date' in item) {
      return item as BookmarkItem;
    }
    // 기존 문자열 형식인 경우
    if (typeof item === 'string') {
      return { date: item, insightText: '' };
    }
    return null;
  }).filter((item): item is BookmarkItem => item !== null);
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set, get) => ({
      bookmarks: [],

      isBookmarked: (date: string) => {
        return get().bookmarks.some((b) => b.date === date);
      },

      toggleBookmark: (date: string, insightText?: string) => {
        const { bookmarks } = get();
        const exists = bookmarks.find((b) => b.date === date);
        if (exists) {
          // 북마크 제거
          set({ bookmarks: bookmarks.filter((b) => b.date !== date) });
        } else {
          // 북마크 추가 (insightText가 있으면 저장)
          set({ bookmarks: [...bookmarks, { date, insightText: insightText || '' }] });
        }
      },

      addBookmark: (date: string, insightText: string) => {
        const { bookmarks } = get();
        if (!bookmarks.some((b) => b.date === date)) {
          set({ bookmarks: [...bookmarks, { date, insightText }] });
        }
      },

      updateBookmark: (date: string, insightText: string) => {
        const { bookmarks } = get();
        set({
          bookmarks: bookmarks.map((b) =>
            b.date === date ? { ...b, insightText } : b
          ),
        });
      },

      removeBookmark: (date: string) => {
        set({ bookmarks: get().bookmarks.filter((b) => b.date !== date) });
      },

      getBookmark: (date: string) => {
        return get().bookmarks.find((b) => b.date === date);
      },
    }),
    {
      name: 'insight-bookmarks',
      storage: createJSONStorage(() => localStorage),
      // 저장된 데이터를 로드할 때 마이그레이션 적용
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.bookmarks = migrateBookmarks(state.bookmarks);
        }
      },
    }
  )
);
