import { useState } from 'react'
import InquiryForm from './components/InquiryForm'
import InquiryHistory from './components/InquiryHistory'
import { LayoutDashboard, History } from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState<'input' | 'history'>('input')

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-kb-yellow rounded-lg flex items-center justify-center">
              <span className="text-kb-dark-grey font-bold text-lg">KB</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">고객 문의 자동 분류 시스템</h1>
          </div>
          
          <nav className="flex gap-1 p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => setActiveTab('input')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'input' 
                ? 'bg-white text-kb-dark-grey shadow-sm' 
                : 'text-gray-500 hover:text-kb-dark-grey'
              }`}
            >
              <LayoutDashboard size={18} />
              문의 입력
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'history' 
                ? 'bg-white text-kb-dark-grey shadow-sm' 
                : 'text-gray-500 hover:text-kb-dark-grey'
              }`}
            >
              <History size={18} />
              문의 내역
            </button>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8">
        {activeTab === 'input' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <InquiryForm />
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <InquiryHistory />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-400 text-sm border-t border-gray-200 bg-white">
        <p>© 2026 KB Financial Group. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
