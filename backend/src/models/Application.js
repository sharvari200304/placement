import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
    resumeUrl: { type: String, trim: true },
    coverLetter: { type: String, trim: true },
    status: {
      type: String,
      enum: ["applied", "reviewing", "shortlisted", "rejected", "selected"],
      default: "applied"
    },
    notes: { type: String, trim: true },
    appliedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

applicationSchema.index({ student: 1, job: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);
