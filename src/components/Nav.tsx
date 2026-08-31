"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

// Âncoras absolutas: o cabeçalho é compartilhado com /vitrine, onde um
// href puramente hash não encontraria a seção.
const links = [
  { n: "01", label: "Passarela", href: "/#passarela" },
  { n: "02", label: "Vitrine", href: "/vitrine" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50 border-b border-ink/10 bg-bone/70 backdrop-blur-md lg:pl-14"
      >
        <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4 md:px-10">
          <a href="/#top" className="group flex items-baseline gap-2">
            <span className="font-serif text-xl font-medium tracking-tight text-ink">
              ItalosLine
            </span>
            <span className="tag text-ink-faint">est. 2026</span>
          </a>

          <ul className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="group flex items-baseline gap-1.5 text-ink"
                >
                  <span className="tag tnum text-ink-faint transition-colors group-hover:text-oxblood">
                    {l.n}
                  </span>
                  <span className="link-underline text-sm">{l.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-6">
            <a
              href="/#medida"
              className="hidden tag text-oxblood link-underline md:inline"
            >
              Agendar prova →
            </a>
            <button
              onClick={() => setOpen(true)}
              className="tag -m-3 touch-manipulation p-3 text-ink md:hidden"
              aria-label="Abrir menu"
            >
              Menu +
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex flex-col bg-bone px-6 py-5 md:hidden"
          >
            <div className="flex items-center justify-between border-b border-ink/15 pb-4">
              <span className="font-serif text-xl text-ink">ItalosLine</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Fechar"
                className="tag -m-3 touch-manipulation p-3 text-ink"
              >
                Fechar ×
              </button>
            </div>
            <ul className="mt-10 flex flex-col">
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.07 }}
                  className="border-b border-ink/10 py-6"
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4"
                  >
                    <span className="tag tnum text-oxblood">{l.n}</span>
                    <span className="font-serif text-4xl text-ink">
                      {l.label}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
