import mongoose from "mongoose";

const caseStudySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    outcome: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const lawyerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    experienceYears: { type: Number, default: 0 },
    experienceLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Experienced"],
      default: "Beginner",
    },
    specialization: {
      type: [
        {
          type: String,
          enum: [
            "Criminal Law",
            "Civil Law",
            "Family Law",
            "Corporate Law",
            "Property Law",
            "Cyber Law",
          ],
        },
      ],
      default: [],
    },
    bio: { type: String, default: "" },
    caseStudies: { type: [caseStudySchema], default: [] },
    pricing: {
      type: String,
      enum: ["Low Cost", "Medium", "Premium"],
      default: "Low Cost",
    },
    availability: { type: Boolean, default: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

lawyerProfileSchema.index({ approvalStatus: 1, rating: -1, experienceYears: -1 });
lawyerProfileSchema.index({ approvalStatus: 1, specialization: 1 });
lawyerProfileSchema.index({ approvalStatus: 1, experienceLevel: 1, pricing: 1, availability: 1 });

const LawyerProfile = mongoose.model("LawyerProfile", lawyerProfileSchema);
export default LawyerProfile;
