import { AuthProvider } from "@/providers/AuthProvider";
import type { Metadata } from "next";
import "./globals.css";
import { dm_sans } from "./lib/fonts";

export const metadata: Metadata = {
  title: "My App with NextAuth",
  description: "Application with NextAuth authentication",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${dm_sans.className} overflow-x-hidden bg-background antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}