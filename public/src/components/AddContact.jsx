import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {IoMdSearch} from 'react-icons/io'
import Loader from '../assets/loader2.gif'
import axios from 'axios'
import { getUsersRoute } from '../utils/APIRoutes'
import { toast } from 'react-toastify'

const Container = styled.div`
    height: 100%;
    color: white;
    display: grid;
    grid-template-rows: 15% 85%;
    place-items: center;

    form {
        width: 80%;
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
                min-height: 5rem;
                width: 90%;
                border-radius: 0.2rem;
                padding: 0.4rem;
                gap: 0.5rem;
                display: flex;
                align-items: center;
                animation-name: loadUserCard;
                animation-duration: 0.5s;

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
        }
    }   

    @keyframes loadUserCard {
        0%   {opacity: 0;}
        100% {opacity: 1;}
    } 
`

export const AddContact = () => {
    const [inputVal, setInputVal] = useState("");
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState(null);

    const toastOptions = {
        position: "bottom-right",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: 'dark',
      }

    useEffect(() => {
        if (loading) {
            axios.get(`${getUsersRoute}?username=${inputVal}`)
            .then((response) => {
                setUsers(response.data.users);
            }).catch((err) => {
                if (err.response.status === 500){
                  toast.error("An error occured. Please try again Later.", toastOptions);
                }else{
                  toast.error(err.response.data.message, toastOptions);
                }
                setLoading(false);
              });
        }
    }, [loading]);

    useEffect(() => {
        if (users){
            console.log(users);
            setLoading(false);
        }
    }, [users])

    const handleTextChange = (msg) => {
        setInputVal(msg);
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (inputVal.length > 0) {
            setLoading(true);
        }
    }

  return (
    <Container>
        <form onSubmit={handleSearchSubmit}>
            <input type="text" placeholder='Search for new contacts' value={inputVal} onChange={(e) => handleTextChange(e.target.value)}/>
            <button type='submit'>
                <IoMdSearch />
            </button>
        </form>
        <div className='search-container'>
            {
                !users ?
                <div className='place-holder'>
                 <span>Click on </span><IoMdSearch /><span> to apply the search.</span><span>Results will be shown here.</span>
                </div> :
                <>
                    {
                        loading ?
                        <img src={Loader} alt='Loader gif' className='loader'/>:
                        <div className='users-list'>
                            {
                                users.map((user, index) => {
                                    console.log(user.username);
                                    return (
                                        <div className='user-card' key={index}>
                                            <img className='avatar' src={`data:image/svg+xml;base64,${user.avatarImage}`} alt="Contact Image" />
                                            <h3>{user.username}</h3>
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
