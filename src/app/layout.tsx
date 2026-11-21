import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "SmogWise Family — Urban Air Quality & Winter Smog Assistant",
  description:
    "Science-grounded winter air quality assistant helping families navigate thermal inversions and smog with practical routines and low-cost indoor hacks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col">
        <Header />
        <main id="main-content" className="flex-1 focus:outline-none">
          {children}
        </main>
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
          <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>SmogWise Family — Powered by Gemini AI & Open-Meteo Sensors</span>
            <span>WCAG 2.1 AA Compliant & Science-Grounded</span>
          </div>
        </footer>
      </body>
    </html>
  );
}

