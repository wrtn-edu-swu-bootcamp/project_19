# 인사이트 생성 스크립트

## 오늘 인사이트 생성하기

### 방법 1: npm 스크립트 사용 (권장)

```bash
# 1. 개발 서버 실행 (터미널 1)
npm run dev

# 2. 다른 터미널에서 실행 (터미널 2)
npm run generate:today
```

### 방법 2: curl 사용

개발 서버가 실행 중일 때:

```bash
curl -X POST http://localhost:3000/api/insights/generate
```

### 방법 3: 브라우저에서 직접 호출

개발 서버가 실행 중일 때 브라우저에서:
- 개발자 도구 → Console에서:
```javascript
fetch('/api/insights/generate', { method: 'POST' })
  .then(r => r.json())
  .then(console.log)
```

## 환경 변수 확인

`.env.local` 파일에 다음 변수가 설정되어 있어야 합니다:

```bash
GEMINI_API_KEY=your-gemini-api-key
DATABASE_URL=postgres://...  # 선택사항 (로컬 개발 시)
```

## 문제 해결

### "API key not valid" 오류
- Google AI Studio (https://aistudio.google.com)에서 API 키를 발급받으세요
- `.env.local` 파일에 `GEMINI_API_KEY=your-key` 형식으로 추가하세요
- 개발 서버를 재시작하세요

### "연결 실패" 오류
- 개발 서버가 실행 중인지 확인하세요 (`npm run dev`)
- 포트 3000이 사용 중인지 확인하세요

### "인사이트가 이미 존재합니다"
- 오늘 날짜의 인사이트가 이미 생성되어 있습니다
- 다른 날짜의 인사이트를 생성하려면 `/api/insights/seed` 엔드포인트를 사용하세요
