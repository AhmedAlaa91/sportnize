import React, { useRef, useEffect, useState } from 'react';
import * as posedetection from '@tensorflow-models/pose-detection';






const drawDynamicSkeleton = (poses, ctx  ) => {
    let detected=false;
    poses.forEach((pose) => {
        const keypoints = pose.keypoints;
        //ctx.strokeStyle = 'red';
        const nose = keypoints.find(keypoint => keypoint.name === 'right_wrist');
        const leftAnkle = keypoints.find(keypoint => keypoint.name === 'left_ankle');
        const rightAnkle = keypoints.find(keypoint => keypoint.name === 'right_ankle');

       // const noseAndAnkleDetected = (nose && nose.score > 0.5) && ((leftAnkle && leftAnkle.score > 0.5) || (rightAnkle && rightAnkle.score > 0.5));
        const noseAndAnkleDetected = (nose && nose.score > 0.5);
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

            detected = true;
            console.log(noseAndAnkleDetected);
           
        }
    });

    

    return detected
};

export default drawDynamicSkeleton ;