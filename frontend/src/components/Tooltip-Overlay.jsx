import React from 'react'
import "./Tooltip-Overlay.css"
import {useState, useEffect} from 'react'
import {useSelector} from "react-redux";




function Tooltip (props) {
    const [x, y] = props.coords
    const { data } = props

    return (
        <div style={{transform: `translate(min(${x+50}px, calc(100vw - 450px)), min(${y+50}px, calc(100vh - 100% - 25px)))`, zIndex:50}} className={"tooltip"}>
            <div className="tooltip-item-name">{data.name}</div>
            {
                data.cost ?
                <div className="cost">{`${data.cost?.amount} ${data.cost?.type}`}</div> :
                null
            }
            <div>{`stacks ${data.maxStackCount} time(s)`}</div>
            <div className={'item-description'}>{data.text}</div>

        </div>
    )
}

export default function TooltipOverlay (){
    const [coords, setCoords] = useState([0,0])

    useEffect(() => {
        window.addEventListener('mousemove', handleTooltipMove)

        return () => {
            window.removeEventListener('mousemove', handleTooltipMove)
        }

    }, [])
    const handleTooltipMove = (e) =>  {
        // console.log(e)
        setCoords([e.clientX, e.clientY])
    }

    const tooltipData = useSelector(state => state.tooltip)

    return (
        <div className={"tooltip-overlay"} onMouseMove={handleTooltipMove}>
            {
                tooltipData.tooltipIsActive ?
                    <Tooltip coords={coords} data={tooltipData.data}/>
                    : null
            }
        </div>
    )
}