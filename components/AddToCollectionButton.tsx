import { useState, useEffect } from "react";
import axios from "axios";

export const AddToCollectionButton = ({ vendorId }) => {
  const [collections, setCollections] = useState<
    { _id: string; name: string }[]
  >([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    axios.get("/api/collections/get").then(({ data }) => {
      setCollections(data.collections);
    });
  }, []);

  const handleAddToCollection = async (collectionId) => {
    await axios.post("/api/collections/add-vendor", {
      collectionId,
      vendorId,
    });
    setShowDropdown(false);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setShowDropdown((prev) => !prev)}
        className="bg-green-600 text-white px-3 py-1 rounded"
      >
        + Add to Collection
      </button>

      {showDropdown && (
        <div className="absolute mt-2 bg-white shadow-md border rounded z-10">
          {collections.map((col) => (
            <button
              key={col._id}
              onClick={() => handleAddToCollection(col._id)}
              className="block px-4 py-2 text-left w-full hover:bg-gray-100"
            >
              {col.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
