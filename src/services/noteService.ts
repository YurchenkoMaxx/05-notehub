import axios from "axios";
import type { Note } from "../types/note";

// Створюємо axios-інстанс з базовим URL і токеном
const BASE_URL = "https://notehub-public.goit.study/api";

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
  },
});

// Тип параметрів запиту
export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

// Тип відповіді з бекенду
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

// Запит на отримання нотатків з підтримкою пагінації та пошуку
export async function fetchNotes(
  params: FetchNotesParams = {}
): Promise<FetchNotesResponse> {
  const cleanedParams: FetchNotesParams = {
    ...params,
  };

  if (!params.search?.trim()) {
    delete cleanedParams.search;
  }

  const response = await instance.get<FetchNotesResponse>("/notes", {
    params: cleanedParams,
  });

  return response.data;
}

// Тип для створення нотатки
export interface CreateNoteParams {
  title: string;
  content: string;
  tag?: string;
}

// Створення нотатки
export async function createNote(data: CreateNoteParams): Promise<Note> {
  const response = await instance.post<Note>("/notes", data);
  return response.data;
}

// Видалення нотатки
export async function deleteNote(id: number): Promise<Note> {
  const response = await instance.delete<Note>(`/notes/${id}`);
  return response.data;
}