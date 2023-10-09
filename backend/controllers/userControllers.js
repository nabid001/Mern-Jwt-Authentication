import asyncHandler from "express-async-handler";
import User from "../model/userSchema.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

//  @desc   Get user profile
//  @route  Get /api/users/profile
//  access  Private
export const getProfile = asyncHandler(async (req, res) => {
  const { name, _id, email } = req.user;
  res.json({
    _id,
    name,
    email,
  });
});

//  @desc   Register
//  @route  POST /api/users/register
//  access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // User Exists
  const userExists = await User.exists({ email });

  if (userExists) {
    res.status(404);
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashPassword,
  });

  if (user) {
    generateToken(res, user._id);
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(404);
    res.json("Invalid user data");
  }
});

//  @desc   Login user/set token
//  @route  POST /api/users/auth
//  access  Public
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  const hashPass = await bcrypt.compare(password, user.password);

  if (user && hashPass) {
    generateToken(res, user._id);
    res.status(201);
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("Wrong Credentials");
  }
});

//  @desc   Logout
//  @route  POST /api/users/logout
//  access  Public
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json("User Logout User");
});

//  @desc   Update user profile
//  @route  Put /api/users/profile
//  access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
  res.json("Update user profile");
});
