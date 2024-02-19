"use client";
import React, {useState, useEffect} from "react";
import {Button} from "@/components/ui/button";
import {cn, extractText} from "@/lib/utils";
import {Loader, UploadCloud} from "lucide-react";
import axios from "axios";
import {Document, Packer, Paragraph, Table, TableRow, TableCell} from "docx";

const ImageToDoc = () => {
    const [dc, setDoc] = useState<any>(null);
    const [text, setText] = useState<string>("");
    const [extracting, setExtracting] = useState<boolean>(false);
    const [isMounted, setIsMounted] = useState<boolean>(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        try {
            const files = event.target.files;
            if (!files) return;
            setExtracting(true);
            setText("");

            const formData = new FormData();

            formData.append("file", files[0]);
            const res = await axios.post("/api/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setText(res.data.response.document.text);
            setDoc(res.data.response.document);
        } catch (error) {
            console.log(error);
        } finally {
            setExtracting(false);
        }
    };


    const handleButtonClick = () => {
        const fileInput = document.getElementById("file-input") as HTMLInputElement;
        fileInput.click();
    };

    const downloadFile = async () => {
        if (!dc) return;
        const headerR = extractText(text, dc.pages[0].tables[0].headerRows[0].cells);
        const bodyR = dc.pages[0].tables[0].bodyRows.map((row: any) => {
            return extractText(text, row.cells);
        })
        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children: [
                        new Table({
                            rows: [
                                new TableRow({
                                    children: headerR.map((cell: any) => new TableCell({
                                        children: [new Paragraph(cell)],
                                    })),
                                }),
                                ...bodyR.map((row: any) => new TableRow({
                                    children: row.map((cell: any) => new TableCell({
                                        children: [new Paragraph(cell)],
                                    })),
                                })),
                            ],
                        }),
                    ],
                },
            ],
        });

        const paragraphs = text?.split("\n");

        paragraphs.forEach((paragraph) => {
            const text = new Paragraph({
                text: paragraph,
            });

            doc.Document.View.Body.push(text);
        });

        // Download the document
        const buffer = await Packer.toBuffer(doc);
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "extracted_table.docx";
        a.click();
    };

    if (!isMounted) return null;

    return (
        <div
            className="relative bg-secondary w-full h-screen overflow-auto"
        >
            <div className="flex flex-col items-center justify-center space-y-5 pt-10">
                <h1 className="font-semibold text-muted-foreground text-2xl sm:text-3xl">
                    Extract Table from Image, PDF, or Document etc.
                </h1>
                <div
                    onClick={handleButtonClick}
                    className={cn(
                        "border border-dashed border-primary hover:border-none hover:bg-gray-200 rounded-md p-3 text-muted-foreground transition-all font-semibold cursor-pointer h-[200px] max-w-[600px] w-full text-sm flex justify-center items-center flex-col space-y-4 mx-10",
                        extracting &&
                        "cursor-not-allowed pointer-events-none bg-gray-200 border-none hover:border-none hover:bg-gray-200 rounded-md p-3 text-muted-foreground transition-all font-semibold h-[200px] max-w-[600px] w-full text-sm flex justify-center items-center flex-col space-y-4 mx-10"
                    )}
                >
                    {extracting ? (
                        <Loader className={"animate-spin"} size={60}/>
                    ) : (
                        <UploadCloud size={60}/>
                    )}

                    <input
                        type="file"
                        accept=".pdf,.gif,.tiff,.tif,.jpg,.jpeg,.png,.bmp,.webp"
                        id="file-input"
                        onChange={handleFileChange}
                        className={"hidden"}
                    />
                    <p className={"text-muted-foreground text-sm"}>
                        {extracting
                            ? "Extracting text from file..."
                            : "Supports (PDF, GIF, TIFF, TIF, JPG, JPEG, PNG, BMP, WEBP) (20MB max)"}
                    </p>
                </div>
                {text && (
                    <Button className={"bg-primary text-white"} onClick={downloadFile}>
                        Download
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ImageToDoc;
