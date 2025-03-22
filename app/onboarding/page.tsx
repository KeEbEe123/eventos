"use client";

import { useSession } from "next-auth/react";
import BasicDetails from "@/components/sections/BasicDetails";

const Onboarding = () => {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;
  if (!session || !session.user?.email)
    return <p>Please log in to continue onboarding.</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Vendor Onboarding</h1>
      <BasicDetails userEmail={session.user.email} />
    </div>
  );
};

export default Onboarding;
