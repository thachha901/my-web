import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Pixel C&D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Navbar */}
        <header className="w-full bg-white dark:bg-gray-900 shadow-md">
          <nav className="max-w-7xl mx-auto p-4 flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
            <Link href = "/">
              <Image
                src="/logo.png"
                alt="Logo"
                width={75}
                height={75}
                priority
              />
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="flex gap-8">
              <Link
                href="/project"
                className="text-black dark:text-white font-medium hover:underline"
              >
                Projects
              </Link>
              <Link
                href="/dataset"
                className="text-black dark:text-white font-medium hover:underline"
              >
                Datasets
              </Link>
              <Link
                href="/guide"
                className="text-black dark:text-white font-medium hover:underline"
              >
                Guide
              </Link>
            </div>

            {/* User Section */}
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Log In
              </button>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main>{children}</main>
      </body>
    </html>
  );
}