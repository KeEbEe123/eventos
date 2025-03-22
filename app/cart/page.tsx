"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const CartPage = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await axios.get("/api/cart/get");
        setCart(data.cart);
      } catch (error) {
        console.error("Failed to load cart:", error);
      }
      setLoading(false);
    };

    fetchCart();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
      {cart.length > 0 ? (
        <ul>
          {cart.map((vendor) => (
            <li key={vendor._id} className="p-2 border rounded mt-2">
              {vendor.name} - {vendor.location}
            </li>
          ))}
        </ul>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default CartPage;
