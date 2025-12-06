import { motion } from 'framer-motion';
import clsx from 'clsx';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5; // Number of page buttons to show

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);

            // Adjust range if at the beginning
            if (currentPage <= 3) {
                endPage = Math.min(totalPages - 1, 4);
            }

            // Adjust range if at the end
            if (currentPage >= totalPages - 2) {
                startPage = Math.max(2, totalPages - 3);
            }

            if (startPage > 2) {
                pages.push('...');
            }

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            if (endPage < totalPages - 1) {
                pages.push('...');
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    };

    const buttonClass = "w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-300";
    const activeClass = "bg-[#709CEF] text-white shadow-lg shadow-blue-500/20";
    const inactiveClass = "bg-[#1e1e1e] text-white border border-gray-800 hover:border-gray-600 hover:bg-[#2a2a2a]";

    return (
        <div className="flex justify-center items-center gap-2 mt-12">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={clsx(
                    buttonClass,
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    inactiveClass
                )}
            >
                <i className="fas fa-chevron-left"></i>
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((page, index) => (
                <button
                    key={index}
                    onClick={() => typeof page === 'number' ? onPageChange(page) : null}
                    disabled={typeof page !== 'number'}
                    className={clsx(
                        buttonClass,
                        {
                            [activeClass]: currentPage === page,
                            [inactiveClass]: currentPage !== page && typeof page === 'number',
                            "cursor-default bg-transparent border-none text-gray-500 hover:bg-transparent hover:border-none": typeof page !== 'number'
                        }
                    )}
                >
                    {page}
                </button>
            ))}

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={clsx(
                    buttonClass,
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    inactiveClass
                )}
            >
                <i className="fas fa-chevron-right"></i>
            </button>
        </div>
    );
};

export default Pagination;
