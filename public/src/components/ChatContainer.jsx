import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { ChatInput } from './ChatInput';
import axios from 'axios';
import { getAllMessagesRoute, sendMessageRoute } from '../utils/APIRoutes';
import { toast } from 'react-toastify';
import {v4 as uuidv4} from 'uuid';

const Container = styled.div`
    padding-top: 1rem;
    display: grid;
    grid-template-rows: 10% 78% 12%;
    gap: 0.1rem;
    overflow: hidden;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
        grid-template-rows: 15% 70% 15%;
    }

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

    .chat-messages {
        padding: 1rem 2rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
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
                max-width: 40%;
                overflow-wrap: break-word;
                padding: 1rem;
                font-size: 1.1rem;
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
`;

export const ChatContainer = ({ contact, user, socket }) => {
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

    return (
        <Container>
            <div className="chat-header">
                <div className="contact-details">
                    <img src={`data:image/svg+xml;base64,${contact.avatarImage}`} alt="Contact's Avatar" />
                    <h3>{contact.username}</h3>
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
