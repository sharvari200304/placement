import express from "express";
import {
  deleteCompanyById,
  getCompanyById,
  getMyCompanyProfile,
  listCompanies,
  updateCompanyById,
  updateMyCompanyProfile
} from "../controllers/companyController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import { companyProfileValidator } from "../validators/domainValidators.js";

const router = express.Router();

router.get("/me", protect, authorize("company"), getMyCompanyProfile);
router.put("/me", protect, authorize("company"), companyProfileValidator, validate, updateMyCompanyProfile);
router.get("/", protect, authorize("admin"), listCompanies);
router.get("/:id", protect, authorize("admin"), getCompanyById);
router.put("/:id", protect, authorize("admin"), companyProfileValidator, validate, updateCompanyById);
router.delete("/:id", protect, authorize("admin"), deleteCompanyById);

export default router;
