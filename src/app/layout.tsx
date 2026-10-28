import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "João Matheus | Blockchain, Fintechs e Cibersegurança",
  description: "Portfólio de João Matheus Marques — desenvolvedor Web3 focado em blockchain e fintechs. Aplicações no ecossistema Ripple, experiência na Zuvia e cibersegurança aplicada ao produto.",
  keywords: ["blockchain", "fintech", "Web3", "Ripple", "XRP Ledger", "Zuvia", "cibersegurança", "desenvolvedor"],
  authors: [{ name: "João Matheus" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
