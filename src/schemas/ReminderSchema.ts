import mongoose, { Schema, Document } from "mongoose";

interface IReminder extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  interval: "daily" | "weekly" | "monthly" | "custom";
  customInterval?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReminderSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  interval: {
    type: String,
    enum: ["daily", "weekly", "monthly", "custom"],
    required: true,
  },
  customInterval: { type: Number, default: null }, // If custom is selected
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IReminder>("Reminder", ReminderSchema);
