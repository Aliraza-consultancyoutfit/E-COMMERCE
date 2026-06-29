import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import RootLayout from "@/layouts/root";
import { headers } from "next/headers";
import { Settings } from "@/interface";
import "./globals.css";

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
});

export const metadata: Metadata = {
  title: "E-Commerce Platform",
  description: "Next.js and MUI app-level rendering example",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function Root({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const settingsHeader = headersList.get("x-settings");

  const settings = settingsHeader
    ? (JSON.parse(settingsHeader) as Settings)
    : undefined;

  return (
    <html lang="en">
      <body className={workSans.variable}>
        <RootLayout settings={settings}>{children}</RootLayout>
      </body>
    </html>
  );
}
