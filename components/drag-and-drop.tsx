'use client'
import {DragDropContext, Draggable, Droppable, DropResult} from "@hello-pangea/dnd";
import {Card} from "@/components/ui/card";
import {Document, Page} from "react-pdf";
import React, {Dispatch, SetStateAction, useState} from "react";
import useScreenSize from "@/hooks/useScreenSize";

const DragAndDrop = ({items, setItems}: { items: any, setItems: Dispatch<SetStateAction<any[]>> }) => {
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [numPages, setNumPages] = useState<number>(0);
    const {isMobile, isSm, isMd, isLg, isXl, is2xl} = useScreenSize();
    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const itemsCopy = Array.from(items);
        const [reorderedItem] = itemsCopy.splice(result.source.index, 1);
        itemsCopy.splice(result.destination.index, 0, reorderedItem);

        const startIndex = Math.min(result.source.index, result.destination.index);
        const endIndex = Math.max(result.source.index, result.destination.index);

        const updateItems = itemsCopy.slice(startIndex, endIndex + 1);
        setItems(itemsCopy);

    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId={"items"} direction={"horizontal"} type={"list"}>
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={"grid grid-cols-4 gap-2 transition"}
                    >
                        {items.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(provided) => (
                                    <Card
                                        ref={provided.innerRef}
                                        {...provided.dragHandleProps}
                                        {...provided.draggableProps}
                                        className={
                                            "max-w-[150px]  transition-transform transform"
                                        }
                                    >
                                        <Document
                                            file={item.file}
                                            onLoadSuccess={({numPages}) => {
                                                setNumPages(numPages);
                                            }}
                                        >
                                            <Page
                                                pageNumber={pageNumber}
                                                renderTextLayer={false}
                                                renderAnnotationLayer={false}
                                                // className="max-w-[10px] max-h-fit border border-red-600"
                                                width={is2xl ? 300 : isLg ? 250 : 150}
                                            />
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
    );
};

export default DragAndDrop;