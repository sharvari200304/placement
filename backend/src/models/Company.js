import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    companyName: { type: String, required: true, trim: true },
    industry: { type: String, trim: true },
    website: { type: String, trim: true },
    location: { type: String, trim: true },
    description: { type: String, trim: true },
    contactPerson: { type: String, trim: true },
    phone: { type: String, trim: true },
    isVerified: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Company", companySchema);
