"use client";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {mergePDFs} from "@/helpers/mergePDFs";
import useScreenSize from "@/hooks/useScreenSize";
import {cn} from "@/lib/utils";
import {
    DragDropContext,
    Draggable,
    DropResult,
    Droppable,
} from "@hello-pangea/dnd";
import workerSrc from "pdfjs-dist/build/pdf.worker.entry.js";
import React, {useEffect, useState} from "react";
import {Document, Page, pdfjs} from "react-pdf";
import DragAndDrop from "@/components/drag-and-drop";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

function reorder<T>(item: T[], startIndex: number, endIndex: number) {
    const result = Array.from(item);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
}

const HomePage = () => {
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setItems(items);
    }, [items]);


    const handleButtonClick = () => {
        const fileInput = document.getElementById("file-input") as HTMLInputElement;
        fileInput.click();
    };
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const newItems = Array.from(files).map((file) => ({
            id: file.name,
            title: file.name,
            file: file,
        }));
        setItems([...items, ...newItems]);
    };

    const handleMergePDFs = async () => {
        if (items && items.length > 0) {
            try {
                const pdfBuffers = await Promise.all(
                    items.map(async (item) => {
                        const arrayBuffer = await item.file.arrayBuffer();
                        return new Uint8Array(arrayBuffer);
                    })
                );

                const mergedPDFBuffer = await mergePDFs(pdfBuffers);

                const blob = new Blob([mergedPDFBuffer], {type: "application/pdf"});
                const link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                link.download = "merged.pdf";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                console.error("Error merging PDFs:", error);
                // Handle the error as needed
            }
        } else {
            alert("Add Some Pdf");
        }
    };

    if (!isMounted) return null;

    return (
        <div className={"relative "}>
            {items.length === 0 && (
                <React.Fragment>
                    <Button
                        onClick={handleButtonClick}
                        variant={"destructive"}
                        size={"lg"}
                        className={cn(
                            "",
                            items.length > 0 && "absolute top-0 right-0 z-10"
                        )}
                    >
                        <input
                            type="file"
                            accept="application/pdf"
                            multiple
                            id="file-input"
                            onChange={handleFileChange}
                            className={"hidden"}
                        />
                        Add PDF
                    </Button>
                </React.Fragment>
            )}

            {/*drap and drop*/}
            <DragAndDrop items={items} setItems={setItems}/>

            <div className="mt-24">
                <Button
                    variant={"destructive"}
                    size={"lg"}
                    className={cn("", items.length > 0 && "absolute top-0 right-0 z-10")}
                    type="button"
                    onClick={handleMergePDFs}
                >
                    Merge Pdf
                </Button>
            </div>
        </div>
    );
};

export default HomePage;
