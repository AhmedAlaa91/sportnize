import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
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

    useEffect(() => {
        async function loadMoveNetModel() {
            const model = posedetection.SupportedModels.MoveNet;
            detectorRef.current = await posedetection.createDetector(model);
        }
        loadMoveNetModel();
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
                setDistanceShoulders(estimatedDistanceShoulders);
            }
        }
    };

    const drawStaticSkeleton = (ctx) => {
        const staticSkeletonKeypoints = [
            { x: 320, y: 100 },  // head
            { x: 320, y: 200 },  // neck
            { x: 270, y: 250 },  // left shoulder
            { x: 370, y: 250 },  // right shoulder
            { x: 270, y: 350 },  // left elbow
            { x: 370, y: 350 },  // right elbow
            { x: 270, y: 450 },  // left wrist
            { x: 370, y: 450 },  // right wrist
            { x: 320, y: 450 },  // torso
            { x: 270, y: 550 },  // left hip
            { x: 370, y: 550 },  // right hip
            { x: 270, y: 650 },  // left knee
            { x: 370, y: 650 },  // right knee
            { x: 270, y: 750 },  // left ankle
            { x: 370, y: 750 }   // right ankle
        ];

        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;

        // Draw skeleton lines
        const drawLine = (from, to) => {
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.stroke();
        };

        // Drawing static skeleton
        drawLine(staticSkeletonKeypoints[0], staticSkeletonKeypoints[1]);
        drawLine(staticSkeletonKeypoints[1], staticSkeletonKeypoints[2]);
        drawLine(staticSkeletonKeypoints[1], staticSkeletonKeypoints[3]);
        drawLine(staticSkeletonKeypoints[2], staticSkeletonKeypoints[4]);
        drawLine(staticSkeletonKeypoints[3], staticSkeletonKeypoints[5]);
        drawLine(staticSkeletonKeypoints[4], staticSkeletonKeypoints[6]);
        drawLine(staticSkeletonKeypoints[5], staticSkeletonKeypoints[7]);
        drawLine(staticSkeletonKeypoints[1], staticSkeletonKeypoints[8]);
        drawLine(staticSkeletonKeypoints[8], staticSkeletonKeypoints[9]);
        drawLine(staticSkeletonKeypoints[8], staticSkeletonKeypoints[10]);
        drawLine(staticSkeletonKeypoints[9], staticSkeletonKeypoints[11]);
        drawLine(staticSkeletonKeypoints[10], staticSkeletonKeypoints[12]);
        drawLine(staticSkeletonKeypoints[11], staticSkeletonKeypoints[13]);
        drawLine(staticSkeletonKeypoints[12], staticSkeletonKeypoints[14]);
    };

    const drawDynamicSkeleton = (poses, ctx) => {
        poses.forEach((pose) => {
            const keypoints = pose.keypoints;
            // ctx.strokeStyle = 'red';
            // const allDetected = keypoints.every(keypoint => keypoint.score > 0.5);
            // ctx.strokeStyle = allDetected ? 'green' : 'red';

            // keypoints.forEach((keypoint) => {
            //     if (keypoint.score > 0.5) {
            //         const { y, x } = keypoint;
            //         ctx.beginPath();
            //         ctx.arc(x, y, 5, 0, 2 * Math.PI);
            //         ctx.fillStyle = allDetected ? 'green' : 'red';
            //         ctx.fillStyle = 'red';
            //         ctx.fill();
            //     }
            const leftShoulder = keypoints.find(keypoint => keypoint.name === 'left_shoulder');
            const rightShoulder = keypoints.find(keypoint => keypoint.name === 'right_shoulder');

            const shouldersDetected = leftShoulder && rightShoulder && leftShoulder.score > 0.5 && rightShoulder.score > 0.5;
            ctx.strokeStyle = shouldersDetected ? 'green' : 'red';

            keypoints.forEach((keypoint) => {
                if (keypoint.score > 0.5) {
                    const { y, x } = keypoint;
                    ctx.beginPath();
                    ctx.arc(x, y, 5, 0, 2 * Math.PI);
                    ctx.fillStyle = shouldersDetected ? 'green' : 'red';
                    ctx.fill();
                }
            });

            const adjacentKeyPoints = posedetection.util.getAdjacentPairs(posedetection.SupportedModels.MoveNet);
            adjacentKeyPoints.forEach(([i, j]) => {
                ctx.beginPath();
                ctx.moveTo(keypoints[i].x, keypoints[i].y);
                ctx.lineTo(keypoints[j].x, keypoints[j].y);
                ctx.strokeStyle = shouldersDetected ? 'green' : 'red';
                ctx.stroke();
            });
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
        let overlayImg = new Image();
        overlayImg.src = imageUrl;
        overlayImg.onload = function () {
            ctx.drawImage(overlayImg, 0, 0, width, height);
            setHasPhoto(true);
        };
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

        if (leftShoulder && rightShoulder && leftShoulder.score > 0.5 && rightShoulder.score > 0.5) {
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
                    {distanceShoulders && <div style={styles.distance}>Estimated Shoulder Distance: {distanceShoulders.toFixed(2)} meters</div>}
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
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        pointerEvents: 'none', // Ensure clicks go through to the video
        opacity: 0.5, // Adjust the opacity value to make the overlay more transparent
    },
};
export default WebCam;
