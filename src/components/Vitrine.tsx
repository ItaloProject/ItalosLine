"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { parsePriceCents, useCart } from "@/lib/cart";
import {
  COLORS,
  GROUPS,
  SIZES,
  models,
  colorOf,
  groupOf,
  type ColorId,
  type GroupId,
  type Model,
  type SizeId,
} from "@/lib/vitrine";

type GroupFilter = GroupId | "todas";

export default function Vitrine() {
  const [group, setGroup] = useState<GroupFilter>("todas");
  const [colors, setColors] = useState<ColorId[]>([]);
  const [sizes, setSizes] = useState<SizeId[]>([]);
  /** Só no mobile: tamanho e cor moram num painel, para a barra caber numa linha. */
  const [sheetOpen, setSheetOpen] = useState(false);

  const byGroup = useMemo(
    () => (group === "todas" ? models : models.filter((m) => m.group === group)),
    [group]
  );

  // Filtros combinam por E: a peça precisa atender cor E tamanho.
  const matches = (m: Model) =>
    (colors.length === 0 || m.variants.some((v) => colors.includes(v.color))) &&
    (sizes.length === 0 || m.sizes.some((s) => sizes.includes(s)));

  const shown = useMemo(() => byGroup.filter(matches), [byGroup, colors, sizes]);

  const available = useMemo(
    () => new Set(byGroup.flatMap((m) => m.variants.map((v) => v.color))),
    [byGroup]
  );

  const availableSizes = useMemo(
    () => new Set(byGroup.flatMap((m) => m.sizes)),
    [byGroup]
  );

  const toggleColor = (id: ColorId) =>
    setColors((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  const toggleSize = (id: SizeId) =>
    setSizes((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const countFor = (g: GroupFilter) =>
    g === "todas" ? models.length : models.filter((m) => m.group === g).length;

  const clearAll = () => {
    setGroup("todas");
    setColors([]);
    setSizes([]);
  };

  const groupOptions = ["todas", ...GROUPS.map((g) => g.id)] as GroupFilter[];

  /** Refinamentos ativos (tamanho + cor) — vira o contador do botão no mobile. */
  const refinementCount = sizes.length + colors.length;

  const chipsRef = useRef<HTMLDivElement>(null);

  // Trava o fundo e fecha no Esc enquanto o painel de filtros está aberto.
  useEffect(() => {
    if (!sheetOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSheetOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [sheetOpen]);

  return (
    <section id="vitrine" className="relative lg:pl-14">
      {/* ── Cabeçalho ────────────────────────────────────────────────── */}
      <header className="mx-auto max-w-[1600px] px-6 pt-32 md:px-10 md:pt-40">
        <div className="flex items-baseline justify-between border-b border-ink/15 pb-5">
          <span className="tag text-oxblood">02 — Vitrine</span>
          <span className="tag text-ink-faint">
            {models.length} modelos · Estação Um
          </span>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 pt-10 md:flex-row md:items-end">
          <h1 className="font-serif text-[clamp(3.2rem,8vw,6.5rem)] font-light leading-[0.9] text-ink">
            Vitrine
          </h1>
          <p className="tag max-w-sm text-right text-ink-faint">
            Escolha a cor e o tamanho direto no card e adicione à sacola.
          </p>
        </div>
      </header>

      {/* ── Filtros ──────────────────────────────────────────────────── */}
      <div className="sticky top-[57px] z-30 mt-10 hidden border-y border-ink/15 bg-bone/85 backdrop-blur-md lg:block">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-6 py-4 md:px-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-7 gap-y-2">
            <span className="tag text-ink-faint">Grupo</span>
            {(["todas", ...GROUPS.map((g) => g.id)] as GroupFilter[]).map((g) => {
              const active = group === g;
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGroup(g)}
                  aria-pressed={active}
                  className={`tag flex items-baseline gap-1.5 border-b pb-0.5 transition-colors ${
                    active
                      ? "border-oxblood text-oxblood"
                      : "border-transparent text-ink-soft hover:text-ink"
                  }`}
                >
                  {g === "todas" ? "Todas" : groupOf(g).label}
                  <span className="tnum text-ink-faint">
                    {String(countFor(g)).padStart(2, "0")}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
            <span className="tag mr-1 text-ink-faint">Tamanho</span>
            {SIZES.map((s) => {
              const active = sizes.includes(s);
              const has = availableSizes.has(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSize(s)}
                  disabled={!has}
                  aria-pressed={active}
                  className={`tag h-8 min-w-[2.25rem] touch-manipulation border px-2 tnum transition-colors sm:h-7 ${
                    active
                      ? "border-oxblood bg-oxblood text-bone-dark"
                      : "border-ink/25 text-ink-soft hover:border-ink/60"
                  } ${has ? "" : "cursor-not-allowed opacity-20"}`}
                >
                  {s}
                </button>
              );
            })}
            {sizes.length > 0 && (
              <button
                type="button"
                onClick={() => setSizes([])}
                className="tag ml-1 text-oxblood link-underline"
              >
                Limpar
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2">
            <span className="tag mr-1 text-ink-faint">Cor</span>
            {COLORS.map((c) => {
              const active = colors.includes(c.id);
              const has = available.has(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggleColor(c.id)}
                  disabled={!has}
                  aria-pressed={active}
                  title={c.label}
                  className={`h-8 w-8 touch-manipulation border transition-all sm:h-6 sm:w-6 ${
                    active
                      ? "border-oxblood ring-1 ring-oxblood ring-offset-2 ring-offset-bone"
                      : "border-ink/25 hover:border-ink/60"
                  } ${has ? "" : "cursor-not-allowed opacity-20"}`}
                  style={{ backgroundColor: c.hex }}
                >
                  <span className="sr-only">{c.label}</span>
                </button>
              );
            })}
            {colors.length > 0 && (
              <button
                type="button"
                onClick={() => setColors([])}
                className="tag ml-1 text-oxblood link-underline"
              >
                Limpar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filtros · mobile — barra enxuta: grupos numa linha rolável e o
          resto num painel. Antes os três blocos empilhavam e empurravam a
          primeira peça para fora da tela. */}
      <div className="sticky top-[57px] z-30 mt-10 border-y border-ink/15 bg-bone/95 backdrop-blur-md lg:hidden">
        <div className="relative">
          <div ref={chipsRef} className="flex gap-2 overflow-x-auto px-6 py-3 pr-12 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {groupOptions.map((g) => {
              const active = group === g;
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGroup(g)}
                  aria-pressed={active}
                  className={`tag flex shrink-0 touch-manipulation items-baseline gap-1.5 border px-3.5 py-2.5 transition-colors ${
                    active
                      ? "border-oxblood bg-oxblood text-bone-dark"
                      : "border-ink/20 text-ink-soft"
                  }`}
                >
                  {g === "todas" ? "Todas" : groupOf(g).label}
                  <span
                    className={`tnum ${active ? "text-bone-dark/70" : "text-ink-faint"}`}
                  >
                    {String(countFor(g)).padStart(2, "0")}
                  </span>
                </button>
              );
            })}
          </div>
          {/* Botão de scroll: toca para revelar chips escondidos à direita */}
          <button
            type="button"
            aria-label="Ver mais filtros"
            onClick={() =>
              chipsRef.current?.scrollBy({ left: 140, behavior: "smooth" })
            }
            className="absolute inset-y-0 right-0 flex w-14 touch-manipulation items-center justify-end bg-gradient-to-l from-bone/95 via-bone/80 to-transparent pr-3"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-ink-faint"
              aria-hidden
            >
              <path d="M6 3l5 5-5 5" />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-ink/10 px-6 py-2.5">
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="tag flex touch-manipulation items-center gap-2 border border-ink/25 px-4 py-2.5 text-ink"
          >
            Tamanho e cor
            {refinementCount > 0 && (
              <span className="tnum flex h-5 min-w-[1.25rem] items-center justify-center bg-oxblood px-1 text-bone-dark">
                {refinementCount}
              </span>
            )}
          </button>
          <span className="tag tnum shrink-0 text-ink-faint">
            {shown.length} {shown.length === 1 ? "peça" : "peças"}
          </span>
        </div>
      </div>

      {/* Painel de tamanho e cor · mobile */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setSheetOpen(false)}
              className="fixed inset-0 z-[80] bg-black/50 lg:hidden"
              aria-hidden
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Filtrar por tamanho e cor"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-0 bottom-0 z-[90] flex max-h-[85vh] flex-col bg-bone lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-ink/15 px-6 py-4">
                <span className="font-serif text-xl font-light text-ink">
                  Filtros
                </span>
                <button
                  type="button"
                  onClick={() => setSheetOpen(false)}
                  className="tag -m-3 touch-manipulation p-3 text-ink"
                >
                  Fechar ×
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6">
                <p className="tag text-ink-faint">Tamanho</p>
                <div className="mt-3 flex gap-2">
                  {SIZES.map((s) => {
                    const active = sizes.includes(s);
                    const has = availableSizes.has(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleSize(s)}
                        disabled={!has}
                        aria-pressed={active}
                        className={`tag tnum h-12 flex-1 touch-manipulation border transition-colors ${
                          active
                            ? "border-oxblood bg-oxblood text-bone-dark"
                            : "border-ink/25 text-ink-soft"
                        } ${has ? "" : "cursor-not-allowed opacity-25"}`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>

                <p className="tag mt-8 text-ink-faint">Cor</p>
                <div className="mt-3 flex flex-col gap-2">
                  {COLORS.map((c) => {
                    const active = colors.includes(c.id);
                    const has = available.has(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => toggleColor(c.id)}
                        disabled={!has}
                        aria-pressed={active}
                        className={`flex touch-manipulation items-center gap-3 border px-3 py-3 transition-colors ${
                          active ? "border-oxblood" : "border-ink/20"
                        } ${has ? "" : "cursor-not-allowed opacity-30"}`}
                      >
                        <span
                          aria-hidden
                          className="h-6 w-6 shrink-0 border border-ink/25"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span className="tag text-ink">{c.label}</span>
                        {active && (
                          <span className="tag ml-auto text-oxblood">
                            Selecionada
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-3 border-t border-ink/15 px-6 py-4">
                <button
                  type="button"
                  onClick={clearAll}
                  className="tag flex-1 touch-manipulation border border-ink/25 py-3.5 text-ink-soft"
                >
                  Limpar tudo
                </button>
                <button
                  type="button"
                  onClick={() => setSheetOpen(false)}
                  className="tag flex-1 touch-manipulation bg-ink py-3.5 text-bone-dark"
                >
                  Ver {shown.length} {shown.length === 1 ? "peça" : "peças"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Grade de modelos ─────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1600px] px-6 py-6 md:px-10">
        {shown.length === 0 ? (
          <div className="border-b border-ink/15 py-32 text-center">
            <p className="font-serif text-2xl font-light text-ink-soft">
              Nenhuma peça nesta combinação.
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="tag mt-6 text-oxblood link-underline"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 pb-24 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((m, i) => (
              <ModelCard key={m.id} model={m} activeColors={colors} priority={i === 0} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ModelCard({
  model,
  activeColors,
  priority = false,
}: {
  model: Model;
  activeColors: ColorId[];
  priority?: boolean;
}) {
  const preferred =
    model.variants.find((v) => activeColors.includes(v.color)) ??
    model.variants[0];

  const [ref, setRef] = useState(preferred.ref);
  const variant = model.variants.find((v) => v.ref === ref) ?? preferred;

  // Sem tamanho pré-selecionado: em roupa, escolher errado por descuido
  // custa uma troca. O botão fica travado até a escolha.
  const [size, setSize] = useState<SizeId | null>(null);
  const { add } = useCart();

  useEffect(() => {
    setRef(preferred.ref);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferred.ref]);

  return (
    /* id = alvo do link enviado no pedido (/vitrine#id). O scroll-mt
       compensa o cabeçalho fixo + a barra de filtros grudada no topo,
       senão a peça abre escondida atrás deles. */
    <article id={model.id} className="group scroll-mt-40">
      <figure className="relative aspect-[3/4] w-full overflow-hidden border border-ink/20 bg-surface">
        {variant.image ? (
          <Image
            src={variant.image}
            alt={`${model.name} — ${colorOf(variant.color).label}`}
            fill
            quality={85}
            priority={priority}
            className="object-contain p-6 mix-blend-multiply transition-transform duration-700 ease-editorial group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="tag text-ink-faint">Foto em breve</span>
          </div>
        )}

        {model.variants.length > 1 && (
          <div className="pointer-events-none absolute left-3 top-3 flex gap-1.5">
            {model.variants.map((v) => (
              <button
                key={v.ref}
                type="button"
                onClick={() => setRef(v.ref)}
                title={colorOf(v.color).label}
                aria-pressed={v.ref === ref}
                className={`pointer-events-auto h-8 w-8 touch-manipulation rounded-full border shadow-sm transition-all sm:h-6 sm:w-6 ${
                  v.ref === ref
                    ? "border-oxblood ring-2 ring-oxblood ring-offset-2 ring-offset-bone"
                    : "border-ink/20 hover:border-ink/60"
                }`}
                style={{ backgroundColor: colorOf(v.color).hex }}
              >
                <span className="sr-only">{colorOf(v.color).label}</span>
              </button>
            ))}
          </div>
        )}
      </figure>

      <div className="mt-3 flex items-baseline justify-between border-t border-ink/15 pt-3">
        <span className="tag tnum text-ink-faint">{variant.ref}</span>
        <span className="tag text-ink-faint">{groupOf(model.group).label}</span>
      </div>

      <div className="mt-2 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-light text-ink">
            {model.name}
          </h2>
          <p className="mt-1 flex items-center gap-2 font-sans text-sm font-light text-ink-soft">
            <span
              aria-hidden
              className="inline-block h-2.5 w-2.5 border border-ink/25"
              style={{ backgroundColor: colorOf(variant.color).hex }}
            />
            {colorOf(variant.color).label}
          </p>
        </div>
        <span className="shrink-0 font-serif text-lg font-light tnum text-ink">
          {variant.price}
        </span>
      </div>

      <dl className="mt-3 space-y-1 font-sans text-xs font-light text-ink-faint">
        <div className="flex justify-between gap-4">
          <dt>Tecido</dt>
          <dd className="text-right text-ink-soft">{variant.fabric}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Gramatura</dt>
          <dd className="tnum text-right text-ink-soft">{variant.weight}</dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <span className="tag mr-1 text-ink-faint">Tam.</span>
        {model.sizes.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSize(s)}
            aria-pressed={size === s}
            className={`tag h-8 min-w-[2.25rem] touch-manipulation border px-2 tnum transition-colors ${
              size === s
                ? "border-ink bg-ink text-bone-dark"
                : "border-ink/25 text-ink-soft hover:border-ink/60"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={!size}
        onClick={() => {
          if (!size) return;
          add({
            ref: variant.ref,
            name: model.name,
            color: variant.color,
            size,
            priceCents: parsePriceCents(variant.price),
            image: variant.image,
            modelId: model.id,
          });
        }}
        className={`tag mt-3 flex w-full touch-manipulation items-center justify-between border px-4 py-3 transition-colors ${
          size
            ? "border-ink/25 text-ink-soft hover:border-ink hover:bg-ink hover:text-bone-dark"
            : "cursor-not-allowed border-ink/15 text-ink-faint"
        }`}
      >
        <span>{size ? "Adicionar à sacola" : "Escolha o tamanho"}</span>
        <span aria-hidden>→</span>
      </button>
    </article>
  );
}
