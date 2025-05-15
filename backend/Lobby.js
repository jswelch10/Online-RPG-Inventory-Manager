import {nanoid} from 'nanoid'
export default class Lobby {
    constructor(id, metadata, socket) {
        this.id = id
        this.campaign = metadata.campaign
        this.host = {
            socket
        }
        ///
        console.log(metadata)
        this.players = (metadata.campaign.isNewCampaign) ?
            new Map() :
            new Map(Object.entries(metadata.campaign.characters)) // redo?

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
        return id
    }
    // getPlayerByCharacter(character) {
    //     this.players.get(this.characters[character].playerId)
    // }
    getPlayerById(id) {

        return this.players.get(id)
    }

    getPlayers() {
        const players = {}
        this.players.forEach(player => {

        })
        return players
    }

    getPlayerInventory(id) {
        return this.players.get(id).inventory
    }
    removePlayer(id) {

    }
}

