import React, {useRef, useState} from "react";
import './LobbyView.css'
import {toPlayerGameView, toTestPage} from "../slices/viewSlice";
import {requestCharacterInventory, requestCharacterList, setupGameData} from "../slices/webSocketSlice";
import {useDispatch, useSelector} from "react-redux";
import {useWsDispatch} from "../redux_middleware/websocketMiddleware";


export default function PlayerLobbyView() {
    const [isLobbyJoined,setIsLobbyJoined] = useState(false),
        [isJoinBtnDisabled, setIsJoinBtnDisabled] = useState(true),
        [isNewCharacter, setIsNewCharacter] = useState(false),
        [selectedCharacter, setSelectedCharacter] = useState({}),

        lobbyIdInputRef = useRef(null),
        characterSelectRef = useRef(null),
        characterNameRef = useRef(null),

        dispatch = useDispatch(),
        wsDispatch = useWsDispatch(dispatch, useSelector),

        {campaign}  = useSelector(state => state.websocket),

        players = useSelector(state => state.websocket.players) || null

    const handleCharacterSelectChange = e => {
        const   {value} = e.target,
                name = e.target.selectedOptions[0].text

        setIsJoinBtnDisabled(value === 'none' || value === 'new-character')
        setIsNewCharacter(value === 'new-character')
        setSelectedCharacter({name, value})
    }

    const handleInputChange = e => {
        console.log(e)
        if(e.target.value === '') {
            console.log('input empty, setting disabled true')
            setIsJoinBtnDisabled(true)
        } else {
            console.log('input empty, setting disabled false')
            setIsJoinBtnDisabled(false)
        }
    }
    const joinLobby = (value) => {
        wsDispatch(requestCharacterList(), {
            lobbyId: value,
        })
        setIsLobbyJoined(true)
        setIsJoinBtnDisabled(true)
    }
    const joinGame = () => {
        let characterInfo
        if(isNewCharacter) {
            // console.log("new campaign logic triggered")
            const newCharacterName = characterNameRef.current.value // gives "Name with spaces"
            characterInfo = {
                isNewCharacter,
                name: newCharacterName,
                value: newCharacterName.replace(/\s+/g, '-').toLowerCase(), // name-with-spaces
            }
            setSelectedCharacter(characterInfo)
        } else {
            console.log("character details ref.curr.value:  ", characterSelectRef)
            characterInfo = {
                isNewCharacter,
                name: selectedCharacter.name,
                value: selectedCharacter.value,
            }
        }
        const metadata = {
            campaign, // needed for inventory gen if character already exists
            selectedCharacter: characterInfo
        }
        wsDispatch(requestCharacterInventory(characterInfo), metadata)
        dispatch(toPlayerGameView())
    }
    const renderPlayerOptions = (characters) => {
        console.log(players)
        const playerArr = []
        if(characters !== null) {
            for(const characterId in characters) {
                playerArr.push(<option value={characterId}>{characters[characterId]}</option>)
            }
            return <>{playerArr}</>
        }

        return null
    }
    const input = isNewCharacter ?
        <input type="text" placeholder={'enter Character name'} ref={characterNameRef} onChange={handleInputChange}/>
        : null

    const renderComponents = () => {
        return (isLobbyJoined ?
            <>
                <select name="characters" id="character-selector" ref={characterSelectRef} value={selectedCharacter.value}
                        onChange={handleCharacterSelectChange}>
                    <option value="none"></option>
                    {renderPlayerOptions(players)}
                    <option value="new-character">Create New Character</option>
                </select>
                {input}
                <button disabled={isJoinBtnDisabled} onClick={joinGame}>{`Join as character`}</button>
            </>
            :
            <>
                <div>Connect using the Lobby ID given to your host</div>
                <input ref={lobbyIdInputRef} placeholder={'ABC123XYZ'} type="text" onChange={handleInputChange}/>
                <button disabled={isJoinBtnDisabled} onClick={() => joinLobby(lobbyIdInputRef.current.value)}>Join Lobby</button>
            </>)

    }
    return(
        <>
            <div className="lobby-view">
                <div className="lobby-info">
                    {renderComponents()}

                    <button onClick={()=>{dispatch(toTestPage())}}>back</button>
                </div>
            </div>

        </>

    )
}