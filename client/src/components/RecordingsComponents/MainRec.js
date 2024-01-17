import React, {useState,useEffect} from 'react'

//component that returns all the videos on the server
export default function MainRec(props){
    
    const [videos, setVideos] = useState([])            //state for the list of videos on the server
    const [connected,setConnected] = useState(true)     //state if the connection to the server is sucssefull
    const ip = props.ip                                 //get the ip of the backend declared in app.js
    
    function getVideos(){                               //function to fetch the videos from the server
        fetch(ip + "/videos")                           //fetch the list of videos on the server
        .then(res => res.json())                        //get the list of videos as a json
        .then(data=> {
            setVideos(data)                             //set the list of videos to the useState
            setConnected(true)                          //set the connection as true showing the server connection is sucsesfull 
        })
        .catch((err)=>{                                 //catch any errors that accur
            console.log(err)                            //console log the error if occurs
            setConnected(false)                         //se the connection to false showing the server connection has failed
        })
 
    }
    
    useEffect(()=>{
        getVideos()                                             //use useEffect to avoid side effects call the fetch function
        const intervalID = setInterval(getVideos,5000)          //set an interval to call it every 5 seconds
        return(()=>(clearInterval(intervalID)))                 //return clearInterval so when the componenet is not rendered any more the it will stop calling the getVideos function
    },[])


    function dowloadVid(name){                                  //function to dowload a selected video
        window.location.href = ip + "/videos/" + name           //will take the user to a dowload link which will dowload the selected video
    }
    let renderVids = videos.map((cur) => (                      //renders each video as a component
        <div  key ={cur} onClick={()=>dowloadVid(cur)} className='vid'>
            <img className="thumbnail" src={`${ip}/thumbnails/${cur}`}></img>
            <h1>{cur.slice(0,-4)}</h1>
        </div>
    ))
    //error message incase the server did not connect
    const error_message = (
        <div className='error'>
            <h1>Error connecting to the server</h1>
        </div>
    )
    //returns the compoenent with all the videos inside. 
    return(
        <div className='video-flex'>
            {connected ? renderVids : error_message}
        </div>
    
    )
} 