import React from 'react'

//component for the recording dot if false is passed in then the dot wont blink
export default function Recording(props){
    return(
        <div className='recording'>
            <span className={`recording-dot 
                        ${props.rec ? "blinking" : "hide"}`}>
                &#x2022;
            </span>Recording
        </div>
    )
}