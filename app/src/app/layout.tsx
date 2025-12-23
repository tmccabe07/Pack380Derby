import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { AdminProvider } from "@/context/AdminContext";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pinewood Derby",
  description: "Created by the members of Pack 380 in Washington, DC",
  keywords: ["Pinewood Derby", "Pack 380", "Cub Scouts"],
  icons: {
    icon: "/pinewood.png",
    shortcut: "/pinewood.png",
    apple: "/pinewood.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Suspense fallback={null}>
          <AdminProvider>
            {children}
          </AdminProvider>
        </Suspense>
      </body>
    </html>
  );
}
