import React from "react";
import { Route, Routes } from "react-router";
import { Register } from "./views/Register";
import { Login } from "./views/Login";
import { Chat } from "./views/Chat";
import { SetAvatar } from "./views/SetAvatar";

function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/set-avatar" element={<SetAvatar />} />
      <Route path="/" element={<Chat />} />
    </Routes>
  );
}

export default App;
