import Company from "../models/Company.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import { fail, ok } from "../utils/apiResponse.js";

export const getMyCompanyProfile = async (req, res, next) => {
  try {
    const profile = await Company.findOne({ user: req.user._id }).populate("user", "name email role");
    ok(res, profile, "Company profile");
  } catch (error) {
    next(error);
  }
};

export const updateMyCompanyProfile = async (req, res, next) => {
  try {
    const profile = await Company.findOneAndUpdate(
      { user: req.user._id },
      req.body,
      { new: true, runValidators: true, upsert: true }
    ).populate("user", "name email role");
    ok(res, profile, "Company profile updated");
  } catch (error) {
    next(error);
  }
};

export const listCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find().populate("user", "name email isActive").sort({ createdAt: -1 });
    ok(res, companies, "Companies fetched");
  } catch (error) {
    next(error);
  }
};

export const getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id).populate("user", "name email isActive");
    if (!company) return fail(res, "Company not found", 404);
    ok(res, company, "Company fetched");
  } catch (error) {
    next(error);
  }
};

export const updateCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!company) return fail(res, "Company not found", 404);
    ok(res, company, "Company updated");
  } catch (error) {
    next(error);
  }
};

export const deleteCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) return fail(res, "Company not found", 404);
    await Job.deleteMany({ company: company._id });
    await Application.deleteMany({ company: company._id });
    ok(res, null, "Company, jobs, and applications deleted");
  } catch (error) {
    next(error);
  }
};
