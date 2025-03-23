"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Image,
  Avatar,
  Select,
  SelectItem,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";

interface Vendor {
  _id: string;
  email?: string;
  location?: string;
  images?: string[];
  name?: string;
}

interface VendorCardProps {
  vendor: Vendor;
  serviceName: string;
  serviceHref: string;
}

function VendorCard({ vendor, serviceName, serviceHref }: VendorCardProps) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [vendorImage, setVendorImage] = useState<string>("");
  const { status, data: session } = useSession();
  const [collections, setCollections] = useState<any[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>("");

  const images = vendor.images?.length
    ? vendor.images
    : ["https://heroui.com/images/card-example-6.jpeg"];

  // Fetch collections
  // Fetch collections periodically
  useEffect(() => {
    const fetchCollections = async () => {
      if (status !== "authenticated") return;

      try {
        const { data } = await axios.get("/api/collections/get");
        setCollections(data.collections || []);
      } catch (error) {
        console.error("Failed to fetch collections:", error);
      }
    };

    fetchCollections(); // Initial fetch

    const interval = setInterval(() => {
      fetchCollections();
    }, 40000); // Fetch every 2 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [status]);

  // Cycle through images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Fetch avatar for vendor
  useEffect(() => {
    const fetchVendorImage = async () => {
      if (!vendor.email) return;

      try {
        const res = await fetch(`/api/getUserByEmail?email=${vendor.email}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.user?.image) {
            setVendorImage(data.user.image);
          }
        } else {
          console.warn("Could not fetch vendor avatar");
        }
      } catch (err) {
        console.error("Error fetching vendor image:", err);
      }
    };

    fetchVendorImage();
  }, [vendor.email]);

  const handleCardClick = () => {
    router.push(serviceHref);
  };

  const handleAddToCollection = async () => {
    if (!selectedCollection || !session) return;

    try {
      await axios.post("/api/collections/add-vendor", {
        collectionId: selectedCollection,
        vendorId: vendor._id,
        serviceType: serviceName, // Assuming serviceName matches serviceType
      });
      alert("Vendor added to collection successfully!");
    } catch (error) {
      console.error("Error adding vendor to collection:", error);
      alert("Failed to add vendor to collection.");
    }
  };

  return (
    <Card isFooterBlurred className="w-full h-[300px]" isBlurred>
      <div className="flex gap-5">
        <CardHeader className="justify-start bg-white/50">
          <Avatar isBordered radius="full" size="md" src={vendorImage || ""} />
          <div className="flex flex-col gap-1 items-start justify-center ml-4">
            <h4 className="text-xl font-semibold leading-none text-black">
              {vendor.name || "Unknown Vendor"}
            </h4>
            <h5 className="text-small tracking-tight text-default-400">
              {vendor.email ? `@${vendor.email.split("@")[0]}` : "@unknown"}
            </h5>
          </div>
        </CardHeader>
      </div>

      <Image
        removeWrapper
        alt={`${vendor.name || serviceName} image`}
        className="z-0 w-full h-full scale-125 -translate-y-6 object-cover transition-opacity duration-500"
        src={images[currentImageIndex]}
      />

      <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {/* Select Component for Collections */}
          <Select
            label="Add to Collection"
            placeholder="Select a collection"
            className="w-40" // Adjust width as needed
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
          >
            {collections.map((collection) => (
              <SelectItem key={collection._id} value={collection._id}>
                {collection.name}
              </SelectItem>
            ))}
          </Select>

          {/* Add to Collection Button */}
          <Button
            size="sm"
            className="bg-black"
            onClick={handleAddToCollection}
            disabled={!selectedCollection}
          >
            Add
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default VendorCard;
