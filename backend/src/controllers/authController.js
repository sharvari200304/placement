import User from "../models/User.js";
import Student from "../models/Student.js";
import Company from "../models/Company.js";
import generateToken from "../utils/generateToken.js";
import { fail, ok } from "../utils/apiResponse.js";

const authPayload = async (user) => {
  const profile = user.role === "student"
    ? await Student.findOne({ user: user._id })
    : user.role === "company"
      ? await Company.findOne({ user: user._id })
      : null;

  return {
    token: generateToken(user),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile
    }
  };
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, companyName } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return fail(res, "Email is already registered", 409);

    const user = await User.create({ name, email, password, role });

    if (role === "student") {
      await Student.create({ user: user._id });
    }

    if (role === "company") {
      await Company.create({ user: user._id, companyName: companyName || name });
    }

    ok(res, await authPayload(user), "Registration successful", 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return fail(res, "Invalid email or password", 401);
    }

    ok(res, await authPayload(user), "Login successful");
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res, next) => {
  try {
    ok(res, await authPayload(req.user), "Current user");
  } catch (error) {
    next(error);
  }
};
