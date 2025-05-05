

export const storageMiddleware = store => next => action => {
    let result = next(action)
    const {websocket} = store.getState()
    /*
    if action.type === 'create-custom-item'
        key = 'custom-items'
        custom-items-Obj:value{} = localstorage.get(key)
        custom-items-Obj[new-custom-obj-name] = itemObj{}
        localstorage.set(key, custom-items-Obj)


        CREATE ITEMS IN TOURIST MODE - means that players cannot access their localstorage for custom items
     */


    // THIS IS TRIGGERING ON WEBSOCKET/SETUPWEBSOCKET
    switch (action.type) {
        case 'inventory/addItem':
        case 'inventory/removeItem':
            if(websocket.isActive && websocket.playerId === 'host') {
                console.log('storage middleware is writing')
                // const data = JSON.parse(window.localStorage.getItem(websocket.campaign.value))
                console.log('websocket active and isHost', action, store.getState().inventory)
                // for each player id, construct an object {name, inventory}

                const   {inventory} = store.getState(),
                    key = websocket.campaign.value,
                    value = {
                        name: action.metadata.campaign.name,
                        players: {
                            ...inventory,
                            //     [playerId]: {
                            //         name: string,
                            //         inventory: Pack[]
                            //     }
                        }
                    },
                    valueString = JSON.stringify(value)

                console.log('key: ', key, 'value: ', value)
                //localStorage.set(state.websocket)
                window.localStorage.setItem(key, valueString)

                return result
            }
            break
        default:
            return result
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