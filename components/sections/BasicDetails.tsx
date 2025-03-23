"use client";
import { useState } from "react";
import axios from "axios";
import { signOut } from "next-auth/react";
import { Input, Select, SelectItem } from "@heroui/react"; // Import HeroUI components

const BasicDetails = ({ userEmail }: { userEmail: string }) => {
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    specialties: "",
    portfolio: "",
    capacity: "",
    priceRangeMin: "",
    priceRangeMax: "",
    amenities: "",
  });
  const [images, setImages] = useState<File[]>([]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let photoUrls: string[] = [];

      if (images.length > 0) {
        const formDataImages = new FormData();
        images.forEach((image) => formDataImages.append("images", image));

        const { data } = await axios.post("/api/upload", formDataImages, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        photoUrls = data.urls;
      }

      await axios.post("/api/onboard", {
        role,
        ...formData,
        email: userEmail,
        images: photoUrls,
      });

      alert("Onboarding successful! You will be signed out now.");
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Error onboarding:", error);
    }
  };

  // Define role options for the Select component
  const roles = [
    { key: "photographer", label: "Photographer" },
    { key: "decorator", label: "Decorator" },
    { key: "venue_distributor", label: "Venue Distributor" },
    { key: "logistics", label: "Logistics Provider" },
    { key: "entertainment", label: "Entertainment" },
    { key: "caterer", label: "Caterer" },
  ];

  return (
    <div className="max-w-lg mx-auto p-6 bg-white/80 backdrop-blur-xl rounded-lg shadow">
      {/* Role Selection with HeroUI Select */}
      <Select
        label="Select Role"
        placeholder="Choose a role"
        className="w-full"
        value={role}
        onChange={(e) => setRole(e.target.value)} // Note: Check HeroUI docs for exact onChange behavior
      >
        {roles.map((roleOption) => (
          <SelectItem key={roleOption.key} value={roleOption.key}>
            {roleOption.label}
          </SelectItem>
        ))}
      </Select>

      {/* Form Fields with HeroUI Input */}
      <div className="mt-6 space-y-6">
        <Input
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
          type="text"
        />

        <Input
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
          type="tel"
        />

        <Input
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Enter your location"
          type="text"
        />

        {/* Conditional Fields Based on Role */}
        {role === "photographer" && (
          <>
            <Input
              label="Specialties"
              name="specialties"
              value={formData.specialties}
              onChange={handleChange}
              placeholder="e.g., Wedding, Portrait"
              type="text"
            />
          </>
        )}

        {role === "decorator" && (
          <Input
            label="Specialties"
            name="specialties"
            value={formData.specialties}
            onChange={handleChange}
            placeholder="e.g., Floral, Lighting"
            type="text"
          />
        )}

        {role === "venue_distributor" && (
          <>
            <Input
              label="Capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="e.g., 200"
              type="number"
            />
            <div className="flex gap-4">
              <Input
                label="Price Range (Min)"
                name="priceRangeMin"
                value={formData.priceRangeMin}
                onChange={handleChange}
                placeholder="Min price"
                type="number"
              />
              <Input
                label="Price Range (Max)"
                name="priceRangeMax"
                value={formData.priceRangeMax}
                onChange={handleChange}
                placeholder="Max price"
                type="number"
              />
            </div>
            <Input
              label="Amenities (comma-separated)"
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
              placeholder="e.g., Parking, WiFi"
              type="text"
            />
          </>
        )}

        {/* File Upload - Using regular input since HeroUI doesn’t support file */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Upload Photos (max 5):
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              if (files.length > 5) {
                alert("You can only upload up to 5 images.");
              } else {
                setImages(files);
              }
            }}
            className="w-full p-2 border rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="mt-6 w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        Submit
      </button>
    </div>
  );
};

export default BasicDetails;
