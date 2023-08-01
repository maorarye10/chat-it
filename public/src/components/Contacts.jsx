import React, { useContext, useEffect } from 'react'
import styled from 'styled-components'
import Logo from '../assets/logo.svg'
import { Logout } from './Logout';
import { contactContext } from '../Context/contactContext';

const Container = styled.div`
  height: 100%;
  display: grid;
  grid-template-rows: 15% 70% 15%;
  overflow: hidden;
  background-color: #080420;
  border-radius: 2rem 0 0 2rem;
  font-size: var(--size-xs);
  
  .header {
    display: flex;
    justify-content: space-between;
    /* grid-template-columns: 1fr 2fr 1fr; */
    align-items: center;
    padding: 0 1.25rem;

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

  /* xs */
  /* @media (min-width: 475px) {} */ 

  /* sm */
  @media (min-width: 640px) {
    .header {
      padding: 0 1.7rem;
    }
  } 

  /* md */
  @media (min-width: 768px) {
    .header {
      padding: 0;
      justify-content: space-around;
    }
  }  

  /* lg */
  @media (min-width: 1024px) {
    font-size: var(--size-sm);
  }

  /* xl */
  @media (min-width: 1280px) {
    font-size: var(--size-base);
    .header {
      .brand {
        gap: 1rem;
    
        img {
          height: 2.5rem;
        }
        h3 {
          font-size: 1.5rem;
        }
      }
    }
    

    .contacts-list {
      gap: 0.8rem;
  
      .contact {
        gap: 1rem;
  
        .avatar {
          height: 3rem;
        }
      }
    }

    .footer {
      .user {
        .avatar {
          height: 3.5rem; 
        }
      }
    }
  } 
`;

export const Contacts = ({ contacts, user, handleVisibility }) => {
  const {contact: selectedContact, handleContactChange} = useContext(contactContext);

  useEffect(() => {
    handleVisibility(selectedContact);
  }, [selectedContact])

  return (
    <Container>
      <div className='header'>
        <Logout />
        <div className="brand">
          <img src={Logo} alt="App Logo" />
          <h3>CHAT-IT</h3>
        </div>
        <Logout />
      </div>
      <div className="contacts-list">
        {contacts.map((contact, index) => {
          return (
            <div className={`contact${selectedContact && contact._id === selectedContact._id ? ' selected' : ''}`} key={index} onClick={() => handleContactChange(contact)}>
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
      </div>
      
    </Container>
  )
}
