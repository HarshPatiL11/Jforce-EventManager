import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import Navbar from "./Navbar";
import Footer from "./footer";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState({
    userNameError: null,
    emailError: null,
    passwordError: null,
    confirmPasswordError: null,
  });
  const [valid, setValid] = useState({
    isUserNameValid: false,
    isEmailValid: false,
    isPasswordValid: false,
    isConfirmPasswordValid: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear specific error on change
    setError({
      ...error,
      [`${name}Error`]: null,
    });

    // Validate individual fields
    if (name === "userName") {
      setValid({ ...valid, isUserNameValid: value.length > 0 });
    } else if (name === "userEmail") {
      setValid({ ...valid, isEmailValid: value.length > 0 });
    } else if (name === "userPassword") {
      setValid({ ...valid, isPasswordValid: value.length > 0 });
    } else if (name === "confirmPassword") {
      setValid({ ...valid, isConfirmPasswordValid: value.length > 0 });
    }
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError({
      userNameError: null,
      emailError: null,
      passwordError: null,
      confirmPasswordError: null,
    });

    const { userName, userEmail, userPassword, confirmPassword } = formData;
    let isValid = true;
    console.log("Length of pass", userPassword.length);
    // Validate fields
    if (!userName && !userEmail && !userPassword && !confirmPassword) {
    
      // toast.error("All Fields Empty"); 
      isValid = false;
    }
    if (!userName) {
      setError((prev) => ({ ...prev, userNameError: "Username is required." }));
      setValid((prev) => ({ ...prev, isUserNameValid: false }));

      isValid = false;
    }

    if (!userEmail) {
      setError((prev) => ({ ...prev, emailError: "Email is required." }));
      setValid((prev) => ({ ...prev, isEmailValid: false }));

      isValid = false;
    }

    
    if (!userPassword) {
      setError((prev) => ({ ...prev, passwordError: "Password is required." }));
      setValid((prev) => ({ ...prev, isPasswordValid: false }));
      isValid = false;
    }

    if (userPassword && userPassword.length < 8) {
      setError((prev) => ({
        ...prev,
        passwordError: " ",
      }));
      setValid((prev) => ({ ...prev, isPasswordValid: false }));
      isValid = false;
      toast.error("Set Password longer than 8 letters");
    }

    if (!confirmPassword) {
      setError((prev) => ({
        ...prev,
        confirmPasswordError: "Confirm Password is required.",
      }));
      setValid((prev) => ({ ...prev, isConfirmPasswordValid: false }));
      isValid = false;
    }
    if (confirmPassword && confirmPassword.length < 8) {
      setError((prev) => ({
        ...prev,
        confirmPasswordError: "  ",
      }));
      setValid((prev) => ({ ...prev, isConfirmPasswordValid: false }));
      isValid = false;
    }
    if (userPassword !== confirmPassword) {
      setError((prev) => ({
        ...prev,
        passwordError: " ",
        confirmPasswordError: " ",
      }));
      setValid((prev) => ({
        ...prev,
        isPasswordValid: false,
        isConfirmPasswordValid: false,
      }));
      toast.error("Password and Confirm Passwords > Not Matching");
      isValid = false;
    }

    if (!isValid) return;

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/register",
        {
          userName,
          userEmail,
          password: userPassword,
        }
      );

      const { token } = response.data;
      localStorage.setItem("userToken", token);
      toast.success("Accout Successfully Registered");
      toast.info("Please Login To procced Futher");
      navigate("/login");
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError((prev) => ({
          ...prev,
          emailError: " ",
        }));
        setValid((prev) => ({ ...prev, isEmailValid: false }));
        toast.warning("Registered Email Detected, Please Login")
      } else {
        setError({
          generalError: "Registration failed! Please check your inputs.",
        });
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="LoginContainer">
        <div className="loginHeader"></div>
        <div className="LoginBody">
          <h3>Register</h3>

          {error.generalError && (
            <div className="error-message">{error.generalError}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Username"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className={
                  valid.isUserNameValid
                    ? "input-valid"
                    : error.userNameError
                    ? "input-invalid"
                    : ""
                }
              />
              {error.userNameError && (
                <div className="error-message">{error.userNameError}</div>
              )}
            </div>

            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                name="userEmail"
                value={formData.userEmail}
                onChange={handleChange}
                className={
                  valid.isEmailValid
                    ? "input-valid"
                    : error.emailError
                    ? "input-invalid"
                    : ""
                }
              />
              {error.emailError && (
                <div className="error-message">{error.emailError}</div>
              )}
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                name="userPassword"
                value={formData.userPassword}
                onChange={handleChange}
                className={
                  valid.isPasswordValid
                    ? "input-valid"
                    : error.passwordError
                    ? "input-invalid"
                    : ""
                }
              />
              {error.passwordError && (
                <div className="error-message">{error.passwordError}</div>
              )}
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={
                  valid.isConfirmPasswordValid
                    ? "input-valid"
                    : error.confirmPasswordError
                    ? "input-invalid"
                    : ""
                }
              />
              {error.confirmPasswordError && (
                <div className="error-message">
                  {error.confirmPasswordError}
                </div>
              )}
            </div>

            <button type="submit" className="login-btn">
              Register
            </button>
          </form>

          {/* <div className="signup-link">
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div> */}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default RegisterPage;
