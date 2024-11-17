import SideBar from "@/components/MySideBar.tsx";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className=" flex flex-col  w-screen  bg-slate-100 ">
      {children}
      <div className=" fixed top-[570px] ">
        <SideBar />
      </div>
    </div>
  );
}
