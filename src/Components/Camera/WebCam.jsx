import { Button } from '@mui/material';
import React , {useRef, useState, useEffect} from 'react'
import './Webcam.css'
import outline_man_front from '../../Assets/outline_man_front.svg'
const WebCam = () => {
    const videoRef = useRef(null);
    const photoRef = useRef(null);
    const mediaStreamRef = useRef(null)
    const [imageUrl, setImageUrl] = useState(outline_man_front);
    const [hasPhoto , setHasPhoto] =  useState(false);
    
  
    const getVideo = () => {
        navigator.mediaDevices.getUserMedia({ video:{ width: 1920, height: 1080 } }).then(stream => {
        
            mediaStreamRef.current = stream;
            let video =videoRef.current;
            video.srcObject = stream;
            video.play();
            
        })
        .catch(err => { console.log(err)})
    }

    const StopVideo = () => {
 
     
            
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            let video =videoRef.current;
            video.srcObject=null;

       
    }

            

    const takePhoto =  ()=>{
        const width =414;
        const height = width /(16/9);
        let video = videoRef.current;
        let photo = photoRef.current;

        photo.width=width;
        photo.height=height;

        let ctx = photo.getContext('2d')
        ctx.drawImage(video,0,0,width,height);
        setHasPhoto(true);
    }

    const closePhoto = () => {

        let photo = photoRef.current;

        let ctx = photo.getContext('2d');
        setHasPhoto(false);
        ctx.clearRect(0,0,photo.width,photo.height);

    }

  //  useEffect(()=> {getVideo()},[videoRef])

  return (
    <div className='camera'>
      <div className='webcamera'>
        Take The Test   
        <div className='submit-container'>
        <button className='actionbutton' onClick={getVideo} >START </button>
        <button className='actionbutton' onClick={StopVideo} >STOP </button>
        </div>
        <div style={styles.container}>
        <video ref={videoRef} autoPlay style={styles.video}></video>
        <img src={imageUrl} alt="Overlay" style={styles.overlay} />
        <button className='button' onClick={takePhoto} >CAPTURE</button>
        </div>

        </div>
        <div className={(hasPhoto ? 'hasPhoto' : '')}>
            <canvas ref={photoRef}></canvas>
            <button className='button' onClick={closePhoto} style={hasPhoto? {visibility:'visible'}:{visibility:'hidden'}}>CLose</button>


        </div>
    </div>
  )
}

const styles = {
    container: {
      position: 'relative',
      width: '640px', // Adjust as necessary
      height: '480px', // Adjust as necessary
    },
    video: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    overlay: {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      pointerEvents: 'none', // Ensure clicks go through to the video
      opacity: 0.5, // Adjust the opacity value to make the overlay more transparent
    },
  };
  

export default WebCam