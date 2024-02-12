'use client';
import React, {useState, useEffect} from "react";
import {DragDropContext, Droppable, Draggable, DropResult} from "@hello-pangea/dnd";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {Plus, Trash, UploadCloud, XCircle} from "lucide-react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import axios from "axios";


function reorder<T>(item: T[], startIndex: number, endIndex: number) {
    const result = Array.from(item);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
}

const ImageToDoc = () => {
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [items, setItems] = useState<any[]>([]);

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
    };

    const handleFileDrop = async (event: React.DragEvent<HTMLDivElement>) => {
        try {

            event.preventDefault();
            const files = event.dataTransfer.files;
            if (!files) return

            const formData = new FormData();

            formData.append("file", files[0]);
            const res = await axios.post("/api/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    };

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        try {
            const files = event.target.files;
            if (!files) return

            const formData = new FormData();

            formData.append("file", files[0]);
            const res = await axios.post("/api/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        } catch (error) {
            console.log(error)
        }

    };

    const handleButtonClick = () => {
        const fileInput = document.getElementById("file-input") as HTMLInputElement;
        fileInput.click();
    };

    if (!isMounted) return null;

    const handleRemoveFile = (idToRemove: string) => {
        const updatedItems = items.filter((item) => item.id !== idToRemove);
        setItems(updatedItems);
    };

    return (
        <div
            className="relative bg-secondary w-full h-screen overflow-auto"
            onDrop={handleFileDrop}
            onDragOver={(e) => e.preventDefault()}
        >
            <div className="flex flex-col items-center justify-center space-y-5 pt-10">
                <h1 className="font-semibold text-muted-foreground text-2xl sm:text-3xl">
                    Upload your file to convert
                </h1>
                <p className="text-muted-foreground text-sm">
                    Drag and drop your file here or click to upload
                </p>
                <div
                    onClick={handleButtonClick}
                    className={cn(
                        "border border-dashed border-primary hover:border-none hover:bg-gray-200 rounded-md p-3 text-muted-foreground transition-all font-semibold cursor-pointer h-[200px] max-w-[600px] w-full text-sm flex justify-center items-center flex-col space-y-4 mx-10",
                        items.length > 0 && ""
                    )}
                >
                    <UploadCloud size={60}/>

                    <input
                        type="file"
                        accept=".pdf,.gif,.tiff,.tif,.jpg,.jpeg,.png,.bmp,.webp"
                        id="file-input"
                        onChange={handleFileChange}
                        className={"hidden"}
                    />
                    <p className={'text-muted-foreground text-sm'}>
                        Supports (PDF, GIF, TIFF, TIF, JPG, JPEG, PNG, BMP, WEBP) (5 pages, 20MB max)
                    </p>
                </div>
            </div>

            {
                items.length > 0 && (
                    <div className="grid grid-cols-3 w-full h-screen">
                        <div className="col-span-2 flex justify-center w-full relative">
                            <div className="absolute top-10 right-6">
                                <div className="relative">
                                    <div
                                        className="absolute size-5 bg-black -top-2 -left-3  rounded-full ring-2 ring-primary text-background flex justify-center items-center text-xs font-medium">
                                        {items.length}
                                    </div>
                                    <Button
                                        size={"icon"}
                                        className="rounded-full"
                                        onClick={handleButtonClick}
                                    >
                                        <input
                                            type="file"
                                            accept=".pdf,.gif,.tiff,.tif,.jpg,.jpeg,.png,.bmp,.webp"
                                            multiple
                                            id="file-input"
                                            onChange={handleFileChange}
                                            className={"hidden"}
                                        />
                                        <Plus size={28}/>
                                    </Button>
                                    <div>
                                        <Button
                                            size={"icon"}
                                            className="rounded-full mt-2"
                                            onClick={() => setItems([])}
                                        >
                                            <Trash/>
                                        </Button>
                                    </div>
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
                                                                        {hoveredIndex === index && (
                                                                            <Button
                                                                                size={"icon"}
                                                                                variant={"ghost"}
                                                                                className="absolute top-1 right-1 z-50 rounded-full text-muted-foreground hover:bg-primary hover:text-primary-foreground bg-secondary"
                                                                                onClick={() => handleRemoveFile(item.id)}
                                                                            >
                                                                                <XCircle/>
                                                                            </Button>
                                                                        )}

                                                                        {/* Display the image */}
                                                                        <img
                                                                            src={URL.createObjectURL(item.file)}
                                                                            alt={item.title}
                                                                            className="w-full h-auto"
                                                                        />
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
                    </div>
                )
            }
        </div>
    )
        ;
};

export default ImageToDoc;
