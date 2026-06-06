import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    roleType: { type: String, enum: ["internship", "full_time", "contract"], default: "full_time" },
    location: { type: String, required: true, trim: true },
    salaryPackage: { type: String, trim: true },
    eligibility: {
      minCgpa: { type: Number, min: 0, max: 10, default: 0 },
      departments: [{ type: String, trim: true }],
      graduationYears: [Number]
    },
    skillsRequired: [{ type: String, trim: true }],
    deadline: { type: Date, required: true },
    status: { type: String, enum: ["open", "closed"], default: "open" }
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
