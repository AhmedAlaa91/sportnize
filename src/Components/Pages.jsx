/* eslint-disable react/no-children-prop */
import React from 'react';
import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import About from './About';
import Profile from './Profile/Profile';
import Home from './Home';
import LoginSignup from './LoginSignup/LoginSignup'
import WebCam from './Camera/WebCam2'
//lazy loading for loading page component
// reference:https://react.dev/reference/react/lazy

//const About = lazy(() => import('./About'));
//const Profile = lazy(() => import('./Profile'));
//const Logout = lazy(() => import('./HOC/Logout'));

const Pages = () => {
  // JSX component for routing path in ocap react app.
  //animation inside suspense
  //check https://blog.logrocket.com/lazy-loading-components-in-react-16-6-6cea535c0b52/
  return (
  
   
          <Routes>

            <Route path="/" element={<Home/>} />
            <Route path="/about" element={<About/>} />
            <Route path="/profile/:userId" element={<Profile/>} />
            <Route path="/loginsignup/:actionType" element={<LoginSignup/>} />
            <Route path="/cam" element={<WebCam/>} />
          </Routes>


  );
};

export default Pages;
