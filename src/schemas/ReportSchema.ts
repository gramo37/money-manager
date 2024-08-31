import mongoose, { Schema, Document } from "mongoose";

interface IReport extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  type: "PDF" | "Excel";
  period: string;
  filePath: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["PDF", "Excel"], required: true },
  period: { type: String, required: true },
  filePath: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IReport>("Report", ReportSchema);
