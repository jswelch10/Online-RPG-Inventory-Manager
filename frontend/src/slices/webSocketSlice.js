import {createSlice, nanoid} from "@reduxjs/toolkit";


export const websocketSlice = createSlice({
    name: 'websocket',
    initialState: {
        isActive: false,
        lobbyId: null,
        // host: 1234,
        playerId: 'tourist',
        players: {}

    },
    reducers: {
        // //TODO: do I need this? should it be handled differently
        // setLobbyId: (state, action) => {
        //     state.lobbyId = action.payload.id
        // },
        setupWebsocket: (state, action) => {
            state.isActive = true

            state.lobbyId = action.payload.lobbyId
            console.log('inside setupwebsocket, playerId: ', action.payload.playerId || 'host')
            state.playerId = action.payload.playerId || 'host'
            state.campaign = action.payload.campaign
            // state.userId = nanoid()
        },

        hostAddPlayer: (state, action) => {
            // if (action.payload.action === 'add') state.players[action.payload.playerId] = action.payload.name
            // if (action.payload.subAction === 'add') state.players.push({
            //     playerId: action.payload.playerId,
            //     name:action.payload.name,
            // })

            // state.players.push({
            //     playerId: action.payload.playerId,
            //     name:action.payload.name,
            //     packs: action.payload.packs
            // })
            state.players[action.payload.playerId] = action.payload.packs

        },

        }
    }
)
export const {
    // setLobbyId,
    setupWebsocket,
    hostAddPlayer
} = websocketSlice.actions

export default websocketSlice.reducer