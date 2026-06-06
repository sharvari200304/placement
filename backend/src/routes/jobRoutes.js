import express from "express";
import {
  createJob,
  deleteJob,
  getJob,
  listJobs,
  myCompanyJobs,
  updateJob
} from "../controllers/jobController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import { jobValidator } from "../validators/domainValidators.js";

const router = express.Router();

router.get("/", protect, listJobs);
router.get("/mine", protect, authorize("company"), myCompanyJobs);
router.get("/:id", protect, getJob);
router.post("/", protect, authorize("company"), jobValidator, validate, createJob);
router.put("/:id", protect, authorize("company", "admin"), jobValidator, validate, updateJob);
router.delete("/:id", protect, authorize("company", "admin"), deleteJob);

export default router;
