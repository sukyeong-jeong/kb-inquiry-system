import { GoogleGenAI } from '@google/genai'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY
const genAI = new GoogleGenAI({ apiKey })

export interface GeminiResponse {
  category: string
  urgency: '높음' | '보통' | '낮음'
  summary: string
  department: string
  script: string
}

export const classifyInquiry = async (inquiry: string): Promise<GeminiResponse> => {
  if (!apiKey) {
    throw new Error('환경변수 VITE_GEMINI_API_KEY가 설정되지 않았습니다.')
  }

  const prompt = `
당신은 KB금융그룹의 고객 서비스 자동 분류 전문가입니다.
다음 고객의 문의 내용을 분석하여 정해진 JSON 형식으로 분류해 주세요.

[카테고리]
보험금청구 / 계약변경 / 해지 / 상품문의 / 대출 / 카드 / 기타

[긴급도 분류 규칙]
- 높음: 사고, 분실, 도난, 긴급 의료, 해외 사고 등 즉시 처리 필요
- 보통: 일반 문의, 상품 가입, 변경 요청
- 낮음: 단순 확인, 정보 요청

[담당부서 매칭 규칙]
- 보험금 관련 → 보상심사팀
- 대출 관련 → 여신심사팀
- 카드 분실/도난 → 카드관리팀
- 적금/예금 → 수신팀
- 그 외 일반 → 고객지원팀

고객 문의 내용:
"${inquiry}"

응답은 아래 JSON 형식으로만 하세요. 마크다운 코드블록이나 설명 텍스트 없이 순수 JSON만 출력하세요.

{
  "category": "카테고리",
  "urgency": "높음|보통|낮음",
  "summary": "한 줄 요약",
  "department": "담당부서",
  "script": "응대 스크립트"
}
`

  try {
    const response = await genAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    })
    
    let text = response.text
    if (!text) throw new Error('AI 응답이 비어있습니다.')

    // 마크다운 코드 블록 제거 전처리
    text = text.replace(/```json|```/g, '').trim()

    return JSON.parse(text) as GeminiResponse
  } catch (error) {
    console.error('Gemini API 호출 중 오류 발생:', error)
    throw error
  }
}
