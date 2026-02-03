import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import clsx from "clsx";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ignite Kenya Admin | Dashboard",
  description: "Admin dashboard for managing Ignite Kenya content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={clsx(inter.variable, "antialiased bg-background text-foreground font-sans")}
      >
        {children}
      </body>
    </html>
  );
}
