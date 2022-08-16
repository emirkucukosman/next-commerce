import React from "react";

// UI Components
import { Pagination as MantinePagination } from "@mantine/core";

// Props
type PaginationProps = {
  totalPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export const Pagination: React.FC<PaginationProps> = ({
  totalPage,
  currentPage,
  onPageChange,
}) => {
  return (
    <MantinePagination
      color="dark"
      total={totalPage}
      page={currentPage}
      onChange={onPageChange}
    />
  );
};
