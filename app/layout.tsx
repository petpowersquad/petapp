import {ClerkProvider} from "@clerk/nextjs";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Lora } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const sansFont = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const serifFont = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PAWPower - AI Pet Care & Triage",
  description: "Monitor your pet's health, scan images for instant AI triage, and manage care schedules.",
};

/** Clerk appearance mapped to our brand CSS custom properties */
const clerkAppearance = {
  variables: {
    colorPrimary: "#11231E",          // --bg-brand-dark (Forest Green)
    colorTextOnPrimaryBackground: "#FFFFFF",
    colorBackground: "#FFFFFF",       // --bg-surface
    colorInputBackground: "#FAFAFA",  // --bg-base
    colorInputText: "#1A1D20",        // --text-primary
    colorText: "#1A1D20",
    colorTextSecondary: "#5A6572",    // --text-muted
    colorDanger: "#E65A5A",           // --state-error
    colorSuccess: "#81B29A",          // --state-success
    colorWarning: "#E5A93C",          // --state-warning
    borderRadius: "0.625rem",         // --radius-lg
    fontFamily: "Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif",
  },
  elements: {
    card: "shadow-sm border border-[#E5E7EB] rounded-2xl",
    headerTitle: "font-serif text-[#1A1D20]",
    headerSubtitle: "text-[#5A6572]",
    formButtonPrimary:
      "bg-[#EAA23B] text-[#11231E] font-semibold hover:opacity-90 transition-opacity",
    footerActionLink: "text-[#EAA23B] hover:opacity-80",
    formFieldInput:
      "border-[#E5E7EB] bg-[#FAFAFA] text-[#1A1D20] focus:ring-[#EAA23B]",
    socialButtonsBlockButton:
      "border-[#E5E7EB] text-[#1A1D20] hover:bg-[#FAFAFA]",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sansFont.variable} ${serifFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider appearance={clerkAppearance}>
          <Header />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </ClerkProvider>
      </body>
    </html>
  );
}