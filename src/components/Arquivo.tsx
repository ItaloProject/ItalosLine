"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { index } from "@/lib/data";
import { Reveal } from "./Reveal";

const CYCLES: Record<string, { src: string; bg: string }[]> = {
  "01": [
    { src: "/products/camisa-oxford-branca.png",   bg: "#8AAF94" },
    { src: "/products/polo-piquet-branca.png",     bg: "#7A9AB0" },
    { src: "/products/camisa-linho-branca.png",    bg: "#B87B5A" },
    { src: "/products/camisa-oxford-preta.png",    bg: "#D4B890" },
    { src: "/products/polo-piquet-preta.png",      bg: "#D4A090" },
    { src: "/products/camisa-linho-preta.png",     bg: "#A8B890" },
    { src: "/products/camisa-oxford-bege.png",     bg: "#4A7880" },
    { src: "/products/polo-piquet-bege.png",       bg: "#785068" },
    { src: "/products/camisa-linho-bege.png",      bg: "#506858" },
  ],
  "02": [
    { src: "/products/bermuda-moletom-branca.png", bg: "#7A9AB0" },
    { src: "/products/bermuda-cargo-branca.png",   bg: "#8AAF94" },
    { src: "/products/bermuda-sarja-branca.png",   bg: "#B4A882" },
    { src: "/products/bermuda-moletom-preta.png",  bg: "#D4B890" },
    { src: "/products/bermuda-cargo-preta.png",    bg: "#C87858" },
    { src: "/products/bermuda-sarja-preta.png",    bg: "#A8B890" },
    { src: "/products/bermuda-moletom-bege.png",   bg: "#4A7880" },
    { src: "/products/bermuda-cargo-bege.png",     bg: "#785068" },
    { src: "/products/bermuda-sarja-bege.png",     bg: "#506858" },
  ],
  "03": [
    { src: "/products/kit-polo-branca.png",   bg: "#F0EDE8" },
    { src: "/products/kit-polo-preta.png",    bg: "#6B8FA8" },
    { src: "/products/kit-polo-bege.png",     bg: "#8A9A88" },
    { src: "/products/kit-casual-branca.png", bg: "#EDE9E1" },
    { src: "/products/kit-casual-preta.png",  bg: "#8AAF94" },
    { src: "/products/kit-casual-bege.png",   bg: "#9A8870" },
    { src: "/products/kit-formal-preta.png",  bg: "#B87B5A" },
    { src: "/products/kit-formal-bege.png",   bg: "#6A8A70" },
  ],
};

export default function Arquivo() {
  const [hover, setHover] = useState(0);
  const [cycleIdx, setCycleIdx] = useState(0);

  const cycle = CYCLES[index[hover].n] ?? null;

  // Cicla a cada 1,8 s quando o item tem ciclo definido
  useEffect(() => {
    setCycleIdx(0);
    if (!cycle) return;
    const id = setInterval(() => {
      setCycleIdx((i) => (i + 1) % cycle.length);
    }, 1800);
    return () => clearInterval(id);
  }, [hover, cycle]);

  const current  = cycle ? cycle[cycleIdx] : null;
  const panelSrc = current ? current.src : index[hover].image;
  const panelBg  = current ? current.bg  : "#ECE8DF";

  return (
    <section id="arquivo" className="border-t border-ink/15 lg:pl-14">
      <div className="mx-auto max-w-[1600px] px-6 py-24 md:px-10 md:py-32">
        <div className="flex items-baseline justify-between border-b border-ink/15 pb-6">
          <span className="tag text-oxblood">04 — O Arquivo</span>
          <span className="tag text-ink-faint">Índice da estação</span>
        </div>

        <div className="grid grid-cols-12 gap-10 pt-10">
          {/* índice */}
          <div className="col-span-12 lg:col-span-7">
            <ul>
              {index.map((item, i) => (
                <Reveal key={item.n} delay={i * 0.06}>
                  <li
                    onMouseEnter={() => setHover(i)}
                    className="group border-b border-ink/15"
                  >
                    <a
                      href="#medida"
                      className="flex items-center gap-5 py-7 transition-[padding] duration-500 ease-editorial group-hover:pl-4"
                    >
                      <span className="tag text-ink-faint tnum">{item.n}</span>
                      <span className="flex-1 font-serif text-4xl font-light text-ink transition-colors group-hover:text-oxblood md:text-6xl">
                        {item.title}
                      </span>

                      {/* thumb no mobile */}
                      <span className="relative h-14 w-14 shrink-0 overflow-hidden border border-ink/15 bg-[#ECE8DF] lg:hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          quality={CYCLES[item.n] ? 100 : undefined}
                          className={CYCLES[item.n] ? "object-contain p-1 mix-blend-multiply" : "object-cover"}
                          sizes="56px"
                        />
                      </span>

                      <span className="hidden text-xl text-ink-faint transition-all duration-500 group-hover:translate-x-1 group-hover:text-oxblood lg:inline">
                        →
                      </span>
                    </a>
                    <p className="max-w-lg -translate-y-2 pb-6 font-sans text-sm font-light text-ink-soft opacity-0 transition-all duration-500 ease-editorial group-hover:translate-y-0 group-hover:opacity-100">
                      {item.note}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>

          {/* painel de imagem */}
          <div className="col-span-5 col-start-8 hidden lg:block">
            <div className="sticky top-28">
                <div className="relative aspect-[3/4] w-full overflow-hidden border border-ink/20">
                <AnimatePresence mode="sync">
                  <motion.div
                    key={panelSrc}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="absolute inset-0"
                    style={{ backgroundColor: panelBg }}
                  >
                    <Image
                      src={panelSrc}
                      alt={index[hover].title}
                      fill
                      quality={cycle ? 100 : undefined}
                      className={cycle ? "object-contain p-4 mix-blend-multiply" : "object-cover"}
                      sizes="30vw"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-3 flex justify-between">
                <span className="tag text-ink-faint tnum">
                  Pl. {index[hover].n}
                </span>
                <span className="tag text-ink-faint">{index[hover].title}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
