import express from "express";
import { getUserNameById, getUserTypeBytoken, registerUser, userLogin, validateEmail } from "../Controllers/UserController.js";
import { adminMiddleware, authMiddle } from "../Middleware/AuthMiddleware.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", userLogin);
// userRouter.get('/:_id',authMiddle,adminMiddleware,getUserNameById);
userRouter.get('/isadmin',authMiddle,getUserTypeBytoken)
userRouter.post("/validate", validateEmail);
userRouter.get("/checkAdmin", authMiddle, (req, res) => {
  res.send({ isAdmin: req.isAdmin });
});
export default userRouter;
