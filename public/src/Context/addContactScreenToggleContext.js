import { createContext, useState } from "react";

export const addContactScreenToggleContext = createContext({});

const { Provider } = addContactScreenToggleContext;

export const AddContactScreenToggleContext = ({ children }) => {
  const [visible, setVisibility] = useState(false);

  const handleVisibilityToggle = () => {
    setVisibility(!visible);
  };

  const value = {
    visible,
    handleVisibilityToggle,
  };

  return <Provider value={value}>{children}</Provider>;
};
