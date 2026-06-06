import { body } from "express-validator";

export const studentProfileValidator = [
  body("cgpa").optional({ nullable: true, checkFalsy: true }).isFloat({ min: 0, max: 10 }).withMessage("CGPA must be between 0 and 10"),
  body("graduationYear").optional({ nullable: true, checkFalsy: true }).isInt({ min: 2000, max: 2100 }).withMessage("Graduation year is invalid"),
  body("resumeUrl").optional({ checkFalsy: true }).isURL().withMessage("Resume must be a valid URL"),
  body("portfolioUrl").optional({ checkFalsy: true }).isURL().withMessage("Portfolio must be a valid URL")
];

export const companyProfileValidator = [
  body("companyName").trim().notEmpty().withMessage("Company name is required"),
  body("website").optional({ checkFalsy: true }).isURL().withMessage("Website must be a valid URL")
];

export const jobValidator = [
  body("title").trim().notEmpty().withMessage("Job title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("deadline").isISO8601().withMessage("Deadline must be a valid date"),
  body("eligibility.minCgpa").optional({ nullable: true }).isFloat({ min: 0, max: 10 }).withMessage("Minimum CGPA must be between 0 and 10")
];

export const applicationValidator = [
  body("resumeUrl").optional({ checkFalsy: true }).isURL().withMessage("Resume must be a valid URL")
];

export const applicationStatusValidator = [
  body("status").isIn(["applied", "reviewing", "shortlisted", "rejected", "selected"]).withMessage("Invalid status")
];
