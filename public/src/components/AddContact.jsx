import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { IoMdSearch, IoMdAdd, IoMdTime, IoMdArrowBack } from 'react-icons/io'
import { BsFillEnvelopeFill, BsFillEnvelopeOpenFill } from "react-icons/bs"
import Loader from '../assets/loader2.gif'
import axios from 'axios'
import { getUsersRoute, getRequestsBySenderRoute, createRequestRoute } from '../utils/APIRoutes'
import { toast } from 'react-toastify'
import { CustomBtn } from './CustomBtn'

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

        .requests-btn {
            margin-left: auto;
            svg {
                font-size: 1.7rem;
            }

            .requests-count {
                position: relative;
            }

            .requests-count::after {
                content: attr(data-text);
                background-color: Crimson;
                width: 60%;
                height: 60%;
                position: absolute;
                top: -0.2rem;
                left: 1rem;
                z-index: 1;
                border-radius: 1rem;
                font-size: 0.8rem;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }

        form {
            width: 100%;
            height: 2rem;
            background-color: #ffffff34;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            border-radius: 2rem;

            input {
                color: white;
                height: 100%;
                width: 100%;
                border-radius: 2rem;
                padding-left: 0.7rem;
                font-size: 0.9rem; //1.2
                background-color: transparent;
                border: none;

                :focus {
                    outline: none;
                }

                &::selection {
                    background-color: #9a86f3;
                }
            }

            button {
                aspect-ratio: auto;
                border-radius: 2rem;
                border: none;
                height: 100%;
                background-color: #9a86f3;
                padding: 0.3rem 1rem;
                cursor: pointer;

                svg {
                    display: block;
                    font-size: 1.1rem;
                    color: white;
                }
            }
        }
    }

    

    .search-container {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;

        .loader {
            max-inline-size: 100%;
        }

        .place-holder {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            gap: 0.2rem;
            color: #ffffff34;
            font-size: 1rem;
            width: 85%;
            svg {
                font-size: 1.5rem;
                display: inline;
            }
        }

        .users-list {
            height: 95%;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: start;
            overflow: auto;
            gap: 0.4rem;

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
    
                &::-webkit-scrollbar {
                    width: 0.2rem;
    
                    &-thumb {
                        background-color: #ffffff39;
                        width: 0.1rem;
                        border-radius: 1rem;
                    }
                }

                button {
                    margin-right: 0.4rem;
                }

                .pending {
                    background-color: #ffffff39;
                    cursor: default;
                }
            }

        }
    }   

    @keyframes loadUserCard {
        0%   {opacity: 0;}
        100% {opacity: 1;}
    } 
`

export const AddContact = ({ user, incomingFriendRequests, handleCloseScreen, handleShowRequestsScreenToggle }) => {
    const [inputVal, setInputVal] = useState("");
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState(null);
    const [friendRequests, setFriendRequests] = useState(null);
    const [lastSearchInput, setLastSearchInput] = useState("");

    const toastOptions = {
        position: "bottom-right",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
    }

    useEffect(() => {
        axios.get(`${getRequestsBySenderRoute}/${user._id}`)
            .then((response) => {
                setFriendRequests(response.data.requests);
            })
    }, []);

    /* useEffect(() => {
        if (friendRequests){
            console.log(friendRequests);
        }
    }, [friendRequests]); */

    useEffect(() => {
        if (loading) {
            axios.get(`${getUsersRoute}?username=${inputVal}&hostUser=${user._id}`)
                .then((response) => {
                    const users = response.data.users
                    //console.log('users recived: ', users);
                    sortIncUsersById(users); // O(nlogn)
                    const newUsers = removeIncomingRequestsUsers(users); // O(nlogn)
                    tagUsersIsRequestSent(newUsers); // O(nlogn)
                    //console.log("new users: ", newUsers);
                    setUsers(newUsers);
                }).catch((err) => {
                    if (err.response.status === 500) {
                        toast.error("An error occured. Please try again Later.", toastOptions);
                    } else {
                        toast.error(err.response.data.message, toastOptions);
                    }
                    setLoading(false);
                });
        }
    }, [loading]);

    useEffect(() => {
        if (users) {
            setLoading(false);
        }
    }, [users]);

    useEffect(() => {
        if (lastSearchInput) {
            setLoading(true);
        }
    }, [lastSearchInput]);

    // O(nlogn) - Browser Depended
    const sortIncUsersById = (users) => {
        users.sort((userA, userB) => {
            if (userA._id < userB._id) {
                return -1;
            }
            if (userA._id > userB._id) {
                return 1;
            }
            return 0;
        });
    }

    const removeIncomingRequestsUsers = (users) => {
        const usersIds = users.map((user) => user._id);
        const usersCopy = [...users];
        const newUsersArr = [];

        // O(n)
        incomingFriendRequests.forEach((request) => {
            //O(log n)
            const index = binarySearch(usersIds, 0, usersIds.length - 1, request.sender._id);
            usersCopy[index] = null;
        });
        usersCopy.forEach((user) => {
            if (user) {
                newUsersArr.push(user);
            }
        })

        return newUsersArr;
    }

    // O(nlogn)
    const tagUsersIsRequestSent = (users) => {
        users.forEach(user => user.isRequestSent = false);
        const usersIds = users.map((user) => user._id);

        // O(n)
        friendRequests.forEach((request) => {
            //O(log n)
            const index = binarySearch(usersIds, 0, usersIds.length - 1, request.reciver);
            if (index > -1) {
                users[index].isRequestSent = true;
            }
        })
    }

    //O(log n)
    const binarySearch = (arr, start, end, val) => {
        if (start > end) {
            return -1;
        }

        let mid = Math.floor((start + end) / 2);

        if (arr[mid] === val) {
            return mid;
        }

        if (val > arr[mid]) {
            return binarySearch(arr, mid + 1, end, val);
        }

        return binarySearch(arr, start, mid - 1, val);
    }

    const handleTextChange = (msg) => {
        setInputVal(msg);
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (inputVal.length > 0 && inputVal !== lastSearchInput) {
            setLastSearchInput(inputVal);
        }
    }

    const handleSendFriendRequest = (index, reciverId) => {
        const btn = document.querySelector(`#btn${index}`);
        if (!btn.classList.contains('pending')) {
            const addSVG = document.querySelector(`#add${index}`);
            const timeSVG = document.querySelector(`#time${index}`);

            btn.classList.add('pending');
            addSVG.style.display = 'none';
            timeSVG.style.display = 'inline';
            console.log(btn);
            console.log(addSVG);
            console.log(timeSVG);

            axios.post(createRequestRoute, { sender: user._id, reciver: reciverId }).then((response) => {
                setFriendRequests([...friendRequests, response.data.request]);
            }).catch((err) => {
                if (err.response.status === 500) {
                    toast.error("An error occured. Please try again Later.", toastOptions);
                } else {
                    toast.error(err.response.data.message, toastOptions);
                }
            });
        }
    }

    const handleGoBack = () => {
        handleCloseScreen();
    }

    return (
        <Container>
            <div className='header'>
                <button className='back-btn' onClick={handleGoBack}>
                    <IoMdArrowBack />
                </button>
                <form onSubmit={handleSearchSubmit}>
                    <input type="text" placeholder='Search for new contacts' value={inputVal} onChange={(e) => handleTextChange(e.target.value)} />
                    <button type='submit'>
                        <IoMdSearch />
                    </button>
                </form>
                <button className='requests-btn' onClick={handleShowRequestsScreenToggle}>
                    {
                        incomingFriendRequests !== null && incomingFriendRequests.length > 0 ?
                            <div data-text={incomingFriendRequests.length} className='requests-count'><BsFillEnvelopeFill /></div> :
                            <BsFillEnvelopeOpenFill />
                    }
                </button>
            </div>
            <div className='search-container'>
                {
                    !users ?
                        <div className='place-holder'>
                            <span>Click on </span><IoMdSearch /><span> to apply the search.</span><span>Results will be shown here.</span>
                        </div> :
                        <>
                            {
                                loading ?
                                    <img src={Loader} alt='Loader gif' className='loader' /> :
                                    <div className='users-list'>
                                        {
                                            users.length === 0 ?
                                                <div className='place-holder'>No users found</div> :
                                                users.map((user, index) => {
                                                    return (
                                                        <div className='user-card' key={index}>
                                                            <div className='user-info'>
                                                                <img className='avatar' src={`data:image/svg+xml;base64,${user.avatarImage}`} alt="Contact Image" />
                                                                <h3>{user.username}</h3>
                                                            </div>
                                                            {
                                                                user.isRequestSent ?
                                                                    <CustomBtn id={`btn${index}`} className='pending'>
                                                                        <IoMdTime id={`time${index}`} />
                                                                    </CustomBtn> :
                                                                    <CustomBtn id={`btn${index}`} handleClick={() => handleSendFriendRequest(index, user._id)}>
                                                                        <IoMdAdd id={`add${index}`} />
                                                                        <IoMdTime id={`time${index}`} style={{ display: 'none' }} />
                                                                    </CustomBtn>
                                                            }
                                                        </div>
                                                    )
                                                })
                                        }
                                    </div>
                            }
                        </>
                }
            </div>
        </Container>
    )
}
