import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    currentView: 'test',
    userType: 'tourist', //host, player, tourist
    data: {},
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
        changeUserType: (state, action) => {
            switch (action.payload) {
                case 'host':
                    state.userType = 'host'
                    break;
                case 'player':
                    state.userType = 'player'
                    break;
                default:
                    state.userType = 'tourist'
            }

        },
        createLobbyView: (state) => {
            state.currentView = 'lobby-host'
            state.userType = 'host'
        },
        joinLobbyView: (state) => {
            state.currentView = 'lobby-player'
            state.userType = 'player'
        },
        toTestPage: (state) => {
            state.currentView = 'test'
            state.userType = 'tourist'
        }
    }
})

export const {
    changeView,
    changeUserType,
    createLobbyView,
    joinLobbyView,
    toTestPage,
} = viewSlice.actions

export default viewSlice.reducer