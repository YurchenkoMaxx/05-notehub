import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (selected: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel="→"
      previousLabel="←"
      onPageChange={(event) => onPageChange(event.selected + 1)}
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      pageCount={totalPages}
      forcePage={currentPage - 1}
      containerClassName={css.pagination}
      pageClassName={css.page}
      activeClassName={css.active}
      previousClassName={css.nav}
      nextClassName={css.nav}
    />
  );
}
