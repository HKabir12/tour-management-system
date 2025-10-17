import type { Metadata } from "next";

import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { ThemeProvider } from "next-themes";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Tour Management App",
  description: "Manage your tours efficiently with our app.",
  icons: {
    icon: "https://i.ibb.co.com/TMrScv8t/Screenshot-2025-09-27-074922.png",
    shortcut: "https://i.ibb.co.com/TMrScv8t/Screenshot-2025-09-27-074922.png",
    apple: "https://i.ibb.co.com/TMrScv8t/Screenshot-2025-09-27-074922.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
