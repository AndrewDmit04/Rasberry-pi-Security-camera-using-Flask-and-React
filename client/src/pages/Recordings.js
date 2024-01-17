import React from 'react'
import NavBar from '../components/globalComponents/NavBar'
import Mainrec from '../components/RecordingsComponents/MainRec'
import "../styles/Recordings.css"
//returns the page with all the recordings on the server
export default function Recordings(props){
    return(
        <div>
            <NavBar/>
            <Mainrec ip={props.ip}/>
        </div>
    )
}