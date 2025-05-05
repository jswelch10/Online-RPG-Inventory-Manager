import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tooltipIsActive: false,
    data: {}
}

export const tooltipSlice = createSlice({
    name: 'tooltip',
    initialState,
    reducers: {
        displayTooltip: (state, action) => {
            state.data = action.payload
            state.tooltipIsActive = true
        },
        hideTooltip: (state) => {
            state.tooltipIsActive = false
            state.data = {}
        }
    }
})

export const {
    displayTooltip,
    hideTooltip
} = tooltipSlice.actions

export default tooltipSlice.reducer