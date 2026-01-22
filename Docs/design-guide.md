# AI Insight Calendar - Design Guide

> **Version**: 1.0 MVP  
> **Last Updated**: 2026년 1월 22일  
> **Based On**: service-plan.md, wireframe.md

---

## 목차

1. [브랜드 아이덴티티](#브랜드-아이덴티티)
2. [컬러 시스템](#컬러-시스템)
3. [타이포그래피](#타이포그래피)
4. [레이아웃 & 스페이싱](#레이아웃--스페이싱)
5. [컴포넌트 라이브러리](#컴포넌트-라이브러리)
6. [아이콘 & 일러스트레이션](#아이콘--일러스트레이션)
7. [애니메이션 & 모션](#애니메이션--모션)
8. [그림자 & 이펙트](#그림자--이펙트)
9. [다크 모드](#다크-모드)
10. [접근성](#접근성)
11. [개발 핸드오프](#개발-핸드오프)

---

## 브랜드 아이덴티티

### 디자인 철학

**Simple is Beautiful**

우리의 디자인은 Apple의 미니멀리즘 철학을 따릅니다. 불필요한 요소를 제거하고, 본질에 집중합니다.

**핵심 원칙:**
- 절제된 표현
- 타이포그래피가 주인공
- 여백이 콘텐츠를 돋보이게
- 디테일에서 완성도

### 핵심 가치

| 가치 | 표현 방식 |
|------|----------|
| **Clarity** | 명확한 정보 계층, 직관적 UI |
| **Focus** | 핵심 콘텐츠에 집중, 방해 요소 제거 |
| **Elegance** | 세련된 타이포그래피, 미묘한 애니메이션 |
| **Consistency** | 일관된 패턴, 예측 가능한 인터랙션 |

### 톤 & 매너

**시각적 톤:**
- 미니멀하고 깔끔함
- 전문적이지만 접근하기 쉬움
- 모던하고 세련됨
- 따뜻하지만 차분함

**언어 톤:**
- 간결하고 명확함
- 전문적이되 친근함
- 가르치는 게 아닌 함께 생각하는
- 존중하는 어조

### 브랜드 키워드

- Minimal
- Thoughtful
- Elegant
- Daily
- Insightful

---

## 컬러 시스템

### 기본 팔레트

#### Light Mode

```
Primary Colors:
- Label:              #000000  (Black)
- Secondary Label:    #8E8E93  (Gray)
- Tertiary Label:     #C7C7CC  (Light Gray)

Background Colors:
- Background:         #FFFFFF  (White)
- Secondary BG:       #F2F2F7  (Off-White)
- Tertiary BG:        #FFFFFF  (White)

Separator:
- Separator:          rgba(60, 60, 67, 0.29)
```

#### Dark Mode

```
Primary Colors:
- Label:              #FFFFFF  (White)
- Secondary Label:    #8E8E93  (Gray)
- Tertiary Label:     #48484A  (Dark Gray)

Background Colors:
- Background:         #000000  (Black)
- Secondary BG:       #1C1C1E  (Near Black)
- Tertiary BG:        #2C2C2E  (Charcoal)

Separator:
- Separator:          rgba(84, 84, 88, 0.6)
```

### 시맨틱 컬러

| 용도 | Light | Dark | 사용 예시 |
|------|-------|------|----------|
| **Primary** | #000000 | #FFFFFF | 메인 텍스트, 아이콘 |
| **Secondary** | #8E8E93 | #8E8E93 | 보조 텍스트, 캡션 |
| **Success** | #34C759 | #30D158 | 저장 완료 표시 |
| **Error** | #FF3B30 | #FF453A | 에러 메시지 |
| **Warning** | #FF9500 | #FF9F0A | 경고 |
| **Link** | #007AFF | #0A84FF | 링크, 액션 |

### 컬러 사용 가이드라인

**DO:**
- 시스템 컬러를 우선 사용
- 의미에 맞는 시맨틱 컬러 사용
- 충분한 대비 확보 (WCAG AA)
- 다크 모드 대응 컬러 쌍 사용

**DON'T:**
- 커스텀 컬러 남발 금지
- 순수 블랙/화이트만 사용하지 말 것 (적절한 회색 활용)
- 의미 없는 컬러 변화 금지
- 너무 많은 컬러 사용 자제

### 접근성 (WCAG AA)

모든 텍스트는 배경과 최소 4.5:1 대비율 유지:

| 조합 | 대비율 | 평가 |
|------|--------|------|
| Label / Background | 21:1 | ✅ Excellent |
| Secondary / Background | 4.6:1 | ✅ Pass |
| Tertiary / Background | 3.9:1 | ⚠️ Large text only |

---

## 타이포그래피

### 폰트 패밀리

**Primary Font: SF Pro**
- SF Pro Display: 헤드라인, 타이틀
- SF Pro Text: 본문, 캡션

**한글 지원:**
- iOS: SF Pro 기본 지원 (한글 포함)
- Fallback: Apple SD Gothic Neo (시스템 기본체)

### 타입 스케일

| 이름 | 폰트 | 크기 | 사용처 |
|------|------|------|--------|
| **Large Title** | SF Pro Display Bold | 34pt | 화면 타이틀 |
| **Title 1** | SF Pro Display Semibold | 28pt | 메인 인사이트 |
| **Title 2** | SF Pro Display Semibold | 22pt | 섹션 제목 (보조) |
| **Title 3** | SF Pro Display Semibold | 20pt | 섹션 헤더 |
| **Headline** | SF Pro Semibold | 17pt | 강조 텍스트 |
| **Body** | SF Pro Regular | 17pt | 본문 텍스트 |
| **Callout** | SF Pro Regular | 16pt | 중요 본문 |
| **Subheadline** | SF Pro Regular | 15pt | 보조 텍스트 |
| **Footnote** | SF Pro Regular | 13pt | 캡션, 주석 |
| **Caption 1** | SF Pro Regular | 12pt | 매우 작은 텍스트 |
| **Caption 2** | SF Pro Regular | 11pt | 최소 크기 |

### Line Height

```css
/* Headlines */
Large Title:  1.1
Title 1-3:    1.2
Headline:     1.2

/* Body */
Body:         1.5
Callout:      1.4
Subheadline:  1.4
Footnote:     1.3
Caption:      1.2
```

### Letter Spacing

SF Pro는 기본 커닝이 최적화되어 있으므로 별도 조정 불필요.

**예외:**
- All Caps 사용 시: +0.02em
- 매우 큰 타이틀 (40pt+): -0.01em

### 타이포그래피 사용 예시

**인사이트 카드:**
```
날짜:      Footnote, Secondary Label
인사이트:   Title 1, Label
키워드:     Subheadline, Secondary Label
```

**상세 페이지:**
```
날짜:           Subheadline, Secondary Label
메인 인사이트:   Title 1, Label
섹션 헤더:      Title 3, Label
본문:          Body, Label
노트 입력:      Body, Label
```

### 한글 폰트 처리

**Bold 처리:**
- SF Pro Bold → 한글은 Semibold로 렌더링
- 시각적 무게감 유지

**가독성:**
- 최소 15pt 이상 권장 (본문 기준)
- Line height 1.5 유지
- 충분한 자간

---

## 레이아웃 & 스페이싱

### 그리드 시스템

**4px 베이스 그리드**

모든 요소는 4px의 배수로 정렬:

```
Base: 4px
Scale: 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 48, 56, 64...
```

### 간격 스케일

| 이름 | 값 | 사용 예시 |
|------|-----|----------|
| **XXS** | 4px | 아이콘-텍스트 간격 |
| **XS** | 8px | 키워드 태그 간격 |
| **S** | 12px | 카드 내부 요소 간격 |
| **M** | 16px | 표준 패딩 |
| **L** | 20px | 카드 패딩 |
| **XL** | 24px | 섹션 간격 |
| **XXL** | 32px | 주요 섹션 간격 |
| **XXXL** | 40px | 화면 단위 간격 |

### 반응형 레이아웃

#### Breakpoints

```
Mobile:   375px - 767px   (기본)
Tablet:   768px - 1023px
Desktop:  1024px+
```

#### Mobile (375px - 767px)

```
Container:
- Max Width: 100%
- Padding: 20px (left/right)
- Content Width: 335px

Calendar:
- Grid: 7x5
- Cell: 44x44px
- Total: 308px (centered)

Card:
- Max Width: 335px
- Padding: 20px
- Corner Radius: 12px
```

#### Tablet (768px - 1023px)

```
Container:
- Max Width: 600px (centered)
- Padding: 24px

Calendar:
- Cell: 64x64px
- Total: 448px

Card:
- Max Width: 560px
- Padding: 24px
```

#### Desktop (1024px+)

```
Container:
- Max Width: 1200px (centered)
- Layout: 2-column

Left Column (Calendar):
- Width: 400px (fixed)

Right Column (Content):
- Width: 600px (fixed)

Gap: 200px
```

### Safe Area & Padding

**iOS Safe Area:**
- Top: 44px (status bar)
- Bottom: 34px (home indicator)
- Sides: 0px

**최소 터치 영역:**
- 44x44px (Apple 권장)
- 버튼, 링크, 탭 영역 모두 준수

---

## 컴포넌트 라이브러리

### 1. 인사이트 카드 (프리뷰)

**Bottom Sheet Preview Card**

```
Dimensions:
- Width: 100% (minus 32px margin)
- Min Height: 240px
- Max Height: 40% viewport
- Corner Radius: 16px (top only)
- Padding: 24px horizontal, 20px vertical

Elements:
1. Drag Handle
   - Size: 36x5px
   - Color: Tertiary Label
   - Center aligned

2. Date
   - Typography: Footnote, Regular
   - Color: Secondary Label

3. Insight
   - Typography: Title 3, Semibold
   - Color: Label
   - Max Lines: 2 (ellipsis)
   - Spacing: 16px from date

4. Keywords
   - Typography: Subheadline, Regular
   - Color: Secondary Label
   - Separator: ·
   - Spacing: 12px from insight

5. CTA Button
   - Text: "자세히 보기 →"
   - Typography: Body, Medium
   - Color: Link
   - No background
   - Spacing: 20px from keywords

Background:
- Light: System background with blur
- Dark: Secondary background with blur
- Backdrop: 40% opacity dim

Shadow:
- Offset: (0, 8px)
- Blur: 16px
- Color: rgba(0,0,0,0.15)
```

**상태:**
- Default: 화면 밖 (아래)
- Appearing: 스프링 애니메이션으로 올라옴
- Active: 사용자 인터랙션 가능
- Dismissing: 아래로 슬라이드

### 2. 캘린더 셀

**Calendar Date Cell**

```
Dimensions:
- Size: 44x44px (mobile)
- Size: 64x64px (tablet+)

Typography:
- Font: SF Pro, 17pt, Regular
- Color: Label (기본)
- Color: Secondary Label (다른 월)

States:
1. Default
   - Background: None
   - Text: Label

2. Today
   - Border: 1px solid, Label
   - Border Radius: 50%
   - Text: Label

3. Selected
   - Background: Label
   - Text: Background (inverted)
   - Border Radius: 50%

4. Has Insight
   - Dot: 4px circle
   - Position: below number (4px gap)
   - Color: Label

5. Disabled (past/future)
   - Text: Tertiary Label
   - No interaction

Interaction:
- Tap: Scale (0.95) + Haptic
- Highlight: 10% opacity overlay
```

### 3. 바텀 시트

**Bottom Sheet Base**

```
Behavior:
- Entry: Slide up from bottom
- Dismiss: Swipe down or tap outside
- Scrollable: If content > viewport

Backdrop:
- Color: rgba(0,0,0,0.4)
- Tap: Dismiss sheet

Drag Handle:
- Required: Yes
- Style: 36x5px rounded pill
- Color: Tertiary Label
- Position: Centered, 12px from top

Corner Radius:
- Top: 16px
- Bottom: 0px

Animation:
- Spring curve (0.4s, 0.8 damping)
- Smooth momentum scrolling
```

### 4. 버튼

#### Primary Button (링크 스타일)

```
Dimensions:
- Height: 44px (minimum)
- Padding: 0px (no background)

Typography:
- Font: SF Pro, 17pt, Medium
- Color: Link

States:
- Default: Link color
- Hover: Link color, 80% opacity
- Active: Scale(0.95)
- Disabled: Secondary Label

Icon:
- Size: 20pt
- Position: Right (4px gap)
- Optional: →, chevron.right
```

#### Secondary Button (텍스트)

```
Dimensions:
- Height: 44px
- Padding: 0px

Typography:
- Font: SF Pro, 17pt, Regular
- Color: Label

States:
- Default: Label color
- Hover: Label, 80% opacity
- Active: Scale(0.95)
- Disabled: Tertiary Label
```

#### Icon Button

```
Dimensions:
- Size: 44x44px (touch target)
- Icon: 24pt (centered)

States:
- Default: Label
- Hover: 80% opacity
- Active: Scale(0.95), Haptic
- Disabled: Tertiary Label

Examples:
- Back: chevron.left
- Menu: ellipsis
- Bookmark: star / star.fill
```

### 5. 입력란 (노트)

**Text Input Area**

```
Dimensions:
- Width: 100% (minus padding)
- Min Height: 120px
- Max Height: 300px (scrollable)
- Padding: 16px
- Corner Radius: 12px

Typography:
- Font: SF Pro, 17pt, Regular
- Color: Label
- Line Height: 1.5

Background:
- Light: Secondary Background
- Dark: Tertiary Background

Border:
- None (미니멀)

Placeholder:
- Text: "이 인사이트에 대한 생각을 자유롭게 적어보세요"
- Color: Secondary Label
- Style: Italic

Auto-save Indicator:
- Text: "자동 저장됨"
- Position: Below input (4px gap)
- Typography: Footnote, Regular
- Color: Secondary Label
- Animation: Fade in (1s) → Stay (2s) → Fade out

States:
- Default: 기본 배경
- Focus: 키보드 올라옴, 자동 스크롤
- Typing: 실시간 저장 (1초 debounce)
- Saved: 인디케이터 표시
```

### 6. 피드백 팝업

**Feedback Modal**

```
Dimensions:
- Size: 280x200px
- Corner Radius: 16px
- Centered on screen

Layout:
1. Title
   - Text: "오늘의 인사이트\n도움이 되었나요?"
   - Typography: Title 3, Semibold
   - Alignment: Center
   - Spacing: 24px from top

2. Buttons Container
   - Layout: Horizontal, 2 buttons
   - Gap: 40px
   - Centered

3. Feedback Button
   - Size: 64x64px each
   - Icon: 32pt emoji (👍 👎)
   - Label below icon
   - Typography: Subheadline, Regular

4. Close Button
   - Text: "닫기"
   - Typography: Body, Regular
   - Color: Secondary Label
   - Position: Bottom, 16px padding

Background:
- Light: White with blur
- Dark: Secondary Background with blur

Backdrop:
- Color: rgba(0,0,0,0.4)
- Blur: 20px

Shadow:
- Offset: (0, 8px)
- Blur: 24px
- Color: rgba(0,0,0,0.2)

Animation:
- Entry: Fade + Scale (0.95 → 1.0)
- Exit: Fade out
- Duration: 0.3s

Interaction:
- 버튼 탭: Scale(0.95) + Haptic + 선택
- 자동 닫힘: 0.3초 후
- 외부 탭: 즉시 닫힘
```

### 7. 네비게이션 바

**Top Navigation Bar**

```
Dimensions:
- Height: 56px
- Padding: 0px 20px

Background:
- Translucent blur
- Light: 80% white
- Dark: 80% black

Layout:
1. Left Item (Back Button)
   - Size: 44x44px
   - Icon: chevron.left, 20pt
   - Color: Label

2. Center Title
   - Typography: Body, Semibold
   - Color: Label
   - Optional (대부분 비움)

3. Right Item (Menu)
   - Size: 44x44px
   - Icon: ellipsis, 20pt
   - Color: Label

Border:
- Bottom: 1px separator
- Color: Separator

Shadow:
- None (미니멀)

Behavior:
- Sticky: 스크롤 시 상단 고정
- Blur: 뒤 콘텐츠 비침
```

---

## 아이콘 & 일러스트레이션

### SF Symbols

**기본 스타일: Regular (Line)**

주요 아이콘:

| 기능 | 아이콘 | 사이즈 |
|------|-------|--------|
| 뒤로가기 | chevron.left | 20pt |
| 메뉴 | ellipsis | 20pt |
| 북마크 (빈) | star | 24pt |
| 북마크 (찬) | star.fill | 24pt |
| 캘린더 | calendar | 24pt |
| 체크 | checkmark | 20pt |
| 닫기 | xmark | 20pt |
| 설정 | gearshape | 24pt |
| 공유 | square.and.arrow.up | 24pt |

### 아이콘 사이즈

```
Extra Small:  16pt  (inline 아이콘)
Small:        20pt  (네비게이션)
Medium:       24pt  (기본)
Large:        32pt  (주요 액션)
Extra Large:  40pt  (빈 상태)
```

### 커스텀 아이콘

**필요 시에만 제작:**
- SF Symbols에 없는 경우
- 브랜드 특화 아이콘

**제작 가이드:**
- 2px stroke (outline)
- 8x8px grid 기반
- 둥근 끝 (rounded cap)
- 미니멀한 형태
- SF Symbols 스타일 유지

### 아이콘 컬러

```
Primary:    Label (검은색/흰색)
Secondary:  Secondary Label (회색)
Accent:     Link (파란색)
Inactive:   Tertiary Label (연회색)
```

**DO:**
- 단색 사용
- 의미에 맞는 컬러 선택
- 충분한 크기 (최소 20pt)

**DON'T:**
- 다색 아이콘 금지
- 복잡한 디테일 지양
- 너무 작은 사이즈 금지

---

## 애니메이션 & 모션

### 애니메이션 원칙

**느낌:**
- 부드럽고 자연스러움
- 예측 가능한 움직임
- 목적이 명확함
- 방해하지 않음

### 스프링 커브 (iOS Native)

```swift
Spring Animation Parameters:
- Response: 0.4
- Damping: 0.8
- Initial Velocity: 0
```

```css
/* CSS 근사치 */
transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1.0);
```

### 지속 시간 (Duration)

| 타입 | 시간 | 사용 예시 |
|------|------|----------|
| **Quick** | 0.2s | 버튼 피드백, 아이콘 변화 |
| **Standard** | 0.3s | 페이지 전환, 모달 |
| **Relaxed** | 0.4s | 바텀 시트, 복잡한 전환 |

### 트랜지션 타입

#### 1. Fade (페이드)

```
Use: 콘텐츠 교체, 오버레이
Timing: 0.2-0.3s
Easing: Ease in-out
```

#### 2. Slide (슬라이드)

```
Use: 페이지 전환, 바텀 시트
Direction: Up/Down, Left/Right
Timing: 0.3-0.4s
Easing: Spring
```

#### 3. Scale (크기)

```
Use: 버튼 피드백, 모달
Range: 0.95 - 1.0
Timing: 0.2s
Easing: Spring
```

#### 4. Blur (블러)

```
Use: 백드롭, 포커스 효과
Range: 0 - 20px
Timing: 0.3s
Easing: Linear
```

### 애니메이션 사용 예시

**바텀 시트 등장:**
```
1. 백드롭 페이드 인 (0.2s)
2. 시트 슬라이드 업 (0.4s, spring)
3. 동시: 콘텐츠 페이드 인 (0.3s)
```

**날짜 선택:**
```
1. 셀 스케일 (0.95, 0.1s)
2. 햅틱 피드백
3. 백그라운드 채우기 (0.2s)
4. 바텀 시트 등장 (0.4s)
```

**피드백 제출:**
```
1. 버튼 스케일 (0.95 → 1.0, 0.2s)
2. 햅틱 피드백
3. 컬러 변경 (0.2s)
4. 모달 페이드 아웃 (0.3s)
```

### 성능 최적화

**DO:**
- Transform 속성 사용 (scale, translate)
- Opacity 사용
- Will-change 적절히 활용
- 60fps 유지

**DON'T:**
- Width/Height 애니메이션 금지
- 너무 많은 동시 애니메이션 금지
- Top/Left 애니메이션 금지 (대신 translate 사용)

---

## 그림자 & 이펙트

### Elevation 레벨

#### Level 1: Subtle (카드)

```
Box Shadow:
- Offset: (0, 1px)
- Blur: 3px
- Color: rgba(0, 0, 0, 0.1)

Use: 
- 인사이트 카드
- 일반 카드 컴포넌트
```

#### Level 2: Elevated (바텀 시트)

```
Box Shadow:
- Offset: (0, 8px)
- Blur: 16px
- Color: rgba(0, 0, 0, 0.15)

Use:
- 바텀 시트
- 드롭다운 메뉴
```

#### Level 3: Modal (팝업)

```
Box Shadow:
- Offset: (0, 16px)
- Blur: 24px
- Color: rgba(0, 0, 0, 0.2)

Use:
- 피드백 팝업
- 중요 모달
```

### Blur 효과

**Backdrop Blur:**
```
Blur Radius: 20px
Use: 
- 네비게이션 바 배경
- 바텀 시트 배경
- 모달 배경
```

**Backdrop Dim:**
```
Overlay: rgba(0, 0, 0, 0.4)
Use:
- 모달 백드롭
- 바텀 시트 뒤 화면
```

### 반투명 처리

**배경 투명도:**
```
Navigation Bar:    80% opacity
Bottom Sheet:      90% opacity
Modal Background:  95% opacity
```

**Material 효과:**
```
/* iOS 스타일 Material */
background: blur(20px)
background-color: rgba(255, 255, 255, 0.8)  /* Light */
background-color: rgba(28, 28, 30, 0.8)     /* Dark */
```

---

## 다크 모드

### 컬러 변환 테이블

| 요소 | Light Mode | Dark Mode |
|------|------------|-----------|
| **Primary Text** | #000000 | #FFFFFF |
| **Secondary Text** | #8E8E93 | #8E8E93 |
| **Tertiary Text** | #C7C7CC | #48484A |
| **Background** | #FFFFFF | #000000 |
| **Secondary BG** | #F2F2F7 | #1C1C1E |
| **Tertiary BG** | #FFFFFF | #2C2C2E |
| **Separator** | rgba(60,60,67,0.29) | rgba(84,84,88,0.6) |
| **Link** | #007AFF | #0A84FF |
| **Success** | #34C759 | #30D158 |
| **Error** | #FF3B30 | #FF453A |

### 컴포넌트별 다크 모드

#### 인사이트 카드
```
Light:
- Background: White
- Text: Black
- Keywords: Gray

Dark:
- Background: #1C1C1E
- Text: White
- Keywords: Gray (동일)
```

#### 노트 입력란
```
Light:
- Background: #F2F2F7
- Text: Black
- Border: None

Dark:
- Background: #2C2C2E
- Text: White
- Border: None
```

#### 바텀 시트
```
Light:
- Background: White blur
- Backdrop: rgba(0,0,0,0.4)

Dark:
- Background: #1C1C1E blur
- Backdrop: rgba(0,0,0,0.6)
```

### 다크 모드 전환

**자동 감지:**
```javascript
// System preference 감지
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
```

**수동 전환:**
- 설정 메뉴에서 선택 가능
- 시스템 설정 무시 옵션
- 로컬 스토리지에 저장

**전환 애니메이션:**
```
Duration: 0.3s
Easing: Ease in-out
Transition: All colors simultaneously
```

---

## 접근성

### 컬러 대비

**WCAG AA 준수:**

모든 텍스트는 배경과 최소 4.5:1 대비율:

| 조합 | 대비율 | 결과 |
|------|--------|------|
| Label / Background | 21:1 | ✅ AAA |
| Secondary / Background | 4.6:1 | ✅ AA |
| Tertiary / Background | 3.9:1 | ⚠️ Large text only |
| Link / Background | 4.5:1 | ✅ AA |

**대형 텍스트 예외:**
- 18pt+ Bold
- 24pt+ Regular
- 최소 3:1 대비율

### 터치 타겟 크기

**최소 크기: 44x44px (iOS HIG)**

모든 인터랙티브 요소:
```
Button:        44px height minimum
Icon Button:   44x44px
Calendar Cell: 44x44px
Link:          44px height minimum
```

**간격:**
- 터치 영역 간 최소 8px 간격
- 밀집된 영역 피하기

### 스크린 리더 지원

**ARIA 레이블:**

```html
<!-- 날짜 선택 -->
<button aria-label="1월 23일, 인사이트 있음">
  23
  <span class="dot" aria-hidden="true"></span>
</button>

<!-- 인사이트 카드 -->
<article aria-labelledby="insight-title">
  <h2 id="insight-title">오늘의 인사이트</h2>
  <p>요즘 브랜드는 혜택보다 선택 이유를 설계한다</p>
</article>

<!-- 노트 입력 -->
<label for="note-input">인사이트에 대한 생각</label>
<textarea 
  id="note-input"
  aria-label="인사이트 노트 작성"
  placeholder="자유롭게 적어보세요">
</textarea>
```

**키보드 네비게이션:**
- Tab: 다음 요소
- Shift + Tab: 이전 요소
- Enter/Space: 활성화
- Escape: 닫기

**포커스 인디케이터:**
```css
:focus {
  outline: 2px solid #007AFF;
  outline-offset: 2px;
}
```

### 모션 감소

**Prefers Reduced Motion:**

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01s !important;
    transition-duration: 0.01s !important;
  }
}
```

사용자가 모션 감소 설정 시:
- 애니메이션 거의 즉시 완료
- 스프링 효과 제거
- 페이드만 유지 (빠르게)

---

## 개발 핸드오프

### 디자인 토큰 (JSON)

```json
{
  "colors": {
    "light": {
      "label": "#000000",
      "secondaryLabel": "#8E8E93",
      "tertiaryLabel": "#C7C7CC",
      "background": "#FFFFFF",
      "secondaryBackground": "#F2F2F7",
      "separator": "rgba(60, 60, 67, 0.29)",
      "link": "#007AFF"
    },
    "dark": {
      "label": "#FFFFFF",
      "secondaryLabel": "#8E8E93",
      "tertiaryLabel": "#48484A",
      "background": "#000000",
      "secondaryBackground": "#1C1C1E",
      "separator": "rgba(84, 84, 88, 0.6)",
      "link": "#0A84FF"
    }
  },
  "typography": {
    "largeTitle": {
      "fontFamily": "SF Pro Display",
      "fontWeight": "700",
      "fontSize": "34pt",
      "lineHeight": "1.1"
    },
    "title1": {
      "fontFamily": "SF Pro Display",
      "fontWeight": "600",
      "fontSize": "28pt",
      "lineHeight": "1.2"
    },
    "body": {
      "fontFamily": "SF Pro",
      "fontWeight": "400",
      "fontSize": "17pt",
      "lineHeight": "1.5"
    }
  },
  "spacing": {
    "xxs": "4px",
    "xs": "8px",
    "s": "12px",
    "m": "16px",
    "l": "20px",
    "xl": "24px",
    "xxl": "32px",
    "xxxl": "40px"
  },
  "borderRadius": {
    "small": "8px",
    "medium": "12px",
    "large": "16px",
    "xlarge": "22px",
    "round": "50%"
  },
  "shadows": {
    "subtle": "0 1px 3px rgba(0, 0, 0, 0.1)",
    "elevated": "0 8px 16px rgba(0, 0, 0, 0.15)",
    "modal": "0 16px 24px rgba(0, 0, 0, 0.2)"
  },
  "animations": {
    "quick": "0.2s",
    "standard": "0.3s",
    "relaxed": "0.4s",
    "spring": "cubic-bezier(0.4, 0.0, 0.2, 1.0)"
  }
}
```

### CSS 변수

```css
:root {
  /* Colors - Light Mode */
  --color-label: #000000;
  --color-secondary-label: #8E8E93;
  --color-tertiary-label: #C7C7CC;
  --color-background: #FFFFFF;
  --color-secondary-bg: #F2F2F7;
  --color-separator: rgba(60, 60, 67, 0.29);
  --color-link: #007AFF;
  
  /* Typography */
  --font-display: 'SF Pro Display', -apple-system, system-ui, sans-serif;
  --font-text: 'SF Pro', -apple-system, system-ui, sans-serif;
  
  --font-size-large-title: 34pt;
  --font-size-title1: 28pt;
  --font-size-title3: 20pt;
  --font-size-body: 17pt;
  --font-size-subheadline: 15pt;
  --font-size-footnote: 13pt;
  
  /* Spacing */
  --space-xxs: 4px;
  --space-xs: 8px;
  --space-s: 12px;
  --space-m: 16px;
  --space-l: 20px;
  --space-xl: 24px;
  --space-xxl: 32px;
  --space-xxxl: 40px;
  
  /* Border Radius */
  --radius-s: 8px;
  --radius-m: 12px;
  --radius-l: 16px;
  --radius-xl: 22px;
  --radius-round: 50%;
  
  /* Shadows */
  --shadow-subtle: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-elevated: 0 8px 16px rgba(0, 0, 0, 0.15);
  --shadow-modal: 0 16px 24px rgba(0, 0, 0, 0.2);
  
  /* Animations */
  --duration-quick: 0.2s;
  --duration-standard: 0.3s;
  --duration-relaxed: 0.4s;
  --easing-spring: cubic-bezier(0.4, 0.0, 0.2, 1.0);
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-label: #FFFFFF;
    --color-secondary-label: #8E8E93;
    --color-tertiary-label: #48484A;
    --color-background: #000000;
    --color-secondary-bg: #1C1C1E;
    --color-separator: rgba(84, 84, 88, 0.6);
    --color-link: #0A84FF;
  }
}
```

### Tailwind Config

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        label: {
          DEFAULT: '#000000',
          secondary: '#8E8E93',
          tertiary: '#C7C7CC',
        },
        background: {
          DEFAULT: '#FFFFFF',
          secondary: '#F2F2F7',
        },
        link: '#007AFF',
      },
      fontFamily: {
        display: ['SF Pro Display', 'system-ui', 'sans-serif'],
        sans: ['SF Pro', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'large-title': '34pt',
        'title-1': '28pt',
        'title-3': '20pt',
        'body': '17pt',
        'subheadline': '15pt',
        'footnote': '13pt',
      },
      spacing: {
        'xxs': '4px',
        'xs': '8px',
        's': '12px',
        'm': '16px',
        'l': '20px',
        'xl': '24px',
        'xxl': '32px',
        'xxxl': '40px',
      },
      borderRadius: {
        's': '8px',
        'm': '12px',
        'l': '16px',
        'xl': '22px',
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'elevated': '0 8px 16px rgba(0, 0, 0, 0.15)',
        'modal': '0 16px 24px rgba(0, 0, 0, 0.2)',
      },
      transitionDuration: {
        'quick': '200ms',
        'standard': '300ms',
        'relaxed': '400ms',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.4, 0.0, 0.2, 1.0)',
      },
    },
  },
  darkMode: 'class',
}
```

### 네이밍 컨벤션

**컴포넌트:**
```
PascalCase: InsightCard, CalendarCell, BottomSheet
```

**CSS 클래스:**
```
BEM: .insight-card, .insight-card__title, .insight-card--preview
```

**변수:**
```
kebab-case: --color-label, --space-xl, --radius-m
```

**파일:**
```
kebab-case: insight-card.tsx, use-calendar.ts, design-tokens.json
```

---

## 마무리

### 체크리스트

**디자인 시작 전:**
- [ ] 이 가이드 숙지
- [ ] wireframe.md 참고
- [ ] 기존 컴포넌트 재사용 우선 검토

**디자인 중:**
- [ ] 컬러는 정의된 팔레트만 사용
- [ ] 타이포그래피 스케일 준수
- [ ] 4px 그리드에 맞춰 정렬
- [ ] 최소 터치 영역 44px 확보
- [ ] 다크 모드 동시 고려

**디자인 완료 후:**
- [ ] 접근성 체크 (대비율, 스크린 리더)
- [ ] 다크 모드 확인
- [ ] 애니메이션 성능 테스트
- [ ] 디자인 토큰 추출

### 참고 자료

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [SF Symbols](https://developer.apple.com/sf-symbols/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

> **Version**: 1.0 MVP  
> **Last Updated**: 2026년 1월 22일  
> **Authors**: Design System Team  
> **Status**: Living Document (지속 업데이트)
