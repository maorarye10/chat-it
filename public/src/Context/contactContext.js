import { createContext, useState } from "react";

export const contactContext = createContext({});

const { Provider } = contactContext;

export const ContactProvider = ({ children }) => {
  const [contact, setContact] = useState(null);

  const handleContactChange = (contact) => {
    setContact(contact);
  };

  const value = {
    contact,
    handleContactChange,
  };

  return <Provider value={value}>{children}</Provider>;
};
