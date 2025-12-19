# 배포 가이드

이 문서는 INSTANT BOARD를 Supabase와 Vercel을 사용하여 배포하는 상세한 절차를 설명합니다.

## 목차

1. [Supabase 설정](#1-supabase-설정)
2. [로컬 개발 환경 설정](#2-로컬-개발-환경-설정)
3. [Vercel 배포](#3-vercel-배포)
4. [배포 후 확인](#4-배포-후-확인)

---

## 1. Supabase 설정

### 1.1 Supabase 계정 생성 및 프로젝트 생성

1. [Supabase](https://supabase.com)에 접속하여 계정을 생성합니다.
2. **New Project**를 클릭합니다.
3. 다음 정보를 입력합니다:
   - **Name**: 프로젝트 이름 (예: `instant-board`)
   - **Database Password**: 강력한 비밀번호 설정 (반드시 저장!)
   - **Region**: 가장 가까운 리전 선택
4. **Create new project**를 클릭합니다.
5. 프로젝트 생성이 완료될 때까지 대기합니다 (약 2분 소요).

### 1.2 API 키 확인

1. 프로젝트 대시보드에서 **Settings** (왼쪽 메뉴)를 클릭합니다.
2. **API** 섹션으로 이동합니다.
3. 다음 정보를 복사하여 안전한 곳에 저장합니다:
   - **Project URL** (예: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** 키 (긴 문자열)

### 1.3 데이터베이스 스키마 생성

1. Supabase 대시보드에서 **SQL Editor** (왼쪽 메뉴)를 클릭합니다.
2. **New query**를 클릭합니다.
3. 프로젝트의 `supabase/schema.sql` 파일을 열어 내용을 복사합니다.
4. SQL Editor에 붙여넣고 **Run** 버튼을 클릭합니다.
5. 성공 메시지가 표시되면 완료입니다.

### 1.4 테이블 확인

1. **Table Editor** (왼쪽 메뉴)로 이동합니다.
2. `boards` 테이블이 생성되었는지 확인합니다.
3. 테이블 구조:
   - `id` (uuid, primary key)
   - `notes` (jsonb)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

---

## 2. 로컬 개발 환경 설정

### 2.1 프로젝트 클론 및 의존성 설치

```bash
# 저장소 클론 (이미 클론했다면 생략)
git clone <your-repository-url>
cd sangminbd-main

# 의존성 설치
npm install
```

### 2.2 환경 변수 파일 생성

프로젝트 루트에 `.env` 파일을 생성합니다:

```bash
# Windows (PowerShell)
New-Item -Path .env -ItemType File

# Mac/Linux
touch .env
```

`.env` 파일에 다음 내용을 추가합니다:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
GEMINI_API_KEY=your_gemini_api_key_here
```

> **참고**: 
> - `VITE_SUPABASE_URL`과 `VITE_SUPABASE_ANON_KEY`는 1.2에서 복사한 값입니다.
> - `GEMINI_API_KEY`는 Google Gemini API를 사용하는 경우에만 필요합니다. [Google AI Studio](https://makersuite.google.com/app/apikey)에서 발급받을 수 있습니다.

### 2.3 로컬 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속하여 애플리케이션이 정상적으로 작동하는지 확인합니다.

---

## 3. Vercel 배포

### 3.1 GitHub에 코드 푸시

```bash
# 변경사항 확인
git status

# 변경사항 추가
git add .

# 커밋
git commit -m "Add Supabase integration and Vercel deployment config"

# GitHub에 푸시
git push origin main
```

### 3.2 Vercel 계정 생성 및 프로젝트 연결

1. [Vercel](https://vercel.com)에 접속하여 계정을 생성합니다 (GitHub 계정으로 로그인 권장).
2. 대시보드에서 **Add New Project**를 클릭합니다.
3. GitHub 저장소를 선택하고 **Import**를 클릭합니다.

### 3.3 프로젝트 설정

Vercel이 자동으로 다음을 감지합니다:
- **Framework Preset**: Vite
- **Root Directory**: `./` (기본값)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

변경이 필요하지 않다면 기본값을 유지합니다.

### 3.4 환경 변수 설정

**Environment Variables** 섹션에서 다음 변수를 추가합니다:

| Name | Value | 설명 |
|------|-------|------|
| `VITE_SUPABASE_URL` | `https://xxxxxxxxxxxxx.supabase.co` | Supabase 프로젝트 URL |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Supabase anon key |
| `GEMINI_API_KEY` | `your_gemini_api_key` | Google Gemini API 키 (선택사항) |

각 변수를 추가할 때:
1. **Name** 입력
2. **Value** 입력
3. **Environment** 선택 (Production, Preview, Development 모두 선택 권장)
4. **Add** 클릭

### 3.5 배포 실행

1. 모든 설정이 완료되면 **Deploy** 버튼을 클릭합니다.
2. 빌드 로그를 확인하며 배포가 진행됩니다 (약 1-2분 소요).
3. 배포가 완료되면 성공 메시지와 함께 URL이 표시됩니다.

---

## 4. 배포 후 확인

### 4.1 기본 기능 테스트

1. 배포된 URL로 접속합니다.
2. **+** 버튼을 클릭하여 새 노트를 생성합니다.
3. 비밀번호(`1212`)를 입력하고 노트를 작성합니다.
4. 노트가 정상적으로 표시되는지 확인합니다.
5. 노트를 드래그하여 순서를 변경할 수 있는지 확인합니다.
6. 노트를 클릭하여 상세 보기가 작동하는지 확인합니다.

### 4.2 공유 링크 테스트

1. **Share** 버튼을 클릭하여 링크를 복사합니다.
2. 시크릿 모드나 다른 브라우저에서 링크를 열어 동일한 보드가 표시되는지 확인합니다.

### 4.3 Supabase 데이터 확인

1. Supabase 대시보드의 **Table Editor**로 이동합니다.
2. `boards` 테이블을 선택합니다.
3. 생성된 보드와 노트 데이터가 JSON 형식으로 저장되어 있는지 확인합니다.

---

## 문제 해결

### Supabase 연결 오류

**증상**: "Failed to create board" 또는 "Sync error" 메시지

**해결 방법**:
1. `.env` 파일의 Supabase URL과 키가 올바른지 확인
2. Supabase 대시보드에서 프로젝트 상태 확인
3. `supabase/schema.sql`이 실행되었는지 확인
4. 브라우저 콘솔에서 에러 메시지 확인

### Vercel 빌드 실패

**증상**: Vercel 배포 시 빌드 오류

**해결 방법**:
1. Vercel 빌드 로그 확인
2. Node.js 버전 확인 (18 이상 필요)
3. `package.json`의 의존성 확인
4. 환경 변수가 올바르게 설정되었는지 확인

### 환경 변수 오류

**증상**: "Supabase credentials are missing" 경고

**해결 방법**:
1. 환경 변수 이름이 `VITE_`로 시작하는지 확인
2. Vercel에서 환경 변수가 모든 환경(Production, Preview, Development)에 설정되었는지 확인
3. 변수 값에 공백이나 특수문자가 없는지 확인

---

## 추가 설정 (선택사항)

### 커스텀 도메인 설정

1. Vercel 프로젝트 설정에서 **Domains** 섹션으로 이동
2. 원하는 도메인을 입력하고 **Add** 클릭
3. DNS 설정 안내에 따라 도메인을 연결

### 환경별 설정

- **Production**: 실제 서비스 환경
- **Preview**: Pull Request마다 생성되는 미리보기 환경
- **Development**: 로컬 개발 환경

각 환경에 다른 Supabase 프로젝트를 연결할 수 있습니다.

---

## 다음 단계

- [ ] Google Analytics 추가
- [ ] 사용자 인증 추가 (Supabase Auth)
- [ ] 이미지 업로드 기능 추가
- [ ] 실시간 동기화 개선 (Supabase Realtime)

---

배포에 문제가 있으면 GitHub Issues에 문의해주세요!

