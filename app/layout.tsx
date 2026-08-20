import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "AI Study Planner",
  description: "AI-powered study planning application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
         <header>
    <Navbar />
  </header>
        <main>{children}</main>
      </body>
    </html>
  );
}