import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron, Space_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "João Matheus | Desenvolvedor Full Stack",
  description: "Portfólio de João Matheus - Desenvolvedor Full Stack especializado em React, Vue.js, PHP, C# e automações. Transformando ideias em código e experiências em soluções.",
  keywords: ["desenvolvedor", "full stack", "React", "Vue.js", "PHP", "C#", "automação", "SaaS"],
  authors: [{ name: "João Matheus" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#00d4ff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} ${spaceMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
