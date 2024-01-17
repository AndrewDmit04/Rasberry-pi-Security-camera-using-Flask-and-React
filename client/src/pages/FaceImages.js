import React from 'react'                                   
import NavBar from '../components/globalComponents/NavBar'      //include the navbar component
import MainFace from '../components/facesComponents/MainFace'   //include the MainFace will contain all the faces
import "../styles/FaceImages.css"
export default function FaceImages(props){          
    //returns the page with all the recorded faces
    return(
        <div>
            <NavBar/>
            <MainFace ip={props.ip}/>
        </div>
    )
}