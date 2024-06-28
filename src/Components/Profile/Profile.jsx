import React, { useState } from 'react'
import './Profile.css'
import Select from "react-select";
import { useParams } from 'react-router-dom';
const Profile = () => {

  const { actionType } = useParams();

  const [action,setAction]= useState('Submit');

  const [data, setData] = useState();
  const [dataH, setDataH] = useState();
  const [dataW, setDataW] = useState();
  const options = [
    { value: "Tennis", label: "Tennis" },
    { value: "BasketBall", label: "BasketBall" },
    { value: "Swimming", label: "Swimming" },
    { value: "Crossfit", label: "Crossfit" }
  ];

  const optionsH = [
    { value: "cm", label: "cm" },
    { value: "in", label: "in" },
  ];
  const optionsW = [
    { value: "kg", label: "kg" },
    { value: "lb", label: "lb" },
  ];

  return (
   
    <div className='container'>
    <div className='header'>
        <div className='text'>Profile</div>
        <div className='underline'></div>
    </div>
    <div className='inputs'>
        <div className='input'>
            <input required type="text" placeholder='First Name'/>
        </div>
        <div className='input'>
            <input required type="text" placeholder='Last Name'/>
        </div>
        <div className='input'>
                <input required type="email" placeholder='Email'/>
        </div>

        <div className='input'>
            <input required type="number" placeholder='Height'/>
            <Select
          options={optionsH}
          onChange={(e) => setDataH(e.value)}
          value={optionsH.filter(function (option) {
            return option.value === dataH;
          })}
          label="Single select"
          placeholder={"cm/in"}
          menuPlacement="top"
          required
        />
        </div>
        <div className='input'>
            <input type="number" placeholder='Weight'/>
            <Select
          options={optionsW}
          onChange={(e) => setDataW(e.value)}
          value={optionsW.filter(function (option) {
            return option.value === dataW;
          })}
          label="Single select"
          placeholder={"kg/lb"}
          menuPlacement="top"
          required
        />
        </div>
        <div className='input'>
            <input required type="number" placeholder='Age' />
        </div>
        
        <div className='input'>
          
           <Select
          options={options}
          onChange={(e) => setData(e.value)}
          value={options.filter(function (option) {
            return option.value === data;
          })}
          label="Single select"
          placeholder={"Sport"}
          menuPlacement="top"
          required
        />
        </div>
        <div className='input'>
           <input required type="text" placeholder='Club/School' />
        </div>
        </div>
        <div className='submit-container'>
        {action==="Submit"?<div className="submit"onClick={()=>{ setAction("Update")}}>Submit</div>: 
       <div className="submit" onClick={()=>{ setAction("Submit")}}>Update</div>}
        </div>
    </div>
    
  )
}

export default Profile