import React from 'react'
import styled from 'styled-components'
import {useNavigate} from 'react-router-dom'

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.3rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: white;
  }
`;

export const CustomBtn = ({children, handleClick}) => {
  return (
    <Button onClick={handleClick}>
      {children}
    </Button>
  )
}
