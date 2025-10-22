import type { Metadata } from "next";
import { Lexend, Roboto } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Brevito",
  description: "Learn languages with fun facts.",
  manifest: "/manifest.json?v=3", // <-- INCREMENT THE VERSION
};

const lexend = Lexend({
  variable: "--font-heading",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${roboto.variable} ${lexend.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}