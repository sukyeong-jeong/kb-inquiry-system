# KB금융그룹 고객 문의 자동 분류 시스템

Gemini 3 Flash AI를 활용하여 고객의 문의 내용을 분석하고, 적절한 카테고리, 긴급도, 담당 부서를 자동으로 분류하는 시스템입니다.

## 🚀 주요 기능
- **AI 자동 분류**: Gemini 3 Flash 모델이 문의 내용을 실시간 분석
- **지능적 응대**: 맞춤형 고객 응대 스크립트 자동 생성
- **실시간 저장**: 분석 결과를 Supabase DB에 즉시 저장
- **내역 관리**: 저장된 전체 문의 내역 조회 및 CSV 다운로드 기능

## 🛠 기술 스택
- **Frontend**: React, TypeScript, Vite, Tailwind CSS v4
- **AI**: @google/genai (Gemini 3 Flash)
- **Backend/DB**: Supabase

## ⚙️ 설정 방법

### 1. 환경 변수 설정
프로젝트 루트에 `.env` 파일을 생성하고 다음 값을 입력합니다:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

### 2. 데이터베이스 설정
Supabase SQL Editor에서 `supabase_setup.sql` 파일의 내용을 복사하여 실행합니다.

### 3. 로컬 실행
```bash
npm install
npm run dev
```

## 📦 배포 방법 (Vercel)
1. GitHub 저장소에 코드를 푸시합니다.
2. Vercel에서 프로젝트를 Import 합니다.
3. Environment Variables 섹션에 `.env`의 3개 항목을 등록합니다.
4. Deploy 버튼을 누릅니다.

## 📄 라이선스
© 2026 KB Financial Group. All rights reserved.
