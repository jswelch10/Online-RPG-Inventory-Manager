import Search from "./Search";
import React from "react";
import {DndContext, MouseSensor, DragOverlay, useSensor, useSensors} from "@dnd-kit/core";
import {addItem, removeItem} from "../slices/inventorySlice";
import TooltipOverlay from "./Tooltip-Overlay";
import {useDispatch, useSelector} from "react-redux";
import {useWsDispatch} from "../redux_middleware/websocketMiddleware";


export default function ContextWrapper(props) {
    const isWSConnected = useSelector( state => state.websocket.isActive)
    const dispatch = useDispatch()
    const wsDispatch = useWsDispatch(dispatch, useSelector)

    const packs = useSelector(state => state.inventory) //used in function
    // console.log(packs)


    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 5,
        }
    })
    const sensors = useSensors(
        mouseSensor
    )

   const isValidPackTransfer = payload => {
        if(payload.isDestroyed && payload.fromPlayer) return true
       //find pack that item is being sent to
       const pack = packs[payload.toPlayer].find(pack => pack.id === payload.toPack)
       const verdict = pack.currentSize + payload.item.size <= pack.maxSize
       console.log("isValidPackTransfer: ", verdict)
       return verdict
       //check if new pack can accommodate new item

       //if it can't return false

   }
    function handleDragStart(e) {
        //TODO: what is this for? lol
    }
    function handleDragEnd(e) {
        console.log('drag end event: ', e)

        // add and remove must be decoupled from the id's needed by drag n drop toolkit
        // TODO: implement wsDispatch since this handled inventory, might have to redo all inventory
        // if(e.over.id !== e.active.data.current) { // if the item moves to a different location
        //     // const payload = generateItemDataPayload(e, packs)
        //     if (!payload.item.isResult) dispatch(removeItem(payload))
        //     if (!payload.isDestroyed) dispatch(addItem(payload))
        // }

        /***************************************************/
        const item = e.active.data.current
        // console.log("drag end: ", item )
        // dispatch(addItem(payload))
        const payload = {
            item,
            toPack: e.over.id,
            fromPack: e.active.data.current.packId,
            fromPlayer: e.active.data.current.playerId,
            toPlayer: e.over.data.current?.playerId,
            isDestroyed: e.over.id === 'destroy-item-droppable'
        }


        // console.log("handle drag end, toPlayer: ",payload.toPlayer)
        // console.log("from id: ", payload.from)
        //TODO: maybe combine remove/add = move?
        if(isValidPackTransfer(payload)) {
            if (isWSConnected) {
                // console.log('handle drag end, isWSConnected: ', isWSConnected)
                console.log('drag end payload: ', payload)
                if (!payload.item.isResult) wsDispatch(removeItem(payload))
                if (!payload.isDestroyed) wsDispatch(addItem(payload))

            } else {
                if (!payload.item.isResult) dispatch(removeItem(payload))
                if (!payload.isDestroyed) dispatch(addItem(payload))
            }
        }

    }

    return(
        <DndContext sensors={sensors}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    autoScroll={false}
        >
            <Search />

            {props.children}

            <TooltipOverlay />
        </DndContext>
    )

}