// import './PlayerView.css'
import React, {useState} from "react";
import Search from '../components/Search'
import Inventory from '../components/Inventory'
import TooltipOverlay from '../components/Tooltip-Overlay'
import ContextWrapper from "../components/ContextWrapper";
import {DndContext, MouseSensor, DragOverlay, useSensor, useSensors} from "@dnd-kit/core";
import { useSelector, useDispatch } from "react-redux";
import {addItem, removeItem} from "../slices/inventorySlice";
// import {addTooltip, removeTooltip} from "./slices/tooltipSlice"

function PlayerView(props) {

    // const [active, setActive] = useState(null)
    // const id = useSelector(state => state.websocket.playerId)
    // const isConnected = useSelector(state => state.websocket.isActive)
    // const info = isConnected ? <h1>`id: ${props.player.playerId}, name: ${props.player.name}`</h1> : null

    // const name = useSelector(state => state.websocket.name)

    // const mouseSensor = useSensor(MouseSensor, {
    //     activationConstraint: {
    //         distance: 5,
    //     }
    // })
    // const sensors = useSensors(
    //     mouseSensor
    // )

    // const dispatch = useDispatch()


    return (
        // <DndContext sensors={sensors}
        //             onDragStart={handleDragStart}
        //             onDragEnd={handleDragEnd}
        //             autoScroll={false}
        // >
        //     <Search />
        <>
            {props.children}
            <Inventory playerId={props.playerId} />
        </>
            // <TooltipOverlay />
        // </DndContext>
    )

    // function handleDragEnd(e) {
    //   if (e.over) {
    //       setIsDropped(true);
    //   }
    // }
    // function handleDragStart(e) {
    //     //TODO: what is this for? lol
    // }
    // function handleDragEnd(e) {
    //     // console.log(e)
    //     const data = e.active.data.current
    //     const isDestroyed = e.collisions[0].id === 'destroy-item-droppable'
    //     // console.log(e)
    //     const payload = {
    //         item:data,
    //         to: e.over.id,
    //         from: data.parentId
    //     }
    //     if(!payload.item.isResult) dispatch(removeItem(payload))
    //     if(!isDestroyed) dispatch(addItem(payload))
    //
    //
    // }
}

export default PlayerView
