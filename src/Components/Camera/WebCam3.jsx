import React, { useRef, useEffect, useState } from 'react';
import outline_man_front from '../../Assets/outline_man_front.svg'; 
import left_pose_outline from '../../Assets/left_pose_outline.png'; 
import right_pose_outline from '../../Assets/right_pose_outline.png'; 
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { FileUpload } from '@mui/icons-material';

const WebCam = () => {
    const profile = useSelector((state) => state.data.profile);
    const videoRef = useRef(null);
    const photoRef = useRef(null);
    const mediaStreamRef = useRef(null);
    const [imageUrl, setImageUrl] = useState(outline_man_front);
    const [hasPhoto, setHasPhoto] = useState(false);
    const canvasRef = useRef(null);
    const detectorRef = useRef(null);
    
    const navigate = useNavigate();


    const [thumbnail, setThumbnail] = useState(false);


    const [countdownTime, setCountdownTime] = useState(5); // Countdown time in seconds
    const [isCountingDown, setIsCountingDown] = useState(false);
    const countdownIntervalRef = useRef(null);


    const [headerText,SetHeaderText] = useState('Take Test');
    const [headerTextColor,SetHeaderTextColor] = useState('black');
    const headerTextColorRef = useRef(headerTextColor);

    let isAnimating = true;


    const [frontPoseCaptured,SetFrontPoseCaptured] = useState(false);
    const [rightPoseCaptured,SetRightPoseCaptured] = useState(false);
    const [leftPoseCaptured,SetLeftPoseCaptured] = useState(false);
    const [backPoseCaptured,SetBackPoseCaptured] = useState(false);
    const [allCaptured ,setAllCaptured ] = useState(false);



    const [uploadFile, setUploadFile] = useState(false);
    const [buttonFunName, setButtonFunName] = useState('Upload');




    useEffect(() => {
        if (isCountingDown) {
            if (countdownTime > 0) {
                countdownIntervalRef.current = setInterval(() => {
                    setCountdownTime(prevTime => prevTime - 1);
                }, 1000);
            } else {
                takePhoto();
                HandlePoses();
            }
        }
        return () => clearInterval(countdownIntervalRef.current);
    }, [isCountingDown, countdownTime]);

    useEffect(() => {
        if (isAnimating) {
            renderFrame();
        }
    }, [isAnimating, countdownTime]);


    const startAnimation = () => {
        isAnimating = true;
        setIsCountingDown(true);
        renderFrame();
    };


    const stopAnimation = () => {
        isAnimating = false;
        setIsCountingDown(false);
        clearInterval(countdownIntervalRef.current);
    };

    const HandlePoses = () => {
        setThumbnail(true);
        if (!frontPoseCaptured)
        {
            SetHeaderText('Front Pose');
            SetHeaderTextColor('green');
            getVideo();
            SetFrontPoseCaptured(true);
            clearInterval(countdownIntervalRef.current);
            setIsCountingDown(false);
            setCountdownTime(5);
        }

        else if (frontPoseCaptured && !rightPoseCaptured)
        {
            setImageUrl(right_pose_outline);
            SetHeaderText('Right Pose');
            SetHeaderTextColor('green');
            getVideo();
            SetRightPoseCaptured(true);
            clearInterval(countdownIntervalRef.current);
            setIsCountingDown(false);
            setCountdownTime(5);

        }

        else if (frontPoseCaptured && rightPoseCaptured && !leftPoseCaptured)
            {
                setImageUrl(left_pose_outline);
                SetHeaderText('Left Pose');
                SetHeaderTextColor('green');
                getVideo();
                SetLeftPoseCaptured(true);
                clearInterval(countdownIntervalRef.current);
                setIsCountingDown(false);
                setCountdownTime(5);
    
            }

        else if (frontPoseCaptured && rightPoseCaptured && leftPoseCaptured && !backPoseCaptured)
                {
                    setImageUrl(outline_man_front);
                    SetHeaderText('back Pose');
                    SetHeaderTextColor('green');
                    getVideo();
                    SetBackPoseCaptured(true);
                    clearInterval(countdownIntervalRef.current);
                    setIsCountingDown(false);
                    setCountdownTime(5);
                    setAllCaptured(true);
        
                }

        // else if (leftPoseCaptured) {
        //     StopVideo();
        // }
    }

    const getVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: { width: 1920, height: 1080 } }).then(stream => {
            mediaStreamRef.current = stream;
            let video = videoRef.current;
            video.srcObject = stream;
            video.play();
            startAnimation();
        }).catch(err => { console.log(err) });
    };

    const StopVideo = () => {

        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        let video = videoRef.current;
        video.srcObject = null;
        stopAnimation();
        setThumbnail(false);
        
    };
    

    const renderFrame = () => {
        if (videoRef.current && canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
            if (isCountingDown) {
                const fontSize = canvasRef.current.height;
                ctx.font = `${fontSize}px Arial`;
                ctx.fillStyle = 'green';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(countdownTime, canvasRef.current.width / 2, canvasRef.current.height / 2);
            }
            if (isAnimating) {
                requestAnimationFrame(renderFrame);
            }
            handleFrame(canvasRef.current);
        }
    };

    const handleFrame = async (canvas) => {
        if (detectorRef.current) {
            const poses = await detectorRef.current.estimatePoses(canvas, {
                flipHorizontal: false,
            });


        }
    };

 
    const takePhoto = () => {
       // stopAnimation();
        const width = 414;
        const height = width / (16 / 9);
        let video = videoRef.current;
        let photo = photoRef.current;

        photo.width = width;
        photo.height = height;

        let ctx = photo.getContext('2d');
        ctx.drawImage(video, 0, 0, width, height);
        setHasPhoto(true);


        photo.toBlob(async (blob) => {
            // Create FormData to send the image
            const formData = new FormData();
            formData.append('photo', blob, profile['user_id']+'_'+headerText+'_photo.png');
    
            try {
                // Send the image to the Django backend
                const response = await fetch('http://127.0.0.1:8080/api/upload/', {
                    method: 'POST',
                    body: formData,
                });
    
                if (response.ok) {
                    console.log('Photo uploaded successfully');
                } else {
                    console.error('Failed to upload photo');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }, 'image/png');
    };

    const closePhoto = () => {
        let photo = photoRef.current;
        let ctx = photo.getContext('2d');
        setHasPhoto(false);
        ctx.clearRect(0, 0, photo.width, photo.height);
    };


    const gallery = () => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        navigate('/gallery');
    };


    const UploadFromPc = () => {

        setUploadFile(true);
        setButtonFunName('Save');
    };

    const [file, setFile] = useState(null);

    const takeFile = (event) => {
        // Capture the file from the input
        setFile(event.target.files[0]);
      };


    const sendFile = async() => {

        if (!file) {
            console.error('No file selected');
            return;
          }

        const originalFileName = file.name;
        const fileExtension = originalFileName.substring(originalFileName.lastIndexOf('.')); // Get file extension (e.g., .jpg, .png)
        const fileNameWithoutExtension = originalFileName.substring(0, originalFileName.lastIndexOf('.')); // Get the name without extension

        // Modify the file name (e.g., append "_modified" to the original file name)
        const newFileName = `${profile['user_id']}_${fileNameWithoutExtension}${fileExtension}`;

        // Create a new File object with the modified name
        const renamedFile = new File([file], newFileName, { type: file.type });

        const formData = new FormData();
        formData.append("photo", renamedFile);
      
            // "photo" should match the field name your Django expects
      
          try {
            // Send the image to the Django backend
            const response = await fetch('http://127.0.0.1:8080/api/upload/', {
              method: 'POST',
              body: formData,
            });
      
            if (response.ok) {
              console.log('Photo uploaded successfully');
              setUploadFile(false);
              setButtonFunName('Upload');
            } else {
              console.error('Failed to upload photo');
            }
          } catch (error) {
            console.error('Error uploading the photo:', error);
          }
        };


    console.log(profile);
 
    if(!profile){
        return (
        <h1>Please SignUp to use this feature</h1>
        )


    }

    else {
    return (
        <div className='camera'>
            <div className='webcamera'>
            <h1  style={{ color: headerTextColor }} >{headerText}</h1>
            <div className='submit-container'>
                    
            <button className='actionbutton' onClick={gallery}>My Photos</button>
                </div>
                <div className='submit-container'>
                    <button className='actionbutton' onClick={HandlePoses}>START</button>
                    <button className='actionbutton' onClick={StopVideo}>STOP</button>
                    <button className='actionbutton' onClick={uploadFile ? sendFile : UploadFromPc} >{buttonFunName}</button>
                    {uploadFile && (
        <input type="file" style={{ display: "block" }} onChange={takeFile} />
      )}
                </div>
                
                <div style={styles.container}>
                    <video ref={videoRef} autoPlay style={styles.video} hidden></video>
                    <canvas ref={canvasRef} width="1920" height="1080"></canvas>
                    <img src={imageUrl} alt="Overlay" style={styles.overlay(thumbnail) } />
                    <button className='button' onClick={takePhoto}>CAPTURE</button>
                    
                </div>
                
            </div>
            <div className={(hasPhoto ? 'hasPhoto' : '')}>
                <canvas ref={photoRef}></canvas>
                <div className='submit-container'>
                <button className='button' onClick={closePhoto} style={hasPhoto ? { visibility: 'visible' } : { visibility: 'hidden' }}>CLOSE</button>
                
                </div>
            </div>
        </div>
    );
}
};

const styles = {
    container: {
        position: 'relative',
        width: '1920px', // Adjust as necessary
        height: '1080px', // Adjust as necessary
    },
    video: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    overlay: (thumbnail) => ({
        position: 'absolute',
        top: '0',
        left: '0',
        width: '20%',
        height: '30%',
        pointerEvents: 'none', // Ensure clicks go through to the video
        opacity: 0.7, // Adjust the opacity value to make the overlay more transparent
        border: '5px solid rgba(0, 0, 0, 0.3)',
        visibility: thumbnail ? 'visible' : 'hidden',
    }),
};
export default WebCam;

