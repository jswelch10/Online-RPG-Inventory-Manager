import {nanoid} from 'nanoid'
export default class Lobby {
    constructor(id, metadata, socket) {
        this.id = id
        this.campaign = metadata.campaign
        this.host = {
            // id: 123456,
            socket
        }
        this.players = (metadata.campaign.isNewCampaign) ?
            new Map() :
            metadata.campaign
        /*
        new Map(Object.entries(obj))


        */
        /*
        curr struct - players: {
                        [playerId]: Pack[]
                    }
        storage -   players:{
                        [playerId]: {
                            name: string,
                            inventory: Pack[],
                            socket: socket
                        }
                    }
        */
        //

    }

    addPlayer(socket) {
        //if player exists, grab the data and add the socket

        //if player doesn't exist create a fresh id
        const id = `player-${nanoid(5)}`
        this.players.set(id, {
            name: "Swagathor",
            socket
        })
        return id
    }

    getPlayer(id) {
        // console.log('getPlayer triggered: Lobby.js')
        return this.players.get(id)
    }

    getPlayerInventory(id) {
        // console.log('getPlayer triggered: Lobby.js')
        return this.players.get(id).inventory
    }

    // setPlayerInventory


    removePlayer(id) {

    }

    // sendToHost
}

