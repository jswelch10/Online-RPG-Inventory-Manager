import {nanoid} from "nanoid";
import CONSTANTS from "./constants.js"
import LobbyHandler from "./LobbyHandler.js";
import Lobby from './Lobby.js'
import generateInventorySliceData from "../utils/index.js";

export default function messageHandler(data, socket) {
    const message = JSON.parse(data)
    const wrapMessage = subAction => {
        return JSON.stringify({
            type: "RECEIVED_WEBSOCKET_MESSAGE",
            subAction
        })
    }
    const routeDataToSocket = ({lobbyId, playerId}, data, targetId = null) => {
        const lobby = LobbyHandler.getLobby(lobbyId)
        console.log("routeDataToSocket: ", playerId, targetId)
        const socket = playerId === 'host' ?
            lobby.getPlayerById(targetId).socket :
            lobby.host.socket
        socket.send(wrapMessage(data))

    }



    //TODO: THIS CAN BE CLEANED UP AND ORGANIZED BETTER LOGICALLY

    switch(message.type){

        case CONSTANTS.CREATE_WEBSOCKET_CONNECTION:
            console.log('create ws message:  ', message)
            if(message.metadata.user === 'host') {
                const   campaign = message.metadata.campaign,
                        regex = /^[a-zA-Z',]+(\s[a-zA-Z',]+)*$/

                if(campaign.name.match(regex)) {
                    const lobby = LobbyHandler.generateLobby(message.metadata, socket) //needs to return a lobby

                    socket.send(wrapMessage({
                        type: 'websocket/setupWebsocket',//
                        payload: {
                            lobbyId: lobby.id,
                            campaign: lobby.campaign
                            // playerId: 'host'
                        }
                    }))
                } else {
                    try {
                        throw new Error('Bad Campaign Name: server')
                    } catch (err) {
                        console.log(err)
                    }

                }


            } else {
                // if user is player
                const lobby = LobbyHandler.getLobby(message.metadata.lobbyId)
                if(lobby === undefined) {
                    socket.send(wrapMessage({
                        type: 'view/toTestPage',
                        payload:{}
                    }))
                    socket.close()
                    return
                }
                const playerId = lobby.addPlayer(socket)
                const hostSocket = lobby.host.socket
//
                socket.send(wrapMessage({
                    type: 'websocket/setupWebsocket',
                    payload: {
                        lobbyId: lobby.id,
                        campaign: lobby.campaign,
                        playerId
                    }
                }))
                hostSocket.send(wrapMessage({
                    type: 'websocket/getCharacterListFromHost',
                    payload: {
                        playerId,
                        campaign: lobby.campaign
                    }
                }))
            }
            break

        case CONSTANTS.SEND_WEBSOCKET_MESSAGE:
            const {metadata, subAction} = message

            console.log('message variable inside "send message" switch case:  ', message)
            let target, playerSocket

            const lobby = LobbyHandler.getLobby(metadata.lobbyId)

            switch(subAction.type) {
                case CONSTANTS.INCREMENT_ITEM:
                case CONSTANTS.DECREMENT_ITEM:
                    target = subAction.payload.playerId
                    routeDataToSocket(metadata, subAction, target)
                    break
                case CONSTANTS.ADD_ITEM://will only ever go to 1 person//if host send to target//if not host, send to host
                    target = subAction.payload.toPlayer
                    // console.log("TO PLAYER: ", target)
                    routeDataToSocket(metadata, subAction, target)
                    break
                case CONSTANTS.REMOVE_ITEM:
                    target = subAction.payload.fromPlayer
                    // console.log("FROM PLAYER: ", target)
                    routeDataToSocket(metadata, subAction, target)///
                    break
                case CONSTANTS.SEND_CHARACTER_LIST_TO_PLAYER:
                    target = subAction.payload.playerId
                    routeDataToSocket(metadata, subAction, target)
                    break
                case CONSTANTS.GET_CHARACTER_LIST_FROM_HOST:
                    break
                case CONSTANTS.SEND_NEW_CHARACTER_TO_HOST:
                    /** goals: create a new character payload constructed with data sent from player
                     *  send payload to host and player with sockets
                     */

                    const   inventory = generateInventorySliceData(),
                            character = subAction.payload.character
                    if(!character.name.match(/^[a-zA-Z',]+(\s[a-zA-Z',]+)*$/)) throw new Error('Bad Character Name')

                    playerSocket = lobby.getPlayerById(metadata.playerId).socket

                    lobby.host.socket.send(wrapMessage({
                        type: 'websocket/sendNewCharacterToHost',
                        payload: {
                            character //TODO: character data is sent twice but
                                        // is needed in 2 different slices
                            // characterId: character.value,
                            // playerId: metadata.playerId
                        }
                    }))
                    const data = {
                        type: 'inventory/synchronizeInventoryData',
                        payload:  {
                            isHost:true,
                            campaign: lobby.campaign, // needed for host to save to localStorage
                            characterId: character.value,
                            characterName: character.name,
                            playerId:  metadata.playerId, // for the host
                            inventory //TODO: inventory is being sent twice (to inventory)

                        }
                    }
                    lobby.host.socket.send(wrapMessage(data))

                    data.payload.isHost = false

                    playerSocket.send(wrapMessage(data))

                    break
                case CONSTANTS.GET_CHARACTER_INVENTORY_FROM_HOST:
                    subAction.payload.requestPlayerId = metadata.playerId
                    routeDataToSocket(metadata, subAction, null)
                    break
                case CONSTANTS.SEND_CHARACTER_INVENTORY_TO_SERVER:
                    // needs to have an inventory created and sent to player and host
                    const p = subAction.payload
                    console.log('************ THE P **************', p)
                    const constructedInventory = generateInventorySliceData(p.character.inventory)
                    const syncData = wrapMessage({
                        type: 'inventory/synchronizeInventoryData',
                        payload: {
                            playerId: p.playerId,
                            characterId: p.character.characterId,
                            characterName: p.character.characterName,
                            inventory: constructedInventory//
                        }
                    })
                    playerSocket = lobby.getPlayerById(p.playerId).socket
                    lobby.host.socket.send(syncData)
                    playerSocket.send(syncData)

                    break
                case CONSTANTS.DISCONNECT:
                        //if user is a player, disconnect them from the lobby
                    console.log('*** PLAYER DISCONNECT ***', metadata, subAction)
                    if(metadata.playerId !== 'host') {
                        lobby.removePlayer(metadata.playerId)
                        lobby.host.socket.send(wrapMessage({
                            type: 'inventory/removeCharacter',
                            payload: {
                                isHost: true,
                                playerId: metadata.playerId
                            }
                        }))

                        lobby.host.socket.send(wrapMessage({
                            type: 'websocket/removeCharacter',
                            payload: {
                                characterId: subAction.payload.characterId
                            }
                        }))

                        // and send update to host
                    } else {
                        //if user is host, disconnect all players from the lobby
                        lobby.players.forEach(player => {
                            console.log(player)
                            player.socket.send(wrapMessage({
                                type: 'websocket/disconnect',
                                payload: undefined
                            }))
                            player.socket.send(wrapMessage({
                                type: 'inventory/reset',
                                payload: undefined
                            }))
                            player.socket.send(wrapMessage({
                                type: 'view/toTestPage',
                                payload: undefined
                            }))
                            player.socket.close()
                        })
                        LobbyHandler.closeLobby(metadata.lobbyId)
                    }
                    break
            }
            break
        default:
            console.log('message type not recognized')
            return null

    }
}