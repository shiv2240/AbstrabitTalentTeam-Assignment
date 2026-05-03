import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Smart Bookmarks — Save & Organize Your Web",
  description:
    "A fast, private bookmark manager with real-time sync across all your tabs. Powered by Supabase and Next.js.",
  keywords: ["bookmarks", "bookmark manager", "save links", "organize bookmarks"],
  openGraph: {
    title: "Smart Bookmarks",
    description: "Save, organize, and sync your bookmarks in real-time.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#ffffff",
              color: "#191c1e",
              border: "1px solid #e0e3e5",
              borderRadius: "12px",
              fontSize: "14px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
            },
            success: {
              iconTheme: {
                primary: "#004ac6",
                secondary: "#ffffff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ba1a1a",
                secondary: "#ffffff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
