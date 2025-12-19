-- Supabase 데이터베이스 스키마
-- 이 SQL을 Supabase 대시보드의 SQL Editor에서 실행하세요.

-- boards 테이블 생성
CREATE TABLE IF NOT EXISTS boards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  notes JSONB DEFAULT '[]'::jsonb NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- updated_at 자동 업데이트를 위한 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_at 트리거 생성
CREATE TRIGGER update_boards_updated_at 
  BEFORE UPDATE ON boards 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) 활성화
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 boards를 읽을 수 있도록 정책 생성 (공개 보드)
CREATE POLICY "Anyone can read boards"
  ON boards FOR SELECT
  USING (true);

-- 모든 사용자가 boards를 생성할 수 있도록 정책 생성
CREATE POLICY "Anyone can create boards"
  ON boards FOR INSERT
  WITH CHECK (true);

-- 모든 사용자가 boards를 업데이트할 수 있도록 정책 생성 (공개 보드)
CREATE POLICY "Anyone can update boards"
  ON boards FOR UPDATE
  USING (true);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_boards_updated_at ON boards(updated_at DESC);

