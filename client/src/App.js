/////////////////////////////////////////////////////////////////////////////////////
//CODE WRITTED BY: Andrew Dmitrievsky
//PURPOSE: create a React-flask application that could monitor-record any part of the 
//house. It will be able to record videos and store them on the server, run facial recognition 
//and store the faces on the server, and will produce a live feed of the camera. 
//It will also be able to show the recorded videos and faces inside of the application
/////////////////////////////////////////////////////////////////////////////////////

import React from 'react'                                         //import React library
import {BrowserRouter, Routes, Route} from 'react-router-dom'     //import react-router-dom for multiple pages on the website
import Home from './pages/Home'                                   //import home page-landing page
import Recordings from './pages/Recordings'                       //import Recordings page where you can see recorded videos
import FaceImages from './pages/FaceImages'                       //import faceImages where you can see all captured faces
const backEndserverIp = "http://YOUR-IP:5000"                     //ip of the backend flask application
function App() {
  return(
    <BrowserRouter>                                               
      <Routes>
        <Route index element={<Home ip={backEndserverIp}/>}/>
        <Route path="*" element={<Home ip={backEndserverIp}/>}/>
        <Route path='/home' element={<Home ip={backEndserverIp}/>}/>
        <Route path='/recordings' element={<Recordings ip={backEndserverIp}/>}/>
        <Route path='/faceimages' element={<FaceImages ip={backEndserverIp}/>}/>
      </Routes>
    </BrowserRouter>
  )
}
export default App
