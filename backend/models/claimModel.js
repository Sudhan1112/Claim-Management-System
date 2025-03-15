import { Schema, model } from "mongoose";

const claimSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    claimAmount: { type: Number, required: true },
    description: { type: String, required: true },
    documentUrl: { type: String },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    insurerComments: { type: String },
    approvedAmount: { type: Number },
  },
  { timestamps: true }
);

export default model("Claim", claimSchema);
