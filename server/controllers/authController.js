import User from "../models/userModel.js";
import createError from "../utils/appError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register
export const signup = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      return next(new createError("User already exists", 400));
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    const newUser = await User.create({
      ...req.body,
      password: hashedPassword,
    });

    // Json web Token
    const token = jwt.sign({ _id: newUser._id }, "secretkey123", {
      expiresIn: "90d",
    });

    res.status(201).json({
      status: "success",
      message: "User Registered Successfully",
      token,
    });
  } catch (err) {
    next(err);
  }
};

// Login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return next(new createError("Invalid email or password", 401));
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return next(new createError("Invalid email or password", 401));
    }

    // Json web Token
    const token = jwt.sign({ _id: user._id }, "secretkey123", {
      expiresIn: "90d",
    });

    res.status(200).json({
      status: "success",
      message: "User Logged in Successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // Pastikan properti role disertakan di sini
      },
    });
  } catch (err) {
    next(err);
  }
};
