import React from 'react'

import NavBar from "../components/globalComponents/NavBar"
import Main from "../components/homeComponents/Main"
import Faces from "../components/homeComponents/Faces"
import "../styles/Home.css"
//returns the home page where the live video can be seen
function Home(props) {
  return(
  <div>
    <NavBar/>
    <Main ip={props.ip}/>
    <Faces ip={props.ip}/>
  </div>
  )
}
export default Home