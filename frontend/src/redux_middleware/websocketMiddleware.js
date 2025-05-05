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
                const state = storeAPI.getState()
                action.metadata = {
                    lobbyId: state.websocket.lobbyId,
                    user: state.view.userType,
                    playerId: state.websocket.playerId
                }
                console.log('requesting orders from high command: ', action)

                socket.send(JSON.stringify(action)) //probably errors
                action = action.subAction
                break

        //when the server sends data and the websocket uses store dispatch
            case 'RECEIVED_WEBSOCKET_MESSAGE':
                //unwrap metadata around the action and pass it through
                //only host needs to unwrap
                action = action.subAction

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

