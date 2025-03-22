"use client";
import React, { useState } from "react";
import { Select, SelectItem } from "@heroui/react";
import axios from "axios";
import { useSession } from "next-auth/react";

// List of Indian states
export const indianStates = [
  { key: "andhra-pradesh", label: "Andhra Pradesh" },
  { key: "arunachal-pradesh", label: "Arunachal Pradesh" },
  { key: "assam", label: "Assam" },
  { key: "bihar", label: "Bihar" },
  { key: "chhattisgarh", label: "Chhattisgarh" },
  { key: "goa", label: "Goa" },
  { key: "gujarat", label: "Gujarat" },
  { key: "haryana", label: "Haryana" },
  { key: "himachal-pradesh", label: "Himachal Pradesh" },
  { key: "jharkhand", label: "Jharkhand" },
  { key: "karnataka", label: "Karnataka" },
  { key: "kerala", label: "Kerala" },
  { key: "madhya-pradesh", label: "Madhya Pradesh" },
  { key: "maharashtra", label: "Maharashtra" },
  { key: "manipur", label: "Manipur" },
  { key: "meghalaya", label: "Meghalaya" },
  { key: "mizoram", label: "Mizoram" },
  { key: "nagaland", label: "Nagaland" },
  { key: "odisha", label: "Odisha" },
  { key: "punjab", label: "Punjab" },
  { key: "rajasthan", label: "Rajasthan" },
  { key: "sikkim", label: "Sikkim" },
  { key: "tamil-nadu", label: "Tamil Nadu" },
  { key: "telangana", label: "Telangana" },
  { key: "tripura", label: "Tripura" },
  { key: "uttar-pradesh", label: "Uttar Pradesh" },
  { key: "uttarakhand", label: "Uttarakhand" },
  { key: "west-bengal", label: "West Bengal" },
];

export default function LocationSelector() {
  const { data: session } = useSession();
  const [selectedLocation, setSelectedLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLocationChange = async (value: string) => {
    if (!session?.user?.email) {
      setError("Please log in to update your location");
      return;
    }

    setSelectedLocation(value);
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.patch("/api/user/location", {
        email: session.user.email,
        location: indianStates.find((state) => state.key === value)?.label,
      });

      if (response.status === 200) {
        console.log("Location updated successfully");
      }
    } catch (err) {
      setError("Failed to update location");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <Select
        items={indianStates}
        label="Select Your Location"
        placeholder="Choose a state"
        className="w-full"
        onChange={(e) => handleLocationChange(e.target.value)}
        isDisabled={isLoading || !session}
        value={selectedLocation}
      >
        {(state) => <SelectItem key={state.key}>{state.label}</SelectItem>}
      </Select>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {isLoading && <p className="text-gray-500 mt-2">Updating location...</p>}
    </div>
  );
}
