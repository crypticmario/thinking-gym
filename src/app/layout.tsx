import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Thinking Gym",
  description: "A daily curriculum for sharper arguments and deeper insight.",
};

const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/learn", label: "Learn" },
  { href: "/journal", label: "Journal" },
  { href: "/models", label: "Models" },
  { href: "/settings", label: "Settings" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-neutral-950 text-neutral-100">
        <header className="border-b border-neutral-800">
          <div className="mx-auto max-w-4xl flex items-center gap-6 px-4 py-3">
            <Link href="/" className="font-semibold tracking-tight text-neutral-100">
              🧠 Thinking Gym
            </Link>
            <nav className="flex gap-4 text-sm text-neutral-400">
              {NAV.map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-neutral-100">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
