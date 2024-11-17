import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import SaveUserToDatabase from "../lib/saveUserData_toDatabase.tsx";
import StoreProvider from "./storeProvider.tsx";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar.tsx";
import { AppSidebar } from "@/components/app-sidebar.tsx"


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Web page scroller",
  description: "Create/scroll fun & interesting web pages.",
  icons: "/favicon.ico",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider
          publishableKey={
            process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY as string
          }
          appearance={{
            layout: {
              socialButtonsVariant: "iconButton",
              logoImageUrl: "/favicon.ico",
            },
            variables: {
              colorBackground: "#15171c",
              colorPrimary: "",
              colorText: "white",
              colorInputBackground: "#1b1f29",
              colorInputText: "white",
            },
          }}
        >
          <StoreProvider>
            <SidebarProvider defaultOpen={false} >
            <SaveUserToDatabase />
              <AppSidebar/>
              <SidebarTrigger />
              {children}
            </SidebarProvider>
          </StoreProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
