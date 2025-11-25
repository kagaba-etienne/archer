import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Archer - Align Your Tasks with Your Goals",
  description:
    "AI-powered productivity platform for students and young professionals. Focus on alignment, not just completion.",
  keywords: [
    "productivity",
    "task management",
    "goal alignment",
    "AI assistant",
    "reflection",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={geistMono.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
