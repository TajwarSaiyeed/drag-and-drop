'use client'
import Image from "next/image";
import Link from "next/link";
import {buttonVariants} from "@/components/ui/button";
import {ChangeEvent, Key, useEffect, useState} from "react";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult
} from '@hello-pangea/dnd';
import {useDropzone} from "react-dropzone";


export default function Home() {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null); // Track dragged file index

    const onDragStart = (index: number) => setDraggedIndex(index);
    const onDragEnd = () => setDraggedIndex(null);

    const onDrop = (acceptedFiles: File[]) => {
        const validFiles = acceptedFiles.filter((file) => file.type === 'application/pdf');
        // ... Validate file size, etc. if needed

        setSelectedFiles((prevState) => [...prevState, ...validFiles]);

        if (validFiles.length) {
            const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file));
            setPreviewUrls([...previewUrls, ...newPreviewUrls]);
        }
    };

    // Use useDropzone for Drag-and-Drop (add accept="application/pdf")


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const filesArray = Array.from(files);
            // ... Validate files if needed

            setSelectedFiles(filesArray);
            const urls = filesArray.map((file) => URL.createObjectURL(file));
            setPreviewUrls(urls);
        }
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        selectedFiles.forEach((file) => formData.append('files', file));

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            // Handle successful upload, e.g., reset state, show success message
        } catch (error) {
            // Handle errors appropriately, e.g., show error message
            setUploadError("something went wrong");
        }
    };

    const {getRootProps, getInputProps} = useDropzone({
        onDrop: onDrop,
        accept: ".pdf", // Ensure PDF uploads only
    });


    const reorderFiles = (sourceIndex: number, destinationIndex: number) => {
        const newFiles = [...selectedFiles];
        const [reorderedItem] = newFiles.splice(sourceIndex, 1);
        newFiles.splice(destinationIndex, 0, reorderedItem);
        setSelectedFiles(newFiles);
    };

    useEffect(() => {
        // Clean up preview URLs when component unmounts
        return () => previewUrls.forEach(URL.revokeObjectURL);
    }, [previewUrls]);


    return (
        <div>
            <Link href={'/split-pdf'} className={buttonVariants()}>
                Split PDF
            </Link>
            <Link href={'/merge-pdf'} className={buttonVariants()}>
                Merge PDF
            </Link>


            <div className="mr-80 pr-80 mt-20 pt-20">
                {/* Drag-and-drop zone */}
                <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>Drag & drop PDFs here, or click to select</p>
                </div>

                {/* File selection input */}
                <input
                    type="file"
                    accept="application/pdf"
                    multiple
                    onChange={handleFileChange}
                />

                {/* Upload button */}
                <button onClick={handleSubmit}>Upload</button>

                {/* File list and previews */}
                {uploadError && <p className="text-red-500">{uploadError}</p>}
                <div className="flex flex-wrap">
                    {previewUrls.map((url, index) => ((url: string | undefined, index: Key | null | undefined) => (
                        <div key={index} style={{margin: '10px 0'}}>
                            <embed src={url} type="application/pdf" width="500" height="600"/>
                        </div>
                    ))(url, index))}
                </div>
            </div>
        </div>
    );
}

