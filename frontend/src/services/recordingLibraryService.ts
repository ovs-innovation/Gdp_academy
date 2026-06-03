import { API_BASE_URL } from '../lib/apiConfig';

export interface RecordingLibraryProgram {
  programId: string;
  title: string;
  image?: string;
  lessonCount: number;
  lessons: Array<{ index: number; title: string; duration: number; hasVideo: boolean }>;
}

export const fetchRecordingLibrary = async (): Promise<RecordingLibraryProgram[]> => {
  const res = await fetch(`${API_BASE_URL}/recordings/library`);
  if (!res.ok) throw new Error('Failed to load recording library');
  const data = await res.json();
  return data.programs || [];
};
