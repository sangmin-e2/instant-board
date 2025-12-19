import { createClient } from '@supabase/supabase-js';
import { Note } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials are missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
}

// 빈 문자열로 클라이언트를 생성하면 오류가 발생할 수 있으므로 더미 값 사용
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

export interface Board {
  id: string;
  notes: Note[];
  created_at: string;
  updated_at: string;
}

/**
 * 새로운 보드를 생성하고 ID를 반환합니다.
 */
export const createBoard = async (): Promise<string | null> => {
  // Supabase 설정이 없으면 null 반환
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://placeholder.supabase.co') {
    console.warn('Supabase not configured. Cannot create board.');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('boards')
      .insert([{ notes: [] }])
      .select('id')
      .single();

    if (error) throw error;
    return data?.id || null;
  } catch (error) {
    console.error('Failed to create board:', error);
    return null;
  }
};

/**
 * 기본 보드를 가져오거나 생성합니다.
 * 모든 사용자가 공유하는 기본 보드를 반환합니다.
 */
export const getOrCreateDefaultBoard = async (): Promise<string | null> => {
  // Supabase 설정이 없으면 null 반환
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://placeholder.supabase.co') {
    console.warn('Supabase not configured. Cannot get default board.');
    return null;
  }

  try {
    // 먼저 기존 보드 중 하나를 가져옴 (가장 최근에 업데이트된 것)
    const { data: existingBoards, error: fetchError } = await supabase
      .from('boards')
      .select('id')
      .order('updated_at', { ascending: false })
      .limit(1);

    if (fetchError) throw fetchError;

    // 기존 보드가 있으면 첫 번째 보드 ID 반환
    if (existingBoards && existingBoards.length > 0) {
      return existingBoards[0].id;
    }

    // 기존 보드가 없으면 새로 생성
    return await createBoard();
  } catch (error) {
    console.error('Failed to get or create default board:', error);
    // 에러 발생 시 새 보드 생성 시도
    return await createBoard();
  }
};

/**
 * 보드의 노트들을 가져옵니다.
 */
export const fetchBoardNotes = async (boardId: string): Promise<Note[]> => {
  // Supabase 설정이 없으면 빈 배열 반환
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://placeholder.supabase.co') {
    console.warn('Supabase not configured. Cannot fetch notes.');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('boards')
      .select('notes')
      .eq('id', boardId)
      .single();

    if (error) throw error;
    return (data?.notes as Note[]) || [];
  } catch (error) {
    console.error('Failed to fetch board notes:', error);
    return [];
  }
};

/**
 * 보드의 노트들을 업데이트합니다.
 */
export const updateBoardNotes = async (boardId: string, notes: Note[]): Promise<boolean> => {
  // Supabase 설정이 없으면 false 반환
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://placeholder.supabase.co') {
    console.warn('Supabase not configured. Cannot update notes.');
    return false;
  }

  try {
    const { error } = await supabase
      .from('boards')
      .update({ 
        notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', boardId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to update board notes:', error);
    return false;
  }
};

/**
 * 보드가 존재하는지 확인합니다.
 */
export const boardExists = async (boardId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('boards')
      .select('id')
      .eq('id', boardId)
      .single();

    return !error && !!data;
  } catch (error) {
    return false;
  }
};

