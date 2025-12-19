<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# INSTANT BOARD - Padlet Style Board

패들렛(Padlet) 스타일의 협업 디지털 보드 애플리케이션입니다. Supabase와 Vercel을 사용하여 배포할 수 있습니다.

## 주요 기능

- 🎨 다양한 색상의 스티키 노트 생성
- 🔄 실시간 클라우드 동기화 (Supabase)
- 🖱️ 드래그 앤 드롭으로 노트 재정렬
- 🔐 비밀번호 기반 보안 게시
- ✨ AI 기반 텍스트 개선 (Google Gemini)
- 📱 반응형 디자인

## 기술 스택

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS (CDN)
- **Backend**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **AI**: Google Gemini API

## 로컬 개발 환경 설정

### 1. 저장소 클론 및 의존성 설치

```bash
npm install
```

### 2. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 가입하고 새 프로젝트를 생성합니다.
2. 프로젝트가 생성되면 **Settings > API**로 이동합니다.
3. 다음 정보를 복사합니다:
   - **Project URL** (예: `https://xxxxx.supabase.co`)
   - **anon/public key** (예: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 3. Supabase 데이터베이스 스키마 설정

1. Supabase 대시보드에서 **SQL Editor**로 이동합니다.
2. `supabase/schema.sql` 파일의 내용을 복사하여 실행합니다.
3. 이 스크립트는 `boards` 테이블을 생성하고 필요한 정책을 설정합니다.

### 4. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가합니다:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

> 참고: `env.example.txt` 파일을 참고하세요.

### 5. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속합니다.

## Vercel 배포 절차

### 1. GitHub에 코드 푸시

```bash
git add .
git commit -m "Add Supabase integration and Vercel deployment config"
git push origin main
```

### 2. Vercel 프로젝트 생성

1. [Vercel](https://vercel.com)에 가입/로그인합니다.
2. **Add New Project**를 클릭합니다.
3. GitHub 저장소를 선택하고 **Import**를 클릭합니다.

### 3. 환경 변수 설정 (Vercel)

Vercel 프로젝트 설정에서 **Environment Variables** 섹션으로 이동하여 다음 변수를 추가합니다:

- `VITE_SUPABASE_URL`: Supabase 프로젝트 URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anon key
- `GEMINI_API_KEY`: Google Gemini API 키 (선택사항)

### 4. 빌드 설정 확인

Vercel은 자동으로 다음 설정을 감지합니다:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 5. 배포

**Deploy** 버튼을 클릭하면 자동으로 빌드 및 배포가 시작됩니다.

### 6. 배포 후 확인

배포가 완료되면 Vercel이 제공하는 URL에서 애플리케이션을 확인할 수 있습니다.

## 프로젝트 구조

```
sangminbd-main/
├── components/          # React 컴포넌트
│   ├── CreateModal.tsx  # 노트 생성 모달
│   ├── DeleteModal.tsx  # 삭제 확인 모달
│   ├── DetailModal.tsx # 노트 상세 보기 모달
│   └── StickyNote.tsx  # 스티키 노트 컴포넌트
├── services/            # 서비스 레이어
│   ├── geminiService.ts # Google Gemini API 서비스
│   └── supabaseService.ts # Supabase 서비스
├── supabase/           # Supabase 스키마
│   └── schema.sql      # 데이터베이스 스키마
├── App.tsx             # 메인 애플리케이션 컴포넌트
├── types.ts            # TypeScript 타입 정의
├── vite.config.ts      # Vite 설정
├── vercel.json         # Vercel 배포 설정
└── package.json        # 프로젝트 의존성
```

## 주요 파일 설명

### `services/supabaseService.ts`
Supabase와의 통신을 담당하는 서비스 파일입니다. 보드 생성, 노트 조회/업데이트 기능을 제공합니다.

### `supabase/schema.sql`
Supabase 데이터베이스 스키마입니다. `boards` 테이블과 RLS(Row Level Security) 정책을 포함합니다.

### `vercel.json`
Vercel 배포 설정 파일입니다. SPA 라우팅을 위한 rewrite 규칙을 포함합니다.

## 문제 해결

### Supabase 연결 오류
- `.env` 파일의 `VITE_SUPABASE_URL`과 `VITE_SUPABASE_ANON_KEY`가 올바른지 확인하세요.
- Supabase 대시보드에서 프로젝트가 활성화되어 있는지 확인하세요.
- `supabase/schema.sql`이 실행되었는지 확인하세요.

### 빌드 오류
- Node.js 버전이 18 이상인지 확인하세요.
- `npm install`을 다시 실행하세요.
- Vercel의 빌드 로그를 확인하세요.

### 환경 변수 오류
- Vercel에서 환경 변수가 올바르게 설정되었는지 확인하세요.
- 변수 이름이 `VITE_`로 시작하는지 확인하세요 (Vite 환경 변수 규칙).

## 라이선스

이 프로젝트는 개인 프로젝트입니다.

## 작성자

Sangmin
