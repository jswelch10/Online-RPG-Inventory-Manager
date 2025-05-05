import {nanoid} from "nanoid";
import CONSTANTS from "./constants.js"
import LobbyHandler from "./LobbyHandler.js";
import Lobby from './Lobby.js'
import generateInventorySliceData from "../utils/index.js";


export default function messageHandler(data, socket) {

    const message = JSON.parse(data)
    console.log("messageHandler: ", message)
    let lobby


    const wrapMessage = subAction => {
        return JSON.stringify({
            type: "RECEIVED_WEBSOCKET_MESSAGE",
            subAction
        })
    }

    const routeDataToSocket = ({lobbyId, user}, data, targetId) => {
        const lobby = LobbyHandler.getLobby(lobbyId)
        const socket = user === 'host' ?
            lobby.getPlayer(targetId).socket :
            lobby.host.socket

        socket.send(wrapMessage(data))

    }



    //TODO: THIS CAN BE CLEANED UP AND ORGANIZED BETTER LOGICALLY

    switch(message.type){

        case CONSTANTS.CREATE_WEBSOCKET_CONNECTION:

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
                const initState = lobby.getPlayerInventory(playerId)
                const inventorySliceData = generateInventorySliceData(initState)
                    // lobby.getPlayer(playerId)

                // console.log(inventorySliceData)


                socket.send(wrapMessage({
                    type: 'websocket/setupWebsocket',
                    payload: {
                        lobbyId: lobby.id,
                        campaign: lobby.campaign,
                        playerId
                    }
                }))
                socket.send(wrapMessage({
                    type: 'inventory/synchronizePacksData',
                    payload: inventorySliceData,
                    // isHost: false,
                    metaData: {
                        playerId
                    }
                }))
                hostSocket.send(wrapMessage({
                    type: 'inventory/synchronizePacksData',
                    payload: inventorySliceData,
                    // isHost: true,
                    metaData: {
                        playerId,
                        name: lobby.getPlayer(playerId).name
                    }
                }))
            }

            //create new websocket connection and add it to list of current connections

            //if it already exists, connect to it


            console.log('create websocket connection triggered')

            break

        case CONSTANTS.SEND_WEBSOCKET_MESSAGE:
            const {metadata, subAction} = message //

            console.log(message)
            console.log("SUBACTION SENT: ", subAction.type)

            switch(subAction.type) {
                case CONSTANTS.INCREMENT_ITEM:
                case CONSTANTS.DECREMENT_ITEM:

                    const targetPlayer = subAction.payload.playerId
                    routeDataToSocket(metadata, subAction, targetPlayer)
                    break

                case CONSTANTS.ADD_ITEM://will only ever go to 1 person//if host send to target//if not host, send to host
                    const {toPlayer} = subAction.payload
                    console.log("TO PLAYER: ", toPlayer)
                    routeDataToSocket(metadata, subAction, toPlayer)
                    break
                case CONSTANTS.REMOVE_ITEM:
                    const {fromPlayer} = subAction.payload
                    console.log("FROM PLAYER: ", fromPlayer)
                    routeDataToSocket(metadata, subAction, fromPlayer)
                    break
            }
            /*******************************************
            const {fromPlayer, toPlayer, item} = subAction.payload

            console.log("SUBACTION SENT: ", subAction.type)
            console.log("FROM PLAYER: ", fromPlayer)
            console.log("TO PLAYER: ", toPlayer)

            if(user === 'host') { // the message is from the host to the players

                if(fromPlayer === toPlayer || item.isResult  ) { // if only affecting 1 inventory then only target 1 player
                    //or if item is a search result, send the "add item" to target player
                    lobby.getPlayer(toPlayer).socket.send(wrapMessage(subAction))
                } else {

                    const fromPlayerSocket = lobby.getPlayer(fromPlayer).socket
                    fromPlayerSocket.send(wrapMessage(subAction))

                    const toPlayerSocket = lobby.getPlayer(toPlayer).socket
                    toPlayerSocket.send(wrapMessage(subAction))
                }
            } else {
                // get the correct game

                const hostSocket = lobby.host.socket
                // const playerSocket = lobby.getPlayer(playerId).socket
                // send the data to the correct sockets
                hostSocket.send(wrapMessage(subAction))
            }

            **********************************************************/

            //filter current games on server for correct one

            //determine who is recipient of data

            //bundle any relevant information

            //send the payload data
            // socket.send(wrapMessage({
            //     type: 'websocket/setLobbyId',
            //     payload: {
            //         uuid: nanoid()
            //     }
            // }))

            break
        default:
            console.log('message type not recognized')
            return null

    }
}