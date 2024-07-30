import React, { useState, useRef, useEffect } from 'react';
import './Profile.css'
import Select from "react-select";
import { useParams, useNavigate } from 'react-router-dom';
import {updateaProfile} from '../../redux/actions/updateProfileActions';
import { connect, useSelector } from 'react-redux';
import ClipLoader from 'react-spinners/ClipLoader';
import { useDispatch } from "react-redux";
import {fetcharofile} from '../../redux/actions/fetchProfileActions';
const Profile = ({profile, loading, error, updateaProfile,}) => {

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const profileValues = profile;
  //fetcharofile
  console.log(profile);
  const { userId } = useParams();

  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(fetcharofile(userId));
  // },);


 

 

  const[firstNameValue , setFirstNameValue] = useState(profileValues[0]?profileValues[0]['first_name']:profileValues['first_name']);
  const[lastNameValue , setLastNameValue] = useState(profileValues[0]?profileValues[0]['last_name']:profileValues['last_name']);
  const[emailValue , setEmailValue] = useState(profileValues[0]?profileValues[0]['email']:profileValues['email']);
  const[heightValue , setHeightValue] = useState(profileValues[0]?profileValues[0]['height']:profileValues['height']);
  const[heightUnitValue , setHeightUnitValue] = useState(profileValues[0]?profileValues[0]['height_unit']:profileValues['height_unit']);
  const[weightValue , setWeightValue] = useState(profileValues[0]?profileValues[0]['weight']:profileValues['weight']);
  const[weightUnitValue , setWeightUnitValue] = useState(profileValues[0]?profileValues[0]['weight_unit']:profileValues['weight_unit']);
  const[ageValue , setageValue] = useState(profileValues[0]?profileValues[0]['age']:profileValues['age']);
  const[sportsValue , setSportValue] = useState(profileValues[0]?profileValues[0]['sport']:profileValues['sport']);
  const[schoolValue , setSchoolValue] = useState(profileValues[0]?profileValues[0]['school']:profileValues['school']);
  
  

  const [dataWSelected, setDataWSelected] = useState('');
  const [dataHelected, setDataHSelected] = useState('');
  const [dataSportelected, setDataSportSelected] = useState('');

  const handleChangeWeight = (e) => {
    setDataW(e.value)
    setDataWSelected(e.value);
  };

  const handleChangeHeight = (e) => {
    setDataH(e.value)
    setDataHSelected(e.value);
  };

  const handleChangeSport = (e) => {
    setData(e.value)
    setDataSportSelected(e.value);
  };



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

  const emailRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const heightRef = useRef(null);
  const weightRef = useRef(null);
  const ageRef = useRef(null);
  const schoolRef = useRef(null);
  const heightUnitRef = useRef(null);
  const weightUnitRef = useRef(null);
  const sportsRef = useRef(null);

  
  
  const handleSubmit = async () => {
    //setIsSubmitting(true); // Set submission state to "true"
    setIsSubmitting(true);
 
    try {
      const firstName = 'first_name';
      const lastName = 'last_name';
      const heightUnit = 'height_unit';
      const weightUnit = 'weight_unit';
  
      
      const profileDataToSubmit = {
          email: emailRef.current.value,
          [firstName]: firstNameRef.current.value,
          [lastName]:lastNameRef.current.value,
          height:heightRef.current.value,
          weight:weightRef.current.value,
          age:ageRef.current.value,
          sport:dataSportelected ? dataSportelected : sportsRef.current.value,
          school:schoolRef.current.value,
          [heightUnit]:dataHelected ? dataHelected : heightUnitRef.current.value,
          [weightUnit]:dataWSelected ? dataWSelected : weightUnitRef.current.value,

        };
        console.log(dataWSelected,dataHelected, dataSportelected )
        console.log('userid',userId);
  
    await updateaProfile(userId,JSON.parse(JSON.stringify(profileDataToSubmit)));
      // Handle successful registration (e.g., navigate to profile)
      navigate('/');
    } catch (error) {
      console.error('Registration failed:', error);
    } 
    finally {
      setIsSubmitting(false); // Set submission state to "false"
    }
  };

  return (
   
    <div className='container'>
    <div className='header'>
        <div className='text'>Profile</div>
        <div className='underline'></div>
    </div>
    <div className='inputs'>
        <div className='input'>
            <input required type="text" ref={firstNameRef} defaultValue={firstNameValue} placeholder='First Name'/>
        </div>
        <div className='input'>
            <input required type="text" ref={lastNameRef} defaultValue={lastNameValue} placeholder='Last Name'/>
        </div>
        <div className='input'>
                <input required ref={emailRef} type="email" defaultValue={emailValue} placeholder='Email'/>
        </div>

        <div className='input'>
            <input required type="number"  ref={heightRef} defaultValue={heightValue} placeholder='Height'/>
            <Select
          options={optionsH}
          onChange={handleChangeHeight}
          // value={optionsH.filter(function (option) {
          //   return option.value === dataH;
          // })}
          label="Single select"
          placeholder={"cm/in"}
          menuPlacement="top"
          required
          defaultValue={optionsH.find(option => option.value === heightUnitValue)}
          ref={heightUnitRef}
          
        />
        </div>
        <div className='input'>
            <input type="number" ref={weightRef} defaultValue={weightValue} placeholder='Weight'/>
            <Select
          options={optionsW}
          onChange={handleChangeWeight}
          // value={optionsW.filter(function (option) {
          //   return option.value === dataW;
          // })}
          defaultValue={optionsW.find(option => option.value === weightUnitValue)}
          label="Single select"
          placeholder={"kg/lb"}
          menuPlacement="top"
          ref={weightUnitRef}
          required
        />
        </div>
        <div className='input'>
            <input required type="number" ref={ageRef} defaultValue={ageValue} placeholder='Age' />
        </div>
        
        <div className='input'>
          
           <Select
          options={options}
          onChange={handleChangeSport}
          // value={options.filter(function (option) {
          //   return option.value === data;
          // })}
          defaultValue={options.find(option => option.value === sportsValue)}
          label="Single select"
          placeholder={"Sport"}
          menuPlacement="top"
          ref={sportsRef}
          required
        />
        </div>
        <div className='input'>
           <input required type="text" ref={schoolRef} defaultValue={schoolValue} placeholder='Club/School' />
        </div>
        </div>
        <div className='submit-container'>
        {isSubmitting ? <ClipLoader size={50} /> : 
            <div className={"submit"} onClick={()=>{handleSubmit()}} >Update</div>
        }
        </div>
    </div>
    
  )
}

const mapStateToProps = (state) => {
  return {
    profile: state.profile.profile,
    loading: state.data.loading,
    error: state.data.error,
  };
};

const mapDispatchToProps = {
  updateaProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);

