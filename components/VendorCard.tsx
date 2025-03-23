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
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AddToCollectionButton } from "./AddToCollectionButton";

interface Vendor {
  _id: string;
  email?: string;
  location?: string;
  images?: string[];
  name?: string;
}

interface PhotographerCardProps {
  vendor: Vendor;
  serviceName: string;
  serviceHref: string;
}

function PhotographerCard({
  vendor,
  serviceName,
  serviceHref,
}: PhotographerCardProps) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [vendorImage, setVendorImage] = useState<string>("");
  const { status, data: session } = useSession();

  const images = vendor.images?.length
    ? vendor.images
    : ["https://heroui.com/images/card-example-6.jpeg"];

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

      <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
        <div>
          <p className="text-black text-tiny">
            {vendor.location || "Location not available"}
          </p>
          <p className="text-black text-tiny">Click to view profile</p>
          <AddToCollectionButton vendorId={vendor._id} />
        </div>
        <div className="flex gap-1">
          {images.map((_, idx) => (
            <span
              key={idx}
              className={`w-2 h-2 rounded-full ${
                idx === currentImageIndex ? "bg-black" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}

export default PhotographerCard;
