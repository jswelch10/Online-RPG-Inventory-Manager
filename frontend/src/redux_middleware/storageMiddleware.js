

export const storageMiddleware = store => next => action => {
    let result = next(action)
    const {websocket} = store.getState()
    // console.log("storageMiddleware websocket state: ", websocket)
    /*
    if action.type === 'create-custom-item'
        key = 'custom-items'
        custom-items-Obj:value{} = localstorage.get(key)
        custom-items-Obj[new-custom-obj-name] = itemObj{}
        localstorage.set(key, custom-items-Obj)


        CREATE ITEMS IN TOURIST MODE - means that players cannot access their localstorage for custom items
        item creation dispatch needs to save to storage in a seperate, non-game related way
     */
    if(websocket.isActive && websocket.playerId === 'host') {

    // THIS IS TRIGGERING ON WEBSOCKET/SETUPWEBSOCKET
        switch (action.type) {
            case 'inventory/addItem':
            case 'inventory/removeItem':
            case 'inventory/incrementItem':
            case 'inventory/decrementItem':
            case 'inventory/syncInventoryData':

                // console.log('storage middleware is writing')
                // const data = JSON.parse(window.localStorage.getItem(websocket.campaign.value))
                // console.log('websocket active and isHost', action, store.getState().inventory)
                // for each player id, construct an object {name, inventory}


                const   {inventory} = store.getState(),
                    key = websocket.campaign.value,
                    characters = JSON.parse(window.localStorage.getItem(key)).characters

                    console.log('characters: ',characters, 'inventoryState: ', inventory, 'key: ', key)
                    for(const character in characters){
                        delete characters[character].playerId
                    }
                    // console.log('maybe deleted playerIds?', inventory)
                    const value = {
                        name: websocket.campaign.name,
                        characters: {
                            ...characters,
                            ...inventory,
                            //     [playerId]: {
                            //         name: string,
                            //         inventory: Pack[]
                            //     }
                        }
                    },
                    valueString = JSON.stringify(value)



                // console.log('key: ', key, 'value: ', value)
                //localStorage.set(state.websocket)
                window.localStorage.setItem(key, valueString)
                console.log('state saved to storage')
                return result

            default:
                return result
        }
    }

    // return next(action)
}

/*
needs to store state - different methods?
    on a timer
    on dispatch
    on player disconnect
    on host disconnect

    when host starts a game, choosing a lobby name
    will rehydrate an inventory slice with its data

    can then begin updating state on dispatch, but only host saves state
        store.getState().websocket.playerId === 'host'


 */