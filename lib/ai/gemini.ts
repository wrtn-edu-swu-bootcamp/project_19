/**
 * Gemini AI Client
 * Google Generative AI를 사용한 마케팅 인사이트 생성
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { InsightKeyword } from '@/types/insight';

// Gemini 클라이언트 초기화
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// 생성된 인사이트 타입 (DB 저장 전)
export type GeneratedInsight = {
  insight_text: string;
  keywords: InsightKeyword[];
  context: string;
  question: string;
};

/**
 * AI를 사용하여 마케팅 인사이트 생성
 * @param date - 인사이트 날짜 (YYYY-MM-DD)
 * @returns 생성된 인사이트 객체
 */
export async function generateInsight(date: string): Promise<GeneratedInsight> {
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.0-flash',
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 1024,
    },
  });

  const prompt = `오늘 날짜: ${date}

당신은 마케팅 트렌드 전문가입니다. 주니어 마케터와 마케팅 전공 대학생을 위한 실용적인 트렌드 인사이트 1개를 생성해주세요.

## 조건
1. **시의성**: 최근 2주 내에 나타난 실제 마케팅/소비자 트렌드 기반
2. **구체성**: 추상적이지 않고, 특정 현상이나 사례를 언급
3. **실용성**: 마케터가 바로 업무에 적용하거나 참고할 수 있어야 함
4. **신선함**: 이미 널리 알려진 뻔한 내용이 아닌, 새로운 관점 제시

## 참고할 트렌드 소스
- 소셜 미디어 마케팅 변화
- Z세대/알파세대 소비 행동
- 브랜드 커뮤니케이션 전략
- 콘텐츠 포맷 트렌드
- 이커머스/리테일 혁신
- AI/기술이 마케팅에 미치는 영향

## 응답 형식 (반드시 JSON으로만 응답)
\`\`\`json
{
  "insight_text": "핵심 인사이트를 1-2문장으로 명확하게 작성. 인용구 스타일로 기억에 남게 작성.",
  "keywords": [
    {"keyword": "키워드1", "description": "이 키워드가 왜 중요한지 1문장 설명"},
    {"keyword": "키워드2", "description": "이 키워드가 왜 중요한지 1문장 설명"},
    {"keyword": "키워드3", "description": "이 키워드가 왜 중요한지 1문장 설명"}
  ],
  "context": "왜 지금 이 트렌드가 중요한지 배경과 맥락을 2-3문장으로 설명. 가능하면 데이터나 사례 언급.",
  "question": "이 인사이트를 바탕으로 마케터가 자신의 브랜드에 적용할 때 고민해볼 질문"
}
\`\`\`

JSON 형식으로만 응답하세요. 다른 텍스트는 포함하지 마세요.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // JSON 추출 (코드 블록이나 순수 JSON 모두 처리)
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || 
                      text.match(/```\s*([\s\S]*?)\s*```/) ||
                      text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('AI 응답에서 JSON을 찾을 수 없습니다.');
    }
    
    const jsonStr = jsonMatch[1] || jsonMatch[0];
    const parsed = JSON.parse(jsonStr);
    
    // 필수 필드 검증
    if (!parsed.insight_text || !parsed.keywords || !parsed.context || !parsed.question) {
      throw new Error('AI 응답에 필수 필드가 누락되었습니다.');
    }
    
    // keywords 배열 검증
    if (!Array.isArray(parsed.keywords) || parsed.keywords.length === 0) {
      throw new Error('keywords는 비어있지 않은 배열이어야 합니다.');
    }
    
    // 각 keyword 객체 검증
    for (const kw of parsed.keywords) {
      if (!kw.keyword || !kw.description) {
        throw new Error('각 keyword 객체는 keyword와 description 필드를 포함해야 합니다.');
      }
    }
    
    return {
      insight_text: parsed.insight_text,
      keywords: parsed.keywords,
      context: parsed.context,
      question: parsed.question,
    };
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`JSON 파싱 실패: ${error.message}`);
    }
    throw error;
  }
}

/**
 * 재시도 로직이 포함된 인사이트 생성
 * @param date - 인사이트 날짜 (YYYY-MM-DD)
 * @param maxRetries - 최대 재시도 횟수 (기본값: 3)
 * @returns 생성된 인사이트 객체
 */
export async function generateInsightWithRetry(
  date: string,
  maxRetries: number = 3
): Promise<GeneratedInsight> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await generateInsight(date);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`인사이트 생성 시도 ${attempt}/${maxRetries} 실패:`, lastError.message);
      
      if (attempt < maxRetries) {
        // 재시도 전 잠시 대기 (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }
  
  throw new Error(`${maxRetries}회 시도 후 인사이트 생성 실패: ${lastError?.message}`);
}
