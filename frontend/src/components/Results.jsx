import React, {useEffect, useState, useRef} from 'react'
import Item from "./Item";
import {nanoid} from "@reduxjs/toolkit";
import DestroyItemDrop from "./DestroyItemDrop"
import data from "../data.json"
export default function Results(props) {
    const value = props.value.toLowerCase()
    const resultId = `pack-${nanoid(6)}`
    const scrollRef = useRef('')

    // if(value === '') return <></>

    //string match the searchbar value to the name value in the data.json, then flatten edge cases like casting foci
    const filteredData = data.filter((el) => {
        if( value === '')  return false

        if (el.name.toLowerCase().includes(value)) {
            return true
        } else if (el.categories) { //TODO: eventually all data items will have categories
            for(let i=0;i < el.categories.length; i++) {
               if (el.categories[i].toLowerCase().includes(value)) return true
            }
        } else return false // TODO: make this regex for a better search
                            // TODO: convert this to reducer when it inevitably gets too complex
    })
    useEffect(() => {
        const scroll = scrollRef.current
        const handleScroll = (e) => {
            e.preventDefault()
            scroll.scrollLeft += e.deltaY
        }
        scroll.addEventListener('wheel', handleScroll)

        return () => scroll.removeEventListener('wheel', handleScroll)
    }, []);



    return(
        <div className={"results-row"}>
            <div className={"search-results"}>
                <ul ref={scrollRef} style={filteredData.length > 0 ? {overflowX: 'scroll'} : {overflowX:'hidden'}}>
                    {filteredData.map(item => (
                        <li className={`results-list-item`} key={item.id}>
                            <Item key={item.id} data={item} packId={resultId} isResult={true} />
                        </li>
                    ))}
                </ul>
            </div>
            <DestroyItemDrop />
        </div>
    )
}