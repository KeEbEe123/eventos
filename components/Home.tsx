"use client";
import React from "react";
import { useState } from "react";
import axios from "axios";

const Home = () => {
  const [eventDescription, setEventDescription] = useState("");
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/recommend", { eventDescription });
      setRecommendations(data.recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Plan Your Event with AI</h1>
      <textarea
        className="w-full p-3 border rounded"
        rows={4}
        placeholder="Describe your event (e.g., 'Wedding for 200 guests in Mumbai with a budget of ₹5,00,000')"
        value={eventDescription}
        onChange={(e) => setEventDescription(e.target.value)}
      />
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Get AI Recommendations"}
      </button>

      {recommendations && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold">Recommended Photographers</h2>
          <ul className="mt-2">
            {recommendations.photographers.map((p: any) => (
              <li key={p._id} className="p-2 border rounded mt-2">
                {p.name} - {p.location} (⭐ {p.ratings})
              </li>
            ))}
          </ul>

          <h2 className="text-2xl font-semibold mt-4">
            Recommended Decorators
          </h2>
          <ul className="mt-2">
            {recommendations.decorators.map((d: any) => (
              <li key={d._id} className="p-2 border rounded mt-2">
                {d.name} - {d.location} (⭐ {d.ratings})
              </li>
            ))}
          </ul>

          <h2 className="text-2xl font-semibold mt-4">Recommended Venues</h2>
          <ul className="mt-2">
            {recommendations.venues.map((v: any) => (
              <li key={v._id} className="p-2 border rounded mt-2">
                {v.name} - {v.location} (Capacity: {v.capacity}, ₹
                {v.pricePerHour}/hr)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Home;
