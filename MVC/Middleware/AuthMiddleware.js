import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/config.js";
import UserModel from "../Models/UserModel.js";

export const authMiddle = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res.status(401).send({
        success: false,
        message: "No token provided",
      });
    }

    jwt.verify(token, JWT_SECRET, async (err, decode) => {
      if (err) {
        console.log("JWT verification error:", err);
        return res.status(401).send({
          success: false,
          message: "Unauthorized User",
        });
      }

      // Check if user exists
      const user = await UserModel.findById(decode.id);
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User not found",
        });
      }

      // Set user information on the request
      req.userId = decode.id;
      req.isAdmin = user.isAdmin;

      console.log("Decoded JWT:", decode);
      console.log("User isAdmin from DB:", req.isAdmin);

      next();
    });
  } catch (error) {
    console.error("Authentication Middleware Error:", error);
    res.status(500).send({
      success: false,
      message: "Error in Authentication Middleware",
      error,
    });
  }
};

export const adminMiddleware = (req, res, next) => {
  try {
    if (req.isAdmin !== true) {
      return res.status(401).send({
        success: false,
        message: "Only Admin Access",
      });
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Unauthorized Access",
      error,
    });
  }
};
