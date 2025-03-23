// app/cart/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Avatar,
} from "@heroui/react";
import axios from "axios";
import { useSession } from "next-auth/react";

interface Vendor {
  _id: string;
  name: string;
  serviceType: string;
  // Add more fields as needed based on your service models
}

interface Collection {
  _id: string;
  name: string;
  vendors: Vendor[];
}

const CartPage = () => {
  const { status, data: session } = useSession();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch collections
  useEffect(() => {
    const fetchCollections = async () => {
      if (status !== "authenticated") return;

      try {
        setLoading(true);
        const { data } = await axios.get("/api/collections/get");
        setCollections(data.collections || []);
      } catch (error) {
        console.error("Failed to fetch collections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [status]);

  if (status === "loading" || loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (status !== "authenticated") {
    return (
      <div className="text-center py-10">Please sign in to view your cart.</div>
    );
  }
  const handleRemoveVendor = async (collectionId: string, vendorId: string) => {
    try {
      await axios.post("/api/collections/remove-vendor", {
        collectionId,
        vendorId,
      });
      // Refresh collections after removal
      const { data } = await axios.get("/api/collections/get");
      setCollections(data.collections || []);
      alert("Vendor removed successfully!");
    } catch (error) {
      console.error("Error removing vendor:", error);
      alert("Failed to remove vendor.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      {collections.length === 0 ? (
        <p className="text-gray-500">No collections found.</p>
      ) : (
        collections.map((collection) => (
          <section key={collection._id} className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">
              {collection.name} ({collection.vendors.length} items)
            </h2>
            {collection.vendors.length === 0 ? (
              <p className="text-gray-500 italic">
                No vendors in this collection yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {collection.vendors.map((vendor) => (
                  <Card key={vendor._id} className="w-full">
                    <CardHeader className="flex gap-3">
                      <div className="flex flex-col">
                        <p className="text-md font-semibold">{vendor.name}</p>
                        <p className="text-sm text-gray-500">
                          {vendor.serviceType}
                        </p>
                      </div>
                    </CardHeader>
                    <CardBody>
                      <p className="text-sm">
                        {/* Add more vendor details here if available */}
                        Service: {vendor.serviceType}
                      </p>
                    </CardBody>
                    <CardFooter className="justify-end">
                      <Button
                        size="sm"
                        color="danger"
                        onClick={() =>
                          handleRemoveVendor(collection._id, vendor._id)
                        }
                      >
                        Remove
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </section>
        ))
      )}
    </div>
  );
};

// Function to remove a vendor from a collection

export default CartPage;
