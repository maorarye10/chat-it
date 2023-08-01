import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import EmojiPicker from 'emoji-picker-react'
import {IoMdSend} from 'react-icons/io'
import {BsEmojiSmileFill} from 'react-icons/bs'

const Container = styled.div`
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #080420;
        padding: 0 1rem;
        gap: 0.7rem; //1
        
        .emoji-container {
            display: flex;
            align-items: center;
            color: white;
            gap: 1rem;

            .emoji {
                position: relative;

                svg {
                    font-size: 1.3rem; //1.5
                    color: white;
                    cursor: pointer;
                }

                .EmojiPickerReact {
                    position: absolute;
                    top: -500px;
                    box-shadow: 0 5px 10px #9a86f3;
                    border-color: #9a86f3;
                    --epr-bg-color: #080420;
                    --epr-category-label-bg-color: #080420;
                    --epr-search-input-bg-color: #ffffff34;
                    --epr-hover-bg-color: #9a86f3;
                    --epr-focus-bg-color: #9a86f3;

                    //Figure out this part.
                    .epr-body::-webkit-scrollbar {
                        background-color: #080420;
                        width: 5px;

                        &-thumb {
                            background-color: #9a86f3;
                        }
                    }
                }
            }
        }

        form {
            width: 100%;
            border-radius: 2rem;
            display: flex;
            align-items: center;
            gap: 2rem;
            background-color: #ffffff34;

            input {
                width: 100%;
                background-color: transparent;
                color: white;
                border: none;
                padding: 0rem 0 0rem 0.7rem; // 0.5 0 0.5 1
                font-size: 0.9rem; //1.2

                &::selection {
                    background-color: #9a86f3;
                }

                &:focus {
                    outline: none;
                }
            }
           
            button {
                padding: 0.3rem 0.8rem;
                border-radius: 2rem;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #9a86f3;
                border: none;
                cursor: pointer;
    
                svg {
                    font-size: 1.1rem; //1.5
                    color: white; 
                }
            }
        }

  /* md */
  @media (min-width: 768px) {}  

  /* lg */
  @media (min-width: 1024px) {
    gap: 1rem; //1

    .emoji-container {
        .emoji {
            svg {
                font-size: 1.7rem; //1.5
            }
        }
    }

    form {
        input {
            padding: 0.5rem 0 0.5rem 1rem; // 0.5 0 0.5 1
            font-size: 1.2rem; //1.2
        }

        button {
            padding: 0.3rem 1.5rem;
            svg {
                font-size: 1.5rem; //1.5
            }
        }
    }
  }

  /* xl */
  @media (min-width: 1280px) {}
    `;

export const ChatInput = ({ handleSendMsg }) => {
    const [isEmojiPickerShown, setIsEmojiPickerShown] = useState(false);
    const [msg, setMsg] = useState('');

    const ToggleEmojiPickerVisibility = () => {
        setIsEmojiPickerShown(!isEmojiPickerShown);
    }
    
    const handleEmojiClick = (emoji) => {
        let message = msg;
        message += emoji.emoji;
        setMsg(message);
    }

    const handleTextChange = (msg) => {
        setMsg(msg);
    }

    const sendMsg = (event) => {
        event.preventDefault();
        if (msg.length > 0){
            handleSendMsg(msg);
            setMsg('');
        }
    }

    return (
        <Container>
            <div className="emoji-container">
                <div className="emoji">
                    <BsEmojiSmileFill onClick={ToggleEmojiPickerVisibility} />
                    {
                        isEmojiPickerShown && <EmojiPicker onEmojiClick={handleEmojiClick}/>
                    }
                </div>
            </div>
            <form onSubmit={sendMsg}>
                <input type="text" placeholder='type your message here' value={msg} onChange={e => handleTextChange(e.target.value)}/>
                <button type='submit'> 
                    <IoMdSend />
                </button>
            </form>
        </Container>
    )
}
