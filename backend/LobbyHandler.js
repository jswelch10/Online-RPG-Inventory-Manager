import Lobby from "./Lobby.js";
import {nanoid} from 'nanoid'
class LobbyHandler {
    constructor() {}

    #lobbies = new Map()

    generateLobby(metadata, socket){
        //generate id until find an available one, set that in  lobby constructor
        let id
        do {
            id = nanoid()
        } while(this.#lobbies.has(id))
        this.#lobbies.set(id, new Lobby(id, metadata, socket))
        return this.getLobby(id)
    }

    getLobby(id) {
        return this.#lobbies.get(id)
    }

    // remove(id) {
    //     delete this.#lobbies[id]
    // }
    closeLobby(id) {
        // this.#lobbies.get(id).close
        this.#lobbies.delete(id)
    }
}

export default LobbyHandler = new LobbyHandler()