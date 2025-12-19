# 빠른 설정 가이드

## ✅ 현재 상태
- [x] 로컬에서 앱이 정상 실행됨
- [ ] Supabase 설정 필요
- [ ] Vercel 배포 필요

---

## 1단계: Supabase 설정 (약 5분)

### 1.1 Supabase 프로젝트 생성

1. **Supabase 접속**: https://supabase.com
2. **회원가입/로그인** (GitHub 계정으로 로그인 권장)
3. **New Project** 클릭
4. 프로젝트 정보 입력:
   - **Name**: `instant-board` (원하는 이름)
   - **Database Password**: 강력한 비밀번호 설정 ⚠️ **반드시 저장하세요!**
   - **Region**: `Northeast Asia (Seoul)` 또는 가장 가까운 리전
5. **Create new project** 클릭
6. 프로젝트 생성 완료 대기 (약 2분)

### 1.2 API 키 복사

1. 프로젝트 대시보드에서 **Settings** (왼쪽 메뉴) 클릭
2. **API** 섹션으로 이동
3. 다음 두 값을 복사하여 메모장에 저장:
   ```
   Project URL: https://xxxxxxxxxxxxx.supabase.co
   anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 1.3 데이터베이스 스키마 실행

1. Supabase 대시보드에서 **SQL Editor** (왼쪽 메뉴) 클릭
2. **New query** 클릭
3. 프로젝트의 `supabase/schema.sql` 파일을 열어서 **전체 내용 복사**
4. SQL Editor에 붙여넣기
5. **Run** 버튼 클릭 (또는 Ctrl+Enter)
6. ✅ "Success. No rows returned" 메시지 확인

### 1.4 테이블 확인

1. **Table Editor** (왼쪽 메뉴) 클릭
2. `boards` 테이블이 생성되었는지 확인
3. 테이블 구조 확인:
   - `id` (uuid)
   - `notes` (jsonb)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

---

## 2단계: 로컬 환경 변수 설정

### 2.1 .env 파일 생성

프로젝트 루트에 `.env` 파일을 생성합니다:

**Windows (PowerShell):**
```powershell
New-Item -Path .env -ItemType File
```

**Mac/Linux:**
```bash
touch .env
```

### 2.2 환경 변수 입력

`.env` 파일을 열고 다음 내용을 입력하세요:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
GEMINI_API_KEY=your_gemini_api_key_here
```

> **참고**: 
> - `VITE_SUPABASE_URL`과 `VITE_SUPABASE_ANON_KEY`는 1.2에서 복사한 값입니다
> - `GEMINI_API_KEY`는 선택사항입니다 (AI 개선 기능 사용 시만 필요)

### 2.3 개발 서버 재시작

```bash
# Ctrl+C로 서버 중지 후
npm run dev
```

### 2.4 로컬 테스트

1. 브라우저에서 `http://localhost:3000` 접속
2. **+** 버튼 클릭하여 노트 생성 테스트
3. 비밀번호: `1212` 입력
4. 노트가 정상적으로 생성되고 저장되는지 확인

---

## 3단계: GitHub에 코드 푸시

### 3.1 Git 초기화 (아직 안 했다면)

```bash
git init
git add .
git commit -m "Initial commit: Padlet-style board with Supabase"
```

### 3.2 GitHub 저장소 생성

1. https://github.com 접속
2. **New repository** 클릭
3. 저장소 이름 입력 (예: `instant-board`)
4. **Create repository** 클릭

### 3.3 코드 푸시

```bash
git remote add origin https://github.com/your-username/instant-board.git
git branch -M main
git push -u origin main
```

> **참고**: `.env` 파일은 `.gitignore`에 추가되어 있어 자동으로 제외됩니다.

---

## 4단계: Vercel 배포

### 4.1 Vercel 계정 생성

1. https://vercel.com 접속
2. **Sign Up** 클릭
3. **Continue with GitHub** 클릭하여 GitHub 계정으로 로그인

### 4.2 프로젝트 Import

1. Vercel 대시보드에서 **Add New Project** 클릭
2. GitHub 저장소 선택
3. **Import** 클릭

### 4.3 프로젝트 설정

Vercel이 자동으로 감지합니다:
- **Framework Preset**: Vite ✅
- **Root Directory**: `./` ✅
- **Build Command**: `npm run build` ✅
- **Output Directory**: `dist` ✅

변경할 필요 없습니다.

### 4.4 환경 변수 설정

**Environment Variables** 섹션에서 다음 변수를 추가:

| Name | Value | 설명 |
|------|-------|------|
| `VITE_SUPABASE_URL` | `https://xxxxxxxxxxxxx.supabase.co` | Supabase 프로젝트 URL |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Supabase anon key |
| `GEMINI_API_KEY` | `your_gemini_api_key` | (선택사항) Gemini API 키 |

각 변수 추가 시:
1. **Name** 입력
2. **Value** 입력
3. **Environment** 선택: **Production**, **Preview**, **Development** 모두 선택 ✅
4. **Add** 클릭

### 4.5 배포 실행

1. 모든 설정 완료 후 **Deploy** 버튼 클릭
2. 빌드 진행 상황 확인 (약 1-2분)
3. ✅ 배포 완료!

### 4.6 배포 확인

1. 배포 완료 후 제공되는 URL로 접속
2. 앱이 정상 작동하는지 확인
3. 노트 생성/삭제 테스트

---

## 완료! 🎉

이제 웹앱이 완전히 배포되었습니다!

### 다음 단계 (선택사항)

- [ ] 커스텀 도메인 연결
- [ ] Google Analytics 추가
- [ ] 사용자 인증 추가 (Supabase Auth)
- [ ] 이미지 업로드 기능 추가

---

## 문제 해결

### Supabase 연결 오류
- `.env` 파일의 URL과 키가 올바른지 확인
- Supabase 프로젝트가 활성화되어 있는지 확인
- `supabase/schema.sql`이 실행되었는지 확인

### Vercel 빌드 실패
- Vercel 빌드 로그 확인
- 환경 변수가 올바르게 설정되었는지 확인
- Node.js 버전 확인 (18 이상 필요)

### 질문이 있으시면
- `DEPLOYMENT.md` 파일 참고
- GitHub Issues에 문의

