import React from 'react'
import styled from 'styled-components'
import Robot from '../assets/robot.gif'

const Container = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: var(--size-sm);

    img {
        height: 17rem;
    }

    span {
        color: #4e0eff
    }  

    /* lg */
    @media (min-width: 1024px) {
        font-size: var(--size-base);
        img {
            height: 20rem;
        }
    }
`;

export const Welcome = ({ user }) => {
    return (
        <Container>
            <img src={Robot} alt="Robot Image" />
            <h1>Welcome, <span>{user.username}</span> !</h1>
            <h3>Select a chat to start messaging.</h3>
        </Container>
    )
}
