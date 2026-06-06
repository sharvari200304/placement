import Application from "../models/Application.js";
import Company from "../models/Company.js";
import Job from "../models/Job.js";
import Student from "../models/Student.js";
import User from "../models/User.js";
import { ok } from "../utils/apiResponse.js";

export const dashboardStats = async (req, res, next) => {
  try {
    const [
      totalStudents,
      totalCompanies,
      totalJobs,
      totalApplications,
      shortlistedCandidates,
      placedStudents,
      latestApplications
    ] = await Promise.all([
      Student.countDocuments(),
      Company.countDocuments(),
      Job.countDocuments(),
      Application.countDocuments(),
      Application.countDocuments({ status: "shortlisted" }),
      Student.countDocuments({ placementStatus: "placed" }),
      Application.find()
        .populate({ path: "student", populate: { path: "user", select: "name email" } })
        .populate("company", "companyName")
        .populate("job", "title")
        .sort({ createdAt: -1 })
        .limit(8)
    ]);

    ok(res, {
      totalStudents,
      totalCompanies,
      totalJobs,
      totalApplications,
      shortlistedCandidates,
      placedStudents,
      latestApplications
    }, "Dashboard analytics fetched");
  } catch (error) {
    next(error);
  }
};

export const listUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    ok(res, users, "Users fetched");
  } catch (error) {
    next(error);
  }
};
