import express from "express";
import UserModel from "../Models/UserModel.js";
import { comparePassword, hashPassword } from "../Helpers/AuthHelper.js";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;
console.log("JWT_SECRET in userConterl.js:", JWT_SECRET);

export const registerUser = async (req, res) => {
  try {
    const { userName, userEmail, password } = req.body;

    if (!userName) {
      return res.status(401).send({
        success: false,
        message: "No userName",
      });
    }
    if (!userEmail) {
      return res.status(401).send({
        success: false,
        message: "No userEmail",
      });
    }
    if (!password) {
      return res.status(401).send({
        success: false,
        message: "No password",
      });
    }

    const chkUserExist = await UserModel.findOne({ userEmail });
    if (chkUserExist) {
      return res.status(409).send({
        success: false,
        message: "User Entered Email Exist In database",
      });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await UserModel.create({
      userName,
      userEmail,
      password: hashedPassword,
    });
    newUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "User Registered",
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error in Register API",
      error,
    });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { userEmail, password } = req.body;

    if (!userEmail && !password) {
      return res.status(400).send({
        success: false,
        message: "Email and password are required",
      });
    } else if (!userEmail) {
      return res.status(400).send({
        success: false,
        message: "User email is required",
      });
    } else if (!password) {
      return res.status(400).send({
        success: false,
        message: "Password is required",
      });
    }

    const user = await UserModel.findOne({ userEmail });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).send({
        success: false,
        message: "Incorrect password. Please try again.",
      });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    user.password = undefined;

    return res.status(200).send({
      success: true,
      message: "User logged in successfully",
      token,
      user,
    });
  } catch (error) {
    console.error("Login API Error:", error);
    return res.status(500).send({
      success: false,
      message: "An error occurred while logging in",
      error,
    });
  }
};

export const validateEmail = async (req, res) => {
  try {
    const userEmail = req.body.userEmail;
    const validEmail = true;

    if (!userEmail) {
      return res
        .status(400)
        .send({ success: false, message: "No Email", validEmail: !validEmail });
    }
    const user = await UserModel.findOne({userEmail});
    if (!user) {
      return res
        .status(400)
        .send({ success: false, message: "Email not In use", validEmail:!validEmail });
    }
    res.status(200).send({
      success: true,
      validEmail,
    });
  } catch (error) {
    error;
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error in get ValidateEmail API ",
      error,
    });
  }
};

export const getUserTypeBytoken = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).send({ success: false, message: "No UserId" });
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(400).send({ success: false, message: "No user" });
    }
    res
      .status(200)
      .send({ succcess: true, message: "user Found", isAdmin: user.isAdmin });
  } catch (error) {
    error;
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error in get userByID API ",
      error,
    });
  }
};

export const getUserNameById = async (req, res) => {
  try {
    const userId = req.params._id;
    if (!userId) {
      return res.status(400).send({ success: false, message: "No UserId" });
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(400).send({ success: false, message: "No user" });
    }
    res
      .status(200)
      .send({ succcess: true, message: "user Found", userName: user.userName });
  } catch (error) {
    error;
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error in get userByID API ",
      error,
    });
  }
};
