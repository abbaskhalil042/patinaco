"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";
import LoginPage from "./components/Login";
import Image from "next/image";

const Home = () => {
  const { data: session } = useSession();
  console.log(session?.user);
  return (
    <div className="text-blue-900 h-screen flex-col-rev bg-gray-100 flex items-start justify-between px-2 py-2">
      {/* Left Section */}
      <div>
        <h2 className="text-2xl">
          Hello, <b>{session?.user?.name}</b>
        </h2>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 bg-gray-300   rounded-lg text-black">
        <Image
          src={session?.user?.image as string}
          alt="User Avatar"
          width={32}
          height={32}
          className="rounded-full"
        />
        <span>{session?.user?.name}</span>
      </div>
    </div>
  );
};

export default Home;
