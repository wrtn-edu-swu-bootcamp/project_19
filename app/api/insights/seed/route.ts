/**
 * Sample Insight Seed API
 * 개발/테스트용 샘플 인사이트 데이터 생성
 * 
 * 사용법:
 * - GET /api/insights/seed - 최근 7일치 샘플 데이터 생성
 * - GET /api/insights/seed?days=30 - 지정한 일수만큼 생성
 * - GET /api/insights/seed?date=2026-01-22 - 특정 날짜만 생성
 */

import { NextRequest, NextResponse } from 'next/server';
import { saveInsight, getInsightByDate } from '@/lib/db';

// 샘플 인사이트 데이터
const SAMPLE_INSIGHTS = [
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
    insight_text: "짧은 영상이 길어지고, 긴 글이 짧아진다",
    keywords: [
      { keyword: "콘텐츠 역설", description: "숏폼 플랫폼에서 롱폼 콘텐츠 수요 증가" },
      { keyword: "깊이 있는 숏폼", description: "짧지만 정보 밀도가 높은 콘텐츠" },
      { keyword: "스낵형 롱폼", description: "긴 콘텐츠도 쉽게 소비할 수 있게 구성" }
    ],
    context: "틱톡이 10분 영상을 지원하고, 유튜브 쇼츠가 3분으로 확장되는 등 플랫폼들이 콘텐츠 길이 제한을 완화하고 있습니다. 동시에 뉴스레터와 블로그는 더 짧고 임팩트 있게 변화하고 있습니다.",
    question: "우리 콘텐츠의 적정 길이는 무엇이며, 어떻게 밀도를 높일 수 있을까?"
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
  },
  {
    insight_text: "커뮤니티가 곧 브랜드다",
    keywords: [
      { keyword: "팬덤 이코노미", description: "열성 팬이 브랜드 성장을 주도" },
      { keyword: "사용자 생성 콘텐츠", description: "고객이 만드는 브랜드 스토리" },
      { keyword: "소속감 마케팅", description: "제품을 넘어 정체성과 연결" }
    ],
    context: "성공하는 브랜드들은 제품을 파는 것을 넘어 커뮤니티를 만들고 있습니다. 애플, 나이키, 레고처럼 고객들이 스스로 브랜드의 일부라고 느끼게 만드는 것이 핵심입니다.",
    question: "우리 브랜드 주변에 커뮤니티가 형성되어 있는가? 고객들이 소속감을 느끼는가?"
  },
  {
    insight_text: "AI가 만들수록 '인간다움'이 프리미엄이 된다",
    keywords: [
      { keyword: "휴먼 터치", description: "AI 시대에 인간적 요소의 가치 상승" },
      { keyword: "진정성 마케팅", description: "완벽함보다 진실함이 신뢰를 얻음" },
      { keyword: "크래프트맨십", description: "수공예적 가치와 스토리의 중요성" }
    ],
    context: "AI가 콘텐츠를 대량 생산하면서 역설적으로 '인간이 만든 것'에 대한 가치가 높아지고 있습니다. 소비자들은 브랜드 뒤에 있는 사람들의 이야기와 진정성에 더 끌립니다.",
    question: "우리 브랜드에서 '인간다움'은 어떻게 표현되고 있는가?"
  },
  {
    insight_text: "검색보다 발견이 구매를 이끈다",
    keywords: [
      { keyword: "디스커버리 커머스", description: "원하는 걸 몰랐는데 발견하는 쇼핑" },
      { keyword: "알고리즘 큐레이션", description: "AI가 취향을 파악해 제안" },
      { keyword: "세렌디피티 마케팅", description: "우연한 발견의 즐거움 설계" }
    ],
    context: "인스타그램 쇼핑, 틱톡 숍, 핀터레스트 등에서 '구경하다가 사는' 경험이 늘고 있습니다. 소비자들은 적극적으로 검색하기보다 피드를 스크롤하다 발견하는 것을 선호합니다.",
    question: "우리 제품이 고객에게 '발견'되는 순간을 어떻게 설계하고 있는가?"
  },
  {
    insight_text: "구독 피로감 속에서 '번들'이 답이다",
    keywords: [
      { keyword: "구독 번들링", description: "여러 서비스를 묶어 가치 제안" },
      { keyword: "올인원 솔루션", description: "분산된 구독을 통합" },
      { keyword: "가격 대비 가치", description: "월 비용 대비 체감 혜택 극대화" }
    ],
    context: "넷플릭스, 스포티파이, 각종 SaaS까지 구독 서비스가 넘쳐나면서 소비자들은 '구독 피로감'을 느끼고 있습니다. 이에 여러 서비스를 묶은 번들 상품이 새로운 트렌드로 부상하고 있습니다.",
    question: "우리 서비스를 다른 서비스와 묶어 더 큰 가치를 제공할 수 있을까?"
  },
  {
    insight_text: "지속가능성, 말하지 말고 보여줘라",
    keywords: [
      { keyword: "그린워싱 피로", description: "실체 없는 친환경 마케팅에 대한 반감" },
      { keyword: "투명성 마케팅", description: "과정과 수치를 공개하는 정직함" },
      { keyword: "임팩트 증명", description: "환경 기여도를 측정 가능하게 제시" }
    ],
    context: "소비자들은 더 이상 '친환경'이라는 문구만으로는 믿지 않습니다. 구체적인 수치, 인증, 실제 변화를 보여주는 브랜드만이 신뢰를 얻고 있습니다.",
    question: "우리의 지속가능성 노력을 어떻게 구체적으로 증명하고 있는가?"
  },
  {
    insight_text: "로컬이 글로벌보다 힙하다",
    keywords: [
      { keyword: "하이퍼로컬", description: "동네 단위의 초밀착 마케팅" },
      { keyword: "로컬 크리에이터", description: "지역 기반 인플루언서의 영향력" },
      { keyword: "지역 정체성", description: "글로벌 획일성에 대한 반작용" }
    ],
    context: "대형 글로벌 브랜드보다 동네 카페, 로컬 브랜드가 더 '힙'하게 여겨지고 있습니다. 특히 MZ세대는 자신만의 숨은 공간과 브랜드를 발견하고 공유하는 것을 즐깁니다.",
    question: "우리 브랜드는 로컬의 특색을 어떻게 활용할 수 있을까?"
  }
];

/**
 * GET /api/insights/seed
 * 샘플 인사이트 데이터 생성
 */
export async function GET(request: NextRequest) {
  // 프로덕션 환경에서는 차단
  if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_SEED) {
    return NextResponse.json(
      { error: 'This endpoint is not available in production' },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const specificDate = searchParams.get('date');
  const daysParam = searchParams.get('days');
  const days = daysParam ? parseInt(daysParam, 10) : 7;

  try {
    const results: { date: string; status: 'created' | 'exists' | 'error'; message?: string }[] = [];

    if (specificDate) {
      // 특정 날짜만 생성
      const result = await seedInsightForDate(specificDate);
      results.push(result);
    } else {
      // 최근 N일치 생성
      const today = new Date();
      
      for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0]!;
        
        const result = await seedInsightForDate(dateStr, i % SAMPLE_INSIGHTS.length);
        results.push(result);
      }
    }

    const created = results.filter(r => r.status === 'created').length;
    const exists = results.filter(r => r.status === 'exists').length;
    const errors = results.filter(r => r.status === 'error').length;

    return NextResponse.json({
      success: true,
      summary: {
        total: results.length,
        created,
        exists,
        errors,
      },
      results,
    });
  } catch (error) {
    console.error('Seed failed:', error);
    return NextResponse.json(
      { error: 'Failed to seed insights', message: String(error) },
      { status: 500 }
    );
  }
}

async function seedInsightForDate(
  date: string, 
  sampleIndex?: number
): Promise<{ date: string; status: 'created' | 'exists' | 'error'; message?: string }> {
  try {
    // 이미 존재하는지 확인
    const existing = await getInsightByDate(date);
    if (existing) {
      return { date, status: 'exists', message: 'Insight already exists' };
    }

    // 샘플 데이터 선택 (날짜 기반으로 다양하게)
    const index = sampleIndex ?? Math.abs(hashCode(date)) % SAMPLE_INSIGHTS.length;
    const sample = SAMPLE_INSIGHTS[index]!;

    // 저장
    await saveInsight({
      date,
      insight_text: sample.insight_text,
      keywords: sample.keywords,
      context: sample.context,
      question: sample.question,
    });

    return { date, status: 'created' };
  } catch (error) {
    return { 
      date, 
      status: 'error', 
      message: error instanceof Error ? error.message : String(error) 
    };
  }
}

// 문자열 해시 함수 (일관된 샘플 선택용)
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
}
