import createWebSocket from "../websocket";

export function useWsDispatch(dispatch, useSelector) {
    //TODO: can i change needsConnect to be based on websocket.isActive instead,
    // then i can use this function for both test and player dispatches

    const connectionIsActive = useSelector(state=>state.websocket.isActive)

    const type = connectionIsActive ? 'SEND_WEBSOCKET_MESSAGE' : 'CREATE_WEBSOCKET_CONNECTION'

    return function(subAction, metadata = {}) {
        console.log('inside custom dispatch: ', subAction)
        const action = {
            type,
            subAction,
            metadata
        }
        return dispatch(action)
    }
}


export const websocketMiddleware = storeAPI => {
    // console.log('init?')
    let socket

    return next => action => {
        // console.log('repeated?: ', action)
        // console.log(action)
        const state = storeAPI.getState()
        switch (action.type) {
            //when the lobby is created
            case 'CREATE_WEBSOCKET_CONNECTION':
                const {type, metadata, subAction} = action
                socket = createWebSocket({type, metadata}, storeAPI)
                // socket.send()
                console.log("inside websocketMiddleware, metadata: ", metadata)
                action = subAction
                break

            //when a dispatch sends data to the server
            case 'SEND_WEBSOCKET_MESSAGE':
                //this should wrap payload with metadata


                action.metadata = {
                    lobbyId: state.websocket.lobbyId,
                    // user: state.view.userType,
                    playerId: state.websocket.playerId,
                    ...action.metadata
                }
                console.log('requesting orders from high command: ', action)

                socket.send(JSON.stringify(action)) //probably errors
                action = action.subAction
                break

            //when the server sends data and the websocket uses store dispatch
            case 'RECEIVED_WEBSOCKET_MESSAGE':
                //unwrap metadata around the action and pass it through
                //only host needs to unwrap
                console.log('trigger 1')
                action = action.subAction
                if (state.websocket.playerId === 'host') {
                    console.log('trigger 2')
                    // if the server needs info from the host, they will grab it here.
                    let data
                    switch (action.type) {
                        // host intercepts this dispatch and gives a shallow player list to the server

                        case 'websocket/requestCharacterList':
                            console.log('trigger 3: ', action.payload)
                            data = {
                                type: 'SEND_WEBSOCKET_MESSAGE',
                                subAction: {
                                    type: action.type,
                                    payload: {
                                        playerId: action.payload.playerId, // this is where it should go
                                        characters: {}
                                    },
                                },
                                metadata: {
                                    lobbyId: state.websocket.lobbyId,
                                    playerId: state.websocket.playerId,
                                }

                            }
                            console.log('inside wm, rcl, received payload: ', action.payload)
                            const {characters} = JSON.parse(window.localStorage.getItem(action.payload.campaign.value))
                            if (Object.keys(characters).length !== 0) {
                                for (const character in characters) {
                                    data.subAction.payload.characters[character] = characters[character].characterName
                                }
                            }
                            console.log('inside wm, sending payload: ', data)
                            socket.send(JSON.stringify(data))
                            break
                        case 'websocket/requestCharacterInventory':
                            console.log('trigger 4')
                            console.log('inside wm, rci, received payload: ', action.payload)
                            data = {
                                type: 'SEND_WEBSOCKET_MESSAGE',
                                subAction: {
                                    type: action.type,
                                    payload: {
                                        playerId: action.payload.playerId, // self ref from requesting player
                                    }
                                },
                                metadata: {
                                    lobbyId: state.websocket.lobbyId,
                                    playerId: state.websocket.playerId      //will always be host
                                }
                            }
                            const p = action.payload
                            const characterId = p.selectedCharacter.value
                            const {name, inventory} = JSON.parse(window.localStorage.getItem(p.campaign.value)).characters[charId]
                            data.subAction.payload.character = {
                                characterId,
                                name,
                                inventory
                            }
                            console.log('inside wm, sending payload: ', data)
                            socket.send(JSON.stringify(data))

                            break
                    }
                }

                // console.log('orders from high command:', action)

                break

            default:
                // console.log('websocket middleware passthru', action)
        }

        return next(action)
    }
}
// export const loggerMiddleware = storeAPI => next => action => {
//     console.log('redux dispatched', action)
//     let result = next(action)
//     console.log('next state', storeAPI.getState())
//     return result
// }

