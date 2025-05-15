import Pack from './Pack'
import './Inventory.css'
import { useSelector } from "react-redux";

//TODO: maybe needs {packIds} param?
export default function Inventory(props) {

    console.log("inventory props:", props.playerId || 'tourist')

    const playerId = props.playerId || 'tourist'
    const characterId = props.characterId || 'tourist'


    // const test = useSelector(state => state.inventory)
    const inventory = useSelector(state => state.inventory[characterId]?.inventory) || []
    // const test = useSelector(state => state.inventory)

    // console.log('inventory selector: ', characterId, test)

    return(
        <div className="inventory">
            {
                inventory.map((pack, i) => {
                    // const p = isHost ? {...pack, id: packIds[i]} : pack
                    // console.log(p)
                    // return <Pack key={p.id} slotNumber={i} packData={p} />
                    return <Pack key={pack.id}
                                 slotNumber={i}
                                 packData={pack}
                                 playerId={playerId}
                                 characterId={characterId}
                    />
                })
            }
        </div>
    )
}