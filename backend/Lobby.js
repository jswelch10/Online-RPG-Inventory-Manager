import {nanoid} from 'nanoid'
export default class Lobby {
    constructor(id, metadata, socket) {
        this.id = id
        this.campaign = metadata.campaign
        this.host = {
            socket
        }
        /* convert metadata.campaign.characters
        to
        characters = {
            [characterName]: {
                isActive: false
            }
        } */
        console.log('characters', metadata.campaign.characters)
        // this.characters = metadata.campaign.characters ? Object.keys(metadata.campaign.characters).reduce((acc, curr) => {
            // console.log('acc', acc, 'curr', curr, 'i', i)
            // acc[curr] = { //
            //     isActive: false
            // }
            // return acc
        // }, {}) : {}
        // console.log('reducer stuff',this.characters)
        // this.characters = Object.keys(metadata.campaign.characters).map(character => {
        //
        // })
        ///
        // console.log(metadata)
        this.players = new Map()
            // (metadata.campaign.isNewCampaign) ?
            // new Map() :
            // new Map(Object.entries(metadata.campaign.characters)) // redo?
        //TODO: players should be as map of playerIds, yet on creation it can be a map of characterIds
        // console.log(this.players)

    }
    updatePlayerKey(id1, id2){ // relevance after switching to player id AND inventory ID, no need to update, only to associate
        this.players.set(id2, this.players.get(id1))
        this.players.delete(id1)
    }


    linkCharacterToPlayer(characterId, playerId) {
        const data = this.players.get(playerId)
        data.characterId = characterId
        this.players.set(playerId, data)
    }

    addPlayer(socket, characterName) { // player Id gen
        const id = `player-${nanoid(5)}`
        this.players.set(id, {
            // name: characterName,
            socket
        })
        console.log(this.players)
        return id
    }
    // getPlayerByCharacter(character) {
    //     this.players.get(this.characters[character].playerId)
    // }
    getPlayerById(id) {

        return this.players.get(id)
    }

    getPlayers() {
        // const players = {}
        // this.players.forEach(player => {
        //
        // })
        // return players

    }

    getPlayerInventory(id) {
        return this.players.get(id).inventory
    }
    removePlayer(id) {
        this.players.delete(id)
    }
    // close() {
    //
    // }
}

