import React, {useState} from 'react'
import SideBar from './SideBar'
export default function NavBar(){
    
    const [sideMenu, setSideMenu] = useState(false)     //use a state for if the side menu should be displayed

    function changeSideMenu(){
        setSideMenu(prev=>!prev)                        //if the hamburger icon is clicked switch the state
    }
    //return the navbar component
    return(<div>
            <SideBar status={sideMenu} func={changeSideMenu}/>
            <nav className='NavBar'>
                <button onClick={changeSideMenu} className='Left'>
                    <div className='bar'></div>
                    <div className='bar'></div>
                    <div className='bar'></div>
                </button>
                <div className="right">
                <h1><span style={{color:"red"}}>A</span>ndrew's security feed </h1>
                </div>
            </nav>
        </div>
    )
}