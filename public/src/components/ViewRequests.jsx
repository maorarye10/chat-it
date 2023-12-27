import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import {IoMdSearch, IoMdArrowBack, IoMdTrash, IoMdCheckmark } from 'react-icons/io'
import { PiCactusLight } from "react-icons/pi";
import { toast } from 'react-toastify'
import axios from 'axios';
import { declineRequestRoute, acceptRequestRoute } from '../utils/APIRoutes';

const Container = styled.div`
    height: 100%;
    color: white;
    display: grid;
    grid-template-rows: 15% 85%;
    place-items: center;

    .header {
        display: grid;
        grid-template-columns: 15% 70% 15%;
        width: 90%;

        button {
            background-color: transparent;
            border: none;
            cursor: pointer;
            svg {
                font-size: 2rem;
                color: white;
            }
        }

        .back-btn {
            margin-right: auto;
        }

        .search-btn {
            margin-left: auto;
        }

        .title {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.3rem;
        }
    }

    .requests-container {
        width: 100%;
        height: 95%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        overflow: auto;
        gap: 0.4rem;

        .place-holder {
            color: #ffffff34;
            text-transform: capitalize;
            margin-bottom: 3rem;
        }

        svg {
            display: block;
            font-size: 5rem;
            margin-bottom: 0.5rem;
            color: #ffffff34;
        }

        .user-card {
            background-color: #ffffff39;
            width: 90%;
            border-radius: 0.2rem;
            min-height: 5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            animation-name: loadUserCard;
            animation-duration: 0.5s;

            .user-info {
                padding: 0.4rem;
                gap: 0.5rem;
                display: flex;
                align-items: center;

                .avatar {
                    height: 2.5rem;
                }
            }

            .action-buttons {
                height: 100%;
                padding: 0 0.4rem 0 0.4rem;
                display: flex;
                flex-direction: column;
                justify-content: space-evenly;

                button {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    /* background-color: transparent; */
                    /* border: 2px solid #9a86f3; */
                    border-radius: 0.5rem;
                    padding: 0.2rem;
                    aspect-ratio: 1/1;
                    /* transition: background-color 0.3s, border-color 0.3s; */
                    cursor: pointer;

                    svg {
                        margin: 0;
                        font-size: 1.3rem;
                        /* color: #9a86f3; */
                        color: white;
                        transition: color 0.3s;
                    }
                }

                .accept-btn {
                    /* &:hover {
                        background-color: green;
                        border-color: green;

                        svg {
                            color: white;
                        }
                    } */
                    background-color: limegreen;
                    border: 2px solid limegreen;
                }

                .decline-btn {
                    /* &:hover {
                        background-color: red;
                        border-color: red;

                        svg {
                            color: white;
                        }
                    } */
                    background-color: red;
                    border: 2px solid red;
                }
            }
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

    .justify-start {
        justify-content: start;
    }

    @keyframes loadUserCard {
        0%   {opacity: 0;}
        100% {opacity: 1;}
    } 
`

export const ViewRequests = ({user, requests, handleCloseScreen, handleRequestsScreenToggle, handleUpdateRequests}) => {
    const requestsContainer = useRef();

    useEffect(() => {
        //console.log(requests);
        if (requests) {
            requests.length > 0 ?
            requestsContainer.current.classList.add('justify-start'):
            requestsContainer.current.classList.remove('justify-start');
        }

    }, [requests]);

    const toastOptions = {
        position: "bottom-right",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
    }

    const handleSwitchToSearch = () => {
        handleRequestsScreenToggle();
    }
    const handleGoBack = () => {
        handleRequestsScreenToggle();
        handleCloseScreen();
    }

    const handleFriendRequest = async (reqIndex, isAccepted) => {
        //console.log(`reqIndex: ${reqIndex}`);
        isAccepted ? await handleAcceptRequest(reqIndex) : await handleDeclineRequest(reqIndex);
        const [removedReq] = requests.splice(reqIndex, 1);
        handleUpdateRequests([...requests], isAccepted && removedReq.sender);
    }
    const handleAcceptRequest = async (reqIndex) => {
        try {
            const response = await axios.put(`${acceptRequestRoute}/${requests[reqIndex]._id}`);
            toast.success(`${requests[reqIndex].sender.username} is now on your contacts list!`, toastOptions);   
        } catch (error) {
            if (error.response.status === 500){
                toast.error("An error occured. Please try again Later.", toastOptions);
            }else{
                toast.error(error.response.data.message, toastOptions);
            }
        }
    }
    const handleDeclineRequest = async (reqIndex) => {
        try {
            const response = await axios.put(`${declineRequestRoute}/${requests[reqIndex]._id}`);
            toast.info(`${requests[reqIndex].sender.username}'s request has been declined.`, toastOptions);
        } catch (error) {
            if (error.response.status === 500){
                toast.error("An error occured. Please try again Later.", toastOptions);
            }else{
                toast.error(error.response.data.message, toastOptions);
            }
        }
        
    }

  return (
    <Container>
        <div className='header'>
            <button className='back-btn' onClick={handleGoBack}>
                <IoMdArrowBack />
            </button>
            <div className='title'>Friend Requests</div>
            <button className='search-btn' onClick={handleSwitchToSearch}>
                <IoMdSearch />
            </button>
        </div>
        <div ref={requestsContainer} className='requests-container' >
            {
                requests && requests.length > 0 ?
                  requests.map((request, index) => {
                    //console.log(index);
                    return(
                        <div className='user-card' key={index}>
                            <div className='user-info'>
                                <img className='avatar' src={`data:image/svg+xml;base64,${request.sender.avatarImage}`} alt="Sender Image" />
                                <h3>{request.sender.username}</h3>
                            </div>
                            <div className='action-buttons'>
                                <button className='accept-btn' onClick={() => handleFriendRequest(index, true)}>
                                    <IoMdCheckmark />
                                </button>
                                <button className='decline-btn' onClick={() => handleFriendRequest(index, false)}>
                                    <IoMdTrash />
                                </button>
                            </div>
                        </div>
                    )
                  }):
                <>
                    <PiCactusLight />
                    <div className='place-holder'>Looks empty here.</div>
                </>
            }
            
        </div>
    </Container>
  )
}
