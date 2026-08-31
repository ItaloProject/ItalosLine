// Catálogo da Vitrine — modelos agrupados por tipo. Cada modelo pode ter
// mais de uma cor (variantes); o usuário troca a cor sem sair do quadro.

export type GroupId = "camisas" | "bermudas" | "kits";
export type ColorId = "off-white" | "areia" | "preto";
export type SizeId = "P" | "M" | "G" | "GG" | "XG";

/** Ordem de exibição — do menor para o maior, não alfabética. */
export const SIZES: SizeId[] = ["P", "M", "G", "GG", "XG"];

export type Variant = {
  ref: string;
  color: ColorId;
  price: string;
  fabric: string;
  weight: string;
  origin: string;
  /** Foto estática — pôster enquanto a sequência carrega. Omitir mostra fundo neutro. */
  image?: string;
};

export type Model = {
  id: string;
  name: string;
  group: GroupId;
  /** Grade disponível do modelo. Vale para todas as cores dele. */
  sizes: SizeId[];
  variants: Variant[];
};

export const GROUPS: { id: GroupId; label: string; note: string }[] = [
  { id: "camisas",  label: "Camisas",  note: "Camisaria" },
  { id: "bermudas", label: "Bermudas", note: "Moda praia e casual" },
  { id: "kits",     label: "Kits",     note: "Looks completos" },
];

export const COLORS: { id: ColorId; label: string; hex: string }[] = [
  { id: "off-white", label: "Off-white", hex: "#ECE7DC" },
  { id: "areia", label: "Areia", hex: "#C4AE8C" },
  { id: "preto", label: "Preto", hex: "#17161A" },
];

export const models: Model[] = [
  {
    id: "camisa-oxford",
    name: "Camisa Oxford",
    group: "camisas",
    sizes: ["P", "M", "G", "GG", "XG"],
    variants: [
      {
        ref: "IL—108",
        color: "off-white",
        price: "R$ 780",
        fabric: "Oxford fio tinto",
        weight: "160 g/m²",
        origin: "Como, Itália",
        image: "/products/camisa-oxford-branca.png",
      },
      {
        ref: "IL—109",
        color: "preto",
        price: "R$ 780",
        fabric: "Oxford fio tinto",
        weight: "160 g/m²",
        origin: "Como, Itália",
        image: "/products/camisa-oxford-preta.png",
      },
      {
        ref: "IL—110",
        color: "areia",
        price: "R$ 780",
        fabric: "Oxford fio tinto",
        weight: "160 g/m²",
        origin: "Como, Itália",
        image: "/products/camisa-oxford-bege.png",
      },
    ],
  },
  {
    id: "camisa-polo-malha",
    name: "Polo Milanese",
    group: "camisas",
    sizes: ["P", "M", "G", "GG", "XG"],
    variants: [
      {
        ref: "IL—120",
        color: "off-white",
        price: "R$ 480",
        fabric: "Piquet de algodão",
        weight: "220 g/m²",
        origin: "São Paulo, Brasil",
        image: "/products/polo-piquet-branca.png",
      },
      {
        ref: "IL—122",
        color: "preto",
        price: "R$ 480",
        fabric: "Piquet de algodão",
        weight: "220 g/m²",
        origin: "São Paulo, Brasil",
        image: "/products/polo-piquet-preta.png",
      },
      {
        ref: "IL—123",
        color: "areia",
        price: "R$ 480",
        fabric: "Piquet de algodão",
        weight: "220 g/m²",
        origin: "São Paulo, Brasil",
        image: "/products/polo-piquet-bege.png",
      },
    ],
  },
  {
    id: "camisa-linho",
    name: "Camisa Linho Riviera",
    group: "camisas",
    sizes: ["P", "M", "G", "GG"],
    variants: [
      {
        ref: "IL—141",
        color: "off-white",
        price: "R$ 620",
        fabric: "Linho puro",
        weight: "170 g/m²",
        origin: "Portofino, Itália",
        image: "/products/camisa-linho-branca.png",
      },
      {
        ref: "IL—140",
        color: "preto",
        price: "R$ 620",
        fabric: "Linho puro",
        weight: "170 g/m²",
        origin: "Portofino, Itália",
        image: "/products/camisa-linho-preta.png",
      },
      {
        ref: "IL—142",
        color: "areia",
        price: "R$ 620",
        fabric: "Linho puro",
        weight: "170 g/m²",
        origin: "Portofino, Itália",
        image: "/products/camisa-linho-bege.png",
      },
    ],
  },
  // ── Bermudas ────────────────────────────────────────────────────────────
  {
    id: "bermuda-moletom",
    name: "Bermuda Moletom",
    group: "bermudas",
    sizes: ["P", "M", "G", "GG", "XG"],
    variants: [
      {
        ref: "IL—201",
        color: "off-white",
        price: "R$ 290",
        fabric: "Moletinho de algodão",
        weight: "280 g/m²",
        origin: "São Paulo, Brasil",
        image: "/products/bermuda-moletom-branca.png",
      },
      {
        ref: "IL—202",
        color: "preto",
        price: "R$ 290",
        fabric: "Moletinho de algodão",
        weight: "280 g/m²",
        origin: "São Paulo, Brasil",
        image: "/products/bermuda-moletom-preta.png",
      },
      {
        ref: "IL—203",
        color: "areia",
        price: "R$ 290",
        fabric: "Moletinho de algodão",
        weight: "280 g/m²",
        origin: "São Paulo, Brasil",
        image: "/products/bermuda-moletom-bege.png",
      },
    ],
  },
  {
    id: "bermuda-cargo",
    name: "Bermuda Cargo",
    group: "bermudas",
    sizes: ["M", "G", "GG", "XG"],
    variants: [
      {
        ref: "IL—210",
        color: "off-white",
        price: "R$ 380",
        fabric: "Sarja de algodão",
        weight: "260 g/m²",
        origin: "São Paulo, Brasil",
        image: "/products/bermuda-cargo-branca.png",
      },
      {
        ref: "IL—211",
        color: "preto",
        price: "R$ 380",
        fabric: "Sarja de algodão",
        weight: "260 g/m²",
        origin: "São Paulo, Brasil",
        image: "/products/bermuda-cargo-preta.png",
      },
      {
        ref: "IL—212",
        color: "areia",
        price: "R$ 380",
        fabric: "Sarja de algodão",
        weight: "260 g/m²",
        origin: "São Paulo, Brasil",
        image: "/products/bermuda-cargo-bege.png",
      },
    ],
  },
  {
    id: "bermuda-sarja",
    name: "Bermuda Sarja",
    group: "bermudas",
    sizes: ["P", "M", "G", "GG", "XG"],
    variants: [
      {
        ref: "IL—220",
        color: "off-white",
        price: "R$ 320",
        fabric: "Sarja leve",
        weight: "240 g/m²",
        origin: "São Paulo, Brasil",
        image: "/products/bermuda-sarja-branca.png",
      },
      {
        ref: "IL—221",
        color: "preto",
        price: "R$ 320",
        fabric: "Sarja leve",
        weight: "240 g/m²",
        origin: "São Paulo, Brasil",
        image: "/products/bermuda-sarja-preta.png",
      },
      {
        ref: "IL—222",
        color: "areia",
        price: "R$ 320",
        fabric: "Sarja leve",
        weight: "240 g/m²",
        origin: "São Paulo, Brasil",
        image: "/products/bermuda-sarja-bege.png",
      },
    ],
  },
  // ── Kits / Looks completos ───────────────────────────────────────────────
  {
    id: "kit-polo",
    name: "Kit Polo",
    group: "kits",
    sizes: ["M", "G", "GG"],
    variants: [
      {
        ref: "IL—301",
        color: "off-white",
        price: "R$ 680",
        fabric: "Piquet + Sarja",
        weight: "220 + 240 g/m²",
        origin: "São Paulo, Brasil",
        image: "/products/kit-polo-branca.png",
      },
      {
        ref: "IL—302",
        color: "preto",
        price: "R$ 680",
        fabric: "Piquet + Sarja",
        weight: "220 + 240 g/m²",
        origin: "São Paulo, Brasil",
        image: "/products/kit-polo-preta.png",
      },
      {
        ref: "IL—303",
        color: "areia",
        price: "R$ 680",
        fabric: "Piquet + Sarja",
        weight: "220 + 240 g/m²",
        origin: "São Paulo, Brasil",
        image: "/products/kit-polo-bege.png",
      },
    ],
  },
  {
    id: "kit-casual",
    name: "Kit Casual",
    group: "kits",
    sizes: ["P", "M", "G", "GG"],
    variants: [
      {
        ref: "IL—310",
        color: "off-white",
        price: "R$ 720",
        fabric: "Oxford + Sarja",
        weight: "160 + 240 g/m²",
        origin: "São Paulo, Brasil",
        image: "/products/kit-casual-branca.png",
      },
      {
        ref: "IL—311",
        color: "preto",
        price: "R$ 720",
        fabric: "Oxford + Sarja",
        weight: "160 + 240 g/m²",
        origin: "São Paulo, Brasil",
        image: "/products/kit-casual-preta.png",
      },
      {
        ref: "IL—312",
        color: "areia",
        price: "R$ 720",
        fabric: "Oxford + Sarja",
        weight: "160 + 240 g/m²",
        origin: "São Paulo, Brasil",
        image: "/products/kit-casual-bege.png",
      },
    ],
  },
  {
    id: "kit-formal",
    name: "Kit Formal",
    group: "kits",
    sizes: ["M", "G", "GG", "XG"],
    variants: [
      {
        ref: "IL—321",
        color: "preto",
        price: "R$ 840",
        fabric: "Linho + Sarja",
        weight: "170 + 240 g/m²",
        origin: "Como, Itália",
        image: "/products/kit-formal-preta.png",
      },
    ],
  },
];

export const colorOf = (id: ColorId) => COLORS.find((c) => c.id === id)!;
export const groupOf = (id: GroupId) => GROUPS.find((g) => g.id === id)!;
