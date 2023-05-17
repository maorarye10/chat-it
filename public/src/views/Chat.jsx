import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getUserContactsRoute } from '../utils/APIRoutes';
import { toast } from 'react-toastify';
import { Contacts } from '../components/Contacts';

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #131324;
  gap: 1rem;

  .content {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 1fr 3fr;
    padding: 3rem 5rem;
    border-radius: 2rem;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export const Chat = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([{}]);
  const [selectedContact, setSelectedContact] = useState(undefined);
  
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
      }).catch((err) => {
        if (err.response.status === 500){
          toast.error("An error occured. Please try again Later.", toastOptions);
        }else{
          toast.error(err.response.data.message, toastOptions);
        }
      });
    }
  }, [user]);

  const handleContactSelected = (contact) => {
    setSelectedContact(contact);
  }

  return (
    <>
      <Container>
        <div className="content">
          <Contacts contacts={contacts} user={user} handleContactSelection={handleContactSelected}/>
        </div>
      </Container>
    </>
  )
}
