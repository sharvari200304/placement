import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    rollNumber: { type: String, trim: true },
    department: { type: String, trim: true },
    graduationYear: Number,
    cgpa: { type: Number, min: 0, max: 10 },
    skills: [{ type: String, trim: true }],
    phone: { type: String, trim: true },
    resumeUrl: { type: String, trim: true },
    portfolioUrl: { type: String, trim: true },
    placementStatus: {
      type: String,
      enum: ["not_applied", "applying", "shortlisted", "placed"],
      default: "not_applied"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
