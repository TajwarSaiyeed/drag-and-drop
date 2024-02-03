'use client';
import { useEffect, useState } from "react";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { Grip, Pencil } from "lucide-react";


const Page = () => {
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [items, setItems] = useState<any[]>([
        { id: "1", title: "Item 1", isPublished: true },
        { id: "2", title: "Item 2", isPublished: true },
        { id: "3", title: "Item 3", isPublished: true },
        { id: "4", title: "Item 4", isPublished: true },
        { id: "5", title: "Item 5", isPublished: true },
    ]); // Changed type to any[]

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

    if (!isMounted) return null;

    return (
        <div>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId={"items"}>
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {items.map((item, index) => (
                                <Draggable
                                    key={item.id}
                                    draggableId={item.id}
                                    index={index}
                                >
                                    {(provided) => (
                                        <div
                                            className={cn(
                                                "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                                                item.isPublished &&
                                                "bg-sky-100 border-sky-200 text-sky-700"
                                            )}
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                        >
                                            <div
                                                className={cn(
                                                    "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                                                    item.isPublished &&
                                                    "border-r-sky-200 hover:bg-sky-200"
                                                )}
                                                {...provided.dragHandleProps}
                                            >
                                                <Grip className={"h-5 w-5"} />
                                            </div>
                                            {item.title}
                                        </div>
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

export default Page;
