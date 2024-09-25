import React, { useState, useRef } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { GrClose } from "react-icons/gr";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import { FaUser } from "react-icons/fa";
import axios from "axios";

const AdmNav = () => {
  const navbar = useRef();
  const [hamburger, setHamburger] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  function onMenuClick() {
    navbar.current.classList.toggle("responsive");
    setHamburger(!hamburger);
  }

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const handleLogout = async () => {
    try {
      await axios.post(
        "/api/v1/user/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Use the correct token here
          },
        }
      );
      console.log("User logged out successfully.");
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem("token"); // Ensure you remove the token
      navigate("/login"); // Redirect to login
    }
  };

  return (
    <div className="page-header">
      <div className="logo">
        <Link to="/admin/manage-events">
          <p className="LogoP">ADMIN</p>
        </Link>
      </div>
      <a id="menu-icon" className="menu-icon" onClick={onMenuClick}>
        {hamburger ? <GrClose size={30} /> : <GiHamburgerMenu size={30} />}
      </a>

      <div id="navigation-bar" className="nav-bar" ref={navbar}>
        <Link to="/">Home</Link>
        <Link to="/admin/add-event">Add</Link>
        {isLoggedIn ? (
          <>
            <Link onClick={handleLogout}>Logout</Link>
          </>
        ) : location.pathname === "/login" ? (
          <Link to="/register">
            <FaUser style={{ marginRight: "5px" }} />
            Sign-up
          </Link>
        ) : (
          <Link to="/login">
            <FaUser style={{ marginRight: "5px" }} />
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default AdmNav;
