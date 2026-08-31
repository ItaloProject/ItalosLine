const entries = [
  "Lã virgem 130's — Biella",
  "Algodão egípcio 2-ply — Como",
  "22 medidas por peça",
  "3 provas antes da entrega",
  "Linho irlandês",
  "Costura de entretela à mão",
  "Edições numeradas",
  "Mohair & lã — noite",
];

export default function Ticker() {
  const row = [...entries, ...entries];
  return (
    <div className="overflow-hidden border-y border-ink/10 bg-surface lg:ml-14">
      <div className="flex w-max animate-ticker">
        {row.map((t, i) => (
          <span key={i} className="flex items-center py-3">
            <span className="tag mx-6 text-ink/70">{t}</span>
            <span className="text-oxbright">✳</span>
          </span>
        ))}
      </div>
    </div>
  );
}
