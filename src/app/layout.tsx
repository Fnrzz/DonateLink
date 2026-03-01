import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/components/providers/Web3Provider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "DonateLink - Cross-Chain Donations for Creators",
  description:
    "Send crypto donations to your favorite streamers and creators across any blockchain. Powered by Chainlink.",
  keywords: ["donation", "crypto", "blockchain", "chainlink", "streaming", "base"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <Web3Provider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster
            richColors
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#FFFFFF",
                border: "2px solid #000000",
                color: "#1A1A1A",
                fontWeight: 700,
                boxShadow: "3px 3px 0 #000000",
                borderRadius: "0px",
              },
            }}
          />
        </Web3Provider>
      </body>
    </html>
  );
}
