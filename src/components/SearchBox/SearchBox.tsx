import css from "./SearchBox.module.css";
import type { ChangeEvent } from "react";
interface SearchBoxProps {
  onSearchUpdate: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBox({ onSearchUpdate }: SearchBoxProps) {
  return (
    <input
      className={css.input}
      type="text"
      onChange={onSearchUpdate}
      placeholder="Search notes"
    />
  );
}
