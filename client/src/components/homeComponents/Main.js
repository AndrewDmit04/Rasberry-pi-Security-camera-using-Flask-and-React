import React, {useState,useEffect} from 'react'
import notFoundImage from './images/notFound.png'
import Recording from './Recording';
//main component for the live video
export default function Main(props){
    const [loaded,setLoaded] = useState(false);             //set a state for the sucsses of loading the page
    const [isRecording,setIsRecording] = useState(true);    //set a state for if server is recording, not used here the server is always recording
    const ip = props.ip                                     //get the ip of the server declared in app.js
    function checkStatus(){                                 //function to check the status of the server
        fetch(ip + "/status")                               //fetch the status
        .then(res=>res.json())                              //get the response as a json
        .then(data=>{               
            if(data.status === 'good'){                     //if the response status is good 
                setLoaded(true)                             //set loaded to be true indicated the response is good
            }
        })
        .catch(err=>{                                       //if theres an error
            setLoaded(false)                                //set it to be false
            console.log(err)                                //display the error
        })

    }
    useEffect(()=>{
        checkStatus()                                      //run the checkStatus function
        const intervalId = setInterval(()=>{checkStatus()},5000) //set up an interval to run the function every 5 seconds
        return(()=>{clearInterval(intervalId)})            //clear the interval when the component is no longer rendered
    },[])
    
    //return the main component
    return(
        <div className='main'>
            { loaded  &&    <Recording rec={isRecording}/>}
            <div className='video'>
                <img alt="mainStream" src={loaded ? `${ip}//video_feed` : notFoundImage} />
            </div>
        </div>
    )
}