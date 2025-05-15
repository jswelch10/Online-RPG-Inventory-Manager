import {createSlice, nanoid, current} from "@reduxjs/toolkit";
import Item from "../components/Item";
import React from "react";
import generateInventorySliceData from "../../../utils";

const initialState = {
    'tourist': {  //playerId - rename to inventoryId
        name: 'tourist', //Character Name
        inventory: generateInventorySliceData(null)
    }
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
            const {packIndex, itemIndex, mods, characterId} = action.payload
            let item = state[characterId].inventory[packIndex].items[itemIndex]
            deviateMod(item, mods, true)

        },
        decrementItem: (state, action) => {
            const {packIndex, itemIndex, mods, characterId} = action.payload
            let item = state[characterId].inventory[packIndex].items[itemIndex]
            deviateMod(item, mods, false)
        },
        addPack: (state) => {

        },
        removePack: (state) => {

        },
        swapPack: (state) => {

        },
        addItem: (state, action) => {
            console.log('add item state', current(state), action)
            const characterId = action.payload.toCharacter // this should not be gathered from the item, rather the bag
            const {inventory} = state[characterId]

            if(inventory) {
                const item = {...action.payload.item}
                const pack = inventory.find(pack => pack.id === action.payload.toPack)

                item.packId = pack.id

                pack.currentSize += action.payload.item.size
                pack.items.push(item)
            }

        },
        removeItem: (state, action) => {
            console.log('remove item state', current(state), action)
            const characterId = action.payload.fromCharacter
            const {inventory} = state[characterId]
            if (inventory) {

                const pack = inventory.find(pack => {

                    return pack.id === action.payload.fromPack
                })
                pack.items = pack.items.filter(item => item.id !== action.payload.item.id)
                pack.currentSize -= action.payload.item.size
            }

        },

        //sorts host and players, takes care of host restructure on first pass
        //sorts host and players, destroys test if it exists
        synchronizeInventoryData: (state, action) => {
            console.log("inside syncIData: ", current(state), action)
            state[action.payload.characterId] = {
                playerId: action.payload.playerId,
                characterName: action.payload.characterName,
                inventory: action.payload.inventory
            }


            if(state['tourist']) {
                // console.log("deleting state")
                delete state['tourist']
            }
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
    synchronizeInventoryData,
    updatePackStatus
} = inventorySlice.actions

export default inventorySlice.reducer

