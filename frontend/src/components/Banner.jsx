import react, {useRef} from 'react'
import './Banner.css'
import {useDispatch} from "react-redux";
import {createLobbyView, joinLobbyView} from "../slices/viewSlice";
// import {useWebsocketDispatch} from "../redux_middleware/websocketMiddleware";


function Banner() {
    const bannerRef = useRef(null)
    const dispatch = useDispatch()
    // const wsDispatch = useWebsocketDispatch()

    const startLobbyAsHost = () => {
        dispatch(createLobbyView())
    }
    const joinLobbyAsPlayer = () => {
        dispatch(joinLobbyView())
        // wsDispatch({type: 'SEND_WEBSOCKET_MESSAGE', payload: 'payload testings' })
    }
    const minMaxBanner = () => {
        console.log(bannerRef.current.classList.toggle('minimized'))
    }

    return (
        <div ref={bannerRef} className={`banner`}>
            <h3>This is a playground to acquaint with the tool, If you are a DM you can host a lobby, and players can then join</h3>
            <h4>select your role</h4>
            <button onClick={startLobbyAsHost}>DM / GM</button>
            <button onClick={joinLobbyAsPlayer}>Player</button>
            <p className='banner-toggle' onClick={minMaxBanner}><i className='arrow down'/></p>
        </div>
    )

}

export default Banner