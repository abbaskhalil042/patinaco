"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import Logo from "./Logo";
import Sidebar from "./Sidebar";
import Image from "next/image";
import { BiLoader } from "react-icons/bi";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [showNav, setShowNav] = useState(false);
  const { data: session } = useSession();
  console.log(session);

  if (!session) {
    return (
      <div className="bg-blue-900 w-screen h-screen flex items-center">
        <div className="text-center w-full">
          <button
            onClick={() => signIn("google")}
            className="bg-white p-3 px-6 rounded-lg flex items-center justify-center gap-3 mx-auto hover:bg-gray-100 transition-colors shadow-md cursor-pointer"
          >
            {/* {session.status === "loading" && (
              <BiLoader className="animate-spin" />
            )} */}

            <Image
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              width={24}
              height={24}
              className="w-6 h-6"
              priority
            />
            <span className="text-gray-700 font-medium">
              Sign in with Google
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fbfafd] min-h-screen">
      <div className="block md:hidden flex items-center">
        <button
          onClick={() => setShowNav(true)}
          className="p-2 hover:bg-gray-200 rounded-md transition-colors"
          aria-label="Open menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <div className="flex grow justify-center mr-6">
          <Logo />
        </div>
      </div>
      <div className="flex">
        <Sidebar show={showNav} />
        <div className="flex-grow">{children}</div>
      </div>
    </div>
  );
}
