import mongoose, { Schema, Document } from "mongoose";

interface IPhotographer extends Document {
  name: string;
  email: string;
  phone: string;
  location: string;
  specialties: string[];
  portfolio: string[]; // Array of URLs
  priceRange: { min: number; max: number };
  availability: boolean;
  ratings: number; // Average rating
}

const PhotographerSchema = new Schema<IPhotographer>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  specialties: { type: [String], required: true },
  portfolio: { type: [String], required: false },
  priceRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  availability: { type: Boolean, default: true },
  ratings: { type: Number, default: 0 },
});

export default mongoose.models.Photographer ||
  mongoose.model<IPhotographer>("Photographer", PhotographerSchema);
