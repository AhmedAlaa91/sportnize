// src/Camera.js
import React, { useRef, useEffect } from 'react';

const Camera = ({ onFrame }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    async function setupCamera() {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
    setupCamera();
  }, []);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    const renderFrame = () => {
      if (videoRef.current && canvasRef.current) {
        ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        onFrame(canvasRef.current);
      }
      requestAnimationFrame(renderFrame);
    };
    renderFrame();
  }, [onFrame]);

  return (
    <div>
      <video ref={videoRef} style={{ display: 'none' }} />
      <canvas ref={canvasRef} width="640" height="480" />
    </div>
  );
};

export default Camera;
