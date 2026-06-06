import Student from "../models/Student.js";
import Application from "../models/Application.js";
import { fail, ok } from "../utils/apiResponse.js";

export const getMyStudentProfile = async (req, res, next) => {
  try {
    const profile = await Student.findOne({ user: req.user._id }).populate("user", "name email role");
    ok(res, profile, "Student profile");
  } catch (error) {
    next(error);
  }
};

export const updateMyStudentProfile = async (req, res, next) => {
  try {
    const profile = await Student.findOneAndUpdate(
      { user: req.user._id },
      req.body,
      { new: true, runValidators: true, upsert: true }
    ).populate("user", "name email role");
    ok(res, profile, "Student profile updated");
  } catch (error) {
    next(error);
  }
};

export const listStudents = async (req, res, next) => {
  try {
    const students = await Student.find().populate("user", "name email isActive").sort({ createdAt: -1 });
    ok(res, students, "Students fetched");
  } catch (error) {
    next(error);
  }
};

export const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).populate("user", "name email isActive");
    if (!student) return fail(res, "Student not found", 404);
    ok(res, student, "Student fetched");
  } catch (error) {
    next(error);
  }
};

export const updateStudentById = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!student) return fail(res, "Student not found", 404);
    ok(res, student, "Student updated");
  } catch (error) {
    next(error);
  }
};

export const deleteStudentById = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return fail(res, "Student not found", 404);
    await Application.deleteMany({ student: student._id });
    ok(res, null, "Student and related applications deleted");
  } catch (error) {
    next(error);
  }
};
