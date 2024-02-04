"use client";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Document, Page, pdfjs } from "react-pdf";
import workerSrc from "pdfjs-dist/build/pdf.worker.entry.js";
import { ArrowRightCircle, Plus, XCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

function reorder<T>(item: T[], startIndex: number, endIndex: number) {
  const result = Array.from(item);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

const Hero = () => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>(0);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [pdfInfo, setPdfInfo] = useState<{
    [key: string]: { size: string; pages: number };
  }>({});

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setItems(items);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const itemsCopy = reorder(
      items,
      result.source.index,
      result.destination.index
    );
    setItems(itemsCopy);

    // Assuming `onReorder` function is defined somewhere
    const bulkUpdateData = itemsCopy.map((item, index) => ({
      id: item.id,
      position: index,
    }));
  };

  const handleFileDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;

    if (files.length > 0) {
      const newItems = await Promise.all(
        Array.from(files).map(async (file) => {
          const pdfInfo = await getPDFInfo(file);
          return {
            id: file.name,
            title: file.name,
            file: file,
            info: pdfInfo,
          };
        })
      );

      setItems([...items, ...newItems]);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    const newItems = await Promise.all(
      Array.from(files).map(async (file) => {
        const pdfInfo = await getPDFInfo(file);
        return {
          id: file.name,
          title: file.name,
          file: file,
          info: pdfInfo,
        };
      })
    );

    setItems([...items, ...newItems]);
  };

  const getPDFInfo = async (
    file: File
  ): Promise<{ size: string; pages: number }> => {
    const arrayBuffer = await file.arrayBuffer(); // Convert File to ArrayBuffer
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    const sizeInKB = (file.size / 1024).toFixed(2); // Convert to KB
    const pages = pdf.numPages;
    return { size: `${sizeInKB}KB`, pages };
  };

  const handleButtonClick = () => {
    const fileInput = document.getElementById("file-input") as HTMLInputElement;
    fileInput.click();
  };

  if (!isMounted) return null;

  const handleRemovePDF = (idToRemove: string) => {
    const updatedItems = items.filter((item) => item.id !== idToRemove);
    setItems(updatedItems);
  };

  return (
    <div
      className="relative bg-secondary w-full h-screen overflow-scroll"
      onDrop={handleFileDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center pt-10">
          <h1 className="text-[42px] font-semibold">Merge PDF files</h1>
          <h3 className="text-[22px] font-base mt-2 mb-8">
            Combine PDFs in the order you want with the easiest PDF merger
            available.
          </h3>
          <Button
            onClick={handleButtonClick}
            size={"lg"}
            className={cn(
              "text-[24px] font-medium w-[330px] h-20 rounded-lg hover:bg-primary/80",
              items.length > 0 && ""
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
            Select PDF Files
          </Button>
          <p className="text-sm mt-3 text-muted-foreground">
            or drop PDFs here
          </p>
        </div>
      )}

      {/* After adding pdf files */}
      {items.length > 0 && (
        <div className="grid grid-cols-3 w-full h-screen">
          {/* PDF files */}
          <div className="col-span-2 flex justify-center w-full relative">
            <div className="absolute top-10 right-6">
              <div className="relative">
                <div className="size-5 bg-black -top-2 -left-3 absolute rounded-full ring-2 ring-primary text-background flex justify-center items-center text-xs font-medium">
                  {items.length}
                </div>
                <Button
                  size={"icon"}
                  className="rounded-full"
                  onClick={handleButtonClick}
                >
                  <input
                    type="file"
                    accept="application/pdf"
                    multiple
                    id="file-input"
                    onChange={handleFileChange}
                    className={"hidden"}
                  />
                  <Plus size={28} />
                </Button>
              </div>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable
                droppableId={"items"}
                direction={"horizontal"}
                type={"list"}
              >
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={
                      "flex justify-center items-start gap-2 transition mt-20 flex-wrap"
                    }
                  >
                    {items.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided) => (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Card
                                  ref={provided.innerRef}
                                  {...provided.dragHandleProps}
                                  {...provided.draggableProps}
                                  className={
                                    "w-[200px] h-[260px] overflow-hidden transition-transform transform relative hover:border hover:border-dashed hover:border-primary/80 shadow-sm "
                                  }
                                  onMouseEnter={() => setHoveredIndex(index)}
                                  onMouseLeave={() => setHoveredIndex(null)}
                                >
                                  <div className="">
                                    {/* Show remove button on hover */}
                                    {hoveredIndex === index && (
                                      <Button
                                        size={"icon"}
                                        variant={"ghost"}
                                        className="absolute top-1 right-1 z-50 rounded-full text-muted-foreground hover:bg-primary hover:text-primary-foreground bg-secondary"
                                        onClick={() => handleRemovePDF(item.id)}
                                      >
                                        <XCircle />
                                      </Button>
                                    )}

                                    <Document
                                      className={
                                        "w-[160px] overflow-hidden mx-auto mt-6 shadow-md h-[200px] rounded-lg"
                                      }
                                      file={item.file}
                                      onLoadSuccess={({ numPages }) => {
                                        setNumPages(numPages);
                                      }}
                                    >
                                      {/* Use the first page and set the scale based on card dimensions */}
                                      <Page
                                        pageNumber={1}
                                        width={160} // Adjust the width as needed
                                        height={160} // Adjust the height as needed
                                        scale={1.0} // Set the scale based on your calculations
                                      />
                                    </Document>
                                  </div>
                                  {/* Display PDF name below the document */}
                                  <p className="mt-2 text-xs text-foreground/60 font-medium w-[160px] truncate ... mx-5 text-center">
                                    {item.title}
                                  </p>
                                </Card>
                              </TooltipTrigger>
                              <TooltipContent className="bg-muted-foreground">
                                <p className="text-muted font-semibold">{`${item.info.size} - ${item.info.pages} pages`}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
          {/* Merge section */}
          <div className="bg-white w-full flex flex-col items-center relative">
            <div className="py-5 border-b border-muted-foreground w-full">
              <h3 className="text-[28px] font-medium text-center">Merge PDF</h3>
            </div>

            <div className="py-6 bg-sky-100 mt-6 w-11/12 mx-auto rounded-md">
              <p className="text-[16px] px-6 py-1 text-foreground">
                To change the order of your PDFs, drag and drop the files as you
                want.
              </p>
            </div>

            <div className="w-11/12 mx-auto absolute bottom-20">
              <Button className="text-[24px] font-medium h-[82px] w-full">
                Merge PDF <ArrowRightCircle className="ml-3" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;
