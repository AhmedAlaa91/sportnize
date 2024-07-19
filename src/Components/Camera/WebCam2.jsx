import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
//import * as tf from '@tensorflow/tfjs-backend-webgpu';
import * as posedetection from '@tensorflow-models/pose-detection';
import outline_man_front from '../../Assets/outline_man_front.svg'; // Adjust this path
import drawDynamicSkeleton from '../BodyPix/FrontPose'
import drawDynamicSkeletonRight from '../BodyPix/RightPose'
import drawDynamicSkeletonLeft from '../BodyPix/LeftPose'
import { green } from '@mui/material/colors';
const WebCam = () => {
    const videoRef = useRef(null);
    const photoRef = useRef(null);
    const mediaStreamRef = useRef(null);
    const [imageUrl, setImageUrl] = useState(outline_man_front);
    const [hasPhoto, setHasPhoto] = useState(false);
    const canvasRef = useRef(null);
    const detectorRef = useRef(null);
    const [distanceShoulders, setDistanceShoulders] = useState(null);

    const [frontPoseCaptured,setFrontPoseCaptured] = useState(false);
    const frontPoseCapturedRef = useRef(frontPoseCaptured);
    const [rightPoseCaptured,setRightPoseCaptured] = useState(false);
    const rightPoseCapturedRef = useRef(rightPoseCaptured);
    const [leftPoseCaptured,setLeftPoseCaptured] = useState(false);
    const leftPoseCapturedRef = useRef(leftPoseCaptured);
    
    const [headerText,SetHeaderText] = useState('Take Test');
    const [headerTextColor,SetHeaderTextColor] = useState('black');
    const headerTextColorRef = useRef(headerTextColor);

    let isAnimating = true;

    useEffect(() => {
        async function initializeBackend() {
            try {
                await tf.ready();
                if (tf.engine().backendNames().includes('webgpu')) {
                    await tf.setBackend('webgpu');
                    console.log(`TensorFlow.js is using the ${tf.getBackend()} backend.`);
                } else if (tf.engine().backendNames().includes('webgl')) {
                    await tf.setBackend('webgl');
                    console.log(`TensorFlow.js is using the ${tf.getBackend()} backend.`);
                } else {
                    await tf.setBackend('cpu');
                    console.log(`TensorFlow.js is using the ${tf.getBackend()} backend.`);
                }
            } catch (err) {
                console.error('Failed to initialize TensorFlow.js backend:', err);
            }
        }

        async function loadMoveNetModel() {
            const model = posedetection.SupportedModels.MoveNet;
            detectorRef.current = await posedetection.createDetector(model);
        }

        initializeBackend().then(loadMoveNetModel);
    }, []);

    useEffect(() => {
        frontPoseCapturedRef.current = frontPoseCaptured;
    }, [frontPoseCaptured]);


    useEffect(() => {
        rightPoseCapturedRef.current = rightPoseCaptured;
    }, [rightPoseCaptured]);




    const startAnimation = () => {
        isAnimating = true;
        renderFrame();
    };


    const stopAnimation = () => {
        isAnimating = false;
    };

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
        stopAnimation();
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        let video = videoRef.current;
        video.srcObject = null;
        
    };

    const renderFrame = () => {
        if (videoRef.current && canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
            console.log('render');
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
            SetHeaderText('FRONT POSE DETECTION')
            let frontCheck= drawDynamicSkeleton(poses, canvas.getContext('2d'));
         
            if (frontCheck && !frontPoseCapturedRef.current)
            {
               SetHeaderTextColor('green');


                  

                  setTimeout(() => {
                   // stopAnimation();
                   setFrontPoseCaptured(true);
             
                   takePhoto();
                    
                    
                  
                  }, 1000);

                  console.log('frontPoseCapturedRef.current',frontPoseCapturedRef.current  );

            }

           

          

            else if (frontPoseCapturedRef.current && !rightPoseCapturedRef.current)
                {
                   // startAnimation();
                    //getVideo();
                    SetHeaderText('RIGHT POSE DETECTION')
                    SetHeaderTextColor('black');
                   // startAnimation();
                   // getVideo();

                    let rightCheck= drawDynamicSkeletonRight(poses, canvas.getContext('2d'));
    
                    if (rightCheck )
                        {
                            SetHeaderTextColor('green');

                            takePhoto();
                                
                            setRightPoseCaptured(true);
                             
            
                            //   setTimeout(() => {
                            //     StopVideo();
                            //    // stopAnimation();
                              
                            //   }, 5000);
                            console.log('rightPoseCapturedRef.current',rightPoseCapturedRef.current  );
            
                        }
                     
    
                }


                else if (rightPoseCapturedRef.current && !leftPoseCapturedRef.current)
                    {

                        console.log('left');
                       // startAnimation();
                        //getVideo();
                        SetHeaderText('LEFT POSE DETECTION');
                        SetHeaderTextColor('black');
                       // startAnimation();
                       // getVideo();
    
                        let leftCheck= drawDynamicSkeletonLeft(poses, canvas.getContext('2d'));
        
                        if (leftCheck )
                            {
                                SetHeaderTextColor('green');
    
                                takePhoto();
                                    
                                setLeftPoseCaptured(true);
                                 
                
                                  setTimeout(() => {
                                    StopVideo();
                                   stopAnimation();
                                  
                                  }, 5000);
                
                            }
        
                    }

            

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
    };

    const closePhoto = () => {
        let photo = photoRef.current;
        let ctx = photo.getContext('2d');
        setHasPhoto(false);
        ctx.clearRect(0, 0, photo.width, photo.height);
    };

    // const estimateShoulderDistance = (pose) => {
    //     const keypoints = pose.keypoints;
    //     const leftShoulder = keypoints.find(keypoint => keypoint.name === 'left_shoulder');
    //     const rightShoulder = keypoints.find(keypoint => keypoint.name === 'right_shoulder');

    //     if (leftShoulder && rightShoulder && leftShoulder.score > 0.7 && rightShoulder.score > 0.7) {
    //         const shoulderDistancePixels = Math.sqrt(
    //             Math.pow(leftShoulder.x - rightShoulder.x, 2) + Math.pow(leftShoulder.y - rightShoulder.y, 2)
    //         );

    //         // Assuming a reference width for shoulder distance (e.g., average human shoulder width)
    //         const averageShoulderWidthMeters = 0.4; // 0.4 meters
    //         const frameWidthPixels = 640; // frame width in pixels

    //         const shoulderDistanceMeters = (shoulderDistancePixels / frameWidthPixels) * averageShoulderWidthMeters;

    //         return shoulderDistanceMeters;
    //     }

    //     return null;
    // };
    
    // const estimateNoseAnkleDistance = (pose) => {
    //     const keypoints = pose.keypoints;
    //     const nose = keypoints.find(keypoint => keypoint.name === 'nose');
    //     const leftAnkle = keypoints.find(keypoint => keypoint.name === 'left_ankle');
    //     const rightAnkle = keypoints.find(keypoint => keypoint.name === 'right_ankle');

    //     if (nose && (leftAnkle || rightAnkle) && nose.score > 0.7 && (leftAnkle?.score > 0.7 || rightAnkle?.score > 0.7)) {
    //         const ankle = leftAnkle?.score > 0.7 ? leftAnkle : rightAnkle;
    //         const distancePixels = Math.sqrt(
    //             Math.pow(nose.x - ankle.x, 2) + Math.pow(nose.y - ankle.y, 2)
    //         );

    //         // Assuming a reference distance for nose to ankle in real-world (e.g., average human height)
    //         const averageHeightMeters = 1.7; // 1.7 meters
    //         const frameHeightPixels = 1080; // frame height in pixels

    //         const distanceMeters = (distancePixels / frameHeightPixels) * averageHeightMeters;
    //         const distanceCm = distanceMeters * 100; // Convert meters to centimeters

    //         return distanceCm;
    //     }

    //     return null;
    // };

    return (
        <div className='camera'>
            <div className='webcamera'>
            <h1  style={{ color: headerTextColor }} >{headerText}</h1>
                <div className='submit-container'>
                    <button className='actionbutton' onClick={getVideo}>START</button>
                    <button className='actionbutton' onClick={StopVideo}>STOP</button>
                </div>
                <div style={styles.container}>
                    <video ref={videoRef} autoPlay style={styles.video} hidden></video>
                    <canvas ref={canvasRef} width="1920" height="1080"></canvas>
                    <img src={imageUrl} alt="Overlay" style={styles.overlay} />
                    <button className='button' onClick={takePhoto}>CAPTURE</button>
                </div>
            </div>
            <div className={(hasPhoto ? 'hasPhoto' : '')}>
                <canvas ref={photoRef}></canvas>
                <button className='button' onClick={closePhoto} style={hasPhoto ? { visibility: 'visible' } : { visibility: 'hidden' }}>CLOSE</button>
            </div>
        </div>
    );
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
    overlay: {
        position: 'absolute',
        bottom: '0',
        left: '0',
        width: '100%',
        height: '90%',
        pointerEvents: 'none', // Ensure clicks go through to the video
        opacity: 0.7, // Adjust the opacity value to make the overlay more transparent
    },
};
export default WebCam;