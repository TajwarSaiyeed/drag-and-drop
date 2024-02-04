'use client';
import {useEffect, useState} from "react";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "@hello-pangea/dnd";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {Document, Page, pdfjs} from "react-pdf";
import workerSrc from 'pdfjs-dist/build/pdf.worker.entry.js'

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;


function reorder<T>(item: T[], startIndex: number, endIndex: number) {
    const result = Array.from(item);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};


const HomePage = () => {
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [numPages, setNumPages] = useState<number>(0);
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [items, setItems] = useState<any[]>([]); // Changed type to any[]

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setItems(items);
    }, [items]);

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const itemsCopy = Array.from(items);
        const [reorderedItem] = itemsCopy.splice(result.source.index, 1);
        itemsCopy.splice(result.destination.index, 0, reorderedItem);

        const startIndex = Math.min(result.source.index, result.destination.index);
        const endIndex = Math.max(result.source.index, result.destination.index);

        const updateItems = itemsCopy.slice(startIndex, endIndex + 1);
        setItems(itemsCopy);

        // Assuming `onReorder` function is defined somewhere
        const bulkUpdateData = updateItems.map((item) => ({
            id: item.id,
            position: itemsCopy.findIndex((i) => i.id === item.id),
        }));

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

    const handleButtonClick = () => {
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        fileInput.click();
    };


    if (!isMounted) return null;

    return (
        <div className={'relative'}>
            <Button onClick={handleButtonClick} variant={'destructive'} size={'lg'} className={cn('',
                items.length > 0 && "absolute top-0 right-0 z-10"
            )}>
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

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId={"items"} direction={'horizontal'} type={"list"}>
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}
                             className={'grid grid-cols-4 gap-2 transition'}>
                            {items.map((item, index) => (
                                <Draggable
                                    key={item.id}
                                    draggableId={item.id}
                                    index={index}
                                >
                                    {(provided) => (
                                        <Card
                                            ref={provided.innerRef}
                                            {...provided.dragHandleProps}
                                            {...provided.draggableProps}
                                            className={'w-40 h-40 transition-transform transform'}
                                        >
                                            <Document
                                                file={item.file}
                                                onLoadSuccess={({numPages}) => {
                                                    setNumPages(numPages);
                                                }}
                                            >
                                                <Page pageNumber={pageNumber}/>
                                            </Document>
                                        </Card>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default HomePage;
