import express from "express";
import {
  deleteStudentById,
  getMyStudentProfile,
  getStudentById,
  listStudents,
  updateMyStudentProfile,
  updateStudentById
} from "../controllers/studentController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import { studentProfileValidator } from "../validators/domainValidators.js";

const router = express.Router();

router.get("/me", protect, authorize("student"), getMyStudentProfile);
router.put("/me", protect, authorize("student"), studentProfileValidator, validate, updateMyStudentProfile);
router.get("/", protect, authorize("admin"), listStudents);
router.get("/:id", protect, authorize("admin"), getStudentById);
router.put("/:id", protect, authorize("admin"), studentProfileValidator, validate, updateStudentById);
router.delete("/:id", protect, authorize("admin"), deleteStudentById);

export default router;
