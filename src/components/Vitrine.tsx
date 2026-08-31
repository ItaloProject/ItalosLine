"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  COLORS,
  GROUPS,
  models,
  colorOf,
  groupOf,
  type ColorId,
  type GroupId,
  type Model,
} from "@/lib/vitrine";

type GroupFilter = GroupId | "todas";

export default function Vitrine() {
  const [group, setGroup] = useState<GroupFilter>("todas");
  const [colors, setColors] = useState<ColorId[]>([]);

  const byGroup = useMemo(
    () => (group === "todas" ? models : models.filter((m) => m.group === group)),
    [group]
  );

  const matches = (m: Model) =>
    colors.length === 0 || m.variants.some((v) => colors.includes(v.color));

  const shown = useMemo(() => byGroup.filter(matches), [byGroup, colors]);

  const available = useMemo(
    () => new Set(byGroup.flatMap((m) => m.variants.map((v) => v.color))),
    [byGroup]
  );

  const toggleColor = (id: ColorId) =>
    setColors((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  const countFor = (g: GroupFilter) =>
    g === "todas" ? models.length : models.filter((m) => m.group === g).length;

  const clearAll = () => {
    setGroup("todas");
    setColors([]);
  };

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
            Escolha a cor direto no card. Agende uma prova para medidas personalizadas.
          </p>
        </div>
      </header>

      {/* ── Filtros ──────────────────────────────────────────────────── */}
      <div className="sticky top-[57px] z-30 mt-10 border-y border-ink/15 bg-bone/85 backdrop-blur-md">
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
                  className={`h-6 w-6 border transition-all ${
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
            {shown.map((m) => (
              <ModelCard key={m.id} model={m} activeColors={colors} />
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
}: {
  model: Model;
  activeColors: ColorId[];
}) {
  const preferred =
    model.variants.find((v) => activeColors.includes(v.color)) ??
    model.variants[0];

  const [ref, setRef] = useState(preferred.ref);
  const variant = model.variants.find((v) => v.ref === ref) ?? preferred;

  useEffect(() => {
    setRef(preferred.ref);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferred.ref]);

  return (
    <article className="group">
      <figure className="relative aspect-[3/4] w-full overflow-hidden border border-ink/20 bg-surface">
        {variant.image ? (
          <Image
            src={variant.image}
            alt={`${model.name} — ${colorOf(variant.color).label}`}
            fill
            quality={100}
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
                className={`pointer-events-auto h-6 w-6 rounded-full border shadow-sm transition-all ${
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

      <a
        href="/#medida"
        className="tag mt-4 inline-flex items-center gap-3 border border-ink/25 px-4 py-2.5 text-ink-soft transition-colors hover:border-ink hover:bg-ink hover:text-bone-dark"
      >
        Agendar prova →
      </a>
    </article>
  );
}
