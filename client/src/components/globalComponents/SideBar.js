import React from 'react'

//navbar component
export default function NavBar(props){
    //return the slide out menu component
    return(
    <div className={`sideMenu ${props.status ? "slide-out" : ""}`}>
        <h1 className='intials'><span>A</span>D</h1>
        <button className='exitButton' onClick={props.func}>X</button>
        <ul className='Options'>
            <li><a href="/home"><button>Home</button></a></li>
            <li><a href="/recordings"><button>Check Recordings</button></a></li>
            <li><a href="/faceimages"><button>Check All faces</button></a></li>
        </ul>
        <p className='copyRight'>&copy; All rights reserved</p>
    </div>
    )
}