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
  images: string[];
}

const PhotographerSchema = new Schema<IPhotographer>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  specialties: { type: [String], required: true },
  portfolio: { type: [String], required: false },
  priceRange: {
    min: { type: Number, required: false },
    max: { type: Number, required: false },
  },
  availability: { type: Boolean, default: true },
  ratings: { type: Number, default: 0 },
  images: { type: [String], default: [] },
});

export default mongoose.models.Photographer ||
  mongoose.model<IPhotographer>("Photographer", PhotographerSchema);
