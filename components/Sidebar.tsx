"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { TbArrowLeft, TbArrowRight } from "react-icons/tb";

const Sidebar = () => {
  const [collections, setCollections] = useState<any[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [position, setPosition] = useState({ x: 50, y: 100 });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement | null>(null);
  const offset = useRef({ x: 0, y: 0 });

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

  const startDrag = (e: React.MouseEvent) => {
    setDragging(true);
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const onDrag = (e: MouseEvent) => {
    if (dragging) {
      setPosition({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      });
    }
  };

  const stopDrag = () => {
    setDragging(false);
  };

  useEffect(() => {
    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", stopDrag);
    return () => {
      window.removeEventListener("mousemove", onDrag);
      window.removeEventListener("mouseup", stopDrag);
    };
  }, [dragging]);

  return (
    <div
      ref={dragRef}
      className="fixed z-50 transition-all duration-300"
      style={{
        left: position.x,
        top: position.y,
        width: collapsed ? 40 : 300,
        height: "auto",
        cursor: dragging ? "grabbing" : "grab",
      }}
    >
      {/* Drag Handle */}
      <div
        onMouseDown={startDrag}
        className="bg-gray-500 text-white p-2 cursor-move rounded-t"
      >
        <button onClick={() => setCollapsed(!collapsed)} className="text-2xl">
          {collapsed ? <TbArrowLeft /> : <TbArrowRight />}
        </button>
      </div>

      {!collapsed && (
        <div className="bg-gray-200 p-4 shadow-xl rounded-b-lg w-full max-h-[90vh] overflow-y-auto">
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
        </div>
      )}
    </div>
  );
};

export default Sidebar;
