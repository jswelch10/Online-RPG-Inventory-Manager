// import './App.css'
import React, {useState} from "react";
import PlayerView from './views/PlayerView'
import TestView from './views/TestView'
import HostView from './views/HostView'
import { useSelector } from 'react-redux'
import LobbyView from "./views/LobbyView";
import ContextWrapper from "./components/ContextWrapper";
import Banner from "./components/Banner";
function App() {
    const currentView = useSelector((state) => state.view.currentView)
    // console.log("test: ", currentView)
    const playerId = useSelector(state => state.websocket.playerId)
    // const currentView = 'lobby'

    function getView(expr) {
        switch (expr) {

            case 'test':
                return <ContextWrapper><Banner /><PlayerView playerId={'tourist'}/></ContextWrapper>
            case 'lobby':
            case 'lobby-host':
            case 'lobby-player':
                return <LobbyView viewType={expr}/>
            case 'host':
                return <ContextWrapper><HostView /></ContextWrapper>
            case 'player':
                return <ContextWrapper><PlayerView playerId={playerId}/></ContextWrapper>
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
