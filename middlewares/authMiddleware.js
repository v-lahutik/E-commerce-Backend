import User from "../models/user.model.js";
import { createError } from "../utils/helper.js";
import { verifyToken } from "../utils/jwt.js";

export const authenticateUser = async (req, res, next) => {
  console.log("cookie: ", req.headers.cookie);
  try {
    const cookies = req.headers.cookie;
    if (!cookies) {
      return res.status(400).json({
        status: "failure",
        msg: "Cookie does not exist",
      });
    }
    const token = cookies.split('; ').find(row => row.startsWith('token=')).split('=')[1];
    
    if (!token) {
      return res.status(400).json({
        status: "failure",
        msg: "Token does not exist in cookies",
      });
    }
    
    const token_payload = await verifyToken(token, process.env.JWT_SECRET);
    


    const user = await User.findById(token_payload.id); 
    
    if (!user) {
      console.log("error")
      throw createError("User not found!", 404);
    }

    req.token_payload = token_payload; 
    next();
  } catch (error) {
    console.log("from error", error)
    next(error);
  }
};

export const authorizeRoles = (...allowed_roles) => {
  return async (req, res, next) => {
    try {
      const userId = req.token_payload.id; 
      console.log("userId: ", userId)
      const user = await User.findById(userId);
      
      if (!user) {
        throw createError('User not found!', 404);
      }

      if (!allowed_roles.includes(user.role)) {
        throw createError('You are not permitted to do this operation', 403);
      }

      next(); 
    } catch (error) {
      next(error); 
    }
  };
};