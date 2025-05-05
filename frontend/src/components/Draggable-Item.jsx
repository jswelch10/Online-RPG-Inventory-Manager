import React, {useEffect, useState} from 'react'
import {useDraggable} from "@dnd-kit/core";
import {useDispatch, useSelector} from "react-redux";
import {displayTooltip, hideTooltip} from "../slices/tooltipSlice"
import {CSS} from "@dnd-kit/utilities"
import {useWsDispatch} from "../redux_middleware/websocketMiddleware";

export default function DraggableItem({data, ...props}) {
    const {isResult} = props
    const {id} = data
    const [timeoutId, setTimeoutId] = useState(null)
    const [tooltipActive, setTooltipActive] = useState(false)
    const dispatch = useDispatch()


    const mouseHoverStart = () => {
        setTimeoutId(setTimeout(() => {
            // setTooltipActive(true)
            // console.log(data)
            dispatch(displayTooltip(data))
            // alert('hovering')
        }, 600))

    }
    const mouseHoverEnd = () => {
        clearTimeout(timeoutId)
        setTimeoutId(null)
        // setTooltipActive(false)
        dispatch(hideTooltip())
    }
    //TODO: handle dragging adding tooltip-active, or maybe draggable tooltip? or tooltip section?

    // const [id, setId] = useState(crypto.randomUUID())
    const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id,
    data
    })
    const scale =  1
    const magic = Math.sqrt(1/scale)
    if(transform) {
        transform.x *= magic
        transform.y *= magic
    }
    const style = transform ? {
        zIndex:50,
        transform: CSS.Translate.toString(transform),

    } : undefined

    return (
        <div className={`draggable-item${tooltipActive ? " tooltip-active" : ''}`}
             key={id}
             ref={setNodeRef}
             style={style}
             {...listeners}
             {...attributes}
             onMouseOver={mouseHoverStart}
             onMouseLeave={mouseHoverEnd}
        >
            {props.children}
        </div>
    )
}