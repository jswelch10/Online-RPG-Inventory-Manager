import react from "react";
import {disconnect} from "../slices/webSocketSlice";
import {removeCharacter} from "../slices/inventorySlice";
import {toTestPage} from "../slices/viewSlice";
import {useDispatch, useSelector} from 'react-redux'
import {useWsDispatch} from "../redux_middleware/websocketMiddleware";
import React from "react";


export default function GameControls(props) {
    const dispatch = useDispatch()
    const wsDispatch = useWsDispatch(dispatch, useSelector)
    const characterId = props.characterId || undefined

    const wsToTestPage = () => {
        // console.log('disconnecting, characterId: ')
        wsDispatch(disconnect({characterId}))
        dispatch(removeCharacter(characterId))
        dispatch(toTestPage())
    }

    return (props.isWSConnected ?
        <>
            <button onClick={wsToTestPage}>Leave Game</button>
        </>
        : null)
}