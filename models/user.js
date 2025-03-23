import mongoose, { Schema, models } from "mongoose";

// Define the schema for a vendor entry
const vendorEntrySchema = new Schema(
  {
    refId: { type: Schema.Types.ObjectId, required: true },
    serviceType: { type: String, required: true },
  },
  { _id: false }
);

// Define the schema for a collection
const collectionSchema = new Schema(
  {
    name: { type: String, required: true },
    vendors: [vendorEntrySchema],
  },
  { _id: true }
);

// Define the main user schema
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  location: { type: String, required: false },
  role: { type: String, enum: ["user", "vendor"], default: "user" },
  onboard: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  lastName: { type: String, required: false, default: "" },
  image: { type: String, default: null },
  collections: [collectionSchema],
});

const User = models.User || mongoose.model("User", userSchema);
export default User;
