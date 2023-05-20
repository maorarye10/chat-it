import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
    padding-top: 1rem;

    .chat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 2rem;

        .contact-details {
            display: flex;
            align-items: center;
            gap: 1rem;

            img {
                height: 3rem;
            }

            h3 {
                color: white;
            }
        }
    }
`;

export const ChatContainer = ({ contact }) => {
  return (
    <Container>
        <div className="chat-header">
            <div className="contact-details">
                <img src={`data:image/svg+xml;base64,${contact.avatarImage}`} alt="Contact's Avatar" />
                <h3>{contact.username}</h3>
            </div>
        </div>
        <div className="chat-content"></div>
        <div className="chat-input"></div>
    </Container>
  )
}
