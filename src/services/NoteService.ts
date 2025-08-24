import axios from "axios";
import type { Note } from "../types/note.ts";

interface NotesHttpResponse {
  notes: Note[];
  totalPages: number;
}

export async function fetchNotes(
  search: string,
  page: number
): Promise<NotesHttpResponse> {
  const response = await axios.get<NotesHttpResponse>(
    `https://notehub-public.goit.study/api/notes`,
    {
      params: {
        search,
        page,
        perPage: 12,
      },
      headers: { Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}` },
    }
  );
  return response.data;
}

export async function createNote(newNote: Note) {
  const response = await axios.post<Note>(
    "https://notehub-public.goit.study/api/notes",
    newNote,
    {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}` },
    }
  );

  return response.data;
}

export async function deleteNote(noteId: string) {
  const response = await axios.delete<Note>(
    `https://notehub-public.goit.study/api/notes/${noteId}`,
    {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}` },
    }
  );

  return response.data;
}
