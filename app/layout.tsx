import type { Metadata } from "next";
import "./globals.css";
import LenisProvider from "@/components/ui/LenisProvider";

export const metadata: Metadata = {
    title: "Faro — Rafael Solis Ramos",
    description: "Portfolio de Rafael Solis Ramos",
};
export default function RootLayout(
    {children,}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
        <body><LenisProvider>{children}</LenisProvider></body>
        </html>
    );
}