import {nanoid} from "nanoid";
import CONSTANTS from "./constants.js"
import LobbyHandler from "./LobbyHandler.js";
import Lobby from './Lobby.js'
import generateInventorySliceData from "../utils/index.js";

export default function messageHandler(data, socket) {
///////////
    const message = JSON.parse(data)
    // console.log("messageHandler: ", message)
    let lobby


    const wrapMessage = subAction => {
        return JSON.stringify({
            type: "RECEIVED_WEBSOCKET_MESSAGE",
            subAction
        })
    }

    const routeDataToSocket = ({lobbyId, playerId}, data, targetId) => {
        const lobby = LobbyHandler.getLobby(lobbyId)
        // if(targetId) return lobby.getPlayer(targetId).socket.send(wrapMessage(data))
        // lobby.host.socket.send(wrapMessage(data))//

        console.log("routeDataToSocket: ", playerId, targetId)

        const socket = playerId === 'host' ?
            lobby.getPlayerById(targetId).socket :
            lobby.host.socket

        socket.send(wrapMessage(data))

    }



    //TODO: THIS CAN BE CLEANED UP AND ORGANIZED BETTER LOGICALLY

    switch(message.type){

        case CONSTANTS.CREATE_WEBSOCKET_CONNECTION:
            /// /console.log('create websocket connection triggered')
            console.log('create ws message:  ', message)
            if(message.metadata.user === 'host') {
                // lobby = new Lobby(message.metadata, socket)
                lobby = LobbyHandler.generateLobby(message.metadata, socket) //needs to return a lobby

                socket.send(wrapMessage({
                    type: 'websocket/setupWebsocket',
                    payload: {
                        lobbyId: lobby.id,
                        campaign: lobby.campaign
                        // playerId: 'host'
                    }
                }))

            } else {
                // if user is player
                lobby = LobbyHandler.getLobby(message.metadata.lobbyId)
                const playerId = lobby.addPlayer(socket)
                const hostSocket = lobby.host.socket
                // const inventorySliceData = generateInventorySliceData()

                //sends a dispatch to be picked up by the websocket middleware,
                //the result of which dispatches over socket with data
                socket.send(wrapMessage({
                    type: 'websocket/setupWebsocket',
                    payload: {
                        lobbyId: lobby.id,
                        campaign: lobby.campaign,
                        playerId
                    }
                }))

                hostSocket.send(wrapMessage({
                    type: 'websocket/requestCharacterList',
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
            // console.log("SUBACTION SENT: ", subAction.type)//
            let target

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
                case CONSTANTS.REQUEST_CHARACTER_LIST:
                    target = subAction.payload.playerId
                    console.log(`a character list is being sent to user ${target}`)
                    console.log('the data', {metadata, subAction})
                    routeDataToSocket(metadata, subAction, target)
                    break
                case CONSTANTS.REQUEST_CHARACTER_INVENTORY:
                    ////if sent from player
                    const   lobby = LobbyHandler.getLobby(metadata.lobbyId)
                    if(metadata.playerId !== 'host') {
                        const character = metadata.selectedCharacter
                        console.log("is New Char?", metadata)


                        if (character.isNewCharacter) {
                            // const player = lobby.getPlayerById(metadata.playerId)
                            // lobby.linkCharacterToPlayer(character.value,  player)

                            // player.characterId = character.value
                            // lobby.host.socket.send(wrapMessage({
                            //     type: 'websocket/hostAssociatePlayer',
                            //     payload: {
                            //         inventoryId: character.value,
                            //         playerId: metadata.playerId
                            //     }
                            // }))
                            const syncData = wrapMessage({
                                type: 'inventory/synchronizeInventoryData',
                                payload:  {
                                    characterId: character.value,
                                    characterName: character.name,
                                    playerId:  metadata.playerId, // for the host
                                    inventory: generateInventorySliceData(null)
                                }
                            })
                            const playerSocket = lobby.getPlayerById(metadata.playerId).socket
                            lobby.host.socket.send(syncData)
                            playerSocket.send(syncData)
                            //sends updated character ID to player based on host localStorage
                            //server sends the constructed inventory to player and host


                        } else {
                            /**
                             * request from player to the host -  player has selected a pre-existing character
                             */
                            console.log("rci, metadata for host: ", metadata)
                            //sends character selection to get inventory
                            lobby.host.socket.send(wrapMessage({
                                type: 'websocket/requestCharacterInventory',
                                payload: {
                                    playerId: metadata.playerId,
                                    campaign: metadata.campaign,
                                    selectedCharacter: metadata.selectedCharacter
                                }
                            }))

                        }
                        //if sent from host
                    } else {
                        /**
                         * the host response to a request for character inventory
                         *
                         */

                        const p = subAction.payload
                            // updatedPlayerId = p.character.characterId

                        //server links the player's socket to ID sent from host
                        // lobby.updatePlayerKey(p.playerId, updatedPlayerId)
                        //server takes inventory data, crafts an inventory with the builder
                        const constructedInventory = generateInventorySliceData(null)
                        //server sends the constructed inventory to the host
                        const syncData = wrapMessage({
                            type: 'inventory/synchronizeInventoryData',
                            payload: {
                                // name: lobby.getPlayerById(metadata.playerId).name,
                                // playerId: updatedPlayerId,=
                                characterId: p.character.characterId,
                                characterName: p.character.name,
                                playerId: p.playerId, // this is for the host to associate websocket IDs with characters
                                inventory: constructedInventory
                            }
                        })
                        const playerSocket = lobby.getPlayerById(metadata.playerId).socket
                        lobby.host.socket.send(syncData)
                        playerSocket.send(syncData)
                        //sends updated character ID to player based on host localStorage
                        // playerSocket.send(wrapMessage({
                        //     type: 'websocket/requestCharacterInventory',
                        //     payload: {
                        //         characterId: p.character.characterId
                        //     },
                        // }))
                        //server sends the constructed inventory to player and host


                    }

                    break
                case CONSTANTS.REQUEST_NEW_INVENTORY:
                    // generateInventorySliceData()
                    break
            }
            break
        default:
            console.log('message type not recognized')
            return null

    }
}