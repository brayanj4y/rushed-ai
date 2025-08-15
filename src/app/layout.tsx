import type { Metadata } from "next";
import { Pixelify_Sans } from "next/font/google";
import "./globals.css";
import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next"
import { neobrutalism } from '@clerk/themes'

const pixelifySans = Pixelify_Sans({
  variable: "--font-pixelify-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Rushed",
  description: "Build lit with Rushed — your AI hype squad for coding",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <TRPCReactProvider>
        <html lang="en" suppressHydrationWarning>
          <head>
            <meta property="og:image" content="https://i.imgur.com/WG9XtSx.jpeg" />
            <meta property="og:site_name" content="Rushed" />
            <meta property="og:title" content="Rushed — Build lit with your AI hype squad" />
            <meta property="og:description" content="Rushed is an AI-powered app builder that helps non-technical teams create web apps from scratch quickly and easily at low cost." />
            <meta property="og:url" content="https://rushed-ai.vercel.app" />
          </head>
          <body
            className={`${pixelifySans.variable} antialiased`}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster />
              {children}
              <Analytics />
            </ThemeProvider>
          </body>
        </html>
      </TRPCReactProvider>
    </ClerkProvider>
  );
}
