import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

import QueryProvider from "./provider";
import Navbar from "@/components/Navbar";
import { SearchProvider } from "@/components/SearchProvider";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

config.autoAddCss = false;

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Recipes",
  description: "Discover, create and share delicious recipes.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="autumn" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-base-200 text-base-content">
        <QueryProvider>
          <SearchProvider>
            <Navbar />
            {children}
          </SearchProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
