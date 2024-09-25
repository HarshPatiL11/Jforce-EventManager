import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./Compnents/pages/Login.jsx";
import RegisterPage from "./Compnents/pages/register.jsx";
import Home from "./Compnents/pages/Home.jsx";
import AddEvent from "./Compnents/pages/AddEvent.jsx";
import AdminPanel from "./Compnents/pages/AdminPanel.jsx";
import Navbar from "./Compnents/pages/Navbar.jsx";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/manage-events" element={<AdminPanel />} />
        <Route path="/admin/add-Event" element={<AddEvent />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
