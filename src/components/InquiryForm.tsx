import { useState } from 'react'
import { classifyInquiry, type GeminiResponse } from '../lib/gemini'
import { supabase } from '../lib/supabase'
import { Send, Loader2, CheckCircle2, AlertCircle, Save } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export default function InquiryForm() {
  const [customerName, setCustomerName] = useState('')
  const [inquiry, setInquiry] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<GeminiResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const handleClassify = async () => {
    if (!customerName.trim() || !inquiry.trim()) {
      setError('이름과 문의 내용을 모두 입력해주세요.')
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)
    setIsSaved(false)

    try {
      const classification = await classifyInquiry(inquiry)
      setResult(classification)
    } catch (err: any) {
      setError(err.message || '분류 중 오류가 발생했습니다.')
      // 에러 시 원본 응답 표시 (디버깅용)
      if (err.message && err.message.includes('Unexpected token')) {
        setError(`JSON 파싱 실패: ${err.message}`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!result || !customerName || !inquiry) return

    setIsSaving(true)
    try {
      const { error: dbError } = await supabase.from('inquiries').insert([
        {
          customer_name: customerName,
          inquiry: inquiry,
          category: result.category,
          urgency: result.urgency,
          summary: result.summary,
          department: result.department,
          script: result.script,
        },
      ])

      if (dbError) throw dbError
      setIsSaved(true)
      // 폼 초기화
      setCustomerName('')
      setInquiry('')
      setTimeout(() => setIsSaved(false), 3000)
    } catch (err: any) {
      setError(`저장 실패: ${err.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case '높음': return 'bg-red-100 text-red-700 border-red-200'
      case '보통': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case '낮음': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Section */}
      <section className="space-y-6">
        <div className="kb-card p-6 md:p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Send className="text-kb-yellow" size={24} />
            새로운 고객 문의 접수
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">고객 성함</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="성함을 입력하세요"
                className="kb-input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">문의 내용</label>
              <textarea
                value={inquiry}
                onChange={(e) => setInquiry(e.target.value)}
                placeholder="고객의 문의 내용을 상세히 입력하세요..."
                rows={6}
                className="kb-input resize-none"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p className="whitespace-pre-wrap">{error}</p>
              </div>
            )}

            <button
              onClick={handleClassify}
              disabled={isLoading}
              className="kb-button-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Gemini AI 분석 중...
                </>
              ) : (
                <>
                  분류하기
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Result Section */}
      <section className="space-y-6">
        {result ? (
          <div className="kb-card animate-in zoom-in-95 duration-300">
            <div className="bg-kb-yellow/10 p-4 border-b border-kb-yellow/20 flex justify-between items-center">
              <span className="font-bold text-kb-dark-grey flex items-center gap-2">
                <CheckCircle2 className="text-kb-yellow" size={20} />
                AI 분석 완료
              </span>
              <div className={cn("px-3 py-1 rounded-full text-xs font-bold border", getUrgencyColor(result.urgency))}>
                긴급도: {result.urgency}
              </div>
            </div>
            
            <div className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-gray-400 block mb-1">카테고리</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm font-semibold">{result.category}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block mb-1">담당 부서</span>
                  <span className="px-3 py-1 bg-kb-dark-grey text-white rounded-lg text-sm font-semibold">{result.department}</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-gray-400 block mb-1">문의 요약</span>
                <p className="text-lg font-bold text-kb-dark-grey leading-tight">{result.summary}</p>
              </div>

              <div className="p-4 bg-kb-light-grey rounded-xl border border-gray-200">
                <span className="text-xs text-gray-400 block mb-2">추천 응대 스크립트</span>
                <p className="text-sm italic text-gray-700 leading-relaxed">"{result.script}"</p>
              </div>

              <button
                onClick={handleSave}
                disabled={isSaving || isSaved}
                className={cn(
                  "w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all",
                  isSaved 
                  ? "bg-green-500 text-white cursor-default" 
                  : "bg-kb-dark-grey text-white hover:bg-black"
                )}
              >
                {isSaving ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : isSaved ? (
                  <>
                    <CheckCircle2 size={20} />
                    저장되었습니다
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    시스템에 저장하기
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="kb-card p-12 flex flex-col items-center justify-center text-gray-400 border-dashed border-2 border-gray-200 bg-gray-50/50 h-full min-h-[400px]">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Send size={32} />
            </div>
            <p className="text-center font-medium">
              왼쪽 양식을 작성하고 <br />
              분류하기 버튼을 눌러주세요.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
