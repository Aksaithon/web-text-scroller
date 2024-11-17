"use client";
import { SignInButton, SignOutButton, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button.tsx";
import { useDispatch } from "react-redux";
import { clearUserData } from "@/lib/features/addUserData/userDataSlice.ts";

const SideBar = () => {
  const dispatch = useDispatch();

  return (
    <div className=" flex gap-3 ">
      <Link
        className=" bg-slate-950 text-slate-200  p-2 rounded-md items-center justify-center "
        href={"/dashboard"}
      >
        Dashboard
      </Link>
      <Link
        className=" bg-slate-950 text-slate-200  p-2 rounded-md items-center justify-center "
        href={"/"}
      >
        Reels
      </Link>

      <SignUpButton>
        <Button className=" bg-blue-500 ">Sign up</Button>
      </SignUpButton>
      <SignInButton>
        <Button className=" bg-white text-blue-500">Sign in</Button>
      </SignInButton>
      <SignOutButton>
        <Button
          onClick={() => dispatch(clearUserData())}
          className="bg-red-500"
        >
          Sign out
        </Button>
      </SignOutButton>
    </div>
  );
};

export default SideBar;
