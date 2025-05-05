
const url = 'ws:localhost:3001'
// const protocols = ''

export default function createWebSocket(data, storeAPI) {
    // console.log('createWebSocket fired');
    const socket = new WebSocket(url
        // , protocols
    )

    //sent to server on connect
    socket.onopen = e => {
        // console.log('websocket connection opened')
        console.log('testing1: ', data)
        socket.send(JSON.stringify(data))
    }

    //sent from the server
    socket.onmessage = message => {
        const data = JSON.parse(message.data)
        // console.log('message received: ', data)
        storeAPI.dispatch(data)

    }


    socket.onerror =e  => {
        console.error('error with websocket: ', e)
    }

    socket.onclose = e => {
        if(e.wasClean) {
            console.log("The connection has been closed successfully.");
        } else {
            console.log("Connection closed with issues")
        }
    }

    return socket
}