// import './HostView.css'
import react from 'react'
import {useSelector} from 'react-redux'
import ContextWrapper from "../components/ContextWrapper";
import PlayerView from "./PlayerView";
import {store} from "../components/store";

function HostView() {
    const players = useSelector(state => state.inventory)
    const lobbyId = useSelector(state => state.websocket.lobbyId)

    // console.log('hostview info',lobbyId, players)

    // const playersRender = players.map(player => <li>{player.name}</li>)
    const playersArr = []
    // console.log('Object.keys: ', Object.keys(players))
    if(Object.keys(players).length > 0) {
        for(const playerId in players) {
            playersArr.push({playerId, packs:players[playerId]})
        }
    }
    // console.log(playersArr)
    const playersRender = playersArr.length > 0 ? playersArr.filter(player => player.playerId !== 'tourist').map(player => {
        // console.log("inside host view playersrender: ", player))
        return <>

            <PlayerView key={player.playerId} playerId={player.playerId}>
                <h1>{`${player.name}: ${player.playerId}`}</h1>
            </PlayerView>
        </>
    }) : null


    // console.log(store.getState())

    return(

        <div className="host-view">
            <div className="host-info">{lobbyId}</div>
            <div>
                <h3>Players:</h3>
                <ul>
                    {playersRender}
                </ul>
            </div>
        </div>

    )

}

export default HostView