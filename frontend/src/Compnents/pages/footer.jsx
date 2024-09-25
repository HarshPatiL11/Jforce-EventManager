import React from "react";
import "./Footer.css"; // Assuming you have a CSS file for styling
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          &copy; {new Date().getFullYear()} Your Company Name. All rights
          reserved.
        </p>
        <ul className="footer-links">
          <li>
            <Link to={"#"}>About Us</Link>
          </li>
          <li>
            <Link to={"#"}>Contact</Link>
          </li>
          <li>
            <Link to={"#"}>Privacy Policy</Link>
          </li>
          <li>
            <Link to={"#"}>Terms of Service</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
