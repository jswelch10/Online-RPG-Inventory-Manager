import React, {useState} from "react";
import Inventory from '../components/Inventory'
import {disconnect} from "../slices/webSocketSlice";
import {toTestPage} from "../slices/viewSlice";
import {useDispatch, useSelector} from "react-redux";
import {useWsDispatch} from "../redux_middleware/websocketMiddleware";
import {removeCharacter} from "../slices/inventorySlice";
function PlayerGameView(props) {
    // console.log('playerId: ', props.playerId)
    const   dispatch = useDispatch(),
            wsDispatch = useWsDispatch(dispatch, useSelector)
            // characterId = useSelector(state => state.websocket.characterId)

    // const wsToTestPage = () => {
    //     // console.log('disconnecting, characterId: ')
    //             wsDispatch(disconnect({characterId:props.characterId}))
    //             dispatch(removeCharacter(props.characterId))
    //             dispatch(toTestPage())
    //         }
    return (
        <>
            {props.children}
            {props.playerId}
            {/*<button onClick={wsToTestPage}>Leave Game</button>*/}
            <Inventory inventory={props.inventory}
                       playerId={props.playerId}
                       characterId={props.characterId}
            />
        </>
    )
}

export default PlayerGameView
