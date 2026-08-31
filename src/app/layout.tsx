import type { Metadata, Viewport } from "next";
import { Fraunces, Spline_Sans_Mono, Archivo } from "next/font/google";
import "./globals.css";
import WhatsApp from "@/components/WhatsApp";

const serif = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const mono = Spline_Sans_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

const sans = Archivo({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ItalosLine — Casa de Alfaiataria · Arquivo Nº 01",
  description:
    "ItalosLine — casa de alfaiataria contemporânea. Arquivo de peças construídas à mão, sob medida. Nº 01 · Estação Um.",
  keywords: ["ItalosLine", "alfaiataria", "sob medida", "moda", "arquivo"],
  openGraph: {
    title: "ItalosLine — Casa de Alfaiataria",
    description: "Arquivo Nº 01 · Estação Um.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0f0d0b",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${serif.variable} ${mono.variable} ${sans.variable}`}
    >
      <body className="paper relative">
        {children}
        <WhatsApp />
      </body>
    </html>
  );
}
