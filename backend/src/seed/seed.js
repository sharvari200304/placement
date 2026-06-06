import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Application from "../models/Application.js";
import Company from "../models/Company.js";
import Job from "../models/Job.js";
import Student from "../models/Student.js";
import User from "../models/User.js";

dotenv.config();

const run = async () => {
  await connectDB();
  await Promise.all([
    Application.deleteMany(),
    Job.deleteMany(),
    Student.deleteMany(),
    Company.deleteMany(),
    User.deleteMany()
  ]);

  const admin = await User.create({
    name: "Placement Admin",
    email: "admin@placement.local",
    password: "Password123!",
    role: "admin"
  });

  const studentUser = await User.create({
    name: "Aarav Sharma",
    email: "student@placement.local",
    password: "Password123!",
    role: "student"
  });

  const companyUser = await User.create({
    name: "TechSpire HR",
    email: "hr@techspire.local",
    password: "Password123!",
    role: "company"
  });

  const student = await Student.create({
    user: studentUser._id,
    rollNumber: "CSE2026-018",
    department: "Computer Science",
    graduationYear: 2026,
    cgpa: 8.7,
    skills: ["React", "Node.js", "MongoDB"],
    phone: "+91-9876543210",
    resumeUrl: "https://example.com/resumes/aarav.pdf",
    placementStatus: "applying"
  });

  const company = await Company.create({
    user: companyUser._id,
    companyName: "TechSpire Labs",
    industry: "SaaS",
    website: "https://example.com",
    location: "Bengaluru",
    description: "Product engineering company hiring full-stack graduates.",
    contactPerson: "Priya Menon",
    phone: "+91-9000000000",
    isVerified: true
  });

  const job = await Job.create({
    company: company._id,
    title: "Full Stack Developer",
    description: "Build production-grade web applications using React, Node.js, and MongoDB.",
    roleType: "full_time",
    location: "Bengaluru",
    salaryPackage: "12 LPA",
    eligibility: {
      minCgpa: 7,
      departments: ["Computer Science", "Information Technology"],
      graduationYears: [2026]
    },
    skillsRequired: ["React", "Node.js", "Express", "MongoDB"],
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    status: "open"
  });

  await Application.create({
    student: student._id,
    job: job._id,
    company: company._id,
    resumeUrl: student.resumeUrl,
    coverLetter: "I am excited to apply for this full-stack role.",
    status: "shortlisted"
  });

  console.log("Seed complete");
  console.log("Admin:", admin.email);
  console.log("Student:", studentUser.email);
  console.log("Company:", companyUser.email);
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
