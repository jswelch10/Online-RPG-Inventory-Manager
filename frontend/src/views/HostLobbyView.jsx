import react, {useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import './LobbyView.css'
import {changeView, toHostGameView, toTestPage} from "../slices/viewSlice";
import {setupGameData} from "../slices/websocketSlice";
import {useWsDispatch} from "../redux_middleware/websocketMiddleware";

export default function HostLobbyView () {
    const [campaign, setCampaign] = useState({name:'',value:'none'}),
        campaignSelectRef = useRef(''),
        [isLobbyCreated,setIsLobbyCreated] = useState(false),
        [isCreateBtnDisabled, setIsCreateBtnDisabled] = useState(true),
        [isNewCampaign, setIsNewCampaign] = useState(false),
        campaignNameRef = useRef(''),

        dispatch = useDispatch(),
        wsDispatch = useWsDispatch(dispatch, useSelector),

        lobbyId = useSelector(state=> state.websocket.lobbyId) || 'ABC123XYZ',
        characters = useSelector(state => state.websocket.characters) || null

    // console.log('players log: ', players)


    const handleCampaignSelectChange = e => {
        const {value} = e.target
        const name = e.target.selectedOptions[0].text

        setIsCreateBtnDisabled(value === 'none')
        setIsNewCampaign(value === 'new-campaign')
        // console.log(e.target.options[e.target.selectedIndex].text)
        setCampaign({
            name,
            value
        })
    }

    const input = isNewCampaign ?
        <input type="text" placeholder={'enter campaign name'} ref={campaignNameRef}/>
        : null

    const renderCampaignOptions = () => {
        const options = []
        Object.keys(window.localStorage).forEach(campaignKey => {
            options.push(
                <option value={campaignKey}>
                    {JSON.parse(window.localStorage.getItem(campaignKey)).name}
                </option>
            )
        })
        return <>{options}</>
    }

    const createLobby = () => {
        // console.log("createLobby button activated: ", campaign)
        let gameInfo
        //if campaign IS new, have server generate us an empty playerId:Packs[]
        if(isNewCampaign) {
            // console.log("new campaign logic triggered")
            const newCampaignName = campaignNameRef.current.value
            gameInfo = {
                isNewCampaign,
                name: newCampaignName,
                value: newCampaignName.replace(/\s+/g, '-').toLowerCase(),
            }
            // console.log("new details: ", gameInfo)

            window.localStorage.setItem(gameInfo.value, JSON.stringify({
                name:gameInfo.name,
                characters: {}
            }))

            //else campaign is not new, server generates inventory for rejoining player,
            // based on  data saved by host in localstorage
        } else {
            const kebabName = campaignSelectRef.current.value
            // console.log("campaign details retrieved from localStorage: ", kebabName)
            const data = JSON.parse(window.localStorage.getItem(kebabName))
            console.log('value @ key: ', data)
            gameInfo = {
                isNewCampaign,
                name: data.name,
                value: kebabName,
                characters: data.characters
            }
            // campaign
        }

        setCampaign(gameInfo)


        wsDispatch(setupGameData(gameInfo), { //TODO maybe change? to changeView('host')
            campaign: gameInfo,
            user: 'host', //needed on server messageHandler to determine if server is created or joined

        })

        setIsLobbyCreated(true)


    }

    const renderCharacters = (characters) => {
        console.log(characters)
        const playersArr = []
        for(const characterId in characters) {
            playersArr.push(<li>{characters[characterId].name}</li>)
        }
        return playersArr
    }
    const renderComponents = () => {
        return isLobbyCreated ? <>
                <div className="lobby-id">
                    Game Name: <span>{campaign.name}</span>.<br/>
                    Your lobby id is: <span>{lobbyId}</span><br/>
                    Share it with your Players
                </div>
                <ul className="player-list">
                    {renderCharacters(characters)}
                </ul>
                <button onClick={()=>{dispatch(toHostGameView())}}>create</button>
            </>
            :
            <>
                <select name="campaign" id="campaign-selector" ref={campaignSelectRef} value={campaign.value}
                        onChange={handleCampaignSelectChange}>
                    <option value="none"></option>
                    {renderCampaignOptions()}
                    <option value="new-campaign">Create New Campaign</option>
                </select>
                {input}
                <button disabled={isCreateBtnDisabled} onClick={createLobby}>Create Lobby</button>
            </>
    }

    return (<>
        <div className="lobby-view">
            <div className="lobby-info">
                {renderComponents()}
                <button onClick={()=>{dispatch(toTestPage())}}>back</button>
            </div>
        </div>
    </>)
}