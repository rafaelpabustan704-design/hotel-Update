'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';

interface UsePaginationOptions<T> {
  data: T[];
  itemsPerPage?: number;
}

interface UsePaginationReturn<T> {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  paginatedData: T[];
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  goToNextPage: () => void;
  goToPrevPage: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  itemsPerPage: number;
  setItemsPerPage: (count: number) => void;
}

export function usePagination<T>({
  data,
  itemsPerPage: initialItemsPerPage = 10,
}: UsePaginationOptions<T>): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPageState] = useState(initialItemsPerPage);

  const totalItems = data.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  // Reset to page 1 when data length changes (e.g. after filtering/searching)
  useEffect(() => {
    setCurrentPage(1);
  }, [totalItems]);

  // Clamp current page if it exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  // 1-indexed display values
  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const goToFirstPage = useCallback(() => setCurrentPage(1), []);
  const goToLastPage = useCallback(() => setCurrentPage(totalPages), [totalPages]);
  const goToNextPage = useCallback(() => {
    if (canGoNext) setCurrentPage((p) => p + 1);
  }, [canGoNext]);
  const goToPrevPage = useCallback(() => {
    if (canGoPrev) setCurrentPage((p) => p - 1);
  }, [canGoPrev]);

  const setItemsPerPage = useCallback((count: number) => {
    setItemsPerPageState(count);
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    setCurrentPage,
    paginatedData,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPrevPage,
    canGoNext,
    canGoPrev,
    itemsPerPage,
    setItemsPerPage,
  };
}
