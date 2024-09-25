import mongoose from "mongoose";

const UserModel = mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin:{
    type:Boolean,
    default:false
  }
});

export default mongoose.model("User", UserModel);