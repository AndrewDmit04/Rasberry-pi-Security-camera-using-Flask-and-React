import React, {useEffect,useState} from 'react'
//component for all the recent faces seen
export default function Faces(props){
    
    const [faces,setFaces] = useState([])       //use state for the json array of images 
    const ip = props.ip                         //get the ip of the backend decalred in app.js
    const getFaces = ()=>{
        fetch(ip+ "/Faces")                     //fetch the array of faces
            .then((res=>res.json()))            //convert it to json array data
            .then((data) => {
                setFaces((data.faces).reverse()) // set the array of faces to the state
            }) 
            .catch(err =>{                      //catch any errors
                console.log(err)                //console log the error
                setFaces([])                    //set faces to empty array
            })
    }
    useEffect(() =>{                            //use effect to avoid side effects
        getFaces()                              //fetch images from server
        const IntervalId = setInterval(()=>{getFaces()},1000)   //set up an interval to update the faces each second
        return () =>clearInterval(IntervalId)   //return clear interval so when the component is unrendered the function is not called
    },[])
    //render each face as a jsx image element
    let ShowFaces = faces.map((img,i) =>(        
        <img id={i} className="individual-face" src={`data:image/jpeg;base64,${img}`}></img>
    ))
    //return the recent faces component
    return(
        <div className='faces'>
            <h1><span style={{color:"red"}}>R</span>ecent Faces:</h1>
            {ShowFaces}
        </div>
    )
}