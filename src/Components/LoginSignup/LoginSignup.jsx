import React, { useState, useRef, useEffect } from 'react'
import './LoginSignup.css'
import person from '../../Assets/person.png'
import password from '../../Assets/password.png'
import email from '../../Assets/email.png'
import { useParams, useNavigate } from 'react-router-dom';
import {registeraNewUser} from '../../redux/actions/registerActions'
import { connect } from 'react-redux';
const LoginSignup = ({data , loading, error, registeraNewUser} ) => {
    const navigate = useNavigate();
    useEffect(() => {
      // Optional: Perform actions based on the error state here (e.g., display error messages)
    }, [error]); // Re-run effect whenever error state changes
  
    const { actionType } = useParams();

    const userNameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);



      const handleSubmit = async () => {
        const firstName = 'first_name';
        const lastName = 'last_name';
        const heightUnit = 'height_unit';
        const weightUnit = 'weight_unit';
    
        
        const registerDataToSubmit = {
            username: userNameRef.current.value,
            password: passwordRef.current.value,
            password2: confirmPasswordRef.current.value,


          };
    
          registeraNewUser(JSON.parse(JSON.stringify(registerDataToSubmit)));
       

       
      }
      console.log('checkError');
      console.log(error);
      if ( ! error ){
        console.log('No error');

        navigate("/profile");
      };
  const [action,setAction]= useState(actionType);
  return (
    <div className='container'>
        <div className='header'>
            <div className='text'>{action}</div>
            <div className='underline'></div>
        </div>
        <div className='inputs'>
            {action==="Login"?<div></div>:            <div className='input'>
                <img src ={person} alt=""/>
                <input type="text" placeholder='User Name' ref={userNameRef} />
            </div>}

            <div className='input'>
                <img src ={email} alt=""/>
                <input type="email" placeholder='Email' ref={emailRef}/>
            </div>
            <div className='input'>
                <img src ={password} alt=""/>
                <input type="password" placeholder='Password' ref={passwordRef}/>
            </div>
            <div className='input'>
                <img src ={password} alt=""/>
                <input type="password" placeholder='Confirm Password' ref={confirmPasswordRef}/>
            </div>
        </div>
        {action==="SignUp"?<div></div>: 
        <div className="forgot-password">Lost Password? <span>Click Here!</span></div>}
        <div className='submit-container'>
            <div className={action==="Login"?"submit gray":"submit"} onClick={()=>{handleSubmit()}} >Sign Up</div>
            <div className={action==="SignUp"?"submit gray":"submit"} onClick={()=>{ setAction("Login")}}>Login</div>
        </div>
        </div>
  )
}



const mapStateToProps = (state) => {
    return {
      data: state.data.data,
      loading: state.data.loading,
      error: state.data.error,
    };
  };
  
const mapDispatchToProps = {
    registeraNewUser,
  };
  
export default connect(mapStateToProps, mapDispatchToProps)(LoginSignup);
