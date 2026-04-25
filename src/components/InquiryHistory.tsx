import { useEffect, useState } from 'react'
import { supabase, type Inquiry } from '../lib/supabase'
import { Download, RefreshCw, Search, Inbox, ExternalLink } from 'lucide-react'

export default function InquiryHistory() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchInquiries = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setInquiries(data || [])
    } catch (err) {
      console.error('데이터 조회 실패:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInquiries()
  }, [])

  const handleDownloadCSV = () => {
    if (inquiries.length === 0) return

    const headers = ['시간', '고객명', '카테고리', '긴급도', '요약', '담당부서', '응대스크립트']
    const rows = inquiries.map(item => [
      new Date(item.created_at).toLocaleString(),
      item.customer_name,
      item.category,
      item.urgency,
      item.summary,
      item.department,
      item.script.replace(/,/g, ' ') // CSV 쉼표 오류 방지
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `kb_inquiries_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredInquiries = inquiries.filter(item => 
    item.customer_name.includes(searchTerm) || 
    item.summary.includes(searchTerm) || 
    item.category.includes(searchTerm)
  )

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case '높음': return 'bg-red-50 text-red-600 border-red-100'
      case '보통': return 'bg-yellow-50 text-yellow-600 border-yellow-100'
      case '낮음': return 'bg-green-50 text-green-600 border-green-100'
      default: return 'bg-gray-50 text-gray-600 border-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      {/* Actions Area */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="이름, 요약, 카테고리로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="kb-input pl-10 py-2"
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={fetchInquiries}
            className="flex-1 md:flex-none p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600"
            title="새로고침"
          >
            <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={handleDownloadCSV}
            disabled={inquiries.length === 0}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-kb-dark-grey text-white px-4 py-2 rounded-xl hover:bg-black disabled:opacity-50"
          >
            <Download size={18} />
            CSV 다운로드
          </button>
        </div>
      </div>

      {/* Table Area */}
      <div className="kb-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">시간</th>
                <th className="px-6 py-4">고객명</th>
                <th className="px-6 py-4">카테고리</th>
                <th className="px-6 py-4">긴급도</th>
                <th className="px-6 py-4">문의 요약</th>
                <th className="px-6 py-4">담당부서</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-4">
                      <div className="h-4 bg-gray-100 rounded w-full"></div>
                    </td>
                  </tr>
                ))
              ) : filteredInquiries.length > 0 ? (
                filteredInquiries.map((item) => (
                  <tr key={item.id} className="hover:bg-kb-light-grey/30 transition-colors text-sm">
                    <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                      {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      <br />
                      <span className="text-[10px]">{new Date(item.created_at).toLocaleDateString()}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-kb-dark-grey">{item.customer_name}</td>
                    <td className="px-6 py-4">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">{item.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${getUrgencyBadge(item.urgency)}`}>
                        {item.urgency}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium max-w-xs truncate" title={item.summary}>
                      {item.summary}
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 text-xs font-semibold text-kb-dark-grey">
                        {item.department}
                        <ExternalLink size={12} className="text-gray-300" />
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-gray-400">
                    <Inbox size={48} className="mx-auto mb-4 opacity-20" />
                    <p>조회된 문의 내역이 없습니다.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
