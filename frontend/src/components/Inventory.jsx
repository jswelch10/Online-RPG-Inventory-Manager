import Pack from './Pack'
import './Inventory.css'
import { useSelector } from "react-redux";

//TODO: maybe needs {packIds} param?
export default function Inventory(props) {
    // const isHost = useSelector(state => state.view.currentView === 'host')
    const playerId = props.playerId || 'tourist'
    // console.log(playerId)
    const packs = useSelector(state => state.inventory[playerId]) || []
    // const test = useSelector(state => state.inventory)
    // console.log(packs, test)
    // const packsFromInventory = useSelector((state) => state.inventory)
    // const packsFromWebsocket = useSelector(state => state.websocket.players[props.playerId])
    // console.log(packs)
    // const packs = isHost ? packsFromWebsocket : packsFromInventory
    // const isHost = useSelector(state => state.view.currentView) === 'host'
    // console.log('isHost', isHost)
    // console.log('packIDS?', packIds)




    return(
        <div className="inventory">
            {
                packs.map((pack, i) => {
                    // const p = isHost ? {...pack, id: packIds[i]} : pack
                    // console.log(p)
                    // return <Pack key={p.id} slotNumber={i} packData={p} />
                    return <Pack key={pack.id} slotNumber={i} packData={pack} playerId={playerId} />
                })
            }
        </div>
    )
}