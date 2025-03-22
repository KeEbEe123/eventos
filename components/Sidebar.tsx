"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const Sidebar = () => {
  const [collections, setCollections] = useState<any[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");

  useEffect(() => {
    fetchCollections();
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
      className={`transition-all ${
        collapsed ? "w-0 overflow-hidden" : "w-1/3"
      } bg-gray-200 h-screen fixed right-0 top-20 p-4 max-h-[80%]`}
    >
      <button
        className="absolute top-4 left-4 bg-gray-500 text-white px-2 py-1 rounded"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? "→" : "←"}
      </button>
      {!collapsed && (
        <>
          <h2 className="text-xl font-bold">Your Collections</h2>
          <ul className="mt-4">
            {collections.map((col) => (
              <li key={col._id} className="p-2 border-b">
                {col.name}
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
        </>
      )}
    </div>
  );
};

export default Sidebar;
