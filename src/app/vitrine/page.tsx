import type { Metadata } from "next";
import { Suspense } from "react";
import Ruler from "@/components/Ruler";
import Nav from "@/components/Nav";
import Vitrine from "@/components/Vitrine";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Vitrine — ItalosLine · Arquivo Nº 01",
  description:
    "A vitrine da ItalosLine: camisas, calças e bermudas do arquivo, filtradas por grupo e cor, cada peça girável em 360°.",
  openGraph: {
    title: "Vitrine — ItalosLine",
    description: "Camisas, calças e bermudas em 360°. Arquivo Nº 01.",
    type: "website",
  },
};

export default function VitrinePage() {
  return (
    <main className="theme-light relative min-h-screen">
      <Ruler />
      <Nav />
      <Suspense>
        <Vitrine />
      </Suspense>
      <Footer />
    </main>
  );
}
