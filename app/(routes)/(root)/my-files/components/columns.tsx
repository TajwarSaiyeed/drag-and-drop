"use client";

import {ColumnDef} from "@tanstack/react-table";
import {cn, formattedDate} from "@/lib/utils";
import {DownloadIcon} from "lucide-react";
import {buttonVariants} from "@/components/ui/button";

type FileData = {
    type: string;
    file_name: string;
    file_key: string;
    file_url: string;
    created_at: string;
    resulted_file: string;
};

export const columns: ColumnDef<FileData>[] = [
    {
        header: "Source File",
        accessorKey: "file_name",
        cell: (data) => {
            return <a href={data.row.original.file_url} target={"_blank"} title={data.row.original.file_name}>
                {data.row.original.file_name}
            </a>
        }
    },
    {
        header: "Type",
        accessorKey: "type",
    },
    {
        header: "Date",
        accessorKey: "created_at",
        cell: (data) => {
            return formattedDate(data.row.original.created_at);
        }
    },
    {
        header: "Resulted File",
        accessorKey: "resulted_file",
        cell: (data) => {
            return <a className={cn("flex justify-center items-center", buttonVariants({
                size: "sm",
                variant: "destructive"
            }))} href={data.row.original.resulted_file}>
                <DownloadIcon size={12}/>
            </a>
        }
    }
];



