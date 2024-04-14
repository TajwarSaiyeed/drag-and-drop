"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader, UploadCloud } from "lucide-react";
import axios from "axios";
import {
  Document,
  Packer,
  Paragraph as DocxParagraph,
  Table,
  TableCell as DocxTableCell,
  TableRow,
} from "docx";

// import {OpenAI} from "openai";

class Paragraph extends DocxParagraph {
  boundingPoly: any;
  normalizedVertices: any;

  constructor(options: any) {
    super(options);
    this.boundingPoly = options.boundingPoly;
    this.normalizedVertices = options.normalizedVertices;
  }
}

class TableCell extends DocxTableCell {
  boundingPoly: any;
  normalizedVertices: any;

  constructor(options: any) {
    super(options);
    this.boundingPoly = options.boundingPoly;
    this.normalizedVertices = options.normalizedVertices;
  }
}

//
// const openai = new OpenAI({
//     baseURL: "https://api.openai.com/v1",
//     apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY!,
//     dangerouslyAllowBrowser: true
// });

const ImageToDoc = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [documentContent, setDocumentContent] = useState<any>(null);
  const [text, setText] = useState<string>("");
  const [extracting, setExtracting] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false); // Cleanup to prevent state updates on unmounted component
    };
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
      console.log("Setting document content:", res.data.response.document);

      setText(res.data.response.document.text);
      setDocumentContent(res.data.response.document);
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
  //
  //
  // // Translation by openai before creating the word
  //
  //
  // const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  //     try {
  //         const response = await openai.chat.completions.create({
  //             model: "gpt-3.5-turbo",
  //             temperature: 0.5, // Adjust as needed
  //             max_tokens: 1000, // Adjust as needed
  //             // stop: ["\n"], // Stop at the first newline character
  //             n: 1, // Generate a single completion
  //             messages: [{role: "system", content: `Translate the following text to ${targetLanguage}:`}, {
  //                 role: "user",
  //                 content: text
  //             }]
  //         });
  //
  //         return response.choices[0].message.content;
  //     } catch (error) {
  //         console.error("Translation error:", error);
  //         return ""; // Handle error appropriately
  //     }
  // };

  // const CHUNK_SIZE = 1000; // Define a suitable chunk size based on token limits
  //
  // // Function to split text into chunks
  //     const chunkText = (text: string, chunkSize: number): string[] => {
  //         // Implementation to split text into chunks of `chunkSize` tokens
  //         // This is a simplified example; consider tokenization specifics for accurate splitting
  //         const result = [];
  //         let currentChunk = "";
  //
  //         text.split(' ').forEach(word => {
  //             if ((currentChunk + word).length > chunkSize) {
  //                 result.push(currentChunk);
  //                 currentChunk = word;
  //             } else {
  //                 currentChunk += `${word} `;
  //             }
  //         });
  //
  //         // Add the last chunk if it's not empty
  //         if (currentChunk.trim()) {
  //             result.push(currentChunk.trim());
  //         }
  //
  //         return result;
  //     };

  // Asynchronous function to translate a chunk of text
  //     const translateChunk = async (chunk: string, targetLanguage: string): Promise<string> => {
  //         // Use the `translateText` function defined earlier or a similar implementation
  //         return await translateText(chunk, targetLanguage);
  //     };

  // Function to handle large text translation by processing it in chunks
  //     const translateLargeText = async (text: string, targetLanguage: string): Promise<string> => {
  //         const chunks = chunkText(text, CHUNK_SIZE);
  //         const translatedChunks = await Promise.all(chunks.map(async (chunk) => {
  //             return await translateChunk(chunk, targetLanguage);
  //         }));
  //
  //         // Combine translated chunks back into a single string
  //         return translatedChunks.join(' ');
  //     };

  const downloadFile = async () => {
    setLoading(true);
    if (!documentContent) return;

    // const targetLanguage = "English";
    // const translatedText = await translateLargeText(text, targetLanguage);

    let children = []; // Prepare an array to hold all document children (paragraphs and tables)
    let usedIndices = new Set<number>(); // Track indices used in tables

    documentContent.pages.forEach((page: any) => {
      let items = [];

      page.tables.forEach((tableData: any) => {
        if (tableData.headerRows && tableData.headerRows.length > 0) {
          const textAnchor =
            tableData.headerRows[0].cells[0].layout?.textAnchor || {};
          const textSegments = textAnchor.textSegments || [];
          const startPosition =
            textSegments.length > 0
              ? parseInt(textSegments[0].startIndex, 10)
              : 0;
          items.push({
            type: "table",
            content: tableData,
            position: startPosition,
          });

          // Mark indices used by this table
          tableData.headerRows.concat(tableData.bodyRows).forEach(
            (row: {
              cells: {
                layout: {
                  textAnchor: {
                    textSegments: { startIndex: string; endIndex: string }[];
                  };
                };
              }[];
            }) => {
              row.cells.forEach(
                (cell: {
                  layout: {
                    textAnchor: {
                      textSegments: { startIndex: string; endIndex: string }[];
                    };
                  };
                }) => {
                  cell.layout.textAnchor.textSegments.forEach(
                    (segment: { startIndex: string; endIndex: string }) => {
                      const startIndex = parseInt(segment.startIndex, 10);
                      const endIndex = parseInt(segment.endIndex, 10);
                      for (let i = startIndex; i <= endIndex; i++) {
                        // Note: <= to include endIndex
                        usedIndices.add(i);
                      }
                    }
                  );
                }
              );
            }
          );
        }
      });

      // Collect text blocks with their positions
      page.blocks.forEach((block: any) => {
        const textAnchor = block.layout?.textAnchor || {};
        const boundingPoly = block.layout?.boundingPoly || {};
        const normalizedVertices =
          block.layout?.boundingPoly?.normalizedVertices || [];
        const textSegments = textAnchor.textSegments || [];
        const startPosition =
          textSegments.length > 0
            ? parseInt(textSegments[0].startIndex, 10)
            : 0;

        // Determine if any part of this block's segments has been used
        let isUsed = textSegments.some(
          (segment: { startIndex: string; endIndex: string }) => {
            const start = parseInt(segment.startIndex, 10);
            const end = parseInt(segment.endIndex, 10);
            for (let i = start; i <= end; i++) {
              if (usedIndices.has(i)) return true;
            }
            return false;
          }
        );

        if (!isUsed) {
          items.push({
            type: "block",
            content: block,
            position: startPosition,
            boundingPoly: boundingPoly,
            normalizedVertices: normalizedVertices,
          });
        }
      });

      // Sort items by their starting position
      items.sort((a, b) => a.position - b.position);

      // Add sorted items to document
      items.forEach((item) => {
        if (item.type === "block") {
          // Use 'startIndex' and 'endIndex' from 'textSegments' to extract the block text
          const textAnchor = item.content.layout?.textAnchor || {};
          const textSegments = textAnchor.textSegments || [];
          const boundingPoly = item.boundingPoly;
          const normalizedVertices = item.normalizedVertices;

          let blockText = "";
          textSegments.forEach(
            (segment: { startIndex: string; endIndex: string }) => {
              const startIndex = parseInt(segment.startIndex, 10);
              const endIndex = parseInt(segment.endIndex, 10);
              blockText += text.substring(startIndex, endIndex);
            }
          );

          const paragraphs = blockText.split("\n").map(
            (paragraphText) =>
              new Paragraph({
                text: paragraphText,
                bidirectional: true,
                boundingPoly: boundingPoly,
                normalizedVertices: normalizedVertices,
              })
          );
          children.push(...paragraphs);
        } else if (item.type === "table") {
          // Extract table data from the item
          const tableData = item.content;
          const rows = [];

          // Combine headerRows and bodyRows for processing
          const allRows = [...tableData.headerRows, ...tableData.bodyRows];

          allRows.forEach((rowData) => {
            const rowCells = rowData.cells.map(
              (cell: {
                layout: {
                  textAnchor: { textSegments: any };
                  boundingPoly: { normalizedVertices: any; vertices: any };
                };
              }) => {
                const cellTextSegments = cell.layout.textAnchor.textSegments;
                const boundingPoly = cell.layout.boundingPoly;
                const normalizedVertices = boundingPoly.normalizedVertices;
                const vertices = boundingPoly.vertices;

                // Extract cell text based on textSegments
                let cellText = "";

                cellTextSegments.forEach(
                  (segment: { startIndex: string; endIndex: string }) => {
                    const startIndex = parseInt(segment.startIndex, 10);
                    const endIndex = parseInt(segment.endIndex, 10);
                    cellText += text.substring(startIndex, endIndex);
                  }
                );

                // Create a TableCell with a Paragraph containing the cellText
                return new TableCell({
                  children: [
                    new Paragraph({
                      text: cellText,
                      bidirectional: true,
                      boundingPoly: vertices,
                      normalizedVertices: normalizedVertices,
                    }),
                  ],
                });
              }
            );

            // Create a TableRow with the mapped rowCells
            rows.push(new TableRow({ children: rowCells }));
          });

          // Create a Table object with the constructed rows
          const table = new Table({
            rows: rows,
          });

          // Add the constructed Table object to the children array
          children.push(table);

          // Add a separator after each table
          const separator = new Paragraph({
            text: "", // Use a space, newline, or any character as needed
          });
          children.push(separator);
        }
      });
    });

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: children,
        },
      ],
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
    document.body.appendChild(a); // Append to body to ensure it works in all browsers
    a.click();
    document.body.removeChild(a); // Clean up
    setLoading(false);
  };

  if (!isMounted) return null;

  return (
    <div className="relative bg-secondary w-full h-screen overflow-auto">
      <div className="flex flex-col items-center justify-center space-y-5 pt-10">
        <h1 className="font-semibold text-muted-foreground text-2xl sm:text-3xl">
          Extract Table from Image, PDF, or Document etc.
        </h1>
        <div
          onClick={handleButtonClick}
          className={cn(
            "border border-dashed border-primary hover:border-none hover:bg-gray-200 rounded-md p-3 text-muted-foreground transition-all font-semibold cursor-pointer h-[200px] max-w-[600px] w-full text-sm flex justify-center items-center flex-col space-y-4 mx-10",
            extracting &&
              "cursor-not-allowed pointer-events-none bg-gray-200 border-none"
          )}
        >
          {extracting ? (
            <Loader className="animate-spin" size={60} />
          ) : (
            <UploadCloud size={60} />
          )}
          <input
            type="file"
            accept=".pdf,.gif,.tiff,.tif,.jpg,.jpeg,.png,.bmp,.webp"
            id="file-input"
            onChange={handleFileChange}
            className="hidden"
            disabled={extracting || loading}
          />
          <p className="text-muted-foreground text-sm">
            {extracting
              ? "Extracting text from file..."
              : "Supports (PDF, GIF, TIFF, TIF, JPG, JPEG, PNG, BMP, WEBP) (20MB max)"}
          </p>
        </div>
        {text && documentContent && (
          <Button className="bg-primary text-white" onClick={downloadFile}>
            {loading ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              "Download Document"
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ImageToDoc;
