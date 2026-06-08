import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage,
  onPageChange,
  totalItems,
  itemsPerPage,
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalItems);
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage + 1;

  const goToPage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    onPageChange(pageNumber);
  };
  const goToPrevPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  // Helper to build page buttons with ellipsis
  const getPageButtons = () => {
    if (totalPages === 0) {
      // Always show 1 as disabled if no data
      return [1];
    }
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [1];
    if (currentPage > 3) pages.push("...");
    if (currentPage > 2) pages.push(currentPage - 1);
    if (currentPage !== 1 && currentPage !== totalPages)
      pages.push(currentPage);
    if (currentPage < totalPages - 1) pages.push(currentPage + 1);
    if (currentPage < totalPages - 2) pages.push("...");
    if (totalPages !== 1) pages.push(totalPages);
    // Remove duplicates and sort
    return [...new Set(pages)].filter(
      (p) =>
        p === 1 ||
        p === totalPages ||
        (typeof p === "number" && p > 1 && p < totalPages) ||
        p === "..."
    );
  };

  const pageButtons = getPageButtons();

  return (
    <div className="px-6 py-4 border-t border-borderGray flex items-center justify-between bottom-0">
      <div>
        <p className="text-sm text-primary font-medium">
          Showing data {totalItems === 0 ? 0 : indexOfFirstItem} to{" "}
          {indexOfLastItem} of {totalItems} entries
        </p>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={goToPrevPage}
          disabled={currentPage === 1 || totalPages === 0}
          className={`px-3 py-1 rounded ${
            currentPage === 1 || totalPages === 0
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-border border-borderGray"
          }`}
        >
          <ChevronLeft size={18} />
        </button>
        {pageButtons.map((pageNum, idx) =>
          pageNum === "..." ? (
            <span key={`ellipsis-${idx}`} className="px-3 py-1">
              ...
            </span>
          ) : (
            <button
              key={`page-${pageNum}`}
              onClick={() => goToPage(pageNum)}
              className={`px-3 py-1 rounded-lg mr-2 ${
                currentPage === pageNum
                  ? "bg-primary text-white"
                  : "text-gray-600 bg-neutral/10"
              }`}
              aria-current={currentPage === pageNum ? "page" : undefined}
              disabled={totalPages === 0}
            >
              {pageNum}
            </button>
          )
        )}
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages || totalPages === 0}
          className={`px-3 py-1 rounded-lg ${
            currentPage === totalPages || totalPages === 0
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600"
          }`}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
