import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lawyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["call", "email", "meeting"],
      required: true,
    },
    message: { type: String, required: true, trim: true },
    scheduledAt: { type: Date },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    responseMessage: { type: String, default: "" },
  },
  { timestamps: true }
);

inquirySchema.index({ lawyerId: 1, createdAt: -1 });
inquirySchema.index({ customerId: 1, createdAt: -1 });
inquirySchema.index({ lawyerId: 1, status: 1, createdAt: -1 });

const Inquiry = mongoose.model("Inquiry", inquirySchema);
export default Inquiry;
