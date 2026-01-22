# AI 인사이트 캘린더 - 와이어프레임 설계

> **작성일**: 2026.01.22  
> **버전**: v1.0 (MVP)  
> **기반 문서**: service-plan.md

---

## 📋 목차

1. [설계 원칙](#설계-원칙)
2. [화면 구조](#화면-구조)
3. [주요 화면별 와이어프레임](#주요-화면별-와이어프레임)
4. [컴포넌트 상세](#컴포넌트-상세)
5. [사용자 플로우](#사용자-플로우)
6. [반응형 전략](#반응형-전략)

---

## 설계 원칙

### UX 설계 원칙

1. **설명 없이 이해 가능**
   - 직관적인 인터페이스
   - 불필요한 요소 제거

2. **Focus on Content**
   - 넉넉한 여백
   - 핵심 정보에 집중
   - 시각적 계층 명확

3. **Effortless Interaction**
   - 자연스러운 제스처
   - 부드러운 애니메이션
   - 즉각적인 피드백

4. **Seamless Experience**
   - 회원가입 불필요
   - 즉시 가치 경험
   - 로딩 없는 듯한 속도

### 디자인 철학

**Simple is Beautiful**

- 절제된 컬러 팔레트 (Black, White, Subtle Gray)
- 타이포그래피가 주인공
- 여백이 콘텐츠를 돋보이게
- 디테일에서 완성도

---

## 화면 구조

### MVP 화면 구성

```
Landing
   ↓
Insight Detail
   ↓
Bookmarks (Optional)
```

**3 Screens. That's it.**

---

## 주요 화면

### 1. Main Screen

#### Mobile Layout

**[기본 상태]**

```
┌─────────────────────────────────┐
│                                 │
│    AI 인사이트 캘린더        ⋯   │  ← 헤더 (미니멀)
│                                 │
│                                 │
│         2026년 1월              │  ← 월
│                                 │
│   월  화  수  목  금  토  일     │
│               1   2   3   4    │
│   5   6   7   8   9  10  11    │  ← 캘린더
│  12  13  14  15  16  17  18    │     (깔끔한 그리드)
│  19  20  21  22  23  24  25    │
│  26  27  28  29  30  31        │
│                                 │
│                                 │
│                                 │
│                                 │
│                                 │
└─────────────────────────────────┘
```

**[날짜 선택됨]**

```
┌─────────────────────────────────┐
│                                 │
│    AI 인사이트 캘린더        ⋯   │
│                                 │
│                                 │
│         2026년 1월              │  ← Dimmed
│                                 │
│   월  화  수  목  금  토  일     │
│               1   2   3   4    │
│   5   6   7   8   9  10  11    │  ← Dimmed
│  12  13  14  15  16  17  18    │     (오버레이)
│  19  20  21  22 ⦿23⦿ 24  25   │     
│  26  27  28  29  30  31        │
│▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔│
│              ━                  │  ← 드래그 핸들
│                                 │
│  1월 23일                       │  ← 날짜
│                                 │
│  "요즘 브랜드는 혜택보다          │  ← 인사이트
│   선택 이유를 설계한다"          │     (2줄 제한)
│                                 │
│  브랜드 · 스토리텔링 · 가치소비   │  ← 키워드
│                                 │
│  자세히 보기  →                  │  ← 액션
│                                 │
└─────────────────────────────────┘
```

#### Visual Specifications

**헤더 (Header)**
- Height: 56px
- Background: 반투명 블러
- Typography: SF Pro Display, 17pt (한글: 시스템 기본체)
- Right icon: 3-dot menu (⋯)
- 언어 전환: 메뉴 내 옵션 (한글/English)

**월 네비게이션 (Month Navigation)**
- Typography: SF Pro Display, 28pt, Semibold (한글: 시스템 고딕 Bold)
- Spacing: 24px from calendar
- 스와이프 제스처 지원
- Format: "YYYY년 M월" (한글) / "Month YYYY" (영어)

**캘린더 그리드 (Calendar Grid)**
- Cell size: 44x44px (Apple의 최소 터치 타겟)
- Typography: SF Pro, 17pt, Regular
- 요일 표시: "월화수목금토일" (한글) / "MTWTFSS" (영어)
- Today: 미세한 원형 아웃라인
- Selected: 채워진 원형
- Dot indicator: 4px, 날짜 아래
- Spacing: 2px between cells

**프리뷰 카드 (Bottom Sheet)**
- Corner radius: 16px (상단 모서리만)
- Background: 시스템 백그라운드 + 블러
- Shadow: 부드러운, 떠있는 느낌
- Padding: 24px horizontal, 20px vertical
- Drag handle: 36x5px, 중앙정렬, 회색
- 날짜 Typography: SF Pro, 13pt, Regular, Secondary label
- 인사이트 Typography: SF Pro Display, 20pt, Semibold (한글: 시스템 Bold)
- 키워드: SF Pro, 15pt, Regular, · 으로 구분
- CTA: SF Pro, 17pt, Medium
  - 한글: "자세히 보기 →"
  - 영어: "View Details →"

**컬러 팔레트 (Color Palette)**
- Primary text: #000000 (Light mode), #FFFFFF (Dark mode)
- Secondary text: #8E8E93
- Background: #FFFFFF / #000000
- Card background: System material
- Accent: 미니멀, 콘텐츠 중심

**간격 시스템 (Spacing System)**
- Base unit: 4px
- Common spacing: 8, 12, 16, 20, 24, 32px

**인터랙션 (Interaction)**
- 프리뷰 외부 탭 → 스프링 애니메이션과 함께 닫힘
- 프리뷰 아래로 스와이프 → 닫힘
- 프리뷰 또는 CTA 탭 → 상세 페이지로 이동
- 모든 애니메이션: 스프링 커브, 0.4s duration

---

### 2. Insight Detail Screen

#### Mobile Layout

```
┌─────────────────────────────────┐
│                                 │
│  ←                          ⋯   │  ← 네비게이션
│                                 │
│  2026년 1월 23일                │  ← 날짜
│                                 │
│                                 │
│  "요즘 브랜드는 혜택보다          │  ← 인사이트
│   선택 이유를 설계한다"          │     (크게, Bold)
│                                 │
│                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │  ← 구분선
│                                 │
│  Trend Signal                   │  ← 섹션
│                                 │
│  브랜드 스토리텔링               │
│  단순한 제품 기능을 넘어          │
│  가치로 전달                     │
│                                 │
│  선택 피로감                     │
│  명확한 이유가 많은 옵션보다      │
│  중요함                          │
│                                 │
│  가치 기반 소비                  │
│  Z세대는 가격에서 의미로          │
│  전환 중                         │
│                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                 │
│  Why it matters                 │  ← 맥락
│                                 │
│  최근 소비자들은 제품 기능이나    │
│  할인보다 '왜 이 브랜드를         │
│  선택해야 하는가'에 더 민감하게   │
│  반응합니다...                   │
│                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                 │
│  Key Question                   │  ← 질문
│                                 │
│  우리 브랜드가 제공하는 선택      │
│  이유는 명확한가? 고객에게        │
│  어떤 가치를 전달하고             │
│  있는가?                        │
│                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                 │
│  My Insight                     │  ← 노트 섹션
│                                 │
│  ┌───────────────────────────┐ │
│  │                           │ │
│  │  이 인사이트에 대한        │ │  ← 플레이스홀더
│  │  생각을 자유롭게 적어보세요│ │
│  │                           │ │
│  │                           │ │
│  │                           │ │
│  └───────────────────────────┘ │
│                                 │
│  자동 저장됨                     │  ← 저장 상태
│                                 │
│                                 │
└─────────────────────────────────┘
```

#### 페이지 나갈 때 - 피드백 팝업 (오늘 인사이트만)

```
┌─────────────────────────────────┐
│                                 │
│  ╔═══════════════════════════╗ │
│  ║                           ║ │
│  ║  오늘의 인사이트           ║ │  ← 팝업
│  ║  도움이 되었나요?          ║
│  ║                           ║ │
│  ║   👍        👎            ║ │  ← 피드백 버튼
│  ║   예       아니오          ║ │
│  ║                           ║ │
│  ║        [닫기]              ║ │
│  ║                           ║ │
│  ╚═══════════════════════════╝ │
│                                 │
└─────────────────────────────────┘
```

#### Visual Specifications

**네비게이션 바 (Navigation Bar)**
- Height: 56px
- 뒤로가기 버튼: SF Symbols chevron.left
- 메뉴: 3-dot (⋯)
- Background: 반투명

**날짜 (Date)**
- Typography: SF Pro, 15pt, Regular
- Color: Secondary label
- Spacing: 32px from top
- Format: "YYYY년 M월 D일" (한글) / "Month D, YYYY" (영어)

**메인 인사이트 (Main Insight)**
- Typography: SF Pro Display, 28pt, Semibold (한글: 시스템 Bold)
- Line height: 1.2
- Max width: 343px (iPhone SE)
- Spacing: 40px bottom

**구분선 (Dividers)**
- Height: 1px
- Color: Separator
- Opacity: 0.3

**섹션 헤더 (Section Headers)**
- Typography: SF Pro Display, 20pt, Semibold
- Spacing: 24px top, 16px bottom
- 한글/영어:
  - "Trend Signal" / "Trend Signal"
  - "Why it matters" / "Why it matters"
  - "Key Question" / "Key Question"
  - "My Insight" / "My Insight"

**Trend Signal**
- Title: SF Pro, 17pt, Medium
- Description: SF Pro, 15pt, Regular, Secondary
- Spacing: 20px between items
- 불릿 없이 깔끔한 리스트

**본문 텍스트 (Body Text)**
- Typography: SF Pro, 17pt, Regular
- Line height: 1.5
- Color: Label
- Max width: 343px

**질문 블록 (Question Block)**
- Background: 미묘한 fill (system gray 6)
- Padding: 20px
- Corner radius: 12px
- Typography: SF Pro, 17pt, Medium

**노트 입력란 (Note Input)**
- Background: Secondary background (#F2F2F7 light / #1C1C1E dark)
- Padding: 16px
- Corner radius: 12px
- Min height: 120px
- Max height: 300px (스크롤 가능)
- Typography: SF Pro, 17pt, Regular
- Placeholder: Secondary label color
- Border: None (미니멀)
- Auto-save indicator: SF Pro, 13pt, Secondary label
  - Text: "자동 저장됨" / "Auto-saved"
  - Appears 1s after typing stops
  - Fades out after 2s

**피드백 팝업 (Feedback Popup)**
- Appears: 오늘 인사이트 상세 페이지에서 뒤로가기 시
- Condition: 하루 1회만 표시
- Background: System background with blur
- Size: 280x200px (centered)
- Corner radius: 16px
- Shadow: Elevated
- Title: SF Pro Display, 20pt, Semibold
- Buttons:
  - Size: 64x64px each
  - Spacing: 40px between
  - Typography: SF Pro, 15pt, Regular
  - Icons: 32pt emoji
  - Active: Scale + haptic
- Close button: SF Pro, 17pt, Regular
  - Text: "닫기" / "Close"

**스크롤 동작 (Scroll Behavior)**
- 부드러운 네이티브 iOS 느낌
- 스프링 바운스
- 스크롤 인디케이터 자동 숨김

---

### 3. Bookmarks Screen

#### Mobile Layout

```
┌─────────────────────────────────┐
│                                 │
│  ←  북마크                      │  ← 네비게이션
│                                 │
│                                 │
│  저장한 인사이트                 │  ← 타이틀
│  5개 항목                       │     서브타이틀
│                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                 │
│  2026년 1월 23일                │  ← 카드 1
│                                 │
│  "요즘 브랜드는 혜택보다          │
│   선택 이유를 설계한다"          │
│                                 │
│  브랜드 · 스토리텔링 · 가치소비   │
│                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                 │
│  2026년 1월 20일                │  ← 카드 2
│                                 │
│  "Z세대는 광고를                │
│   콘텐츠로 소비한다"             │
│                                 │
│  콘텐츠 · Z세대 · 플랫폼         │
│                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                 │
│  2026년 1월 18일                │  ← 카드 3
│                                 │
│  "짧은 영상이 길어지고,          │
│   긴 글이 짧아진다"              │
│                                 │
│  플랫폼 · 콘텐츠 · 포맷          │
│                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                 │
└─────────────────────────────────┘
```

#### Visual Specifications

**타이틀 섹션 (Title Section)**
- Title: SF Pro Display, 34pt, Bold
- Subtitle: SF Pro, 15pt, Regular, Secondary
- Spacing: 8px between
- 한글/영어: "저장한 인사이트" / "Saved Insights", "개 항목" / "items"

**북마크 카드 (Bookmark Cards)**
- Padding: 20px vertical
- 날짜: SF Pro, 13pt, Regular, Secondary
- 인사이트: SF Pro Display, 20pt, Semibold
- 키워드: SF Pro, 15pt, Regular, · 으로 구분
- 탭 → 상세 페이지로 이동
- 왼쪽 스와이프 → 삭제 옵션

**리스트 스타일 (List Style)**
- 깔끔하고 미니멀한 구분선
- 네이티브 iOS 리스트 느낌
- 카드 배경 없음
- 구분선 + 여백만으로 구성

---

## Design Specifications

### Language Support

**기본 언어: 한글**
- 앱 기본 언어는 한글
- 사용자 시스템 설정 자동 감지
- 메뉴에서 언어 전환 가능

**지원 언어**
- 한국어 (기본)
- English (선택 가능)

**언어 전환 위치**
- 헤더 우측 메뉴 (⋯) → "언어 / Language"
- 설정은 로컬 스토리지에 저장
- 앱 재시작 없이 즉시 적용

**번역 가이드**
| 한국어 | English |
|--------|---------|
| AI 인사이트 캘린더 | AI Insight Calendar |
| 저장한 인사이트 | Saved Insights |
| Trend Signal | Trend Signal |
| Why it matters | Why it matters |
| Key Question | Key Question |
| My Insight | My Insight |
| 자세히 보기 | View Details |
| 북마크 | Bookmarks |
| 도움이 되었나요? | Was this helpful? |
| 예 / 아니오 | Yes / No |

---

### Typography Scale

**SF Pro Display (헤드라인)**
- 34pt Bold — 화면 타이틀
- 28pt Semibold — 메인 인사이트
- 20pt Semibold — 섹션 헤더

**SF Pro (본문)**
- 17pt Medium — 강조 텍스트
- 17pt Regular — 본문 텍스트
- 15pt Regular — 보조 텍스트
- 13pt Regular — 캡션

**한글 폰트**
- iOS: SF Pro 기본 지원 (한글 포함)
- 대체: 시스템 기본체 (Apple SD Gothic Neo)
- Bold weight는 Semibold로 렌더링

**Line Height**
- Headlines: 1.1 - 1.2
- Body: 1.5

### Color System

**라이트 모드 (Light Mode)**
- Label: #000000
- Secondary Label: #8E8E93
- Tertiary Label: #C7C7CC
- Background: #FFFFFF
- Secondary Background: #F2F2F7
- Separator: rgba(60, 60, 67, 0.29)

**다크 모드 (Dark Mode)**
- Label: #FFFFFF
- Secondary Label: #8E8E93
- Tertiary Label: #48484A
- Background: #000000
- Secondary Background: #1C1C1E
- Separator: rgba(84, 84, 88, 0.6)

### Spacing Scale

4px 그리드 기반:
- 4px — Tight
- 8px — Close
- 12px — Comfortable
- 16px — Standard
- 20px — Relaxed
- 24px — Loose
- 32px — Section
- 40px — Major section

### Corner Radius

- 12px — 표준 카드, 버튼
- 16px — 바텀 시트, 모달
- 22px — 앱 아이콘 (1024x1024)

### Shadows & Elevation

**미묘함 (Cards)**
- Offset: 0, 1px
- Blur: 3px
- Color: rgba(0, 0, 0, 0.1)

**떠있음 (Sheets)**
- Offset: 0, 8px
- Blur: 16px
- Color: rgba(0, 0, 0, 0.15)

### Animations

**스프링 커브 (Spring Curve)** (iOS Native)
- Response: 0.4
- Damping: 0.8

**지속 시간 (Durations)**
- Quick: 0.2s — 미세 인터랙션
- Standard: 0.3s — 전환
- Relaxed: 0.4s — 전체 화면

---

## User Flows

### 신규 사용자 여정

```
랜딩
   ↓ (즉시, 회원가입 불필요)
캘린더 보기
   ↓ (날짜 탭)
프리뷰 시트 등장
   ↓ (프리뷰 탭)
전체 인사이트 읽기
   ↓ (선택 사항)
노트 작성
   ↓ (뒤로가기)
피드백 팝업 (오늘 인사이트만)
   ↓
피드백 제출 or 닫기
```

**소요 시간: 1-2분**  
**탭 횟수: 3-5회**

---

### 일일 사용자 여정

```
알림 도착
   ↓
앱 열기
   ↓ (오늘 자동 표시)
프리뷰 등장
   ↓ (프리뷰 탭)
인사이트 읽기
   ↓ (선택 사항)
생각 노트 작성
   ↓ (뒤로가기)
피드백 팝업
   ↓
피드백 제출
```

**소요 시간: 1-3분**  
**탭 횟수: 2-4회**

---

### 과거 인사이트 탐색 + 노트 확인

```
메인 화면
   ↓ (캘린더 스와이프)
월 이동
   ↓ (날짜 탭)
인사이트 보기
   ↓
작성했던 노트 확인 or 새로 작성
   ↓ (뒤로가기)
다른 날짜 탐색 (피드백 팝업 없음)
```

**소요 시간: 5-10분**  
**탭 횟수: 3-10회**

---

### 노트 작성 플로우 (상세)

```
인사이트 상세 페이지
   ↓ (스크롤 다운)
"My Insight" 섹션 도달
   ↓ (노트 입력란 탭)
키보드 올라옴
   ↓
생각 입력
   ↓ (타이핑 중단 1초 후)
"자동 저장됨" 표시
   ↓ (2초 후 페이드 아웃)
계속 입력 or 페이지 나가기
```

**저장**: 로컬 스토리지, 날짜별 관리

---

## Responsive Strategy

### Mobile First 접근

**중단점 (Breakpoints)**
- Mobile: 375px (iPhone SE 기준)
- Tablet: 768px
- Desktop: 1024px+

---

### Mobile (375px - 767px)

**레이아웃 (Layout)**
- 단일 컬럼
- 전체 너비 컴포넌트
- 세로 스크롤
- 바텀 시트 인터랙션

**캘린더 (Calendar)**
- 7x5 그리드
- 44x44px 셀 (터치 친화적)
- 308px 전체 너비 (중앙 정렬)

**콘텐츠 (Content)**
- Max width: 343px (20px 여백)
- Typography: 가독성 최적화
- 넉넉한 간격

---

### Tablet (768px - 1023px)

**레이아웃 (Layout)**
- 여전히 단일 컬럼
- Max width: 600px (중앙 정렬)
- 여백 증가

**캘린더 (Calendar)**
- 64x64px 셀 (더 크게)
- 448px 전체 너비

**콘텐츠 (Content)**
- Max width: 560px
- 약간 큰 타이포그래피
- 더 많은 여백

---

### Desktop (1024px+)

**레이아웃 전환 (Layout Shift)**

```
┌────────────────────────────────────────────┐
│         AI 인사이트 캘린더              ⋯   │
├──────────────────┬─────────────────────────┤
│                  │                         │
│  2026년 1월      │  2026년 1월 23일        │
│                  │                         │
│  월 화 수 목 금   │  "요즘 브랜드는          │
│  1  2  3  4  5   │   혜택보다 선택 이유를"  │
│  6  7  8  9 10   │                         │
│ 11 12 13 14 15   │  Trend Signal           │
│ 16 17 18 19 20   │  브랜드 스토리텔링...    │
│ 21 22 23 24 25   │  선택 피로감...          │
│ 26 27 28 29 30   │                         │
│                  │  Why it matters         │
│                  │  최근 소비자들은...      │
│                  │                         │
└──────────────────┴─────────────────────────┘
    (400px)              (600px)
```

**기능 (Features)**
- 2컬럼 레이아웃
- 왼쪽: 캘린더 (400px 고정)
- 오른쪽: 인사이트 상세 (600px)
- 캘린더 + 상세 항상 표시
- 날짜 클릭 → 오른쪽 패널 업데이트
- 호버 효과 활성화
- 최대 전체 너비: 1200px (중앙 정렬)

---

## Interactions

### 캘린더 날짜 탭

**모바일 (Mobile)**
- 탭 → 바텀 시트 올라옴 (스프링 애니메이션)
- 배경 dim 처리 (0.3 opacity)
- 날짜 하이라이트
- 햅틱 피드백 (라이트 임팩트)

**데스크탑 (Desktop)**
- 클릭 → 오른쪽 패널 콘텐츠 페이드 인
- 부드러운 전환 (0.3s)
- 날짜에 호버 상태

---

### 바텀 시트 (Bottom Sheet)

**제스처 (Gestures)**
- 외부 탭 → 닫힘
- 아래로 스와이프 → 닫힘  
- 시트 탭 → 상세 페이지로 이동

**애니메이션 (Animation)**
- 올라옴: 스프링 (0.4s)
- 내려감: Ease out (0.3s)
- 배경 페이드: 0.2s

---

### 노트 입력 (Note Input)

**인터랙션 (Interaction)**
- 탭 → 키보드 올라옴, 입력란 포커스
- 입력 시작 → 자동 확장 (최대 300px)
- 타이핑 중단 1초 후 → "자동 저장됨" 표시
- 2초 후 → 인디케이터 페이드 아웃
- 저장: 로컬 스토리지 (날짜별)

**기능 (Features)**
- 각 인사이트마다 개별 노트 저장
- 과거 인사이트 재방문 시 작성한 노트 표시
- 빈 노트는 플레이스홀더 표시
- 무제한 글자 수 (스크롤 가능)

---

### 피드백 팝업 (Feedback Popup)

**표시 조건 (Display Conditions)**
- 오늘 날짜 인사이트 상세 페이지에서만
- 뒤로가기 버튼 탭 시 팝업 표시
- 하루 1회만 표시 (로컬 스토리지로 추적)
- 이미 피드백 제출 시 다시 표시 안 함

**인터랙션 (Interaction)**
- 👍 또는 👎 탭 → 스케일 애니메이션 (1.0 → 0.95 → 1.0)
- 선택 시 → 색상 변경, 햅틱 피드백
- 자동으로 팝업 닫힘 (0.3s delay)
- "닫기" 버튼 → 피드백 없이 닫기
- 배경 탭 → 피드백 없이 닫기

**애니메이션 (Animation)**
- 등장: 페이드 인 + 미세한 스케일 (0.95 → 1.0), 0.3s
- 사라짐: 페이드 아웃, 0.2s
- 배경 블러 + dim (0.4 opacity)

**데이터 저장 (Data Storage)**
- 피드백 제출 → 서버 전송
- 로컬에 오늘 날짜 + 피드백 완료 표시
- 다음 날 자정 이후 초기화

---

### 월 네비게이션 (Month Navigation)

**모바일 (Mobile)**
- 좌우 스와이프 → 월 변경
- 슬라이드 애니메이션
- 월 크로스 페이드

**데스크탑 (Desktop)**
- 화살표 클릭 → 월 변경
- 키보드: 좌우 화살표

---

### 스크롤 동작 (Scroll Behavior)

**모든 화면 (All Screens)**
- 네이티브 iOS 스프링
- 부드러운 모멘텀
- 인디케이터 자동 숨김
- Pull-to-refresh (메인 화면만)

---

## Performance

### 로딩 전략 (Loading Strategy)

**초기 로드 (Initial Load)**
- 오늘의 인사이트: 우선순위
- 캘린더 스켈레톤: 즉시
- 전체: < 1초

**점진적 로딩 (Progressive Loading)**
- 스크롤 트리거 콘텐츠
- 이전 월: 온디맨드
- 이미지: 레이지 로드

**캐싱 (Caching)**
- 최근 7일: 로컬 캐시
- 오프라인 가능 (PWA)
- 서비스 워커 활성화

---

### 애니메이션 성능 (Animation Performance)

- 60fps 유지
- 하드웨어 가속
- 최소 리페인트
- 스프링 커브 네이티브 느낌

---

## Accessibility

### 터치 타겟 (Touch Targets)

- 최소: 44x44px (iOS 가이드라인)
- 캘린더 셀: 44x44px ✓
- 버튼: 최소 44px 높이 ✓
- 탭 가능 영역 간 적절한 간격

### 시각적 (Visual)

- 색상 대비: WCAG AA 준수
- 포커스 인디케이터: 명확하고 보이는
- 텍스트 크기: 기본 설정에서 가독성
- 다크 모드: 완전 지원

### 스크린 리더 (Screen Reader)

- ARIA 레이블: 포괄적
- 시맨틱 HTML: 적절한 계층
- 대체 텍스트: 모든 이미지
- 네비게이션: 논리적 탭 순서

---

## Error States

### 네트워크 오류 (Network Error)

```
┌─────────────────────────────┐
│                             │
│                             │
│    연결할 수 없습니다         │
│                             │
│    캐시된 콘텐츠를 표시합니다 │
│                             │
│    [다시 시도]               │
│                             │
│                             │
└─────────────────────────────┘
```

### 인사이트 없음 (No Insight Available)

```
┌─────────────────────────────┐
│                             │
│                             │
│    이 날짜의 인사이트 없음    │
│                             │
│    곧 확인해보세요           │
│                             │
│                             │
└─────────────────────────────┘
```

### 빈 북마크 (Empty Bookmarks)

```
┌─────────────────────────────┐
│                             │
│    북마크                    │
│                             │
│                             │
│    저장한 인사이트가 없습니다 │
│                             │
│    인사이트에서 ⋯를 탭하여   │
│    여기에 저장하세요         │
│                             │
│                             │
└─────────────────────────────┘
```

**원칙 (Principles)**
- 명확하고 간결한 메시지
- 가능한 경우 실행 가능하게
- 전문 용어나 오류 코드 없음
- 우아한 성능 저하

---

## Next Steps

**와이어프레임 완료 후:**

1. **디자인 시스템 (Design System)**
   - 컬러 팔레트 정의
   - 타이포그래피 스케일 최종화
   - Figma 컴포넌트 라이브러리

2. **고화질 프로토타입 (High-Fidelity Prototype)**
   - 픽셀 퍼펙트 목업
   - 인터랙티브 프로토타입
   - 사용자 테스트

3. **개발 핸드오프 (Development Handoff)**
   - 디자인 토큰 추출
   - 컴포넌트 명세서
   - 에셋 준비

---

> **버전 (Version)**: 1.0 MVP  
> **마지막 업데이트 (Last Updated)**: 2026년 1월 22일  
> **기반 문서 (Based On)**: service-plan.md  
> **디자인 철학 (Design Philosophy)**: Apple 미니멀리즘, 한글 우선 + 영어 지원
