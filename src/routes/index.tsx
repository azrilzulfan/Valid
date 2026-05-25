import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Preloader } from "@/components/valid/Preloader";
import { Navbar } from "@/components/valid/Navbar";
import { Hero } from "@/components/valid/Hero";
import { Stats } from "@/components/valid/Stats";
import { ProofManifesto } from "@/components/valid/ProofManifesto";
import { CaraKerja } from "@/components/valid/CaraKerja";
import { AIInterview } from "@/components/valid/AIInterview";
import { BodyGood } from "@/components/valid/BodyGood";
import { UntukSiapa } from "@/components/valid/UntukSiapa";
import { SDGs } from "@/components/valid/SDGs";
import { Kontak } from "@/components/valid/Kontak";
import { PreFooterCTA } from "@/components/valid/PreFooterCTA";
import { Footer } from "@/components/valid/Footer";

gsap.registerPlugin(ScrollTrigger);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VALID — Buktikan Kemampuanmu" },
      { name: "description", content: "Platform verifikasi peer berbasis AI buat pekerja vokasi Indonesia. Bukti nyata, wawancara AI, dan validasi ahli industri." },
      { property: "og:title", content: "VALID — Buktikan Kemampuanmu" },
      { property: "og:description", content: "Verifikasi skill yang jujur dan berbasis bukti untuk pekerja vokasi Indonesia." },
    ],
  }),
  component: Index,
});

function Index() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) {
      // Force ScrollTrigger to refresh its cached start/end positions after the preloader leaves the DOM
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [ready]);
  return (
    <main className="relative">
      {!ready && <Preloader onDone={() => setReady(true)} />}
      <Navbar />
      <Hero />
      <Stats />
      <ProofManifesto />
      <CaraKerja />
      <AIInterview />
      <BodyGood />
      <UntukSiapa />
      <SDGs />
      <Kontak />
      <PreFooterCTA />
      <Footer />
    </main>
  );
}
