import { NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/user";
import { useSession } from "next-auth/react"; // Adjust if using next-auth

export async function POST(req: Request) {
  try {
    const { vendorId } = await req.json();

    // Get user session (Assuming you use NextAuth.js)
    const session = await useSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ email: session.data?.user?.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent duplicate vendor in cart
    if (!user.cart.includes(vendorId)) {
      user.cart.push(vendorId);
      await user.save();
    }

    return NextResponse.json({ message: "Added to cart", cart: user.cart });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
