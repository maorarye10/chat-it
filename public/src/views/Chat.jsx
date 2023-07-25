import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { getUserContactsRoute, host } from '../utils/APIRoutes'
import { ToastContainer, toast } from 'react-toastify'
import { Contacts } from '../components/Contacts'
import { Welcome } from '../components/Welcome'
import { ChatContainer } from '../components/ChatContainer'
import {io} from 'socket.io-client'

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #131324;
  gap: 1rem;

  .content {
    height: 85%;
    width: 85%;
    background-color: #00000076;
    display: grid;
    border-radius: 2rem;
    overflow: hidden;

    .chat-area-container {
      max-height: 85vh;
      display: none;
    }

    .contacts-container {
      display: none;
    }

    .visible-mobile {
      display: block;
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
  @media (min-width: 768px) {font-size: var(--size-base);
    .content {
      grid-template-columns: 1.5fr 2.5fr;
      .chat-area-container {
        display: block;
      }
      .contacts-container{
        display: block;
      }
    }}  

  /* lg */
  @media (min-width: 1024px) {
    font-size: var(--size-base);
    .content {
      grid-template-columns: 1fr 3fr;
      .chat-area-container {
        display: block;
      }
      .contacts-container{
        display: block;
      }
    }
  } 

  /* xl */
  /* @media (min-width: 1280px) {} */ 

  /*2xl */
  /* @media (min-width: 1536px) {} */
`;

export const Chat = () => {
  const socket = useRef();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([{}]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
  }

  useEffect(() => {
    const user = localStorage.getItem('chat-app-user')
    if (!user){
      navigate('/login');
    }
    else{
      const parsedUser = JSON.parse(user);
      if (!parsedUser.isAvatarImageSet){
        navigate('/set-avatar');
      }else{
        setUser(parsedUser);
        //console.log("User:", parsedUser);
      }
    }
    
  }, []);

  useEffect(() => {
    if (user){
      axios.get(`${getUserContactsRoute}/${user._id}`).then((response) => {
        //console.log("Contact:", response.data.contacts);
        setContacts(response.data.contacts);
        setIsLoaded(true);
      }).catch((err) => {
        if (err.response.status === 500){
          toast.error("An error occured. Please try again Later.", toastOptions);
        }else{
          toast.error(err.response.data.message, toastOptions);
        }
      });

      socket.current = io(host);
      socket.current.emit("add-user", user._id);
    }
  }, [user]);

  const handleContactSelected = (contact) => {
    setSelectedContact(contact);
  }

  return (
    <>
      {
        isLoaded &&
        <>
          <Container>
            <div className="content">
              <div className={selectedContact && 'contacts-container'}>
                <Contacts contacts={contacts} user={user} handleContactSelection={handleContactSelected}/>
              </div>
              <div className={`chat-area-container ${selectedContact && 'visible-mobile'}`}>
                {
                  selectedContact ? <ChatContainer contact={selectedContact} user={user} socket={socket} /> : <Welcome user={user} />
                }
              </div>
            </div>
          </Container>
          <ToastContainer />
        </>
      }
    </>
  )
}
