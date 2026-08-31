"use client";

import { useEffect, useState } from "react";
import { Reveal } from "./Reveal";

const pieces = [
  "Blazer / Terno",
  "Camisa",
  "Calça",
  "Colete",
  "Guarda-roupa completo",
];

const sizes = ["P", "M", "G", "GG", "XG"];

export default function MadeToMeasure() {
  const [piece, setPiece] = useState(pieces[0]);
  const [size, setSize] = useState(sizes[1]);
  const [sent, setSent] = useState(false);
  const [fichaNum, setFichaNum] = useState("—");

  useEffect(() => {
    setFichaNum(String(Math.floor(Math.random() * 900) + 100));
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <section id="medida" className="border-t border-ink/10 bg-surface lg:pl-14">
      <div className="mx-auto max-w-[1600px] px-6 py-24 md:px-10 md:py-32">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* lado esquerdo — convite */}
          <div className="lg:col-span-5">
            <Reveal>
              <span className="tag text-oxbright">03 — Sob Medida</span>
              <h2 className="mt-6 font-serif text-5xl font-light leading-[0.95] text-ink md:text-6xl">
                A peça <span className="italic">só sua</span> começa com uma
                conversa.
              </h2>
              <p className="mt-8 max-w-md font-sans text-base font-light leading-relaxed text-ink/60">
                Reserve uma prova privada no ateliê. Tomamos suas medidas,
                escolhemos o tecido juntos e desenhamos uma peça que não existe
                em nenhum outro corpo além do seu.
              </p>
              <div className="mt-10 flex items-center gap-3">
                <span className="h-px w-10 bg-oxbright" />
                <span className="tag text-ink/65">
                  Resposta em até 24 horas
                </span>
              </div>
            </Reveal>
          </div>

          {/* lado direito — ficha de pedido */}
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={0.12}>
              <form
                onSubmit={submit}
                className="relative border border-ink/15 p-8 md:p-10"
              >
                <div className="flex items-baseline justify-between border-b border-ink/15 pb-4">
                  <span className="tag text-ink">Ficha de Prova</span>
                  <span className="tag text-ink/65 tnum">
                    Nº {fichaNum}
                  </span>
                </div>

                {!sent ? (
                  <div className="mt-8 space-y-8">
                    <Field label="Nome completo" name="nome" placeholder="Seu nome" />
                    <Field
                      label="Contato (e-mail ou telefone)"
                      name="contato"
                      placeholder="seu@email.com"
                    />

                    <div>
                      <label className="tag text-ink/65">Peça de interesse</label>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {pieces.map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setPiece(p)}
                            className={`border px-3 py-2 font-mono text-xs transition-colors ${
                              piece === p
                                ? "border-oxbright bg-oxbright text-ink"
                                : "border-ink/20 text-ink/60 hover:border-ink/50"
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="tag text-ink/65">Tamanho</label>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {sizes.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setSize(s)}
                            aria-pressed={size === s}
                            className={`min-w-[3rem] touch-manipulation border px-3 py-2 font-mono text-xs tnum transition-colors ${
                              size === s
                                ? "border-oxbright bg-oxbright text-ink"
                                : "border-ink/20 text-ink/60 hover:border-ink/50"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="group flex w-full items-center justify-between border border-ink/40 px-6 py-4 text-ink transition-colors hover:border-oxbright hover:bg-oxblood"
                    >
                      <span className="tag">Verificar pedido</span>
                      <span className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="mt-8 flex flex-col items-start gap-4 py-6">
                    <span className="inline-block -rotate-6 border-2 border-oxbright px-4 py-2 font-serif text-2xl text-oxbright">
                      Recebido ✓
                    </span>
                    <p className="font-sans text-sm font-light text-ink/60">
                      Seu pedido de <em className="text-ink">{piece}</em> no
                      tamanho <em className="text-ink tnum">{size}</em> foi
                      registrado. Entraremos em contato para confirmar os
                      detalhes.
                    </p>
                  </div>
                )}
              </form>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  placeholder,
}: {
  label: string;
  name: string;
  placeholder: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="tag text-ink/65">
        {label}
      </label>
      <input
        id={name}
        name={name}
        required
        placeholder={placeholder}
        className="mt-2 w-full border-b border-ink/20 bg-transparent pb-2 font-sans text-lg text-ink placeholder:text-ink/40 outline-none transition-colors focus:border-oxbright"
      />
    </div>
  );
}
