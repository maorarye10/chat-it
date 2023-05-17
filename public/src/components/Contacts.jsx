import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Logo from '../assets/logo.svg'

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #080420;

  .brand {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;

    img {
      height: 2rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }

  .contacts-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;

    .contact {
      background-color: #ffffff39;
      min-height: 5rem;
      width: 90%;
      cursor: pointer;
      border-radius: 0.2rem;
      padding: 0.4rem;
      gap: 1rem;
      display: flex;
      align-items: center;
      transition: 0.2s;

      .avatar {
        height: 3rem;
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

  .user {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    background-color: #0d0d30;

    .avatar {
      height: 4rem;
      max-inline-size: 100%;
    }
  }

  .username {
    color: white;
  }

  @media screen and (min-width: 720px) and (max-width: 1080px) {
    gap: 0.5rem;

    .username {
      font-size: 1rem;
    }
  }
`;

export const Contacts = ({ contacts, user, handleContactSelection }) => {
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [selectedContact, setSelectedContact] = useState(undefined);

  useEffect(() => {
      if(user){
          setUsername(user.username);
          setAvatar(user.avatarImage);
      }
  }, [user]);

  const changeSelectedContact = (index, contact) => {
    setSelectedContact(index);
    handleContactSelection(contact);
  }

  return (
    <>
      {
        username && avatar && (
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
            <div className="user">
              <img className='avatar' src={`data:image/svg+xml;base64,${avatar}`} alt="Contact Image" />
              <h2 className='username'>{username}</h2>
            </div>
          </Container>
        )
      }
    </>
  )
}
