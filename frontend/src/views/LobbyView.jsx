import './LobbyView.css'
import {useSelector, useDispatch} from "react-redux";
import {changeUserType, changeView, toTestPage} from "../slices/viewSlice";
import react, {useState, useRef} from 'react'
import {useWsDispatch} from "../redux_middleware/websocketMiddleware";

function LobbyView(props) {
    const [campaign, setCampaign] = useState({name:'',value:'none'})
    const [isCreateBtnDisabled, setIsCreateBtnDisabled] = useState(true)
    const [isLobbyCreated,setIsLobbyCreated] = useState(false)
    const [isNewCampaign, setIsNewCampaign] = useState(false)
    const [isJoinBtnDisabled, setIsJoinBtnDisabled] = useState(true)
    const userType = useSelector(state => state.view.userType)
    const packs = useSelector(state => state.inventory)

    const lobbyId = useSelector(state=>state.websocket.lobbyId) || 'ABC123XYZ'
    const dispatch = useDispatch()
    const wsDispatch = useWsDispatch(dispatch, useSelector)

    const campaignNameRef = useRef('')
    const lobbyIdInputRef = useRef('')

    const handleSelectChange = e => {
        const {value} = e.target
        const name = e.target.options[e.target.selectedIndex].text

        setIsCreateBtnDisabled(value === 'none')
        setIsNewCampaign(value === 'new-campaign')
        // console.log(e.target.options[e.target.selectedIndex].text)
        setCampaign({
            name,
            value
        })

    }
    const handleInputChange = e => {
        if(e.target.value !== '') {
            setIsJoinBtnDisabled(false)
        } else {
            setIsJoinBtnDisabled(true)
        }
    }

    // console.log(lobbyIds)
    const createLobby = () => {
        console.log("createLobby button activated")
        let campaign
        //if campaign IS new, have server generate us an empty playerId:Packs[]
        if(isNewCampaign) {
            console.log("new campaign logic triggered")
            const newCampaignName = campaignNameRef.current.value
            campaign = {
                isNewCampaign,
                name: newCampaignName,
                value: newCampaignName.replace(/\s+/g, '-').toLowerCase(),
            }
            console.log("new details: ", campaign)

            //else campaign is not new, server generates inventory for rejoining player,
            // based on  data saved by host in localstorage
        } else {
            console.log("campaign details retrieved from localStorage")
            const data = JSON.parse(window.localStorage.getItem(campaignNameRef.current.value))
            campaign = {
                isNewCampaign,
                name: data.name,
                // value: ,
                players: data.players
            }
            // campaign
        }

        setCampaign(campaign)


        wsDispatch(changeUserType('host'), {
            campaign,
            user: 'host', //needed on server messageHandler to determine if server is created or joined

        })

        setIsLobbyCreated(true)


    }
    const renderCampaignOptions = () => {
        console.log(window.localStorage)
        const options = []
        // for(let i=0; i< window.localStorage.length; i++) {
        //     const   s = window.localStorage,
        //             key = s.key[i]
        //
        //     options.push(<option value={key} >{s.getItem(key)}</option>)
        // }
        Object.keys(window.localStorage).forEach(campaignKey => {
            options.push(
                <option value={campaignKey}>
                    {JSON.parse(window.localStorage.getItem(campaignKey)).name}
                </option>
            )
        })

        return <>
            {options}
            {/*<option value="test-value1">Quest for the Purple Squishy</option>*/}
            {/*<option value="test-value2">Lord of the Ringers</option>*/}
        </>
    }



    const joinLobby = (value) => {
        wsDispatch(changeView({view:userType}), {
            lobbyId: value
        })
    }

    const renderComponents = () => {
        const input = isNewCampaign ?
            <input type="text" placeholder={'enter campaign name'} ref={campaignNameRef}/>
            : null
        if(props.viewType === 'lobby-host' && isLobbyCreated) {
            return (<>
                <div className="lobby-id">
                    Game Name: <span>{campaign.name}</span>.<br/>
                    Your lobby id is: <span>{lobbyId}</span><br/>
                    Share it with your Players
                </div>
                <ul className="player-list">
                    <li>Player 1</li>
                    <li>Suzanne</li>
                    <li>Arpad the Pine Punisher</li>
                </ul>
            </>)
        }else if(props.viewType === 'lobby-host') {
            return (<>
                <select name="campaign" id="campaign-selector" value={campaign.value} onChange={handleSelectChange}>
                    <option value="none"></option>
                    {/*TODO:these values should come from localStorage key<Gov'tname>: { name, value: Pack[]}   */}
                    {renderCampaignOptions()}
                    <option value="new-campaign">Create New Campaign</option>
                </select>
                {input}
                <button disabled={isCreateBtnDisabled} onClick={createLobby}>Create Lobby</button>
            </>)
        } else {
            return (<>
                <div>Connect using the Lobby ID given to your host</div>
                <input ref={lobbyIdInputRef} placeholder={'ABC123XYZ'} type="text" onChange={handleInputChange}/>
                <button disabled={isJoinBtnDisabled} onClick={() => joinLobby(lobbyIdInputRef.current.value)}>Join</button>
            </>)
        }
    }
    return(
        <>
        <div className="lobby-view">
            <div className="lobby-info">
                {renderComponents()}
                <button onClick={()=>{dispatch(changeView({view:userType}))}}>close</button>
            </div>
        </div>

        </>

    )

}

export default LobbyView