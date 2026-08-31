"use client";

import { useScroll, useMotionValueEvent } from "framer-motion";
import { useMemo, useRef } from "react";

/**
 * Fita métrica fixa na lateral esquerda. Marca a "profundidade" da
 * página em centímetros — metáfora da alfaiataria, no lugar de uma
 * barra de progresso comum.
 */
export default function Ruler() {
  const { scrollYProgress } = useScroll();
  const cmRef = useRef<HTMLSpanElement>(null);

  // Grava o texto direto no DOM em vez de setState — scrollYProgress dispara
  // a cada pixel rolado, e re-renderizar o componente inteiro (37 traços)
  // a essa frequência custa caro. Escala fictícia: página inteira = 180 cm.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (cmRef.current) {
      cmRef.current.textContent = `${String(Math.round(v * 180)).padStart(3, "0")} cm`;
    }
  });

  const ticks = useMemo(() => Array.from({ length: 37 }), []);

  return (
    <div className="pointer-events-none fixed left-0 top-0 z-40 hidden h-screen w-14 flex-col items-center justify-center border-r border-ink/10 bg-bone/40 backdrop-blur-[1px] lg:flex">
      {/* marcas da régua */}
      <div className="relative flex h-full w-full flex-col justify-between py-16">
        {ticks.map((_, i) => (
          <div key={i} className="flex items-center">
            <div
              className={`ml-0 h-px bg-ink/30 ${
                i % 5 === 0 ? "w-5" : "w-2.5"
              }`}
            />
          </div>
        ))}
      </div>

      {/* leitura atual */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 -rotate-90 whitespace-nowrap">
        <span ref={cmRef} className="tag tnum text-oxblood">000 cm</span>
      </div>

      {/* rótulo topo */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 -rotate-90 whitespace-nowrap">
        <span className="tag text-ink-faint">Italos·Line</span>
      </div>
    </div>
  );
}
