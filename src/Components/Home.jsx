import React from "react";
import BannerBackground from "../Assets/home-banner-background.png";
import CircleCam from "../Assets/video-camera-circle-svgrepo-com.svg";
import Navbar from "./Navbar";
import { FiArrowRight } from "react-icons/fi";
import { Link, BrowserRouter as Router } from 'react-router-dom';
import Pages from "./Pages";
const Home = () => {
  return (
    <div className="home-container">
      <div className="home-banner-container">
        <div className="home-bannerImage-container">
          <img src={BannerBackground} alt="" />
        </div>
        <div className="home-text-section">
          <h1 className="primary-heading">
            Your Favourite Food Delivered Hot & Fresh
          </h1>
          <p className="primary-text">
            Healthy switcher chefs do all the prep work, like peeding, chopping
            & marinating, so you can cook a fresh food.
          </p>
          
             <Link to="/loginsignup/SignUp" style={{ textDecoration: 'none' }}> <button className="secondary-button"> Sign Up <FiArrowRight /> </button></Link> 
   
        </div>
        <div className="home-image-section">
          <img src={CircleCam} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Home;