import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Nastaliq_Urdu } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoNastaliqUrdu = Noto_Nastaliq_Urdu({
  variable: "--font-urdu",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Al-Iqra Modern Madrasa",
  description: "Official portal for Al-Iqra Modern Madrasa",
  icons: {
    icon: "/favicon.ico",
  },
};

import { TopBar } from "@/components/layout/TopBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  let isLoggedIn = false;
  
  if (token) {
    try {
      isLoggedIn = !!verifyToken(token);
    } catch(e) {
      // invalid token
    }
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoNastaliqUrdu.variable} antialiased min-h-screen flex flex-col print:block print:min-h-0`}
      >
        <div className="print:hidden">
          <TopBar />
          <Navbar isLoggedIn={isLoggedIn} />
        </div>
        <main className="flex-1 print:block">
          {children}
        </main>
        <div className="print:hidden">
          <Footer />
        </div>
      </body>
    </html>
  );
}
