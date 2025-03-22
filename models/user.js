import mongoose, { Schema, models } from "mongoose";

// Define the main user schema
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  role: { type: String, enum: ["user", "vendor"], default: "user" },
  onboard: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  lastName: { type: String, required: false, default: "" },
  cart: [{ type: Schema.Types.ObjectId, ref: "Vendor" }], // Add cart field
});

const User = models.User || mongoose.model("User", userSchema);
export default User;
