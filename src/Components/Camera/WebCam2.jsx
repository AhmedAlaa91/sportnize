import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
//import * as tf from '@tensorflow/tfjs-backend-webgpu';
import * as posedetection from '@tensorflow-models/pose-detection';
import outline_man_front from '../../Assets/outline_man_front.svg'; // Adjust this path

const WebCam = () => {
    const videoRef = useRef(null);
    const photoRef = useRef(null);
    const mediaStreamRef = useRef(null);
    const [imageUrl, setImageUrl] = useState(outline_man_front);
    const [hasPhoto, setHasPhoto] = useState(false);
    const canvasRef = useRef(null);
    const detectorRef = useRef(null);
    const [distanceShoulders, setDistanceShoulders] = useState(null);

    // useEffect(() => {
    //     async function loadMoveNetModel() {
    //         const model = posedetection.SupportedModels.MoveNet;
    //         detectorRef.current = await posedetection.createDetector(model);
    //     }
    //     loadMoveNetModel();
    // }, []);
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

    const getVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: { width: 1920, height: 1080 } }).then(stream => {
            mediaStreamRef.current = stream;
            let video = videoRef.current;
            video.srcObject = stream;
            video.play();
            renderFrame();
        }).catch(err => { console.log(err) });
    };

    const StopVideo = () => {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        let video = videoRef.current;
        video.srcObject = null;
    };

    const renderFrame = () => {
        if (videoRef.current && canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
            //drawStaticSkeleton(ctx);
            handleFrame(canvasRef.current);
            requestAnimationFrame(renderFrame);
        }
    };

    const handleFrame = async (canvas) => {
        if (detectorRef.current) {
            const poses = await detectorRef.current.estimatePoses(canvas, {
                flipHorizontal: false,
            });
            drawDynamicSkeleton(poses, canvas.getContext('2d'));
            if (poses.length > 0) {
                const estimatedDistanceShoulders = estimateShoulderDistance(poses[0]);
                const distance = estimateNoseAnkleDistance(poses[0]);
                setDistanceShoulders(distance);
            }
        }
    };

    const drawDynamicSkeleton = (poses, ctx) => {
        poses.forEach((pose) => {
            const keypoints = pose.keypoints;
            //ctx.strokeStyle = 'red';
            const allDetected = keypoints.every(keypoint => keypoint.score > 0.7);
            const nose = keypoints.find(keypoint => keypoint.name === 'nose');
            const leftAnkle = keypoints.find(keypoint => keypoint.name === 'left_ankle');
            const rightAnkle = keypoints.find(keypoint => keypoint.name === 'right_ankle');
    
            const noseAndAnkleDetected = (nose && nose.score > 0.7) && ((leftAnkle && leftAnkle.score > 0.7) || (rightAnkle && rightAnkle.score > 0.7));
    
            let colorStyle = noseAndAnkleDetected ? 'green' : 'red';
            ctx.strokeStyle =colorStyle

            keypoints.forEach((keypoint) => {
                if (keypoint.score > 0.7) {
                    const { y, x } = keypoint;
                    ctx.beginPath();
                    ctx.arc(x, y, 5, 0, 2 * Math.PI);
                    ctx.fillStyle = colorStyle
                    ctx.fill();
                }
            // const leftShoulder = keypoints.find(keypoint => keypoint.name === 'left_shoulder');
            // const rightShoulder = keypoints.find(keypoint => keypoint.name === 'right_shoulder');

            // const shouldersDetected = leftShoulder && rightShoulder && leftShoulder.score > 0.7 && rightShoulder.score > 0.7;
            // ctx.strokeStyle = shouldersDetected ? 'green' : 'red';

            // keypoints.forEach((keypoint) => {
            //     if (keypoint.score > 0.7) {
            //         const { y, x } = keypoint;
            //         ctx.beginPath();
            //         ctx.arc(x, y, 5, 0, 2 * Math.PI);
            //         ctx.fillStyle = shouldersDetected ? 'green' : 'red';
            //         ctx.fill();
            //     }
            });

            const adjacentKeyPoints = posedetection.util.getAdjacentPairs(posedetection.SupportedModels.MoveNet);
            adjacentKeyPoints.forEach(([i, j]) => {
                ctx.beginPath();
                ctx.moveTo(keypoints[i].x, keypoints[i].y);
                ctx.lineTo(keypoints[j].x, keypoints[j].y);
                ctx.strokeStyle = colorStyle
                ctx.stroke();
            });

            if (noseAndAnkleDetected) {

                setTimeout(() => {
                    takePhoto();
                  }, 5000);

                  setTimeout(() => {
                    StopVideo();
                  }, 6000);
               
            }
        });
    };

    const takePhoto = () => {
        const width = 414;
        const height = width / (16 / 9);
        let video = videoRef.current;
        let photo = photoRef.current;

        photo.width = width;
        photo.height = height;

        let ctx = photo.getContext('2d');
        ctx.drawImage(video, 0, 0, width, height);

        // Draw the overlay image
        // let overlayImg = new Image();
        // overlayImg.src = imageUrl;
        // overlayImg.onload = function () {
        //     ctx.drawImage(overlayImg, 0, 0, width, height);
        //     setHasPhoto(true);
        // };
        
        setHasPhoto(true);
    };

    const closePhoto = () => {
        let photo = photoRef.current;
        let ctx = photo.getContext('2d');
        setHasPhoto(false);
        ctx.clearRect(0, 0, photo.width, photo.height);
    };

    const estimateShoulderDistance = (pose) => {
        const keypoints = pose.keypoints;
        const leftShoulder = keypoints.find(keypoint => keypoint.name === 'left_shoulder');
        const rightShoulder = keypoints.find(keypoint => keypoint.name === 'right_shoulder');

        if (leftShoulder && rightShoulder && leftShoulder.score > 0.7 && rightShoulder.score > 0.7) {
            const shoulderDistancePixels = Math.sqrt(
                Math.pow(leftShoulder.x - rightShoulder.x, 2) + Math.pow(leftShoulder.y - rightShoulder.y, 2)
            );

            // Assuming a reference width for shoulder distance (e.g., average human shoulder width)
            const averageShoulderWidthMeters = 0.4; // 0.4 meters
            const frameWidthPixels = 640; // frame width in pixels

            const shoulderDistanceMeters = (shoulderDistancePixels / frameWidthPixels) * averageShoulderWidthMeters;

            return shoulderDistanceMeters;
        }

        return null;
    };
    
    const estimateNoseAnkleDistance = (pose) => {
        const keypoints = pose.keypoints;
        const nose = keypoints.find(keypoint => keypoint.name === 'nose');
        const leftAnkle = keypoints.find(keypoint => keypoint.name === 'left_ankle');
        const rightAnkle = keypoints.find(keypoint => keypoint.name === 'right_ankle');

        if (nose && (leftAnkle || rightAnkle) && nose.score > 0.7 && (leftAnkle?.score > 0.7 || rightAnkle?.score > 0.7)) {
            const ankle = leftAnkle?.score > 0.7 ? leftAnkle : rightAnkle;
            const distancePixels = Math.sqrt(
                Math.pow(nose.x - ankle.x, 2) + Math.pow(nose.y - ankle.y, 2)
            );

            // Assuming a reference distance for nose to ankle in real-world (e.g., average human height)
            const averageHeightMeters = 1.7; // 1.7 meters
            const frameHeightPixels = 1080; // frame height in pixels

            const distanceMeters = (distancePixels / frameHeightPixels) * averageHeightMeters;
            const distanceCm = distanceMeters * 100; // Convert meters to centimeters

            return distanceCm;
        }

        return null;
    };

    return (
        <div className='camera'>
            <div className='webcamera'>
                Take The Test
                <div className='submit-container'>
                    <button className='actionbutton' onClick={getVideo}>START</button>
                    <button className='actionbutton' onClick={StopVideo}>STOP</button>
                </div>
                <div style={styles.container}>
                    <video ref={videoRef} autoPlay style={styles.video} hidden></video>
                    <canvas ref={canvasRef} width="1920" height="1080"></canvas>
                    <img src={imageUrl} alt="Overlay" style={styles.overlay} />
                    {distanceShoulders && <div style={styles.distance}>Estimated Nose - Anekls Distance: {distanceShoulders.toFixed(2)} Cmeters</div>}
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