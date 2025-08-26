import toast, { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import NoteList from "../NoteList/NoteList";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import css from "./App.module.css";

function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [debouncedSearch] = useDebounce(search, 300);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["notes", debouncedSearch, page],
    queryFn: () => fetchNotes(debouncedSearch, page),
    placeholderData: keepPreviousData,
  });

  const handleSearchUpdate = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  };

  useEffect(() => {
    if (data && data.notes.length === 0) {
      toast("No notes found for your request.");
    }
  }, [data]);

  const totalPages = data?.totalPages ?? 0;

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        {<SearchBox search={search} handleSearchUpdate={handleSearchUpdate} />}
        {isSuccess && totalPages > 1 && (
          <Pagination totalPages={totalPages} setPage={setPage} page={page} />
        )}
        {
          <button className={css.button} onClick={() => setShowModal(true)}>
            Create note +
          </button>
        }
      </header>
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
      {showModal && (
        <Modal onClose={handleModalClose}>
          <NoteForm handleFormClose={handleModalClose} />
        </Modal>
      )}
      <Toaster />
    </div>
  );
}

export default App;
