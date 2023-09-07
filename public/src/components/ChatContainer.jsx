import React, { useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { ChatInput } from './ChatInput';
import axios from 'axios';
import { getAllMessagesRoute, sendMessageRoute } from '../utils/APIRoutes';
import { toast } from 'react-toastify';
import {v4 as uuidv4} from 'uuid';
import {IoMdArrowBack} from 'react-icons/io'
import { contactContext } from '../Context/contactContext';

const Container = styled.div`
    height: 100%;
    display: grid;
    grid-template-rows: 14% 72% 14%; // 11.5 73 15.5
    gap: 0rem;
    overflow: hidden;
    font-size: var(--size-xs);

    .chat-header {
        display: grid;
        grid-template-columns: 1fr 2fr 1fr;
        height: 100%;
        padding: 1rem 1.5rem 0.7rem 1.5rem; //2
        background-color: #080420;

        button {
            background-color: #080420;
            border: none;
            margin-right: auto;
            svg {
                font-size: 2rem;
                color: white;
            }
        }

        .contact-container {
            display: flex;
            justify-content: center;
            align-items: center;

            .contact-details {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem; //1
    
                img {
                    height: 2rem; //2.5
                }
    
                h3 {
                    color: white;
                }
            }
        }
    }

    .chat-messages {
        padding: 1rem 2rem;
        display: flex;
        flex-direction: column;
        gap: 0.7rem; //1
        overflow: auto;

        &::-webkit-scrollbar {
            width: 0.2rem;
            &-thumb {
                background-color: #ffffff39;
                width: 0.1rem;
                border-radius: 1rem;
            }
        }

        .message {
            display: flex;
            align-items: center;

            .message-content {
                max-width: 80%;
                overflow-wrap: break-word;
                padding: 1rem;
                font-size: 0.8rem; //1.1
                border-radius: 1rem;
                color: #d1d1d1;
            }
        }

        .sended {
            justify-content: flex-end;

            .message-content {
                background-color: #4f04ff21;
            }
        }

        .received {
            justify-content: flex-start;

            .message-content {
                background-color: #9900ff20;
            }
        }
    }

  /* xs */
  /* @media (min-width: 475px) {} */ 

  /* sm */
  /* @media (min-width: 640px) {} */

  /* md */
  @media (min-width: 768px) {
    grid-template-rows: 15% 70% 15%; // 11.5 73 15.5

    .chat-header {
        display: flex;
        align-items: center;
        justify-content: start;
        padding: 0rem 1.2rem; //2

        button {
            display: none;
        }
        
        .contact-container {
            .contact-details {
                flex-direction: row;
                gap: 0.7rem; //1
    
                img {
                    height: 2.3rem; //2.5
                }
            }
        }
    }
  }  

  /* lg */
  @media (min-width: 1024px) {
    font-size: var(--size-sm);

    .chat-messages {
        gap: 0.85rem; //1

        .message {
            .message-content {
                font-size: var(--size-sm);
            }
        }
    }
  }

  /* xl */
  @media (min-width: 1280px) {
    font-size: var(--size-base);

    .chat-header {
        padding: 0rem 1rem; //2
        
        .contact-details {
            gap: 1rem; //1

            img {
                height: 3rem; 
            }
        }
    }

    .chat-messages {
        gap: 1rem; //1

        .message {
            .message-content {
                font-size: 1.1rem;
            }
        }
    }
  }
`;

export const ChatContainer = ({ user, socket, handleCloseChat }) => {
    const {contact, handleContactChange} = useContext(contactContext);
    const [messages, setMessages] = useState([]);
    const [arrivedMessage, setArrivedMessage] = useState(null);
    const scrollRef = useRef();

    const toastOptions = {
        position: "bottom-right",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
    }

    useEffect(() => {
        if (socket.current){
            socket.current.on("message-recieved", (msg) => {
                setArrivedMessage({fromSelf: false, message: msg})
            });
        }
    }, []);

    useEffect(() => {
        arrivedMessage && setMessages([...messages, arrivedMessage]);
    }, [arrivedMessage]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behaviour: "smooth"});
    }, [messages])

    useEffect(() => {
        if(contact){
            axios.post(getAllMessagesRoute, {
                user: user._id,
                contact: contact._id
            }).then(response => {
                setMessages(response.data);
            });
        }
    }, [contact]);

    const handleSendMsg = async (msg) => {
        axios.post(sendMessageRoute, {
        sender: user._id, 
        reciver: contact._id,
        messageText: msg
        }).catch(error => {
            toast.error(error.response.data.message, toastOptions);
        })
        socket.current.emit("send-message", contact._id, msg);
        const updatedMessages = [...messages];
        updatedMessages.push({fromSelf: true, message: msg});
        setMessages(updatedMessages);
    }

    const handleCloseChatClick = () => {
        handleCloseChat();
        handleContactChange(null);
    }

    return (
        <Container>
            <div className="chat-header">
                <button onClick={handleCloseChatClick}>
                    <IoMdArrowBack />
                </button>
                <div className='contact-container'>
                    <div className="contact-details">
                        <img src={`data:image/svg+xml;base64,${contact.avatarImage}`} alt="Contact's Avatar" />
                        <h3>{contact.username}</h3>
                    </div>
                </div>
            </div>
            <div className="chat-messages">
                {
                    messages.map((msg) => (
                        <div ref={scrollRef} key={uuidv4()}>
                            <div className={`message ${msg.fromSelf ? "sended" : "received"}`}>
                                <p className='message-content'>
                                    {msg.message}
                                </p>
                            </div>
                        </div>
                    ))
                }
            </div>
            <ChatInput handleSendMsg={handleSendMsg}/>
        </Container>
    )
}
