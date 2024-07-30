import React, { useRef, useEffect, useState } from 'react';
import * as posedetection from '@tensorflow-models/pose-detection';



const drawDynamicSkeletonRight = (poses, ctx) => {
    let detected=false;
    poses.forEach((pose) => {
        const keypoints = pose.keypoints;
        //ctx.strokeStyle = 'red';
        const rightEar = keypoints.find(keypoint => keypoint.name === 'right_ear');
        const rightHip = keypoints.find(keypoint => keypoint.name === 'right_hip');
        const rightKnee = keypoints.find(keypoint => keypoint.name === 'right_knee');
        const rightAnkle = keypoints.find(keypoint => keypoint.name === 'right_ankle');


        const leftEar = keypoints.find(keypoint => keypoint.name === 'left_ear');
        const leftHip = keypoints.find(keypoint => keypoint.name === 'left_hip');
        const leftKnee = keypoints.find(keypoint => keypoint.name === 'left_knee');
        const leftAnkle = keypoints.find(keypoint => keypoint.name === 'left_ankle');

        const leftSideDetected = (leftEar && leftEar.score > 0.7) ||
        (leftHip && leftHip.score > 0.7) ||
        (leftKnee && leftKnee.score > 0.7) ||
        (leftAnkle && leftAnkle.score > 0.7);

        // const rightSideDetection = 
        //                            (rightEar && rightEar.score > 0.7) &&
        //                            (rightHip && rightHip.score > 0.7) &&
        //                            (rightKnee && rightKnee.score > 0.7) &&
        //                            (rightAnkle && rightAnkle.score > 0.7);
        const nose = keypoints.find(keypoint => keypoint.name === 'left_wrist');

        const rightSideDetection = (nose && nose.score > 0.5);


        let colorStyle = rightSideDetection ? 'green' : 'red';
        ctx.strokeStyle =colorStyle

        keypoints.forEach((keypoint) => {
            if (keypoint.score > 0.7) {
                const { y, x } = keypoint;
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, 2 * Math.PI);
                ctx.fillStyle = colorStyle
                ctx.fill();
            }
        });

        const adjacentKeyPoints = posedetection.util.getAdjacentPairs(posedetection.SupportedModels.MoveNet);
        adjacentKeyPoints.forEach(([i, j]) => {
            ctx.beginPath();
            ctx.moveTo(keypoints[i].x, keypoints[i].y);
            ctx.lineTo(keypoints[j].x, keypoints[j].y);
            ctx.strokeStyle = colorStyle
            ctx.stroke();
        });

        if (rightSideDetection && !leftSideDetected) {


            detected = true;
           
        }
    });

    return detected
};

export default drawDynamicSkeletonRight ;