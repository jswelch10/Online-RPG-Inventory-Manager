import {createSlice, current, nanoid} from "@reduxjs/toolkit";

const initialState = {
    isActive: false,
    lobbyId: null, //used by the server to identify which lobby
    // host: 1234,
    playerId: 'tourist', //used by everyone to identify their socket on the server
    characterId: 'tourist', // used by players to identify their inventories
    characters: {} //used by host to keep track of the different players in the lobby

}

export const websocketSlice = createSlice({
    name: 'websocket',
    initialState,
    reducers: {
        setupGameData: (state, action) => {
            //only the host activates this
            state.characters = action.payload.characters || {}

        },
        setupWebsocket: (state, action) => {
            //data from server to set state

            state.isActive = true

            state.lobbyId = action.payload.lobbyId
            console.log('inside setupwebsocket, playerId: ', action.payload.playerId || 'host')
            state.playerId = action.payload.playerId || 'host'
            state.campaign = action.payload.campaign
            console.log(current(state))
            // state.userId = nanoid()
        },
        requestCharacterList: (state, action) => {
            console.log('websocketSlice rcl triggered: ', action)
            if(state.playerId !== 'host') state.characters = action.payload?.characters

        },
        getCharacterListFromHost: (state,action) => {
            // this dispatch is from the player and is handled in websocketMiddleware.js
            // it's also the reducer used by the player to initiate a websocket connection,
            // the setup of which takes place in the messageHandler.js file on the server
        },
        sendCharacterListToPlayer: (state,action) => {
            console.log('scltp', current(state), action)
            state.characters = action.payload?.characters
        },
        sendNewCharacterToHost: (state,action) => {
            if(state.playerId === 'host') {
                state.characters[action.payload.character.value] = {
                    characterName: action.payload.character.name,
                    isActive: true
                }
            }
        },
        getCharacterInventoryFromHost:(state,action) => {
            if(state.playerId === 'host') {
                state.characters[action.payload.character.value] = {
                    characterName: action.payload.character.name,
                    isActive: true
                }
            } else {
                state.characterId = action.payload.value
            }
        },
        requestCharacterInventory:(state, action) => {
            // console.log('************************HELLO***********************************',
            //     action.payload.character?.value,
            //     action.payload.character?.name,
            //     )

            // the host that received the request dispatch

            // console.log("rci ws slice: ", current(state))
            if(state.playerId !== 'host') {
                state.characterId = action.payload.value
            }

            if(state.playerId ==='host') {
                // when host receives this dispatch from the server,
                // it adds the character to it's state.characters obj
                // and saves the new character
                state.characters[action.payload.character.value] = action.payload.character.name

                //saving to storage, does this need to take place here or will inventory suffice?
                //i guess it's because i need the campaign value?
                // can it be sent to syncivnentory instead?

                const gameData = JSON.parse(window.localStorage.getItem(state.campaign.value))
                gameData.characters[action.payload.character.value] = {
                    characterName: action.payload.character.name,
                    inventory: action.payload.inventory
                }

                window.localStorage.setItem(state.campaign.value, JSON.stringify(gameData))
            }

        },
        removeCharacter: (state, action) => {
            console.log('removeCharacter', current(state), action)
            state.characters[action.payload.characterId].isActive = false
        },
        disconnect: (state, action) => {
            for (const key in state)
            state[key] = initialState[key]
        }

    }
})
export const {
    // setLobbyId,
    requestCharacterList,
    requestCharacterInventory,
    setupGameData,
    setupWebsocket,
    sendNewCharacterToHost,
    getCharacterListFromHost,
    sendCharacterListToPlayer,
    getCharacterInventoryFromHost,
    sendCharacterInventoryToPlayer,
    sendCharacterInventoryToHost,
    // hostAssociatePlayer,
    removeCharacter,
    disconnect
} = websocketSlice.actions

export default websocketSlice.reducer