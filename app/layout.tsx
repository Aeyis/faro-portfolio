import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import LenisProvider from "@/components/ui/LenisProvider";
import LogoIntro from "@/components/ui/LogoIntro";
import TrapMenu from "@/components/ui/TrapMenu";
import { Syne, Inter_Tight, Fraunces, Cormorant_Garamond, DM_Sans } from "next/font/google";
import localFont from "next/font/local";

const syne             = Syne({ subsets: ["latin"], variable: "--font-syne" });
const interTight       = Inter_Tight({ subsets: ["latin"], weight: ["900"], variable: "--font-inter-tight" });
const fraunces         = Fraunces({ subsets: ["latin"], weight: ["300", "400"], style: ["italic"], variable: "--font-fraunces" });
const cormorantGaramond = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500"], style: ["normal", "italic"], variable: "--font-cormorant" });
const dmSans       = DM_Sans({ subsets: ["latin"], weight: ["300", "400", "700"], variable: "--font-roboto" });
const blacksword   = localFont({ src: "../public/assets/hero/Blacksword.otf", variable: "--font-meie" });

export const metadata: Metadata = {
    title: "Faro — Rafael Solis Ramos",
    description: "Portfolio de Rafael Solis Ramos",
};
export default function RootLayout(
    {children,}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr" className={`${syne.variable} ${interTight.variable} ${fraunces.variable} ${cormorantGaramond.variable} ${blacksword.variable} ${dmSans.variable}`}>
        <body>
            <LogoIntro />
            <TrapMenu />

            <LenisProvider>{children}</LenisProvider>
        </body>
        </html>
    );
}