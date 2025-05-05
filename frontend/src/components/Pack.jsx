import './Pack.css'
import {useDroppable} from "@dnd-kit/core";
import Item from "./Item";

import React, {useState} from "react";
import DraggableItem from "./Draggable-Item";
import {useSelector} from "react-redux";
import {Droppable} from "./Droppable";


export default function Pack ({slotNumber, packData, playerId}) {
    // console.log('inside pack component: ', playerId)
    // console.log("pack component, packData: ", packData)

    const {isOver, setNodeRef} = useDroppable({
        id: packData.id,
        data: {
            playerId,
            //TODO: this could be used to better ferry data to the redux reducers
        },

    })
    const style = {
        backgroundColor: isOver ? 'green' : undefined,
    }
     // const data =
    // console.log(data);
    // const p = useSelector(state => state.inventory)
    //     .reduce((a, c) => {
            // console.log("a", a)
            // a.push(c.id)
            // return a
        // },[])
    // console.log(p)
    return (
        <div className="packData">

            <div className="containerData">
                <div className="container-number">{slotNumber+1}</div>
                <input type="text" className="containerName" placeholder={'Backpack'}/>
            </div>

            <div className={`armorData armorData--${slotNumber+1}`}>
                {packData?.armor?.isArmorSlot ? <div><p>*ignore if {packData.armor.type}*</p></div> : null}
                <div className="pack" >
                    <div className="pack-background" style={style}>
                        <div className="join-bar-bg">{packData.id}</div>
                        <div className="pack-segment-bg"></div>
                        <div className="pack-segment-bg"></div>
                        <div className="pack-segment-bg"></div>
                    </div>
                    <Droppable>
                        <div className="pack-items " ref={setNodeRef}>
                            {packData.items?.map((item,  i) => {
                                return <Item key={item.id}
                                             packSlotNumber={slotNumber}
                                             itemSlotNumber={i}
                                             data={item}
                                             packId={packData.id}
                                             isResult={false}
                                             playerId={playerId}
                                />
                            })}
                        </div>
                    </Droppable>
                </div>


            </div>

            <div className="containerStatus">
                <div className="statusOption option1">
                    <input type="radio" name={`containerStatus-${slotNumber+1}`} value={"equipped"}/>
                    {/*<label htmlFor="equip">Equipped</label>*/}
                </div>
                <div className="statusOption option2">
                    <input type="radio" name={`containerStatus-${slotNumber+1}`} value={"dropped"}/>
                    {/*<label htmlFor="drop">Dropped</label>*/}
                </div>
                <div className="statusOption option3">
                    <input type="radio" name={`containerStatus-${slotNumber+1}`} value={"lost"}/>
                    {/*<label htmlFor="lost">Lost</label>*/}
                </div>

            </div>
        </div>
    )
}