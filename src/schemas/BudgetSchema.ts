import mongoose, { Schema, Document } from "mongoose";

interface IBudget extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  monthlyBudget: number;
  dailyBudget: number;
  usedBudget: number;
  createdAt: Date;
  updatedAt: Date;
}

const BudgetSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  monthlyBudget: { type: Number, required: true },
  dailyBudget: { type: Number, required: true }, // This can be auto-calculated
  usedBudget: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IBudget>("Budget", BudgetSchema);
