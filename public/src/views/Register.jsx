import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../assets/logo.svg'
import { ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import { ValidEmail, ValidPassword } from '../utils/RegexValidations'
import axios from 'axios'
import { registerRoute } from '../utils/APIRoutes'
import '../utils/CSSUtil.css'

const FromContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  background-color: #131324;
  font-size: var(--size-xxs);
  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    img {
      height: 3.5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
    animation-name: loadPage;
    animation-duration: 1s;
    input {
      background-color: transparent;
      padding: 1rem;
      border: 0.1rem solid #4e0eff;
      border-radius: 0.4rem;
      color: white;
      font-size: 1rem;
      width: 100%;
      transition: 300ms;
      &:focus {
        border: 0.1rem solid #997af0;
        outline: none;
      }
      &:hover {
        border: 0.1rem solid #997af0;
      }
    }
    button {
      background-color: #997af0;
      color: white;
      padding: 1rem 2rem;
      border: none;
      font-weight: bold;
      cursor: pointer;
      border-radius: 0.4rem;
      font-size: 1rem;
      text-transform: uppercase;
      transition: 300ms;
      &:hover {
        background-color: #4e0eff;
      }
    }
    span {
      color: white;
      text-transform: uppercase;
      a {
        color: #4e0eff;
        font-weight: bold;
        text-decoration: none;
        transition: 200ms;
        &:hover {
          color: #997af0;
        }
      }
    }
  }
  @keyframes loadPage {
    0%   {opacity: 0;}
    100% {opacity: 1;}
  }
  @keyframes deloadPage {
    0%   {opacity: 1;}
    100% {opacity: 0;}
  }

 /* xs */
 /* @media (min-width: 475px) {} */ 

 /* sm */
 /* @media (min-width: 640px) {} */ 

  /* md */
  @media (min-width: 768px) {
    font-size: var(--size-base);
    .brand {
      img {
        height: 5rem;
      }
    }
  }  

 /* lg */
 /* @media (min-width: 1024px) {} */ 

 /* xl */
 /* @media (min-width: 1280px) {} */ 

 /*2xl */
 /* @media (min-width: 1536px) {} */
`;
  
export const Register = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  }) ;

  useEffect(() => {
    if (localStorage.getItem('chat-app-user')){
      navigate('/set-avatar');
    }
  }, []);
  
  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (handleSubmitValidation()){
      axios.post(registerRoute, {...values}).then((response) => {
        localStorage.setItem('chat-app-user', JSON.stringify(response.data.user));
        navigate('/set-avatar');
      }).catch((err) => {
        if (err.response.status === 500){
          toast.error("An error occured. Please try again Later.", toastOptions);
        }else{
          toast.error(err.response.data.message, toastOptions);
        }
      });
    }
  }

  const handleSubmitValidation = () => {
    const {password, confirmPassword, username, email} = values;
    if (username.length < 3){
      toast.error("Username length must be at least 3 characters", toastOptions);
      return false;
    }else if (!ValidEmail.test(email)){
      toast.error("Invalid email address", toastOptions);
      return false;
    }else if (!ValidPassword.test(password)){
      toast.error("Password Requirments:\n- At least 6 characters\n- 1 Upper case letter\n- 1 Lower case letter\n- 1 Number", toastOptions);
      return false;
    }else if (password !== confirmPassword){ 
      toast.error("The passwords are not matching", toastOptions);
      return false;
    }
    return true;
  }

  const handleChange = (event) => {
    handleValidation(event);
    setValues({...values, [event.target.name]: event.target.value } )
  }

  const handleValidation = (event) => {
    const inputName = event.target.name;
    const value = event.target.value;
    
    if (inputName === "username" && value.length < 3){
      event.target.style.borderColor = "red";
    }else if (inputName === "email" && !ValidEmail.test(value)){
      event.target.style.borderColor = "red";
    }else if (inputName === "password" && !ValidPassword.test(value)){
      event.target.style.borderColor = "red";
    }else if (inputName === "confirmPassword" && value === ""){
      event.target.style.borderColor = "red";
    }else{
      event.target.style.borderColor = "#997af0";
    }
  }

  return (
    <>
      <FromContainer className='container'>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="Logo" />
            <h1>Chat-it</h1>
          </div>
          <input type="text" placeholder='Username' name='username' maxLength={20} onChange={e => handleChange(e)} onBlur={e => handleValidation(e)}/>
          <input type="email" placeholder='Email'  name='email' onChange={e => handleChange(e)} onBlur={e => handleValidation(e)}/>
          <input type="password" placeholder='Password' name='password' onChange={e => handleChange(e)} onBlur={e => handleValidation(e)}/>
          <input type="password" placeholder='Confirm Password' name='confirmPassword' onChange={e => handleChange(e)} onBlur={e => handleValidation(e)}/>
          <button type='submit' formNoValidate="formnovalidate">Register</button>
          <span>Already have an account ? <Link to='/login'>Login</Link></span>
        </form>
      </FromContainer>
      <ToastContainer />
    </>
  )
}
