import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    currentView: 'test', //host, player, tourist
    // data: {},
}

export const viewSlice = createSlice({
    name: 'view',
    initialState,
    reducers: {
        changeView: (state, action) => {
            /*
            * 'test'
            * 'lobby'
            * 'lobby-host'
            * 'lobby-player'
            * 'host'
            * 'player'
            */
            // console.log(action)
            state.currentView = action.payload.view
        },
        createLobbyView: (state) => {
            state.currentView = 'lobby-host'
            // state.userType = 'host'
        },
        joinLobbyView: (state) => {
            state.currentView = 'lobby-player'
            // state.userType = 'player'
        },
        toTestPage: (state) => {
            state.currentView = 'test'
            // state.userType = 'tourist'
        },
        toPlayerGameView: state => {
            state.currentView = 'player'
        },
        toHostGameView: state => {
            state.currentView = 'host'
        }
    }
})

export const {
    changeView,
    // changeUserType,
    createLobbyView,
    joinLobbyView,
    toTestPage,
    toPlayerGameView,
    toHostGameView,
} = viewSlice.actions

export default viewSlice.reducer