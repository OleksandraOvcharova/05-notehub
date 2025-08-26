import css from "./SearchBox.module.css";
interface SearchBoxProps {
  search: string;
  handleSearchUpdate: (newSearch: string) => void;
}

export default function SearchBox({
  search,
  handleSearchUpdate,
}: SearchBoxProps) {
  return (
    <input
      defaultValue={search}
      className={css.input}
      type="text"
      onChange={(e) => {
        handleSearchUpdate(e.target.value);
      }}
      placeholder="Search notes"
    />
  );
}
