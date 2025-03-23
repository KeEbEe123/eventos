"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Logo from "@/public/logo.png";
import PrimaryBtn from "./PrimaryBtn";
import { Koulen } from "next/font/google";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { TransitionLink } from "@/components/TransitionLink";
import { Tooltip } from "@nextui-org/tooltip";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
  Avatar,
  Divider,
} from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { TbShoppingCart } from "react-icons/tb";

const Navbar: React.FC = () => {
  const { status, data: session } = useSession();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const userId = session?.user?.email;
  const router = useRouter();

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const response = await axios.get(`/api/getUserByEmail?email=${userId}`);
  //       const data = response.data.user;

  //       setUser(data);
  //     } catch (error) {
  //       console.error("Error fetching user:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (userId) {
  //     fetchUser();
  //   }
  // }, [userId]);

  // if (loading) {
  //   return <p>Loading...</p>;
  // }

  return (
    <nav
      className={`flex items-center justify-between p-4 bg-background text-primary`}
    >
      <Link href="/">
        <Image
          src={Logo}
          alt="Logo"
          width={150}
          height={150}
          className="absolute top-6"
        />
      </Link>

      <div classNa me="flex space-x-4">
        {session ? (
          <div className="flex flex-row items-center space-x-8">
            <button
              onClick={() => router.push("/onboarding")}
              className="px-4 py-2 mr-6 text-lg font-koulen bg-background text-primary rounded-lg  hover:bg-primary hover:text-background hover:rounded-2xl hover:shadow-glow hover:shadow-primary transition-all duration-300"
            >
              Partner with us
            </button>
            <button onClick={() => router.push("/cart")}>
              <TbShoppingCart className="text-4xl mr-2 text-white"></TbShoppingCart>
            </button>
            <Image
              src={session?.user?.image || "/default-profile.png"}
              alt="Profile Picture"
              width={50}
              height={50}
              onClick={onOpen}
              className="rounded-full cursor-pointer ring-4 ring-primary hover:ring-8 hover:ring-pink-600 transition-all duration-300 hover:shadow-glow hover:shadow-pink-600"
            />
            <Drawer
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              className="bg-background"
              size="sm"
              backdrop="blur"
            >
              <DrawerContent>
                {(onClose) => (
                  <>
                    <DrawerHeader className="flex flex-row gap-4 font-koulen text-4xl items-center text-primary">
                      <Avatar
                        src={session?.user?.image || "/default-profile.png"}
                        className="w-16 h-16"
                      ></Avatar>
                      {session?.user?.name}
                    </DrawerHeader>
                    <DrawerBody className="flex flex-col gap-4 items-start mt-5">
                      <TransitionLink href="/profile">
                        <button
                          className="text-2xl font-thin font-pop text-slate-400 hover:text-offwhite transition-all duration-200"
                          onClick={onClose}
                        >
                          Profile
                        </button>
                      </TransitionLink>
                      <TransitionLink href="/friends">
                        <button
                          className="text-2xl font-thin font-pop text-slate-400 hover:text-offwhite transition-all duration-200"
                          onClick={onClose}
                        >
                          Friends
                        </button>
                      </TransitionLink>
                      <TransitionLink href="/leaderboard">
                        <button
                          className="text-2xl font-thin font-pop text-slate-400 hover:text-offwhite transition-all duration-200"
                          onClick={onClose}
                        >
                          Leaderboard
                        </button>
                      </TransitionLink>
                      <TransitionLink href="opportunities">
                        <button
                          className="text-2xl font-thin font-pop text-slate-400 hover:text-offwhite transition-all duration-200"
                          onClick={onClose}
                        >
                          Opportunities
                        </button>
                      </TransitionLink>
                      <TransitionLink href="courses">
                        <button
                          className="text-2xl font-thin font-pop text-slate-400 hover:text-offwhite transition-all duration-200"
                          onClick={onClose}
                        >
                          Courses
                        </button>
                      </TransitionLink>
                      <TransitionLink href="/contact">
                        <button
                          className="text-2xl font-thin font-pop text-slate-400 hover:text-offwhite transition-all duration-200"
                          onClick={onClose}
                        >
                          Contact Us
                        </button>
                      </TransitionLink>
                      <TransitionLink href="/">
                        <button
                          className="text-2xl font-bold mt-4 font-pop text-slate-400 hover:text-pink-600 transition-all duration-200"
                          onClick={() => signOut({ callbackUrl: "/" })}
                        >
                          Sign Out
                        </button>
                      </TransitionLink>
                    </DrawerBody>
                  </>
                )}
              </DrawerContent>
            </Drawer>
          </div>
        ) : (
          <div>
            <button
              onClick={() => router.push("/onboarding")}
              className="px-4 py-2 mr-6 text-lg font-koulen bg-background text-primary rounded-lg  hover:bg-primary hover:text-background hover:rounded-2xl hover:shadow-glow hover:shadow-primary transition-all duration-300"
            >
              Partner with us
            </button>

            <button
              onClick={() => signIn("google")}
              className="px-4 py-2 text-lg font-koulen bg-background text-primary rounded-lg  hover:bg-primary hover:text-background hover:rounded-2xl hover:shadow-glow hover:shadow-primary transition-all duration-300"
            >
              Sign In
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
