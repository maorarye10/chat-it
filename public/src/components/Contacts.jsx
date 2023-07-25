import React, { useState } from 'react'
import styled from 'styled-components'
import Logo from '../assets/logo.svg'
import { Logout } from './Logout';
import '../utils/CSSUtil.css'

const Container = styled.div`
  height: 100%;
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #080420;
  border-radius: 2rem 0 0 2rem;
  font-size: var(--size-xs);

  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    img {
      height: 2rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
      font-size: 1.2rem
    }
  }

  .contacts-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.4rem;

    .contact {
      background-color: #ffffff39;
      min-height: 5rem;
      width: 90%;
      cursor: pointer;
      border-radius: 0.2rem;
      padding: 0.4rem;
      gap: 0.5rem;
      display: flex;
      align-items: center;
      transition: 0.2s;

      .avatar {
        height: 2.5rem;
      }
    }
    
    .selected {
      border: 0.1rem solid #ffffff;
      background-color: #997af0;
    }

    &::-webkit-scrollbar {
      width: 0.2rem;

      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #0d0d30;
    padding: 0 1rem;

    .user {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
  
      .avatar {
        height: 3rem;
        max-inline-size: 100%;
      }
    }
  }


  .username {
    color: white;
  }

  
`;

export const Contacts = ({ contacts, user, handleContactSelection }) => {
  const [selectedContact, setSelectedContact] = useState(undefined);

  const changeSelectedContact = (index, contact) => {
    setSelectedContact(index);
    handleContactSelection(contact);
  }

  return (
    <Container>
      <div className="brand">
        <img src={Logo} alt="App Logo" />
        <h3>CHAT-IT</h3>
      </div>
      <div className="contacts-list">
        {contacts.map((contact, index) => {
          return (
            <div className={`contact${index === selectedContact ? ' selected' : ''}`} key={index} onClick={() => changeSelectedContact(index, contact)}>
              <img className='avatar' src={`data:image/svg+xml;base64,${contact.avatarImage}`} alt="Contact Image" />
              <h3 className='username'>{contact.username}</h3>
            </div>
          )
        })}
      </div>
      <div className="footer">
        <div className="user">
          <img className='avatar' src={`data:image/svg+xml;base64,${user.avatarImage}`} alt="Contact Image" />
          <h2 className='username'>{user.username}</h2>
        </div>
        <Logout />
      </div>
      
    </Container>
  )
}
