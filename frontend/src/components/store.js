import {configureStore} from "@reduxjs/toolkit";
import viewReducer from "../slices/viewSlice"
import inventoryReducer from "../slices/inventorySlice"
import tooltipReducer from "../slices/tooltipSlice"
import websocketReducer from "../slices/webSocketSlice"
// import storageReducer from "../slices/storageSlice"
import {
    // loggerMiddleware,
    websocketMiddleware,
} from "../redux_middleware/websocketMiddleware"
import {storageMiddleware} from "../redux_middleware/storageMiddleware"


export const store = configureStore({
    reducer: {
        view : viewReducer,
        inventory: inventoryReducer,
        tooltip: tooltipReducer,
        websocket: websocketReducer,
        // storage: storageReducer

    },
    middleware: getDefaultMiddleware=>getDefaultMiddleware()
        // .concat(loggerMiddleware)

        // .concat(storageMiddleware)
        .concat(websocketMiddleware)
        .concat(storageMiddleware)

})