import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LMS - Learning Reimagined | AI-Powered Education Platform",
  description: "Experience education at the speed of thought with AI-powered insights, real-time collaboration, and personalized learning paths. Join thousands of learners advancing their careers.",
  keywords: ["LMS", "Learning Management System", "AI Education", "Online Learning", "E-Learning", "Courses", "Certificates", "EdTech"],
  authors: [{ name: "LMS Platform" }],
  creator: "LMS Platform",
  publisher: "LMS Platform",
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: "LMS - Learning Reimagined",
    description: "AI-powered learning platform with personalized insights and real-time analytics",
    url: 'http://localhost:3000',
    siteName: 'LMS Platform',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "LMS - Learning Reimagined",
    description: "AI-powered learning platform with personalized insights and real-time analytics",
    creator: '@lmsplatform',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}