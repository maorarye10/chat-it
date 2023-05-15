import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Logo from '../assets/logo.svg'

export const Contacts = ({ contacts, user }) => {
    const [username, setUsername] = useState("");
    const [avatar, setAvatar] = useState("");
    const [selectedContact, setSelectedContact] = useState(undefined);
    useEffect(() => {
        if(user){
            setUsername(user.username);
            setAvatar(user.avatarImage);
        }
    }, [user]);
  return (
    <div>Contacts</div>
  )
}
