"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { TbArrowLeft, TbArrowRight } from "react-icons/tb";

const Sidebar = () => {
  const [collections, setCollections] = useState<any[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");

  useEffect(() => {
    fetchCollections();
    const interval = setInterval(() => {
      fetchCollections();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchCollections = async () => {
    try {
      const { data } = await axios.get("/api/collections/get");
      setCollections(data.collections);
    } catch (error) {
      console.error("Failed to fetch collections:", error);
    }
  };

  const addCollection = async () => {
    if (!newCollectionName) return;
    try {
      await axios.post("/api/collections/add", { name: newCollectionName });
      setNewCollectionName("");
      fetchCollections();
    } catch (error) {
      console.error("Error adding collection:", error);
    }
  };

  return (
    <div
      className={`fixed top-20 right-0 z-50 h-[80%] transition-all duration-300 shadow-xl ${
        collapsed ? "w-12 bg-transparent" : "w-80 bg-gray-200"
      }`}
    >
      {/* Drag Handle */}
      <div className="bg-gray-500 text-white p-2 cursor-pointer rounded-t flex justify-center">
        <button onClick={() => setCollapsed(!collapsed)} className="text-2xl">
          {collapsed ? <TbArrowLeft /> : <TbArrowRight />}
        </button>
      </div>

      {!collapsed && (
        <div className="p-4 w-full max-h-[calc(100vh-48px)] overflow-y-auto rounded-b-lg">
          <h2 className="text-xl font-bold">Your Collections</h2>
          <ul className="mt-4 space-y-4">
            {collections.map((col) => (
              <li key={col._id} className="p-3 border rounded bg-white shadow">
                <h3 className="font-semibold text-lg mb-2">{col.name}</h3>
                {col.vendors.length > 0 ? (
                  <ul className="pl-2 space-y-1">
                    {col.vendors.map((vendor: any) => (
                      <li key={vendor._id} className="text-sm text-gray-700">
                        <span className="font-medium">{vendor.name}</span> –{" "}
                        <span className="italic">{vendor.serviceType}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm italic text-gray-500">No vendors yet</p>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-4">
            <input
              type="text"
              placeholder="New Collection"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              className="p-2 border rounded w-full"
            />
            <button
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded w-full"
              onClick={addCollection}
            >
              + Add Collection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
