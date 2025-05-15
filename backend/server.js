import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import WebSocket, {WebSocketServer} from "ws";
import {nanoid} from "nanoid"
import messageHandler from "./messageHandler.js"
import LobbyHandler from "./LobbyHandler.js";


const   app = express(),
        port = 3001,
        __filename = fileURLToPath(import.meta.url),
        __dirname = path.dirname(__filename),
        wsServer = new WebSocketServer({noServer: true}),
        lobbyHandler = LobbyHandler


//TODO: track IP address to limit open websocket servers

wsServer.on('connection', (socket, req) => {
    // console.log('request info: ', req.headers['sec-websocket-key'])
    // ('sec-websocket-key'))//


    socket.on('open', message => {
        //this never gets triggered

        // socket.send(Date.now())
        // console.log('trying to trigger socket.onOpen: ', Date.now())
        // const response = messageHandler(message)
        ////////////////////socket.send(response)
    })



    socket.on('message', message => {
        // console.log('serverjs, socket.on message', message.toString())
        messageHandler(message, socket)


        // const receivedData = JSON.parse(message)
        // console.log(receivedData)

        //
        //     socket.send(JSON.stringify({
        //         type: "RECEIVED_WEBSOCKET_MESSAGE",
        //         data: {
        //             type: 'websocket/setLobbyId',
        //             payload: {
        //                 uuid
        //             }
        //         }
        //
        //     }))
        // }
    })
})



app.get('/', (req, res) => {
    // res.send('Hello World!')
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'))
})

// app.use(express.static(path.join(__dirname, '../frontend/src')))
app.use(express.static(path.join(__dirname, '../frontend/dist')))

const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head,socket => {
        wsServer.emit('connection', socket, request);
    })
})