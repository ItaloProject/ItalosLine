import { WHATSAPP_URL } from "@/lib/contact";

type Col = { title: string; links: { label: string; href: string; external?: boolean }[] };

const cols: Col[] = [
  {
    title: "Navegar",
    links: [
      { label: "Passarela",  href: "/#passarela" },
      { label: "Vitrine",    href: "/vitrine" },
      { label: "Sob medida", href: "/#medida" },
      { label: "Arquivo",    href: "/#arquivo" },
    ],
  },
  {
    title: "Atendimento",
    links: [
      { label: "Agendar prova",   href: "/#medida" },
      { label: "Guia de medidas", href: "#" },
      { label: "Cuidados",        href: "#" },
      { label: "Trocas",          href: "#" },
    ],
  },
  {
    title: "Social",
    links: [
      { label: "Instagram",  href: "#" },
      { label: "Pinterest",  href: "#" },
      { label: "WhatsApp",   href: WHATSAPP_URL, external: true },
      { label: "Newsletter", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-ink/15 bg-bone lg:pl-14">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        {/* wordmark gigante */}
        <div className="border-b border-ink/15 py-14">
          <p className="break-words font-serif text-[13vw] font-light leading-none text-ink">
            Italos<span className="italic text-outline">Line</span>
          </p>
        </div>

        {/* colunas */}
        <div className="grid grid-cols-2 gap-10 py-14 md:grid-cols-5">
          <div className="col-span-2">
            <p className="max-w-xs font-sans text-sm font-light leading-relaxed text-ink-soft">
              Casa de alfaiataria contemporânea. Peças numeradas, feitas à mão,
              construídas para atravessar o tempo.
            </p>
            <p className="mt-6 tag text-oxblood">São Paulo · Brasil</p>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <p className="tag mb-5 text-ink-faint">{c.title}</p>
              <ul className="space-y-3">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="link-underline font-sans text-sm text-ink"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* colofão */}
        <div className="flex flex-col items-start justify-between gap-3 border-t border-ink/15 py-6 md:flex-row md:items-center">
          <span className="tag text-ink-faint tnum">
            © {new Date().getFullYear()} ItalosLine — Arquivo Nº 01
          </span>
          <span className="tag text-ink-faint">
            Feito à mão, peça por peça
          </span>
          <div className="flex gap-6">
            <a href="#" className="tag text-ink-faint link-underline">
              Privacidade
            </a>
            <a href="#" className="tag text-ink-faint link-underline">
              Termos
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
