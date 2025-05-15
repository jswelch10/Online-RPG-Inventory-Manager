import React, {useState} from "react";
import Inventory from '../components/Inventory'
function PlayerGameView(props) {
    console.log('playerId: ', props.playerId)
    return (
        <>
            {props.children}
            {props.playerId}
            <Inventory inventory={props.inventory}
                       playerId={props.playerId}
                       characterId={props.characterId}
            />
        </>
    )
}

export default PlayerGameView
