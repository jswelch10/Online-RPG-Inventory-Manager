import './HostView.css'
import react from 'react'
import {useSelector} from 'react-redux'
import ContextWrapper from "../components/ContextWrapper";
import PlayerGameView from "./PlayerGameView";
import {store} from "../components/store";

function HostGameView() {
    const players = useSelector(state => state.inventory)
    const lobbyId = useSelector(state => state.websocket.lobbyId)

    // console.log('hostview info',lobbyId, players)

    // const playersRender = players.map(player => <li>{player.name}</li>)
    const playersArr = []
    // console.log('Object.keys: ', Object.keys(players))
    if(Object.keys(players).length > 0) {
        for(const player in players) {
            if(player !== 'tourist') {
                playersArr.push({
                    playerId: players[player].playerId,
                    characterName:players[player].characterName,
                    characterId: player,
                    inventory:players[player].inventory
                })
            }

        }
    }
    // console.log(playersArr)
    const playersRender = playersArr.length > 0 ? playersArr.filter(player => player.playerId !== 'tourist').map((player, i, players) => {
        // console.log("inside host view playersrender: ", player)
        return <div className={'host-view--player'}
                    // style={{scale: `${1/players.length}`}}
        >
            <PlayerGameView key={player.playerId}
                            playerId={player.playerId}
                            characterId={player.characterId}
            >
                <h1>{`${player.characterName}: ${player.playerId}: ${player.characterId}`}</h1>
            </PlayerGameView>
        </div>
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

export default HostGameView