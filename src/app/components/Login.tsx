"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";

import Image from "next/image";
import { BiLoader } from "react-icons/bi";

export default function LoginPage() {
  const { data: session, status } = useSession(); // Destructure both session and status

  return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center p-4 w-[100%]">
    
      <button
        onClick={() => signIn("google")}
        className=" flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 px-4 rounded-lg transition duration-200"
        aria-label="Continue with Google"
      >
        {status === "loading" ? <BiLoader className="animate-spin" /> : ""}
        <Image
          src={"https://developers.google.com/identity/images/g-logo.png"}
          alt="Google Logo"
          width={20}
          height={20}
          className="w-5 h-5"
        />
        Continue with Google
      </button>
    </div>
  );
}
