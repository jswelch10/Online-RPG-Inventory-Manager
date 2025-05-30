

const CONSTANTS = {
    CREATE_WEBSOCKET_CONNECTION: 'CREATE_WEBSOCKET_CONNECTION',
    SEND_WEBSOCKET_MESSAGE: 'SEND_WEBSOCKET_MESSAGE',

    ADD_ITEM: 'inventory/addItem',
    REMOVE_ITEM: 'inventory/removeItem',
    DELETE_ITEM: '',

    INCREMENT_ITEM: 'inventory/incrementItem',
    DECREMENT_ITEM: 'inventory/decrementItem',
    // SET_LOBBY_ID: "websocket/setLobbyId",

    REQUEST_CHARACTER_LIST: 'websocket/requestCharacterList',
    REQUEST_CHARACTER_INVENTORY: 'websocket/requestCharacterInventory',
    /////////////////////////////////////////////////////////


    GET_CHARACTER_LIST_FROM_HOST: 'websocket/getCharacterListFromHost',
    SEND_CHARACTER_LIST_TO_PLAYER: 'websocket/sendCharacterListToPlayer',

    SEND_NEW_CHARACTER_TO_HOST: 'websocket/sendNewCharacterToHost',


    GET_CHARACTER_INVENTORY_FROM_HOST: 'websocket/getCharacterInventoryFromHost',

    SEND_CHARACTER_INVENTORY_TO_HOST: 'websocket/sendCharacterInventoryToHost',
    SEND_CHARACTER_INVENTORY_TO_PLAYER: 'websocket/sendCharacterInventoryToPlayer',
    SEND_CHARACTER_INVENTORY_TO_SERVER: 'websocketMiddleware/sendCharacterInventoryToServer',

    DISCONNECT: 'websocket/disconnect'


}

// export const {
//     SET_LOBBY_ID
// } = CONSTANTS

export default CONSTANTS