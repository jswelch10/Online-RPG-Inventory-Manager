import {createSlice, nanoid} from "@reduxjs/toolkit";


export const websocketSlice = createSlice({
    name: 'websocket',
    initialState: {
        isActive: false,
        lobbyId: null,
        // host: 1234,
        playerId: 'tourist',
        characterId: 'tourist',
        characters: {}

    },
    reducers: {
        // //TODO: do I need this? should it be handled differently
        // setLobbyId: (state, action) => {
        //     state.lobbyId = action.payload.id
        // },
        setupGameData: (state, action) => {
            //only the host activates this
            state.players = action.payload.players

        },
        requestCharacterList: (state, action) => {
            console.log('websocketSlice rcl triggered: ', action)
            state.characters = action.payload?.characters
        },
        requestCharacterInventory:(state, action) => {
            //this function handles 3 scenarios:
            // player where dispatch was originated
            // the host that received the request dispatch
            // the data that has been sent from the host/server to the OG player

            if(state.playerId !== 'host') state.characterId = action.payload.value
            if(state.playerId ==='host') state.characters[action.payload.characterId] = action.payload.playerId
            console.log("rci ws slice: ", state.playerId)
        }, // used by websocketMiddleware switch, accepts update for playerId


        setupWebsocket: (state, action) => {
            //data from server to set state
            state.isActive = true

            state.lobbyId = action.payload.lobbyId
            console.log('inside setupwebsocket, playerId: ', action.payload.playerId || 'host')
            state.playerId = action.payload.playerId || 'host'
            state.campaign = action.payload.campaign
            // state.userId = nanoid()
        },

        hostAssociatePlayer: (state, action) => {
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
            state.characters[action.payload.inventoryId] = action.payload.playerId

        },

        }
    }
)
export const {
    // setLobbyId,
    requestCharacterList,
    requestCharacterInventory,
    setupGameData,
    setupWebsocket,
    hostAssociatePlayer
} = websocketSlice.actions

export default websocketSlice.reducer