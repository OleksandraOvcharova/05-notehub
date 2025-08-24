export interface Note {
  id?: string;
  title: string;
  content: string;
  tag: string;
}

export type NoteTag = "Work" | "Personal" | "Meeting" | "Shopping" | "Todo";
