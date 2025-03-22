import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/mongodb";
import User from "../../../models/user";

const ADMIN_EMAILS = [
  "keertan.k@gmail.com",
  "admin2@example.com",
  "siddhartht4206@gmail.com",
  "23r21a12b3@mlrit.ac.in",
  "23r21a1285@mlrit.ac.in",
  "nv.rajasekhar@gmail.com",
  "rajasekhar.nv@gmail.com",
  "hodds@mlrinstitutions.ac.in",
  "hodaiml@mlrinstitutions.ac.in",
  "hodit@mlrinstitutions.ac.in",
  "hodcse@mlrinstitutions.ac.in",
  "pradeep13@mlrinstitutions.ac.in",
];

export async function POST(request) {
  try {
    const { name, email, image } = await request.json();
    const onboard = ADMIN_EMAILS.includes(email);

    await connectMongoDB();
    console.log("Connected to MongoDB");

    const user = await User.create({ name, email, image, onboard });
    console.log("User created:", user);

    return NextResponse.json({ message: "User Registered" }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Error registering user" },
      { status: 500 }
    );
  }
}
