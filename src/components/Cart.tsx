"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { formatBRL, useCart } from "@/lib/cart";
import { colorOf } from "@/lib/vitrine";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Botão flutuante — some quando a sacola está vazia para não poluir a tela. */
export function CartButton() {
  const { count, setOpen } = useCart();

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.button
          type="button"
          onClick={() => setOpen(true)}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.35, ease: EASE }}
          aria-label={`Abrir sacola — ${count} ${count === 1 ? "item" : "itens"}`}
          /* bottom-28 empilha a sacola acima do botão do WhatsApp (bottom-8, 56px de altura) */
          className="group fixed bottom-28 right-8 z-50 flex h-14 items-center gap-3 rounded-full bg-ink px-5 text-bone-dark shadow-lg transition-transform duration-300 hover:scale-105 active:scale-95"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6ZM3 6h18M16 10a4 4 0 0 1-8 0"
            />
          </svg>
          <span className="tag tnum">{count}</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export default function Cart() {
  const {
    items,
    count,
    totalCents,
    open,
    setOpen,
    remove,
    setQty,
    clear,
    checkoutUrl,
  } = useCart();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm"
            aria-hidden
          />

          <motion.aside
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label="Sacola de compras"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: EASE }}
            className="fixed inset-y-0 right-0 z-[90] flex w-full max-w-md flex-col bg-bone text-ink shadow-2xl"
          >
            {/* cabeçalho */}
            <div className="flex items-center justify-between border-b border-ink/15 px-6 py-5">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-2xl font-light">Sacola</span>
                <span className="tag tnum text-ink-faint">
                  {count} {count === 1 ? "item" : "itens"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fechar sacola"
                className="tag -m-3 touch-manipulation p-3 text-ink"
              >
                Fechar ×
              </button>
            </div>

            {/* itens */}
            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <p className="font-serif text-2xl font-light text-ink-soft">
                  Sua sacola está vazia.
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="tag text-oxblood link-underline"
                >
                  Voltar à vitrine
                </button>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto px-6">
                  {items.map((i) => (
                    <li
                      key={i.key}
                      className="flex gap-4 border-b border-ink/10 py-5"
                    >
                      {/* Fundo claro fixo: as fotos têm fundo branco e o
                          mix-blend-multiply precisa de base clara. O painel
                          usa o tema escuro, onde bg-surface deixaria a peça
                          preta sobre preto. */}
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden border border-ink/15 bg-[#ECE8DF]">
                        {i.image && (
                          <Image
                            src={i.image}
                            alt={i.name}
                            fill
                            quality={70}
                            className="object-contain p-1 mix-blend-multiply"
                            sizes="80px"
                          />
                        )}
                      </div>

                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-serif text-lg font-light leading-tight">
                              {i.name}
                            </p>
                            <p className="mt-1 flex items-center gap-2 font-sans text-xs font-light text-ink-soft">
                              <span
                                aria-hidden
                                className="inline-block h-2.5 w-2.5 border border-ink/25"
                                style={{
                                  backgroundColor: colorOf(i.color).hex,
                                }}
                              />
                              {colorOf(i.color).label} · Tam.{" "}
                              <span className="tnum">{i.size}</span>
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(i.key)}
                            aria-label={`Remover ${i.name}`}
                            className="tag -m-2 shrink-0 touch-manipulation p-2 text-ink-faint transition-colors hover:text-oxblood"
                          >
                            ×
                          </button>
                        </div>

                        <div className="mt-auto flex items-end justify-between pt-3">
                          <div className="flex items-center border border-ink/20">
                            <button
                              type="button"
                              onClick={() => setQty(i.key, i.qty - 1)}
                              aria-label="Diminuir quantidade"
                              className="h-9 w-9 touch-manipulation text-ink-soft transition-colors hover:bg-ink hover:text-bone-dark"
                            >
                              −
                            </button>
                            <span className="tag tnum w-9 text-center">
                              {i.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => setQty(i.key, i.qty + 1)}
                              aria-label="Aumentar quantidade"
                              className="h-9 w-9 touch-manipulation text-ink-soft transition-colors hover:bg-ink hover:text-bone-dark"
                            >
                              +
                            </button>
                          </div>
                          <span className="font-serif text-lg font-light tnum">
                            {formatBRL(i.priceCents * i.qty)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* rodapé */}
                <div className="border-t border-ink/15 px-6 py-5">
                  <div className="flex items-baseline justify-between">
                    <span className="tag text-ink-faint">Total</span>
                    <span className="font-serif text-2xl font-light tnum">
                      {formatBRL(totalCents)}
                    </span>
                  </div>

                  <a
                    href={checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-5 flex w-full items-center justify-between bg-ink px-6 py-4 text-bone-dark transition-colors hover:bg-oxblood hover:text-ink"
                  >
                    <span className="tag">Finalizar no WhatsApp</span>
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </a>

                  <div className="mt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={clear}
                      className="tag text-ink-faint link-underline"
                    >
                      Esvaziar sacola
                    </button>
                    <span className="tag text-ink-faint">
                      Frete combinado no chat
                    </span>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
