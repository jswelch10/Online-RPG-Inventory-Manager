import React, {useRef, useState} from "react";
import './LobbyView.css'
import {toPlayerGameView, toTestPage} from "../slices/viewSlice";
import {
    getCharacterListFromHost,
    requestCharacterInventory,
    requestCharacterList,
    sendNewCharacterToHost,
    getCharacterInventoryFromHost,
    setupGameData,
    disconnect
} from "../slices/webSocketSlice";
import {useDispatch, useSelector} from "react-redux";
import {useWsDispatch} from "../redux_middleware/websocketMiddleware";


export default function PlayerLobbyView() {
    const [isLobbyJoined,setIsLobbyJoined] = useState(false),
        [isJoinBtnDisabled, setIsJoinBtnDisabled] = useState(true),
        [isNewCharacter, setIsNewCharacter] = useState(false),
        [selectedCharacter, setSelectedCharacter] = useState({}),
        [helpText, setHelpText] = useState(null),

        lobbyIdInputRef = useRef(null),
        characterSelectRef = useRef(null),
        characterNameRef = useRef(null),

        dispatch = useDispatch(),
        wsDispatch = useWsDispatch(dispatch, useSelector),

        {campaign}  = useSelector(state => state.websocket),

        characters = useSelector(state => state.websocket.characters) || null

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
        // wsDispatch(requestCharacterList(), {
        //     lobbyId: value,
        // })
        wsDispatch(getCharacterListFromHost(), {
            lobbyId: value
        })
        setIsLobbyJoined(true)
        setIsJoinBtnDisabled(true)
    }
    const joinGame = () => {
        const data = {
            campaign
        }
        if(isNewCharacter) {

            // console.log("new campaign logic triggered")
            const name = characterNameRef.current.value // gives "Name with spaces"
            if(name.match(/^[a-zA-Z]+(\s[a-zA-Z]+)*$/)) {
                data.character = {
                    // isNewCharacter,
                    name,
                    value: name.replace(/\s+/g, '-').toLowerCase(), // name-with-spaces
                }
                setSelectedCharacter(data.character) //TODO necessary?
                wsDispatch(sendNewCharacterToHost(data))
                dispatch(toPlayerGameView())
            } else {
                console.log(characterNameRef.current.getAttribute('placeholder'))
                characterNameRef.current.value = ''
                setHelpText(
                    <p>only letters, commas, apostrophes allowed<br></br>e.g. "Ar'pad, The Pine Punisher "</p>
                )

                throw new Error('Bad Character Name: client')
            }

        } else {
            // console.log("character details ref.curr.value:  ", characterSelectRef)
            data.character = {
                // isNewCharacter,
                name: selectedCharacter.name,
                value: selectedCharacter.value,
            }
            wsDispatch(getCharacterInventoryFromHost(data))
            dispatch(toPlayerGameView())
        }
        // const metadata = {
        //     campaign, // needed for inventory gen if character already exists
        //     character: characterInfo
        // }
        // wsDispatch(requestCharacterInventory(metadata.character), metadata)

    }
    const renderPlayerOptions = () => {
        const playerArr = []
        if(characters !== null) {
            for(const characterId in characters) {
                const c = characters[characterId]
                playerArr.push(<option className={c.isActive ? 'isActive' : null}
                                       disabled={c.isActive}
                                       value={characterId}
                                >
                                            {c.characterName}
                                </option>
                )
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
                    {renderPlayerOptions()}
                    <option value="new-character">Create New Character</option>
                </select>
                {input}
                {helpText}
                <button disabled={isJoinBtnDisabled} onClick={joinGame}>{`Join as character`}</button>
            </>
            :
            <>
                <div>Connect using the Lobby ID given to your host</div>
                <input ref={lobbyIdInputRef} placeholder={'ABC123XYZ'} type="text" onChange={handleInputChange}/>
                <button disabled={isJoinBtnDisabled} onClick={() => joinLobby(lobbyIdInputRef.current.value)}>Join Lobby</button>
            </>)

    }
    const wsToTestPage = () => {
        if(isLobbyJoined) wsDispatch(disconnect())
        dispatch(toTestPage())
    }

    return(
        <>
            <div className="lobby-view">
                <div className="lobby-info">
                    {renderComponents()}

                    <button onClick={wsToTestPage}>back</button>
                </div>
            </div>

        </>

    )
}