/**
 * Gemini AI Client
 * Google Generative AI를 사용한 마케팅 인사이트 생성
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { InsightKeyword } from '@/types/insight';

// Gemini 클라이언트 초기화 (API 키가 없으면 null)
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// 생성된 인사이트 타입 (DB 저장 전)
export type GeneratedInsight = {
  insight_text: string;
  keywords: InsightKeyword[];
  context: string;
  question: string;
};

/**
 * API 키가 없을 때 사용할 샘플 인사이트 생성
 */
function generateSampleInsight(date: string): GeneratedInsight {
  const sampleInsights = [
    {
      insight_text: "요즘 브랜드는 혜택보다 선택 이유를 설계한다",
      keywords: [
        { keyword: "브랜드 스토리텔링", description: "단순한 제품 기능을 넘어 가치로 전달" },
        { keyword: "선택 피로감", description: "명확한 이유가 많은 옵션보다 중요함" },
        { keyword: "가치 기반 소비", description: "Z세대는 가격에서 의미로 전환 중" }
      ],
      context: "최근 소비자들은 제품 기능이나 할인보다 '왜 이 브랜드를 선택해야 하는가'에 더 민감하게 반응합니다. 특히 Z세대는 브랜드의 가치관과 자신의 정체성이 일치하는지를 중요하게 생각합니다.",
      question: "우리 브랜드가 제공하는 선택 이유는 명확한가? 고객에게 어떤 가치를 전달하고 있는가?"
    },
    {
      insight_text: "Z세대는 광고를 콘텐츠로 소비한다",
      keywords: [
        { keyword: "광고 네이티브", description: "광고와 콘텐츠의 경계가 흐려짐" },
        { keyword: "숏폼 크리에이티브", description: "15초 안에 브랜드 메시지 전달" },
        { keyword: "밈 마케팅", description: "공유 가능한 형태의 브랜드 커뮤니케이션" }
      ],
      context: "Z세대에게 광고는 더 이상 '스킵해야 할 것'이 아닙니다. 재미있고 공유할 만한 광고는 오히려 적극적으로 찾아보고 친구들과 나눕니다. 이는 광고의 형식보다 콘텐츠의 질이 중요해졌음을 의미합니다.",
      question: "우리 브랜드의 광고는 사람들이 자발적으로 공유하고 싶어하는가?"
    },
    {
      insight_text: "개인화를 넘어 '맥락화'가 승부를 가른다",
      keywords: [
        { keyword: "상황 인식 마케팅", description: "고객의 현재 상황과 맥락을 파악" },
        { keyword: "마이크로 모먼트", description: "결정적 순간에 적절한 메시지 전달" },
        { keyword: "예측적 개인화", description: "필요를 미리 예측하여 제안" }
      ],
      context: "이름과 구매 이력 기반 개인화는 이제 기본입니다. 진정한 차별화는 고객이 '지금 무엇이 필요한지'를 상황과 맥락에서 파악하여 적절한 타이밍에 제안하는 것입니다.",
      question: "우리는 고객의 상황과 맥락을 얼마나 이해하고 활용하고 있는가?"
    }
  ];
  
  // 날짜 기반으로 샘플 선택 (일관성 유지)
  const dateNum = parseInt(date.replace(/-/g, ''), 10);
  const index = dateNum % sampleInsights.length;
  return sampleInsights[index]!;
}

/**
 * AI를 사용하여 마케팅 인사이트 생성
 * API 키가 없으면 샘플 인사이트 반환
 * @param date - 인사이트 날짜 (YYYY-MM-DD)
 * @returns 생성된 인사이트 객체
 */
export async function generateInsight(date: string): Promise<GeneratedInsight> {
  // API 키가 없으면 샘플 인사이트 반환
  if (!genAI || !apiKey) {
    console.warn('[AI] GEMINI_API_KEY가 설정되지 않아 샘플 인사이트를 사용합니다.');
    console.warn('[AI] 실제 AI 인사이트를 사용하려면 .env.local에 GEMINI_API_KEY를 설정하세요.');
    // 약간의 지연을 추가하여 실제 API 호출처럼 보이게
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateSampleInsight(date);
  }

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
