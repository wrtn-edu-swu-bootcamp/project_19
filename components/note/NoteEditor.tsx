'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LocalNote } from '@/types/note';

type NoteEditorProps = {
  insightDate: string; // YYYY-MM-DD format
  initialContent?: string;
  onSave?: (content: string) => void;
};

const STORAGE_KEY_PREFIX = 'insight_note_';
const AUTO_SAVE_DELAY = 1000; // 1 second
const INDICATOR_FADE_DELAY = 2000; // 2 seconds

export function NoteEditor({ insightDate, initialContent = '', onSave }: NoteEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const indicatorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved note from localStorage on mount
  useEffect(() => {
    const storageKey = `${STORAGE_KEY_PREFIX}${insightDate}`;
    const saved = localStorage.getItem(storageKey);
    
    if (saved) {
      try {
        const savedNote: LocalNote = JSON.parse(saved);
        setContent(savedNote.content);
      } catch {
        // Invalid JSON, ignore
      }
    } else if (initialContent) {
      setContent(initialContent);
    }
  }, [insightDate, initialContent]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(Math.max(textarea.scrollHeight, 120), 300)}px`;
    }
  }, [content]);

  // Save to localStorage
  const saveNote = useCallback((noteContent: string) => {
    const storageKey = `${STORAGE_KEY_PREFIX}${insightDate}`;
    const note: LocalNote = {
      insight_date: insightDate,
      content: noteContent,
      last_saved: new Date().toISOString(),
      synced: false,
    };

    localStorage.setItem(storageKey, JSON.stringify(note));
    onSave?.(noteContent);
    
    // Show save indicator
    setIsSaving(false);
    setShowSaveIndicator(true);

    // Hide indicator after delay
    if (indicatorTimeoutRef.current) {
      clearTimeout(indicatorTimeoutRef.current);
    }
    indicatorTimeoutRef.current = setTimeout(() => {
      setShowSaveIndicator(false);
    }, INDICATOR_FADE_DELAY);
  }, [insightDate, onSave]);

  // Handle content change with auto-save
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    setIsSaving(true);
    setShowSaveIndicator(false);

    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for auto-save
    saveTimeoutRef.current = setTimeout(() => {
      saveNote(newContent);
    }, AUTO_SAVE_DELAY);
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (indicatorTimeoutRef.current) {
        clearTimeout(indicatorTimeoutRef.current);
      }
    };
  }, []);

  return (
    <section className="space-y-3">
      {/* 섹션 헤드라인 - 설정 페이지와 동일한 스타일 */}
      <h2 className="text-caption font-normal text-secondary uppercase tracking-wide px-1">
        My Insight
      </h2>

      <div className="relative rounded-xl bg-bg p-4">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          placeholder="이 인사이트에 대한 생각을 자유롭게 적어보세요"
          className="
            w-full min-h-[100px] max-h-[200px]
            bg-transparent
            text-footnote text-label
            placeholder:text-secondary
            resize-none
            outline-none
            transition-all duration-quick
          "
          aria-label="인사이트 노트"
        />

        {/* Save Status Indicator */}
        <AnimatePresence>
          {(isSaving || showSaveIndicator) && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-4 right-4"
            >
              <span className="text-caption text-secondary flex items-center gap-1">
                {isSaving ? (
                  <>
                    <LoadingDots />
                    저장 중...
                  </>
                ) : (
                  <>
                    <CheckIcon />
                    저장됨
                  </>
                )}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg 
      width="14" 
      height="14" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function LoadingDots() {
  return (
    <span className="inline-flex gap-0.5" aria-hidden="true">
      <motion.span
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
        className="w-1 h-1 rounded-full bg-secondary"
      />
      <motion.span
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
        className="w-1 h-1 rounded-full bg-secondary"
      />
      <motion.span
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
        className="w-1 h-1 rounded-full bg-secondary"
      />
    </span>
  );
}

export default NoteEditor;
