"use client";

import "./globals.css";
import { DM_Sans, Koulen, Poppins } from "next/font/google";

import { Inter } from "next/font/google";
import Navbar from "../components/Navbar";
import { NextAuthProvider } from "./Providers";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { HeroUIProvider, Spinner } from "@heroui/react";
import { Toaster } from "react-hot-toast";
import { ReactNode } from "react";
import "@mantine/core/styles.css";
import localFont from "next/font/local";

import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";
import PatchNotes from "@/components/PatchNotes";
import Sidebar from "@/components/Sidebar";

const poppins = Poppins({
  weight: ["200", "400", "600"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

const koulen = Koulen({
  weight: "400",
  variable: "--font-koulen",
  subsets: ["latin"],
});
const dm = DM_Sans({
  weight: "400",
  style: "italic",
  variable: "--font-dm",
  subsets: ["latin"],
});
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "CodeSense",
//   description: "",
// };

export default function RootLayout({ children }: { children: ReactNode }) {
  // const pathname = usePathname();
  // const { isLoading, setLoading } = useLoadingStore();
  // useEffect(() => {
  //   setLoading(true);
  //   const timeout = setTimeout(() => setLoading(false), 500); // Simulate loading time

  //   return () => clearTimeout(timeout);
  // }, [pathname]);
  return (
    <html lang="en" className="bg-background" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <script type="module"></script>

      <body
        className={`${geistSans.variable} ${geistMono.variable} ${koulen.variable} ${poppins.variable} ${dm.variable} antialiased bg-background`}
      >
        {/* {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-80 z-50">
            <Spinner size="lg" />
          </div>
        )} */}
        <MantineProvider defaultColorScheme="dark">
          <HeroUIProvider>
            <NextAuthProvider>
              <Navbar />
              <Sidebar />
              <div id="main" className="mx-auto dark">
                <Toaster position="top-center" />
                <PatchNotes />

                {children}
              </div>
            </NextAuthProvider>
          </HeroUIProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
