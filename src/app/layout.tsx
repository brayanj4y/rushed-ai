import type { Metadata } from "next";
import { Pixelify_Sans } from "next/font/google";
import "./globals.css";
import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";

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
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="description" content="Rushed is an AI-powered app builder that helps non-technical teams create web apps from scratch quickly and easily at low cost." />
            <meta name="keywords" content="AI app builder, web apps, low code, open source, Rushed" />
            <meta name="author" content="Rushed Team" />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href="https://rushed-ai.vercel.app" />

            <meta property="og:type" content="website" />
            <meta property="og:title" content="Rushed — Build lit with your AI hype squad" />
            <meta property="og:description" content="Rushed is an AI-powered app builder that helps non-technical teams create web apps from scratch quickly and easily at low cost." />
            <meta property="og:url" content="https://rushed-ai.vercel.app" />
            <meta property="og:site_name" content="Rushed" />
            <meta property="og:image" content="https://i.imgur.com/WG9XtSx.jpeg" />
            <meta property="og:image:alt" content="Rushed — AI app builder screenshot" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content="Rushed — Build lit with your AI hype squad" />
            <meta name="twitter:description" content="Rushed is an AI-powered app builder that helps non-technical teams create web apps from scratch quickly and easily at low cost." />
            <meta name="twitter:image" content="https://i.imgur.com/WG9XtSx.jpeg" />
            <meta name="twitter:site" content="@RushedAI" />
            <meta name="twitter:image:alt" content="Rushed — AI app builder screenshot" />

            <link rel="icon" href="/logo.png" />
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/logo.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/logo.png" />
            <link rel="manifest" href="/site.webmanifest" />
            <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ff6600" />
            <meta name="msapplication-TileColor" content="#ffffff" />
            <meta name="theme-color" content="#ffffff" />
          </head>
          <body className={`${pixelifySans.variable} antialiased`}>
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
