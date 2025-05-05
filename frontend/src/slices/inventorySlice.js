import {createSlice, nanoid, current} from "@reduxjs/toolkit";
import Item from "../components/Item";
import React from "react";
import generateInventorySliceData from "../../../utils";

const initialState = {
    'tourist': generateInventorySliceData()
} //returns Pack{}
function deviateMod(item, mods, isAdded) {
    if(mods.shift) {
        item.currentStackCount = isAdded ? item.maxStackCount : 1
    } else if (mods.ctrl) {
        item.currentStackCount = isAdded ? Math.min(item.currentStackCount + 5, item.maxStackCount) :
            Math.max(item.currentStackCount - 5, 1)
    } else {
        if(isAdded) {
            item.currentStackCount++
        } else {
            item.currentStackCount--
        }
    }
}
export const inventorySlice = createSlice({
    name: 'inventory',
    initialState,
    reducers: {
        incrementItem: (state, action) => {
            const {packIndex, itemIndex, mods, playerId} = action.payload
            let item = state[playerId][packIndex].items[itemIndex]
            deviateMod(item, mods, true)

        },
        decrementItem: (state, action) => {
            const {packIndex, itemIndex, mods, playerId} = action.payload
            let item = state[playerId][packIndex].items[itemIndex]
            deviateMod(item, mods, false)
        },
        addPack: (state) => {

        },
        removePack: (state) => {

        },
        swapPack: (state) => {

        },
        addItem: (state, action) => {
            const playerId = action.payload.toPlayer // this should not be gathered from the item, rather the bag
            const packs = state[playerId]

            if(packs) {
                const item = {...action.payload.item}
                const pack = packs.find(pack => pack.id === action.payload.toPack)

                item.packId = pack.id
                if(item.isResult) {
                    item.isResult = false
                    item.id = `item-${nanoid(5)}`
                    item.currentStackCount = 1
                }

                pack.currentSize += action.payload.item.size
                pack.items.push(item)
            }
            // console.log(packs)

            //NEW SYSTEM NEEDS TO BE DECOUPLED FROM IDs, MAYBE ARRAY LOCATIONS?


        },
        removeItem: (state, action) => {
            const playerId = action.payload.fromPlayer
            console.log("state before removing item: ", current(state), action.payload)
            // console.log("state before removing item, playerId: ", current(state[playerId]))
            const packs = state[playerId]
            if (packs) {
                const packIndex = packs.findIndex((pack) => {
                    // console.log(pack.id === action.payload.fromPack, pack.id, action.payload.fromPack)
                    return pack.id === action.payload.fromPack
                })
                console.log('remove item internal, packIndex: ', packIndex)

                const pack = packs[packIndex]

                // console.log('remove item internal, packObj: ', pack)
                packs[packIndex].items = pack.items.filter(item => {
                    return item.id !== action.payload.item.id
                })
                packs[packIndex].currentSize -= action.payload.item.size
            }

        },

        //sorts host and players, takes care of host restructure on first pass
        //sorts host and players, destroys test if it exists
        synchronizePacksData: (state, action) => {
            console.log(state)
            if(state['tourist']) {
                console.log("deleting state")
                delete state['tourist']
            }
            state[action.metaData.playerId] = action.payload
            console.log(state)
        },
        updatePackStatus: (state, action) => {
            const validValues = ["equipped", "dropped", "lost"]

            if(validValues.includes(action.payload))
                state.status = action.payload
        },
    },
})



export const {
    incrementItem,
    decrementItem,
    addPack,
    removePack,
    swapPack,
    addItem,
    removeItem,
    synchronizePacksData,
    updatePackStatus
} = inventorySlice.actions

export default inventorySlice.reducer

