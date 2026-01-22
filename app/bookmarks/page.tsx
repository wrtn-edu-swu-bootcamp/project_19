'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useBookmarkStore } from '@/stores/bookmark-store';
import { useTranslation } from '@/lib/i18n';
import { format } from 'date-fns';

export default function BookmarksPage() {
  const { bookmarks, removeBookmark, updateBookmark } = useBookmarkStore();
  const { ts } = useTranslation();
  const sortedBookmarks = [...bookmarks].sort((a, b) => b.date.localeCompare(a.date));

  // insightText가 없는 북마크에 대해 API로 가져와서 업데이트
  useEffect(() => {
    const fetchMissingInsights = async () => {
      const bookmarksWithoutText = bookmarks.filter(
        (b) => !b.insightText || b.insightText.trim() === ''
      );

      for (const bookmark of bookmarksWithoutText) {
        try {
          const response = await fetch(`/api/insights/${bookmark.date}`);
          if (response.ok) {
            const insight = await response.json();
            if (insight.insight_text) {
              updateBookmark(bookmark.date, insight.insight_text);
            }
          }
        } catch (error) {
          console.error(`Failed to fetch insight for ${bookmark.date}:`, error);
        }
      }
    };

    if (bookmarks.length > 0) {
      fetchMissingInsights();
    }
  }, [bookmarks, updateBookmark]);

  return (
    <div className="flex flex-1 flex-col bg-bg-secondary min-h-screen">
      {/* Header - iOS 스타일 */}
      <header className="sticky top-0 z-10 bg-bg-secondary/80 backdrop-blur-xl border-b border-separator/30">
        <div className="w-full max-w-[600px] mx-auto px-5 py-3">
          <div className="relative flex items-center justify-center h-8">
            {/* 뒤로가기 - 왼쪽 고정 */}
            <Link 
              href="/"
              className="absolute left-0 flex items-center gap-0.5 text-label font-medium hover:opacity-80 transition-opacity"
            >
              <BackIcon />
              <span className="text-footnote">캘린더</span>
            </Link>
            
            {/* 타이틀 - 가운데 */}
            <h1 className="text-subheadline font-semibold">
              북마크
            </h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="w-full max-w-[600px] mx-auto px-5 py-6 flex-1 flex flex-col">
        {sortedBookmarks.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 mb-4 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
              <BookmarkEmptyIcon />
            </div>
            <p className="text-footnote font-semibold mb-1">
              북마크가 없습니다
            </p>
            <p className="text-caption text-secondary">
              저장한 인사이트가 여기에 표시됩니다
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedBookmarks.map((bookmark) => {
              const formattedDate = format(new Date(bookmark.date), 'yyyy.M.d');
              return (
                <div 
                  key={bookmark.date} 
                  className="rounded-xl bg-bg overflow-hidden"
                >
                  <div className="flex items-center">
                    {/* 북마크 아이콘 */}
                    <div className="pl-4 pr-3">
                      <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                        <BookmarkFilledIcon />
                      </div>
                    </div>
                    
                    {/* 인사이트 정보 */}
                    <Link 
                      href={`/insight/${bookmark.date}`}
                      className="flex-1 py-3 pr-2 active:opacity-70 transition-opacity min-w-0"
                    >
                      <p className="text-footnote font-medium truncate">
                        {bookmark.insightText || '인사이트 없음'}
                      </p>
                      <p className="text-caption text-secondary mt-0.5">{formattedDate}</p>
                    </Link>
                    
                    {/* 삭제 버튼 */}
                    <button
                      type="button"
                      onClick={() => removeBookmark(bookmark.date)}
                      className="pl-3 pr-4 active:opacity-50 transition-opacity flex-shrink-0"
                      aria-label="북마크 삭제"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function BookmarkEmptyIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500" aria-hidden="true">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function BookmarkFilledIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 dark:text-amber-500" aria-hidden="true">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-secondary" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
