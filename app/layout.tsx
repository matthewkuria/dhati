import type { Metadata } from "next";
import "./globals.css";
import {inter} from "./ui/fonts"
import { Toaster } from "@/components/ui/toaster";



export const metadata: Metadata = {
  title: "Dhati",
  description: "A simple and elegant way to manage your tasks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
