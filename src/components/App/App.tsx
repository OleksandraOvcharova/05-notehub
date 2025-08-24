import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  useQuery,
  useQueryClient,
  useMutation,
  keepPreviousData,
} from "@tanstack/react-query";
import { fetchNotes, deleteNote, createNote } from "../../services/NoteService";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import NoteList from "../NoteList/NoteList";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import css from "./App.module.css";
import type { Note } from "../../types/note";

function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["notes", search, page],
    queryFn: () => fetchNotes(search, page),
    placeholderData: keepPreviousData,
  });

  const updateSearch = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      setPage(1);
    },
    300
  );

  useEffect(() => {
    if (data && data.notes.length === 0) {
      toast("No movies found for your request.");
    }
  }, [data]);

  const totalPages = data?.totalPages ?? 0;

  const handleModalClose = () => {
    setShowModal(false);
  };

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleDelete = (noteId: string) => {
    deleteMutation.mutate(noteId);
  };

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleCreate = (newNote: Note) => {
    createMutation.mutate(newNote);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        {<SearchBox onSearchUpdate={updateSearch} />}
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
      {data && data.notes.length > 0 && (
        <NoteList notes={data.notes} handleDelete={handleDelete} />
      )}
      {showModal && (
        <Modal onClose={handleModalClose}>
          <NoteForm
            handleCreate={handleCreate}
            handleFormClose={handleModalClose}
          />
        </Modal>
      )}
    </div>
  );
}

export default App;
