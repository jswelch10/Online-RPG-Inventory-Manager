import './Item.css'
import {nanoid} from "@reduxjs/toolkit";

import DraggableItem from "./Draggable-Item";
import {useState, useEffect} from 'react'
import { useSelector, useDispatch } from "react-redux";
import {incrementItem, decrementItem} from "../slices/inventorySlice"
import {useWsDispatch} from "../redux_middleware/websocketMiddleware";

export default function Item (props) {
    const isWSConnected = useSelector( state => state.websocket.isActive)

    const data = {
        ...props.data,
        isResult: props.isResult,
        playerId: props.playerId,
        packId: props.packId
    }
    // console.log(props.isResult)
    if (data.isResult) data.id = `result-${nanoid(5)}`
    // console.log('playerId associated to item: ', props.playerId)

    const packIndex = props.packSlotNumber
    const itemIndex = props.itemSlotNumber
    const {playerId} = props
    const counter = !data.isResult ? useSelector(state => {
        return state.inventory[playerId][packIndex].items[itemIndex].currentStackCount
    }) : 1
    const dispatch = useDispatch()
    const wsDispatch = useWsDispatch(dispatch, useSelector)

    //ctrl =  +/- 5, shift = to max/min
    const handleIncrementClick = (e) => {
        console.log("clicky++")
        const mods = {
            'ctrl': e.ctrlKey,
            'shift': e.shiftKey
        };
        if(isWSConnected){
            wsDispatch(incrementItem({packIndex, itemIndex, mods, playerId}))
        } else {
            dispatch(incrementItem({packIndex, itemIndex, mods, playerId}))
        }


    }
    const handleDecrementClick = (e) => {
        console.log("clicky--")
        const mods = {
            'ctrl': e.ctrlKey,
            'shift': e.shiftKey
        };
        if(isWSConnected){
            wsDispatch(decrementItem({packIndex, itemIndex, mods, playerId}))
        } else {
            dispatch(decrementItem({packIndex, itemIndex, mods, playerId}))
        }
    }
    const itemStackCounter = data.maxStackCount > 1 ?
        <span className="item-stack-count">{`${counter}/${data.maxStackCount}`}</span>
        : <div/>
    const decrementBtn = counter === 1 ?
        <div className="stack-count-button"/> : <button onClick={handleDecrementClick} className="stack-count-button --decrement">-</button>
    const incrementBtn = counter !== data.maxStackCount && data.maxStackCount > 1 ?
        <button onClick={handleIncrementClick} className="stack-count-button --increment">+</button>
        : <div className="stack-count-button" />

    const counterHTML =
        <div className="item-stack-ui">
            {props.isResult ? null: decrementBtn}
            {props.isResult ? null: itemStackCounter}
            {props.isResult ? null: incrementBtn}
        </div>
    return(
        <DraggableItem data={data}
                       // onMouseOver={e => console.log('onMouseOver')}

        >
            <div className={`slot-item--${data.size}`}>
                {data.name || data.id}
                {counterHTML}
            </div>
        </DraggableItem>
    )
}