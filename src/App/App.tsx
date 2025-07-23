import css from "./App.module.css";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { fetchNotes, createNote, deleteNote } from "../services/noteService";
import type { FetchNotesResponse } from "../services/noteService";
import SearchBox from "../components/SearchBox/SearchBox";
import NoteList from "../components/NoteList/NoteList";
import Pagination from "../components/Pagination/Pagination";
import Modal from "../components/Modal/Modal";
import NoteForm from "../components/NoteForm/NoteForm";
import Loader from "../components/Loader/Loader";
import ErrorMessage from "../components/ErrorMessage/ErrorMessage";
import { useDebounce } from "use-debounce";

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);

  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<
    FetchNotesResponse,
    Error
  >({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () => fetchNotes({ page, perPage: 12, search: debouncedSearch }),
    placeholderData: (prev) => prev,
  });

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handlePageChange = (newPage: number) => setPage(newPage);

  const handleDelete = (id: number) => deleteMutation.mutate(id);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
        />
        {data && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            onPageChange={handlePageChange}
            currentPage={page}
          />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <Loader />}
      {isError && <ErrorMessage message={error?.message || "Error"} />}

      {data && data.notes?.length > 0 && (
        <NoteList notes={data.notes} onDelete={handleDelete} />
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onSubmit={createMutation.mutate}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}
