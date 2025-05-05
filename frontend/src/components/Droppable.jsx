import React from "react";
import {useDroppable} from "@dnd-kit/core";

export function Droppable(props) {
    return (
         <div>
            {props.children}
        </div>
    )
}