import React,{useState,useEffect} from 'react'
//component for all the faces captured on the server
export default function MainFace(props){
    const [faces, setFaces] = useState([])              //set a state for the array of images 
    const [connected,setConnected] = useState(true)     //set a state if the connection is succsesfull or not
    const ip = props.ip                                 //get the ip of the backend
    
    function checkFaces(){                              //function for fetching faces
        fetch(ip + "/faceImages")                       //fetch the faces array
        .then(res => res.json())                        //convert the response to json
        .then(data=> {
            setFaces(data)                              //set the fetched array to faces
            setConnected(true)                          //set connected to true
        })  
        .catch((err)=>{                                 //if an error accurs 
            console.log(err)                            //log the error in the console
            setConnected(false)                         //set is connected to false
        })
    }
    
    useEffect(()=>{                                     //use useEffect to avoid side affects
        checkFaces()                                    //fetch the faces
        const intervalID = setInterval(checkFaces,5000) //set an interval to fetch faces every 5 seconds
        return(() => (clearInterval(intervalID)))       //when we unrender the component return clearInterval with the interval id to avoid a function that doesent exists
    },[])

    let renderFaces = faces.map((cur) => (              //map all the faces in the array to jsx ellement
        <div  key ={cur}  className='pic'>             
            <img className="thumbnail" src={`${ip}/faceImages/${cur}`}></img>
            <h1>{cur.slice(0,-6)}</h1>
        </div>
    ))
    //jsx ellement in case of an error
    const error_message = (
        <div className='error'>
            <h1>Error connecting to the server</h1>
            </div>
        )
    //return the component
    return(
        <div className='pic-flex'>
            {connected ? renderFaces: error_message}
        </div>
    
    )
}