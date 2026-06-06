import Company from "../models/Company.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import { fail, ok } from "../utils/apiResponse.js";

export const listJobs = async (req, res, next) => {
  try {
    const { status, q } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (q) filter.$or = [
      { title: new RegExp(q, "i") },
      { location: new RegExp(q, "i") },
      { skillsRequired: new RegExp(q, "i") }
    ];
    const jobs = await Job.find(filter).populate("company", "companyName industry location").sort({ createdAt: -1 });
    ok(res, jobs, "Jobs fetched");
  } catch (error) {
    next(error);
  }
};

export const getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate("company", "companyName industry website location");
    if (!job) return fail(res, "Job not found", 404);
    ok(res, job, "Job fetched");
  } catch (error) {
    next(error);
  }
};

export const createJob = async (req, res, next) => {
  try {
    const company = await Company.findOne({ user: req.user._id });
    if (!company) return fail(res, "Company profile required before posting jobs", 400);
    const job = await Job.create({ ...req.body, company: company._id });
    ok(res, job, "Job created", 201);
  } catch (error) {
    next(error);
  }
};

export const myCompanyJobs = async (req, res, next) => {
  try {
    const company = await Company.findOne({ user: req.user._id });
    const jobs = await Job.find({ company: company?._id }).sort({ createdAt: -1 });
    ok(res, jobs, "Company jobs fetched");
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return fail(res, "Job not found", 404);

    if (req.user.role === "company") {
      const company = await Company.findOne({ user: req.user._id });
      if (!company || !job.company.equals(company._id)) return fail(res, "Cannot update another company's job", 403);
    }

    Object.assign(job, req.body);
    await job.save();
    ok(res, job, "Job updated");
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return fail(res, "Job not found", 404);

    if (req.user.role === "company") {
      const company = await Company.findOne({ user: req.user._id });
      if (!company || !job.company.equals(company._id)) return fail(res, "Cannot delete another company's job", 403);
    }

    await Application.deleteMany({ job: job._id });
    await job.deleteOne();
    ok(res, null, "Job and related applications deleted");
  } catch (error) {
    next(error);
  }
};
