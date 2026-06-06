import express from "express";
import {
  applyToJob,
  companyApplications,
  deleteApplication,
  listApplications,
  myApplications,
  updateApplicationStatus
} from "../controllers/applicationController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import { applicationStatusValidator, applicationValidator } from "../validators/domainValidators.js";

const router = express.Router();

router.post("/jobs/:jobId", protect, authorize("student"), applicationValidator, validate, applyToJob);
router.get("/mine", protect, authorize("student"), myApplications);
router.get("/company", protect, authorize("company"), companyApplications);
router.get("/", protect, authorize("admin"), listApplications);
router.put("/:id/status", protect, authorize("company", "admin"), applicationStatusValidator, validate, updateApplicationStatus);
router.delete("/:id", protect, authorize("admin"), deleteApplication);

export default router;
