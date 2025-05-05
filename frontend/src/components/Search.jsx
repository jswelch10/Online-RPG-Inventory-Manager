import '../font-awesome.min.css'
import './Search.css'
import React, {useState} from 'react'
import Results from "./Results";


export default function Search() {
    const [value, setValue] = useState('')

    const handleChange = (e) => {
        setValue(e.target.value)
    }

    return (<>
        <div className={"search-container"}>
            <input type="text"
                   placeholder={'Search for Item'}
                   onChange={handleChange}
                   value={value}/>
            <button>
                <i className="fa fa-search" aria-hidden="true"></i>
            </button>
        </div>
        <Results value={value} />
    </>)
}
