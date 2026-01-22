'use client';

import { useBookmarkStore } from '@/stores';

type BookmarkButtonProps = {
  date: string;
  insightText?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
};

export function BookmarkButton({ 
  date, 
  insightText = '',
  size = 'md', 
  showLabel = false,
  className = '' 
}: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useBookmarkStore();
  const bookmarked = isBookmarked(date);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 18,
    md: 22,
    lg: 26,
  };

  const handleClick = () => {
    toggleBookmark(date, insightText);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`
        inline-flex items-center justify-center gap-2
        ${sizeClasses[size]}
        rounded-full
        transition-all duration-quick ease-smooth
        hover:bg-bg-secondary active:scale-95
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-link
        ${className}
      `}
      aria-label={bookmarked ? '북마크 해제' : '북마크 추가'}
      aria-pressed={bookmarked}
    >
      <BookmarkIcon 
        filled={bookmarked} 
        size={iconSizes[size]} 
      />
      {showLabel && (
        <span className="text-footnote font-medium">
          {bookmarked ? '저장됨' : '저장'}
        </span>
      )}
    </button>
  );
}

function BookmarkIcon({ filled, size }: { filled: boolean; size: number }) {
  if (filled) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className="text-link"
        aria-hidden="true"
      >
        <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-secondary"
      aria-hidden="true"
    >
      <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  );
}

export default BookmarkButton;
