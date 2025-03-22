"use client";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Image,
} from "@heroui/react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

// Define the expected shape of the props
interface Vendor {
  _id?: string;
  location?: string;
  imageUrl?: string;
}

interface CardMineProps {
  vendor?: Vendor;
  serviceName: string;
  serviceHref: string;
}

function CardMine({ vendor, serviceName, serviceHref }: CardMineProps) {
  const router = useRouter(); // Initialize router for navigation
  const [collections, setCollections] = useState<any[]>([]);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [showPrompt, setShowPrompt] = useState(false);

  const fetchCollections = async () => {
    try {
      const { data } = await axios.get("/api/collections/get");
      setCollections(data.collections);
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  };

  const addToCollection = async () => {
    if (!selectedCollection || !vendor?._id) return;
    try {
      await axios.post("/api/collections/addVendor", {
        collectionId: selectedCollection,
        vendorId: vendor._id,
      });
      setShowPrompt(false);
    } catch (error) {
      console.error("Failed to add vendor to collection:", error);
    }
  };

  const handleCardClick = () => {
    if (!showPrompt) {
      router.push(serviceHref);
    }
  };

  // If no serviceName is provided, show a loading/placeholder state
  if (!serviceName) {
    return (
      <Card isFooterBlurred isPressable className="w-full h-[300px]" isBlurred>
        <CardHeader className="absolute z-10 top-1 flex-col items-start bg-white/30 blur-xs">
          <p className="text-tiny text-white/60 uppercase font-bold">Service</p>
          <h4 className="text-black font-medium text-2xl">Loading...</h4>
        </CardHeader>
        <Image
          removeWrapper
          alt="Loading placeholder"
          className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
          src="https://heroui.com/images/card-example-6.jpeg"
        />
      </Card>
    );
  }

  return (
    <Card
      isFooterBlurred
      isPressable
      onPress={handleCardClick} // Add navigation on card click
      className="w-full h-[300px]"
      isBlurred
    >
      <CardHeader className="absolute z-10 top-1 flex-col items-start bg-white/30 blur-xs">
        <p className="text-tiny text-white/60 uppercase font-bold">Service</p>
        <h4 className="text-black font-medium text-2xl">{serviceName}</h4>
      </CardHeader>

      <Image
        removeWrapper
        alt={`${serviceName} background`}
        className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
        src={
          vendor?.imageUrl || "https://heroui.com/images/card-example-6.jpeg"
        }
      />

      {showPrompt ? (
        <CardBody className="absolute z-20 bg-white/90 p-4 flex flex-col gap-2">
          <label className="text-black text-sm">Select Collection:</label>
          <select
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
            className="p-2 border rounded w-full text-black"
          >
            <option value="">Select...</option>
            {collections.map((col) => (
              <option key={col._id} value={col._id}>
                {col.name}
              </option>
            ))}
          </select>
          <Button color="success" size="sm" onPress={addToCollection}>
            Add
          </Button>
        </CardBody>
      ) : (
        <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
          <div>
            <p className="text-black text-tiny">
              {vendor?.location || "Location not available"}
            </p>
            <p className="text-black text-tiny">Click to add to collection</p>
          </div>
          <Button
            className="text-tiny"
            color="primary"
            radius="full"
            size="sm"
            onPress={(e) => {
              e.stopPropagation(); // Prevent card click from triggering
              setShowPrompt(true);
              fetchCollections();
            }}
          >
            Add to Collection
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export default CardMine;
