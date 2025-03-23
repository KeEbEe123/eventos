import mongoose, { Schema, Document } from "mongoose";

interface IDecorator extends Document {
  name: string;
  email: string;
  phone: string;
  location: string;
  specialties: string[];
  availability: boolean;
  ratings: number;
  photos: string[];
  images: string[];
}

const DecoratorSchema = new Schema<IDecorator>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  specialties: { type: [String], required: true },
  availability: { type: Boolean, default: true },
  ratings: { type: Number, default: 0 },
  photos: { type: [String], default: [] },
  images: { type: [String], default: [] },
});

export default mongoose.models.Decorator ||
  mongoose.model<IDecorator>("Decorator", DecoratorSchema);
