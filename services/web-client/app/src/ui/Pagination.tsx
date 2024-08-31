import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => (
  <nav aria-label="Page navigation example" className="flex justify-center py-4">
    <ul className="flex items-center -space-x-px h-10 text-lg">
      <li>
        <a
          href="#"
          className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg ${currentPage === 1 ? "cursor-not-allowed" : "hover:bg-gray-100 hover:text-gray-700"}`}
          onClick={(e) => {
            e.preventDefault();
            if (currentPage > 1) onPageChange(currentPage - 1);
          }}
        >
          <span className="sr-only">Previous</span>
          <svg
            className="w-4 h-4 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 1 1 5l4 4"
            />
          </svg>
        </a>
      </li>
      {[...Array(totalPages)].map((_, index) => (
        <li key={index}>
          <a
            href="#"
            className={`flex items-center justify-center px-4 h-10 leading-tight ${
              currentPage === index + 1
                ? "z-10 text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100"
                : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
            }`}
            onClick={(e) => {
              e.preventDefault();
              onPageChange(index + 1);
            }}
          >
            {index + 1}
          </a>
        </li>
      ))}
      <li>
        <a
          href="#"
          className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg ${currentPage === totalPages ? "cursor-not-allowed" : "hover:bg-gray-100 hover:text-gray-700"}`}
          onClick={(e) => {
            e.preventDefault();
            if (currentPage < totalPages) onPageChange(currentPage + 1);
          }}
        >
          <span className="sr-only">Next</span>
          <svg
            className="w-4 h-4 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1l4 4-4 4"
            />
          </svg>
        </a>
      </li>
    </ul>
  </nav>
);

export default Pagination;
