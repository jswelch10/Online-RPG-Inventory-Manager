// import './App.css'
import React, {useState} from "react";
import PlayerGameView from './views/PlayerGameView'
import TestView from './views/TestView'
import HostGameView from './views/HostGameView'
import { useSelector } from 'react-redux'
import ContextWrapper from "./components/ContextWrapper";
import Banner from "./components/Banner";
import HostLobbyView from "./views/HostLobbyView";
import PlayerLobbyView from "./views/PlayerLobbyView";
function App() {
    const   currentView = useSelector((state) => state.view.currentView),
            {
                // characterId,
                playerId} = useSelector(state => state.websocket),
            inventory = useSelector(state => state.inventory),
            characterId = Object.keys(inventory)[0]
            console.log('app characterId: ', characterId)


            // inventory = useSelector(state => state.inventory)
            // inventoryId = inventory[Object.keys(inventory)[0]]
            // console.log('app, characterId: ', characterId, playerId)

    function getView(expr) {
        switch (expr) {

            case 'test':
                return  <ContextWrapper>
                            <Banner />
                            <PlayerGameView />
                        </ContextWrapper>
            case 'lobby':
            case 'lobby-host':
                return <HostLobbyView />
            case 'lobby-player':
                return <PlayerLobbyView />
            case 'host':
                return  <ContextWrapper characterId={characterId}>
                            <HostGameView />
                        </ContextWrapper>
            case 'player':
                return  <ContextWrapper characterId={characterId}>
                            <PlayerGameView characterId={characterId}
                                            playerId={playerId}/>
                        </ContextWrapper>
            default:
                console.log(`"${expr}" view not found`)
        }
    }
    const display = getView(currentView)

    return (
        <>
        {display}
        </>
    )
}

export default App
