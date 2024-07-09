import React from "react";
import AboutBackground from "../Assets/about-background.png";
import AboutBackgroundImage from "../Assets/about-background-image.png";
import { BsFillPlayCircleFill } from "react-icons/bs";
import VideoCam from "../Assets/video-camera-svgrepo-com.svg";
import SkeletonTracker from './BodyPix/Skeleton';
const About = () => {
  return (
    <div className="App">
    <h1>Human Skeleton Tracker</h1>
    <SkeletonTracker/>
  </div>
  );
};

export default About;