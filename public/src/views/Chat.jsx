import React, { useEffect, useState, useRef, useContext } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { getUserContactsRoute, host, getRequestsByReciverRoute } from '../utils/APIRoutes'
import { ToastContainer, toast } from 'react-toastify'
import { Contacts } from '../components/Contacts'
import { Welcome } from '../components/Welcome'
import { ChatContainer } from '../components/ChatContainer'
import { io } from 'socket.io-client'
import { ContactProvider } from '../Context/contactContext'
import { addContactScreenToggleContext } from '../Context/addContactScreenToggleContext'
import { AddContact } from '../components/AddContact'
import { ViewRequests } from '../components/ViewRequests'

const Container = styled.div`
  height: 100%;
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

    .show-chat-mobile {
      display: block;
    }

    .contacts-container-fix {
      max-height: 85vh;
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
  @media (min-width: 768px) {
    .content {
      grid-template-columns: 1.5fr 2.5fr;
      .chat-area-container {
        display: block;
      }
      .contacts-container{
        display: block;
      }
    }
  }  

  /* lg */
  @media (min-width: 1024px) {
    .content {
      grid-template-columns: 1.2fr 2.8fr;
    }
  } 

  /* xl */
  @media (min-width: 1280px) {
    .content {
      grid-template-columns: 1fr 3fr;
    }
  } 

  /*2xl */
  /* @media (min-width: 1536px) {} */
`;

export const Chat = () => {
  const socket = useRef();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [contacts, setContacts] = useState([{}]);
  const [incomingFriendRequests, setIncomingFriendRequests] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRequestsScreenVisible, setIsRequestsScreenVisible] = useState(false);
  const { visible: addContactScreenVisible, handleVisibilityToggle } = useContext(addContactScreenToggleContext);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
  }

  useEffect(() => {
    const user = localStorage.getItem('chat-app-user')
    if (!user) {
      navigate('/login');
    }
    else {
      const parsedUser = JSON.parse(user);
      if (!parsedUser.isAvatarImageSet) {
        navigate('/set-avatar');
      } else {
        setUser(parsedUser);
        //console.log("User:", parsedUser);
      }
    }

  }, []);

  useEffect(() => {
    if (user) {
      axios.get(`${getUserContactsRoute}/${user._id}`).then((response) => {
        //console.log("Contact:", response.data.contacts);
        setContacts(response.data.contacts);
      }).catch((err) => {
        if (err.response.status === 500) {
          toast.error("An error occured. Please try again Later.", toastOptions);
        } else {
          toast.error(err.response.data.message, toastOptions);
        }
      });

      axios.get(`${getRequestsByReciverRoute}/${user._id}`).then((response) => {
        //console.log(response.data.requests);
        setIncomingFriendRequests(response.data.requests);
      }).catch((err) => {
        if (err.response.status === 500) {
          toast.error("An error occured. Please try again Later.", toastOptions);
        } else {
          toast.error(err.response.data.message, toastOptions);
        }
      })

      socket.current = io(host);
      socket.current.emit("add-user", user._id);

      setIsLoaded(true);
    }
  }, [user]);

  const handleContactChange = (contact) => {
    setSelectedContact(contact);
  }

  const handleCloseAddContactsScreen = () => {
    handleVisibilityToggle();
  }

  const handleRequestsScreenToggle = () => {
    setIsRequestsScreenVisible(!isRequestsScreenVisible);
  }

  const handleRequestsUpdate = (newReqArr, contactToAdd = null) => {
    setIncomingFriendRequests(newReqArr);
    contactToAdd && setContacts([...contacts, contactToAdd]);
  }

  return (
    <>
      {
        isLoaded &&
        <>
          <ContactProvider>
            <Container className='container'>
              <div className="content">
                <div className={`contacts-container-fix${selectedContact || addContactScreenVisible ? ' contacts-container' : ''}`}>
                  <Contacts contacts={contacts} user={user} incomingRequestsCount={incomingFriendRequests && incomingFriendRequests.length} handleVisibility={handleContactChange} />
                </div>
                <div className={`chat-area-container ${selectedContact || addContactScreenVisible ? 'show-chat-mobile' : ''}`}>
                  {
                    addContactScreenVisible ?
                      <>
                        {
                          !isRequestsScreenVisible && <AddContact user={user} incomingFriendRequests={incomingFriendRequests} handleCloseScreen={handleCloseAddContactsScreen} handleShowRequestsScreenToggle={handleRequestsScreenToggle} />
                        }
                        {
                          isRequestsScreenVisible && <ViewRequests user={user} requests={incomingFriendRequests} handleCloseScreen={handleCloseAddContactsScreen} handleRequestsScreenToggle={handleRequestsScreenToggle} handleUpdateRequests={handleRequestsUpdate} />
                        }
                      </> :
                      <>
                        {
                          selectedContact ? <ChatContainer user={user} socket={socket} handleCloseChat={() => handleContactChange(null)} /> : <Welcome user={user} />
                        }
                      </>
                  }
                </div>
              </div>
            </Container>
            <ToastContainer />
          </ContactProvider>
        </>
      }
    </>
  )
}
