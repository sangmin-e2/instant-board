/**
 * Supabase 연결 테스트 스크립트
 * 
 * 사용법: node test-supabase-connection.js
 * 
 * 이 스크립트는 Supabase 연결이 제대로 설정되었는지 확인합니다.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env 파일 로드
config({ path: join(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Supabase 연결 테스트 시작...\n');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ 환경 변수가 설정되지 않았습니다!');
  console.log('\n다음 환경 변수를 .env 파일에 설정하세요:');
  console.log('  VITE_SUPABASE_URL=your_supabase_url');
  console.log('  VITE_SUPABASE_ANON_KEY=your_supabase_anon_key');
  process.exit(1);
}

console.log('✅ 환경 변수 확인 완료');
console.log(`   URL: ${supabaseUrl.substring(0, 30)}...`);
console.log(`   Key: ${supabaseAnonKey.substring(0, 20)}...\n`);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('📡 Supabase 연결 테스트 중...');
    
    // 1. 연결 테스트 (boards 테이블 조회)
    const { data, error } = await supabase
      .from('boards')
      .select('id')
      .limit(1);

    if (error) {
      if (error.code === 'PGRST116') {
        console.error('❌ boards 테이블이 존재하지 않습니다!');
        console.log('\n해결 방법:');
        console.log('  1. Supabase 대시보드에서 SQL Editor로 이동');
        console.log('  2. supabase/schema.sql 파일의 내용을 실행하세요');
        return false;
      } else if (error.code === '42501') {
        console.error('❌ 권한 오류: RLS 정책이 올바르게 설정되지 않았습니다!');
        console.log('\n해결 방법:');
        console.log('  supabase/schema.sql 파일을 다시 실행하세요');
        return false;
      } else {
        throw error;
      }
    }

    console.log('✅ Supabase 연결 성공!');
    console.log('✅ boards 테이블 접근 가능\n');

    // 2. 보드 생성 테스트
    console.log('🧪 보드 생성 테스트 중...');
    const { data: newBoard, error: createError } = await supabase
      .from('boards')
      .insert([{ notes: [] }])
      .select('id')
      .single();

    if (createError) {
      throw createError;
    }

    console.log(`✅ 보드 생성 성공! (ID: ${newBoard.id})\n`);

    // 3. 보드 조회 테스트
    console.log('🧪 보드 조회 테스트 중...');
    const { data: fetchedBoard, error: fetchError } = await supabase
      .from('boards')
      .select('notes')
      .eq('id', newBoard.id)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    console.log('✅ 보드 조회 성공!\n');

    // 4. 보드 업데이트 테스트
    console.log('🧪 보드 업데이트 테스트 중...');
    const testNote = {
      id: 'test-note-1',
      title: '테스트 노트',
      content: '이것은 테스트입니다',
      color: 'yellow',
      author: 'Test',
      createdAt: Date.now()
    };

    const { error: updateError } = await supabase
      .from('boards')
      .update({ 
        notes: [testNote],
        updated_at: new Date().toISOString()
      })
      .eq('id', newBoard.id);

    if (updateError) {
      throw updateError;
    }

    console.log('✅ 보드 업데이트 성공!\n');

    // 5. 테스트 보드 삭제
    console.log('🧹 테스트 보드 삭제 중...');
    await supabase
      .from('boards')
      .delete()
      .eq('id', newBoard.id);
    console.log('✅ 테스트 보드 삭제 완료\n');

    console.log('🎉 모든 테스트 통과! Supabase 설정이 완료되었습니다.');
    return true;

  } catch (error) {
    console.error('❌ 테스트 실패:', error.message);
    console.error('   상세:', error);
    return false;
  }
}

testConnection().then(success => {
  process.exit(success ? 0 : 1);
});

