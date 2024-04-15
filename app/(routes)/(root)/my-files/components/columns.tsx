"use client";

import { ColumnDef } from "@tanstack/react-table";

type FileData = {
  type: string;
  file_name: string;
  file_key: string;
  file_url: string;
  created_at: string;
};

export const columns: ColumnDef<FileData>[] = [
  {
    header: "File Name",
    accessorKey: "file_name",
  },
  {
    header: "Type",
    accessorKey: "type",
  },
  {
    header: "File Key",
    accessorKey: "file_key",
  },
  {
    header: "File URL",
    accessorKey: "file_url",
  },
];
