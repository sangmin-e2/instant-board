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

