import mongoose, { Schema } from "mongoose";

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "employee" | "guest";
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "manager", "employee", "guest"],
    default: "guest",
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const UserModel = mongoose.model<IUser>("user", UserSchema);

export default UserModel;
