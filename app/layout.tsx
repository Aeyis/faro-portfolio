import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import LenisProvider from "@/components/ui/LenisProvider";
import LogoIntro from "@/components/ui/LogoIntro";
import TrapMenu from "@/components/ui/TrapMenu";
import { Syne, Inter_Tight, Fraunces } from "next/font/google";

const syne       = Syne({ subsets: ["latin"], variable: "--font-syne" });
const interTight = Inter_Tight({ subsets: ["latin"], weight: ["900"], variable: "--font-inter-tight" });
const fraunces   = Fraunces({ subsets: ["latin"], weight: ["300", "400"], style: ["italic"], variable: "--font-fraunces" });

export const metadata: Metadata = {
    title: "Faro — Rafael Solis Ramos",
    description: "Portfolio de Rafael Solis Ramos",
};
export default function RootLayout(
    {children,}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr" className={`${syne.variable} ${interTight.variable} ${fraunces.variable}`}>
        <body>
            <LogoIntro />
            <TrapMenu />

            <LenisProvider>{children}</LenisProvider>
        </body>
        </html>
    );
}