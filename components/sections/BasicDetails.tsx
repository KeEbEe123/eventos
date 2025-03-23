import { useState } from "react";
import axios from "axios";
import { signOut } from "next-auth/react";

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
        images.forEach((image) => formDataImages.append("images", image)); // key must be 'images'

        const { data } = await axios.post("/api/upload", formDataImages, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        photoUrls = data.urls; // Now this will correctly contain the uploaded image URLs
      }

      await axios.post("/api/onboard", {
        role,
        ...formData,
        email: userEmail,
        images: photoUrls, // Send the correct URLs to your DB
      });

      alert("Onboarding successful! You will be signed out now.");
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Error onboarding:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Vendor Onboarding</h2>
      <label className="block mb-2">Select Role:</label>
      <select
        name="role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="">Choose a role</option>
        <option value="photographer">Photographer</option>
        <option value="decorator">Decorator</option>
        <option value="venue_distributor">Venue Distributor</option>
        <option value="logistics">Logistics Provider</option>
        <option value="entertainment">Entertainment</option>
        <option value="caterer">Caterer</option>
      </select>

      <div className="mt-4">
        <label className="block mb-2">Name:</label>
        <input
          type="text"
          name="name"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <label className="block mt-4 mb-2">Phone:</label>
        <input
          type="text"
          name="phone"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <label className="block mt-4 mb-2">Location:</label>
        <input
          type="text"
          name="location"
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        {role === "photographer" && (
          <>
            <label className="block mt-4 mb-2">Specialties:</label>
            <input
              type="text"
              name="specialties"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <label className="block mt-4 mb-2">
              Portfolio (comma-separated URLs):
            </label>
            <input
              type="text"
              name="portfolio"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </>
        )}

        {role === "decorator" && (
          <>
            <label className="block mt-4 mb-2">Specialties:</label>
            <input
              type="text"
              name="specialties"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </>
        )}

        {role === "venue_distributor" && (
          <>
            <label className="block mt-4 mb-2">Capacity:</label>
            <input
              type="number"
              name="capacity"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <label className="block mt-4 mb-2">Price Range:</label>
            <input
              type="number"
              name="priceRangeMin"
              placeholder="Min"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="number"
              name="priceRangeMax"
              placeholder="Max"
              onChange={handleChange}
              className="w-full p-2 border rounded mt-2"
            />
            <label className="block mt-4 mb-2">
              Amenities (comma-separated):
            </label>
            <input
              type="text"
              name="amenities"
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </>
        )}
      </div>
      <label className="block mt-4 mb-2">Upload Photos (max 5):</label>
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
        className="w-full"
      />

      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
    </div>
  );
};

export default BasicDetails;
