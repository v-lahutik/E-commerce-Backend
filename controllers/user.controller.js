import User from "../models/user.model.js";
import { createToken, verifyToken } from "../utils/jwt.js";
import { sendEmail } from "../utils/helper.js";
import { createError } from "../utils/helper.js";

export const register = async (req, res, next) => {
    try {
      const { firstName, lastName, email, password } = req.body;
  
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
      }
  
      const newUser = await User.create({ firstName, lastName, email, password });
  
      // Generate verification token
      const verificationToken = await createToken(
        { id: newUser._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
  
      // Send verification email
      await sendEmail(newUser, verificationToken);
  
      res.status(201).json({
        message: "User registered successfully. Please verify your email.",
        user: {
          id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  export const verifyAccount = async (req, res, next) => {
    try {
        const { vtoken, uid } = req.params;

        // Verify the token
        const decoded = await verifyToken(vtoken, process.env.JWT_SECRET);
        if (decoded.id !== uid) {
            return next(createError("Invalid token or user ID", 400));
        }

        // Activate the user's account
        const user = await User.findById(uid);
        if (!user) {
            return next(createError("User not found", 400));
        }

        if (user.is_activated) {
            return next(createError("User already activated", 400));
        }

        user.is_activated = true;
        await user.save();

        res.status(200).json({ message: "Account verified successfully" });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;


    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Email or Password is incorrect" });
    }

    const isMatch = await user.comparePass(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Email or Password is incorrect" });
    }

    const token = await createToken(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
        expires: new Date(Date.now() + 3_600_000 * 24), 
        httpOnly: true, 
      })
      .json({ status: "login-success", user: { id: user._id, email: user.email } });
  } catch (error) {
    next(error);
  }
};