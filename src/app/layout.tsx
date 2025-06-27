import type { Metadata } from "next";
import { Roboto_Mono, Roboto } from "next/font/google";
import "./globals.css";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ['400', '700'],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "EYES WIDE SHUT",
  description: "An investigation into the invisible forces shaping what we see online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${robotoMono.variable} ${roboto.variable}`}>
      <body className="font-mono" suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
