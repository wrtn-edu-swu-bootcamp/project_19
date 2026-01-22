/**
 * 번역 시스템 (한국어 고정)
 */

export const translations = {
  // 메인 페이지
  'home.title': 'Insight Calendar',
  'home.subtitle': 'Daily Marketing Trends',
  'home.footer': '날짜를 탭하여 인사이트 확인',
  
  // 캘린더
  'calendar.weekdays': ['일', '월', '화', '수', '목', '금', '토'],
  'calendar.today': '오늘',
  
  // 프리뷰
  'preview.today': 'TODAY',
  'preview.viewDetail': '자세히 보기',
  'preview.loading': '불러오는 중',
  'preview.noInsight': '인사이트가 없습니다',
  'preview.noInsightDesc': '아직 준비되지 않았어요\n매일 오전 7시 새로운 인사이트가 업데이트됩니다',
  
  // 상세 페이지
  'detail.todayInsight': "Today's Insight",
  'detail.trendSignal': 'Trend Signal',
  'detail.whyItMatters': 'Why it matters',
  'detail.keyQuestion': 'Key Question',
  'detail.myInsight': 'My Insight',
  'detail.notePlaceholder': '이 인사이트에 대한 나만의 생각을 기록해보세요...',
  'detail.back': '캘린더',
  
  // 설정 페이지
  'settings.title': '설정',
  'settings.back': '캘린더',
  'settings.display': '화면',
  'settings.darkMode': '다크 모드',
  'settings.fontSize': '글씨 크기',
  'settings.fontSmall': '작게',
  'settings.fontMedium': '보통',
  'settings.fontLarge': '크게',
  'settings.notification': '알림',
  'settings.pushNotification': '푸시 알림',
  'settings.comingSoon': '준비 중',
  'settings.info': '정보',
  'settings.version': '버전',
  'settings.developer': '개발',
  'settings.footer': 'Made with AI for Marketers',
} as const;

export type TranslationKey = keyof typeof translations;
