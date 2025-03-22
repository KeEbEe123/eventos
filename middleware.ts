import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

const ADMIN_EMAILS = [
  "keertan.k@gmail.com",
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
]; // Replace with your admin emails

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If user is already logged in and is on the sign-in page, redirect to home

  // Check if the user is logged in

  // Check if the user is onboarded
  // Protect admin routes

  // Allow access
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|onboarding|auth).*)"], // Protect all routes except onboarding, API, and auth routes
};
