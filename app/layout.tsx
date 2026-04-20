import type { Metadata } from "next";
import "./globals.css";

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
        <body>{children}</body>
        </html>
    );
}