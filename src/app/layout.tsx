import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "AutomateIn - LinkedIn Post Automation",
  description: "A premium tool to draft, schedule, and automate your LinkedIn posts with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased bg-[rgb(var(--background))] text-[rgb(var(--foreground))] min-h-screen relative`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-transparent to-transparent -z-10" />
        {children}
      </body>
    </html>
  );
}
