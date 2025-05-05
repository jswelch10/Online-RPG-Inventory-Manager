import React from "react";
import {useDroppable} from "@dnd-kit/core";
import {Droppable} from "./Droppable";

export default function DestroyItemDrop() {
    const {isOver, setNodeRef} = useDroppable({
        id: "destroy-item-droppable"
    })

    const style = {
        backgroundColor: isOver ? 'red': undefined,
    }


    return (
        // <Droppable>
            <div className="destroy-item" style={style} ref={setNodeRef}>Destroy Item</div>
        // </Droppable>
    )
}