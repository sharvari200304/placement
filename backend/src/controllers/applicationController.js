import Application from "../models/Application.js";
import Company from "../models/Company.js";
import Job from "../models/Job.js";
import Student from "../models/Student.js";
import { fail, ok } from "../utils/apiResponse.js";

export const applyToJob = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return fail(res, "Student profile required before applying", 400);

    const job = await Job.findById(req.params.jobId);
    if (!job || job.status !== "open") return fail(res, "Job is not open for applications", 400);
    if (new Date(job.deadline) < new Date()) return fail(res, "Application deadline has passed", 400);

    const application = await Application.create({
      student: student._id,
      job: job._id,
      company: job.company,
      resumeUrl: req.body.resumeUrl || student.resumeUrl,
      coverLetter: req.body.coverLetter
    });

    student.placementStatus = student.placementStatus === "placed" ? "placed" : "applying";
    await student.save();
    ok(res, application, "Application submitted", 201);
  } catch (error) {
    if (error.code === 11000) return fail(res, "You already applied for this job", 409);
    next(error);
  }
};

export const myApplications = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    const applications = await Application.find({ student: student?._id })
      .populate({ path: "job", select: "title location salaryPackage status deadline" })
      .populate("company", "companyName")
      .sort({ createdAt: -1 });
    ok(res, applications, "Student applications fetched");
  } catch (error) {
    next(error);
  }
};

export const companyApplications = async (req, res, next) => {
  try {
    const company = await Company.findOne({ user: req.user._id });
    const filter = { company: company?._id };
    if (req.query.jobId) filter.job = req.query.jobId;
    const applications = await Application.find(filter)
      .populate({ path: "student", populate: { path: "user", select: "name email" } })
      .populate("job", "title")
      .sort({ createdAt: -1 });
    ok(res, applications, "Company applications fetched");
  } catch (error) {
    next(error);
  }
};

export const listApplications = async (req, res, next) => {
  try {
    const applications = await Application.find()
      .populate({ path: "student", populate: { path: "user", select: "name email" } })
      .populate("company", "companyName")
      .populate("job", "title")
      .sort({ createdAt: -1 });
    ok(res, applications, "Applications fetched");
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return fail(res, "Application not found", 404);

    if (req.user.role === "company") {
      const company = await Company.findOne({ user: req.user._id });
      if (!company || !application.company.equals(company._id)) {
        return fail(res, "Cannot update another company's application", 403);
      }
    }

    application.status = req.body.status;
    application.notes = req.body.notes ?? application.notes;
    await application.save();

    if (["shortlisted", "selected"].includes(application.status)) {
      await Student.findByIdAndUpdate(application.student, {
        placementStatus: application.status === "selected" ? "placed" : "shortlisted"
      });
    }

    ok(res, application, "Application status updated");
  } catch (error) {
    next(error);
  }
};

export const deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) return fail(res, "Application not found", 404);
    ok(res, null, "Application deleted");
  } catch (error) {
    next(error);
  }
};
