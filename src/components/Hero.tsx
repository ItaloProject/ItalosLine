"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef     = useRef<HTMLElement>(null);
  const frameRef       = useRef<HTMLDivElement>(null);
  const targetVideoRef = useRef<HTMLVideoElement>(null);
  const flyerRef       = useRef<HTMLDivElement>(null);
  const flyerVideoRef  = useRef<HTMLVideoElement>(null);
  const mastheadRef    = useRef<HTMLDivElement>(null);
  const plateRef       = useRef<HTMLElement>(null);
  const topBarRef      = useRef<HTMLDivElement>(null);
  const bottomBarRef   = useRef<HTMLDivElement>(null);
  const tagRef         = useRef<HTMLParagraphElement>(null);
  const copyRef        = useRef<HTMLParagraphElement>(null);
  const ctaRef         = useRef<HTMLDivElement>(null);
  const title1Ref      = useRef<HTMLDivElement>(null);
  const title2Ref      = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section     = sectionRef.current;
    const plate       = plateRef.current;
    const frame       = frameRef.current;
    const targetVideo = targetVideoRef.current;
    const flyer       = flyerRef.current;
    const flyerVideo  = flyerVideoRef.current;
    const title1      = title1Ref.current;
    const title2      = title2Ref.current;

    if (!section || !plate || !frame || !targetVideo || !flyer || !flyerVideo || !title1 || !title2) return;

    // A camisa toca inteira uma vez; depois prende os 2s finais em loop.
    const handleTailLoop = () => {
      if (targetVideo.duration && targetVideo.currentTime >= targetVideo.duration - 0.05) {
        targetVideo.currentTime = Math.max(0, targetVideo.duration - 2);
      }
    };
    const handleEnded = () => {
      targetVideo.currentTime = Math.max(0, targetVideo.duration - 2);
      void targetVideo.play().catch(() => undefined);
      targetVideo.addEventListener("timeupdate", handleTailLoop);
    };
    targetVideo.addEventListener("ended", handleEnded, { once: true });

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const unlockScroll = () => { document.body.style.overflow = ""; };

    const ctx = gsap.context(() => {
      if (reduced) {
        flyerVideo.pause();
        targetVideo.pause();
        gsap.set(flyer, { autoAlpha: 0 });
        gsap.set([title1, title2], { yPercent: 0 });
        gsap.set(
          [plate, targetVideo, tagRef.current, copyRef.current,
           ctaRef.current, topBarRef.current, bottomBarRef.current],
          { x: 0, y: 0, autoAlpha: 1 }
        );
        return;
      }

      // Trava o scroll enquanto a camisa está em trânsito
      document.body.style.overflow = "hidden";

      // ── Estados iniciais ─────────────────────────────────────────────
      gsap.set(tagRef.current, { yPercent: 110 });
      gsap.set(
        [copyRef.current, ctaRef.current, topBarRef.current, bottomBarRef.current],
        { autoAlpha: 0, y: 18 }
      );
      gsap.set([title1, title2], { yPercent: 105 });

      const frameRect = frame.getBoundingClientRect();
      targetVideo.currentTime = 0;
      flyerVideo.currentTime  = 0;
      void Promise.allSettled([targetVideo.play(), flyerVideo.play()]);

      gsap.set(plate, { autoAlpha: 1 });
      gsap.set(targetVideo, { autoAlpha: 0 });
      gsap.set(flyer, {
        width:    frameRect.width,
        height:   frameRect.height,
        x:        -frameRect.width * 1.2,
        y:        frameRect.top,
        rotate:   -5,
        scale:    0.9,
        autoAlpha: 1,
      });

      const intro = gsap.timeline();

      intro
        // 1 ▸ Camisa voa; título revela palavra a palavra
        .to(flyer, {
          x: frameRect.left, y: frameRect.top,
          rotate: 0, scale: 1,
          duration: 2.35, ease: "power3.inOut",
        }, 0)
        .to([title1, title2], {
          yPercent: 0,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.12,
        }, 0.75)

        // 2 ▸ Troca flyer → vídeo no quadro
        .call(() => {
          targetVideo.currentTime = flyerVideo.currentTime;
          void targetVideo.play().catch(() => undefined);
        })
        .to(targetVideo, { autoAlpha: 1, duration: 0.28, ease: "power2.out" })
        .to(flyer,       { autoAlpha: 0, duration: 0.28, ease: "power2.out" }, "<")

        // 3 ▸ Interface
        .to(topBarRef.current, { autoAlpha: 1, y: 0, duration: 0.7,  ease: "power3.out" }, "-=0.25")
        .to(tagRef.current,    { yPercent: 0,  duration: 0.9,  ease: "power4.out" }, "-=0.55")

        // 4 ▸ Copy e CTA
        .to(copyRef.current,      { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, "+=2.4")
        .to(ctaRef.current,       { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
        .to(bottomBarRef.current, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.55")
        .call(unlockScroll);

      // ── Parallax ─────────────────────────────────────────────────────
      gsap.to(mastheadRef.current, {
        yPercent: -12, ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(plate, {
        yPercent: 28, ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
      });
    }, section);

    return () => {
      ctx.revert();
      unlockScroll(); // garante liberação se o componente desmontar antes do fim
      targetVideo.removeEventListener("ended", handleEnded);
      targetVideo.removeEventListener("timeupdate", handleTailLoop);
    };
  }, []);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden lg:pl-14"
    >
      {/* Grade de papel de modelagem — reforça o vocabulário de alfaiataria */}
      <div
        aria-hidden
        className="rules pointer-events-none absolute inset-0 z-0 opacity-60"
      />

      {/* Camisa em trânsito */}
      <div
        ref={flyerRef}
        className="pointer-events-none fixed left-0 top-0 z-50 will-change-transform"
        style={{ opacity: 0, visibility: "hidden" }}
        aria-hidden
      >
        <video
          ref={flyerVideoRef}
          className="h-full w-full object-cover object-left"
          style={{
            clipPath:
              "polygon(34% 10%, 50% 8%, 70% 10%, 85% 17%, 100% 29%, 100% 43%, 89% 45%, 82% 35%, 88% 90%, 29% 90%, 30% 36%, 16% 43%, 7% 31%, 22% 17%)",
          }}
          muted playsInline preload="auto" loop
        >
          <source src="/videos/camisa-flyer.webm" type="video/webm" />
        </video>
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1600px] flex-col px-6 pb-8 pt-24 md:px-10">

        <div ref={topBarRef} className="flex items-center justify-between border-b border-ink/15 pb-4">
          <span className="tag text-ink">Arquivo Nº 01</span>
          <span className="tag hidden text-ink-faint sm:inline">Casa de Alfaiataria</span>
          <span className="tag text-ink">Estação Um · MMXXVI</span>
        </div>

        <div className="relative grid flex-1 grid-cols-12 items-center gap-6 py-10">

          <div ref={mastheadRef} className="relative col-span-12 lg:col-span-8">
            {/* Numeral fantasma — escala e profundidade editorial */}
            <span
              aria-hidden
              className="text-outline pointer-events-none absolute -left-4 -top-16 -z-10 select-none font-serif text-[13rem] font-light leading-none opacity-[0.07] sm:text-[18rem] lg:-top-24 lg:text-[24rem]"
            >
              01
            </span>

            <div className="overflow-hidden mb-6">
              <p ref={tagRef} className="tag text-oxblood">
                São Paulo · Feito à mão, peça por peça
              </p>
            </div>

            {/* Logotipo tipográfico — revela por palavra */}
            <div aria-label="ItalosLine" className="mb-2 select-none">
              <div className="overflow-hidden">
                <div
                  ref={title1Ref}
                  className="font-serif text-[clamp(3.6rem,10vw,8.5rem)] font-extralight tracking-[-0.02em] text-ink"
                >
                  Italos
                </div>
              </div>
              <div className="-mt-3 overflow-hidden sm:-mt-4 lg:-mt-6">
                <div
                  ref={title2Ref}
                  className="font-serif text-[clamp(3.6rem,10vw,8.5rem)] font-extralight italic tracking-[-0.02em] text-ink"
                >
                  Line
                </div>
              </div>
            </div>

            <p
              ref={copyRef}
              className="mt-6 max-w-md font-sans text-base font-light leading-relaxed text-ink-soft"
            >
              Uma casa de alfaiataria que trata cada peça como parte de um
              arquivo — numerada, registrada, construída para atravessar
              estações. Sem pressa. Sem excesso.
            </p>

            <div ref={ctaRef} className="mt-9 flex items-center gap-8">
              <a
                href="#passarela"
                className="group inline-flex items-center gap-3 bg-ink px-8 py-4 text-bone-dark transition-colors hover:bg-oxblood hover:text-ink"
              >
                <span className="tag">Ver a passarela</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
              <a href="/vitrine" className="tag text-ink link-underline">A vitrine</a>
            </div>
          </div>

          {/* Quadro */}
          <figure
            ref={plateRef}
            className="col-span-8 col-start-3 mt-4 lg:col-span-4 lg:col-start-9 lg:mt-0"
          >
            <div
              ref={frameRef}
              className="relative aspect-[3/4] w-full border border-ink/20 p-2"
            >
              <div className="relative h-full w-full overflow-hidden bg-[#c8ced1]">
                <video
                  ref={targetVideoRef}
                  className="h-full w-full object-cover object-[8%_center]"
                  muted playsInline preload="auto"
                >
                  <source src="/videos/camisa-intro.mp4" type="video/mp4" />
                </video>
                {/* Tingimento de marca — une a peça à paleta oxblood/tinta */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-oxblood/25 via-transparent to-ink/10 mix-blend-multiply"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 shadow-[inset_0_0_90px_rgba(0,0,0,0.35)]"
                />
              </div>

              {/* Etiqueta vertical — margem do quadro */}
              <span className="tag pointer-events-none absolute -right-1 top-3 origin-top-right rotate-180 text-ink-faint [writing-mode:vertical-rl]">
                ItalosLine · Pl. 001
              </span>
            </div>
            <figcaption className="mt-3 flex items-center justify-between">
              <span className="tag text-ink-faint">Pl. 001</span>
              <span className="tag text-ink-faint">Camisa em movimento</span>
            </figcaption>
          </figure>
        </div>

        <div ref={bottomBarRef} className="flex items-center justify-between border-t border-ink/15 pt-4">
          <span className="tag text-ink-faint">↓ Role para explorar</span>
          <span className="tag tnum text-ink-faint">23°33′S 46°38′O</span>
        </div>
      </div>
    </section>
  );
}
