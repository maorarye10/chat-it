import React from 'react'
import styled from 'styled-components'
import Robot from '../assets/robot.gif'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;

    img {
        height: 20rem;
    }

    span {
        color: #4e0eff
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
