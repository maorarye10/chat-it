import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ChatInput } from './ChatInput';
import { ChatContent } from './ChatContent';
import axios from 'axios';
import { getAllMessagesRoute, sendMessageRoute } from '../utils/APIRoutes';
import { toast } from 'react-toastify';

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

export const ChatContainer = ({ contact, user }) => {
    const [messages, setMessages] = useState([]);

    const toastOptions = {
        position: "bottom-right",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
    }

    useEffect(() => {
        axios.post(getAllMessagesRoute, {
            user: user._id,
            contact: contact._id
        }).then(response => {
            setMessages(response.data);
        });
    }, [contact]);

    const handleSendMsg = async (msg) => {
        axios.post(sendMessageRoute, {
        sender: user._id, 
        reciver: contact._id,
        messageText: msg
        }).catch(error => {
            toast.error(error.response.data.message, toastOptions);
        })
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
                    messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.fromSelf ? "sended" : "received"}`}>
                            <p className='message-content'>
                                {msg.message}
                            </p>
                        </div>
                    ))
                }
            </div>
            <ChatInput handleSendMsg={handleSendMsg}/>
        </Container>
    )
}
