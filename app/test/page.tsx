"use client";

import React from "react";
// import GitHubCalendarComponent from "@/components/GitHubCalendarComponent";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
  Image,
} from "@heroui/react";
import CyclingText from "@/components/CyclingTest";

const page = () => {
  return (
    <div className="max-w-[900px] gap-2 grid grid-cols-12 grid-rows-2 px-8">
      <Card
        isFooterBlurred
        className="w-full h-[300px] col-span-12 sm:col-span-5"
        isBlurred
      >
        <CardHeader className="absolute z-10 top-1 flex-col items-start bg-white/30 blur-xs">
          <p className="text-tiny text-white/60 uppercase font-bold">New</p>
          <h4 className="text-black font-medium text-2xl">Acme camera</h4>
        </CardHeader>
        <Image
          removeWrapper
          alt="Card example background"
          className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
          src="https://heroui.com/images/card-example-6.jpeg"
        />
        <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
          <div>
            <p className="text-black text-tiny">Available soon.</p>
            <p className="text-black text-tiny">Get notified.</p>
          </div>
          <Button className="text-tiny" color="primary" radius="full" size="sm">
            Add to cart
          </Button>
        </CardFooter>
      </Card>

      <CyclingText words={["Hello", "World", "React"]} />
    </div>
  );
};

export default page;
