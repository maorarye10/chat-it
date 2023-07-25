import React from 'react'
import {BiPowerOff} from 'react-icons/bi'
import styled from 'styled-components'
import {useNavigate} from 'react-router-dom'
import '../utils/CSSUtil.css'

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  border: none;
  cursor: pointer;
  svg {
    font-size: 0.8rem;
    color: white;
  }
`;

export const Logout = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    localStorage.clear();
    navigate('/login');
  }

  return (
    <Button onClick={handleClick}>
      <BiPowerOff />
    </Button>
  )
}
