import {configureStore} from "@reduxjs/toolkit";
import viewReducer from "../slices/viewSlice"
import inventoryReducer from "../slices/inventorySlice"
import tooltipReducer from "../slices/tooltipSlice"
import websocketReducer from "../slices/webSocketSlice"
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
        websocket: websocketReducer

    },
    middleware: getDefaultMiddleware=>getDefaultMiddleware()
        // .concat(loggerMiddleware)

        .concat(websocketMiddleware)
        .concat(storageMiddleware)
})