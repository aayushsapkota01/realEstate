import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  // Validate that the password is provided and is a string
  if (!username || !email || !password || typeof password !== 'string') {
    return next(errorHandler(400, "Please fill out all the fields !!"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json({ msg: "User Created Successfully!" });
  } catch (error) {
    next(error);
  }
};


export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User Not Found!"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(404, "Wrong Credentials"));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// Google OAuth handler
export const google = async (req, res, next) => {
  try {
    // Check if the user already exists in the database
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      // If user exists, generate a JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

      // Exclude the password from the user object before sending the response
      const { password: pass, ...rest } = user._doc;

      // Set the JWT token in an HTTP-only cookie and send the user data in the response
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      // If user does not exist, create a new user
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });

      // Save the new user to the database
      await newUser.save();

      // Generate a JWT token
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

      // Exclude the password from the user object before sending the response
      const { password: pass, ...rest } = newUser._doc;

      // Set the JWT token in an HTTP-only cookie and send the user data in the response
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    // Pass any errors to the error handler middleware
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been Logged Out");
  } catch (error) {
    next(error);
  }
};
