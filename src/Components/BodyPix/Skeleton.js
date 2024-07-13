// src/SkeletonTracker.js
import React, { useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as posedetection from '@tensorflow-models/pose-detection';
import Camera from './Camera';

const SkeletonTracker = () => {
  const detectorRef = useRef(null);

  useEffect(() => {
    async function loadMoveNetModel() {
      const model = posedetection.SupportedModels.MoveNet;
      detectorRef.current = await posedetection.createDetector(model);
    }
    loadMoveNetModel();
  }, []);

  const handleFrame = async (canvas) => {
    if (detectorRef.current) {
      const poses = await detectorRef.current.estimatePoses(canvas, {
        flipHorizontal: false,
      });
      drawSkeleton(poses, canvas.getContext('2d'));
    }
  };

  const drawSkeleton = (poses, ctx) => {
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

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(ctx.canvas, 0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw static skeleton
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;

    const drawStaticSkeleton = (keypoints) => {
      for (let i = 0; i < keypoints.length - 1; i++) {
        ctx.beginPath();
        ctx.moveTo(keypoints[i].x, keypoints[i].y);
        ctx.lineTo(keypoints[i + 1].x, keypoints[i + 1].y);
        ctx.stroke();
      }
    };

    drawStaticSkeleton(staticSkeletonKeypoints);

    // Draw dynamic skeleton
    poses.forEach((pose) => {
      const keypoints = pose.keypoints;
      ctx.strokeStyle = 'red';

      keypoints.forEach((keypoint) => {
        if (keypoint.score > 0.5) {
          const { y, x } = keypoint;
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = 'red';
          ctx.fill();
        }
      });

      const adjacentKeyPoints = posedetection.util.getAdjacentPairs(posedetection.SupportedModels.MoveNet);
      adjacentKeyPoints.forEach(([i, j]) => {
        ctx.beginPath();
        ctx.moveTo(keypoints[i].x, keypoints[i].y);
        ctx.lineTo(keypoints[j].x, keypoints[j].y);
        ctx.strokeStyle = 'red';
        ctx.stroke();
      });
    });
  };

  return <Camera onFrame={handleFrame} />;
};

export default SkeletonTracker;
