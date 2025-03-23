import mongoose, { Schema, Document } from "mongoose";

interface IVenue extends Document {
  name: string;
  email: string;
  phone: string;
  location: string;
  specialties: string[];
  availability: boolean;
  ratings: number;
  images: string[];
}

const VenueSchema = new Schema<IVenue>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  specialties: { type: [String], required: true },
  availability: { type: Boolean, default: true },
  ratings: { type: Number, default: 0 },
  images: { type: [String], default: [] },
});

export default mongoose.models.Venue ||
  mongoose.model<IVenue>("Venue", VenueSchema);
