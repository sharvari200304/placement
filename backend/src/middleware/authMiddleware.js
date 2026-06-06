import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { fail } from "../utils/apiResponse.js";

export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return fail(res, "Authentication token required", 401);
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user || !user.isActive) {
      return fail(res, "User is not authorized", 401);
    }

    req.user = user;
    next();
  } catch (error) {
    fail(res, "Invalid or expired token", 401);
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return fail(res, "You do not have permission to access this resource", 403);
  }
  next();
};
