"use client";

import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { runway } from "@/lib/data";

export default function Runway() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const maxX = useRef(0);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // desloca o trilho na horizontal conforme o scroll vertical
  const x = useTransform(scrollYProgress, (v) => -(v * maxX.current));

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(runway.length - 1, Math.floor(v * runway.length)));
  });

  useEffect(() => {
    const update = () => {
      if (trackRef.current) {
        maxX.current = trackRef.current.scrollWidth - window.innerWidth;
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <section
      id="passarela"
      ref={sectionRef}
      style={{ height: `${runway.length * 62 + 60}vh` }}
      className="relative bg-bone-dark"
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden lg:pl-14">
        {/* cabeçalho da seção */}
        <div className="flex items-end justify-between px-6 pb-6 pt-24 md:px-10">
          <div>
            <span className="tag text-oxblood">A Passarela</span>
            <h2 className="mt-2 font-serif text-4xl font-light text-ink md:text-5xl">
              Coleção <span className="italic">— Estação Um</span>
            </h2>
          </div>
          <div className="hidden items-baseline gap-2 md:flex">
            <span className="font-serif text-5xl text-oxblood tnum">
              {String(active + 1).padStart(2, "0")}
            </span>
            <span className="tag text-ink-faint tnum">
              / {String(runway.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* trilho horizontal */}
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex gap-6 px-6 md:gap-10 md:px-10"
        >
          {runway.map((g, i) => (
            <article
              key={g.ref}
              className="flex w-[86vw] shrink-0 gap-5 sm:w-[64vw] lg:w-[46vw]"
            >
              {/* coluna do índice */}
              <div className="flex shrink-0 flex-col justify-between py-1">
                <span className="font-serif text-2xl text-ink-faint tnum">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="tag rotate-180 text-ink-faint [writing-mode:vertical-rl]">
                  {g.ref}
                </span>
              </div>

              {/* prancha */}
              <div className="flex-1">
                <figure className="group relative aspect-[4/5] w-full overflow-hidden border border-ink/15">
                  {g.video ? (
                    <LazyLoopVideo src={g.video} className="h-full w-full object-cover" />
                  ) : (
                    <Image
                      src={g.image}
                      alt={g.name}
                      fill
                      className="object-cover transition-transform duration-[1.1s] ease-editorial group-hover:scale-105"
                      sizes="(max-width: 640px) 86vw, (max-width: 1024px) 64vw, 46vw"
                    />
                  )}
                  {/* etiqueta de ficha técnica */}
                  <figcaption className="absolute inset-x-3 bottom-3 flex items-stretch gap-px bg-bone-dark/90 text-ink backdrop-blur-sm transition-all duration-500 ease-editorial lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
                    <Spec k="Tecido" v={g.fabric} />
                    <Spec k="Gramatura" v={g.weight} />
                    <Spec k="Origem" v={g.origin} />
                  </figcaption>
                </figure>

                {/* legenda */}
                <div className="mt-4 flex items-baseline justify-between border-t border-ink/15 pt-3">
                  <div>
                    <span className="tag text-ink-faint">{g.category}</span>
                    <h3 className="font-serif text-2xl font-light text-ink">
                      {g.name}
                    </h3>
                  </div>
                  <span className="font-mono text-sm text-oxblood tnum">
                    {g.price}
                  </span>
                </div>
              </div>
            </article>
          ))}

          {/* cartão final */}
          <article className="flex w-[70vw] shrink-0 items-center sm:w-[46vw] lg:w-[32vw]">
            <a
              href="#arquivo"
              className="group flex h-full w-full flex-col items-start justify-center border border-dashed border-ink/30 p-10 transition-colors hover:border-oxblood"
            >
              <span className="tag text-oxblood">Continua</span>
              <p className="mt-4 font-serif text-4xl font-light leading-tight text-ink">
                Ver o arquivo completo
              </p>
              <span className="mt-8 text-2xl transition-transform group-hover:translate-x-2">
                →
              </span>
            </a>
          </article>
        </motion.div>

        {/* dica de interação */}
        <div className="px-6 pb-8 pt-6 md:px-10">
          <span className="tag text-ink-faint">
            Role para percorrer a coleção →
          </span>
        </div>
      </div>
    </section>
  );
}

function Spec({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex-1 px-3 py-3">
      <p className="tag text-ink/65">{k}</p>
      <p className="mt-1 font-mono text-xs text-ink">{v}</p>
    </div>
  );
}

/**
 * Vídeo que só baixa e toca quando o cartão realmente entra na tela
 * (o trilho da passarela desloca via transform, então todos os
 * cartões existem no DOM o tempo todo — sem isso, os 4 vídeos
 * tocariam e consumiriam banda ao mesmo tempo, mesmo fora da tela).
 */
function LazyLoopVideo({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.2,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (inView) {
      if (!el.src) el.src = src;
      void el.play().catch(() => undefined);
    } else {
      el.pause();
    }
  }, [inView, src]);

  return <video ref={ref} muted loop playsInline preload="none" className={className} />;
}
