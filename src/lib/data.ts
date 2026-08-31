// Imagens de placeholder (Unsplash) — alfaiataria, camisas, calças.
// Troque estas URLs pelas fotos dos seus próprios modelos quando tiver.
const U = (id: string, w = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export type Garment = {
  ref: string;
  name: string;
  category: string;
  price: string;
  fabric: string;
  weight: string;
  origin: string;
  image: string;
  video?: string;
  videoMobile?: string;
};

export const heroPlate = U("photo-1594938298603-c8148c4dae35", 1600);

/** Camisa solta (produto, uma peça) — intro 3D; sem modelo vestido. */
export const introShirt = U("photo-1596755094514-f87e34085b2c", 900);

// A "passarela" — plates que rolam na horizontal
export const runway: Garment[] = [
  {
    ref: "IL—014",
    name: "Camisa Bianco",
    category: "Camisaria",
    price: "R$ 690",
    fabric: "Algodão egípcio 2-ply",
    weight: "120 g/m²",
    origin: "Como, Itália",
    image: U("photo-1602810318383-e386cc2a3ccf", 1400),
    video: "/videos/camisa-bianco-bege.mp4",
    videoMobile: "/videos/camisa-bianco-bege-mobile.mp4",
  },
  {
    ref: "IL—107",
    name: "Camisa Oxford",
    category: "Camisaria",
    price: "R$ 780",
    fabric: "Oxford fio tinto",
    weight: "160 g/m²",
    origin: "Como, Itália",
    image: U("photo-1598033129183-c4f50c736f10", 1400),
    video: "/videos/camisa-oxford-white.mp4",
    videoMobile: "/videos/camisa-oxford-white-mobile.mp4",
  },
  {
    ref: "IL—122",
    name: "Polo Milanese",
    category: "Camisaria",
    price: "R$ 480",
    fabric: "Piquet de algodão",
    weight: "220 g/m²",
    origin: "São Paulo, Brasil",
    image: U("photo-1594938328870-9623159c8c99", 1400),
    video: "/videos/polo-preto.mp4",
    videoMobile: "/videos/polo-preto-mobile.mp4",
  },
  {
    ref: "IL—120",
    name: "Polo Milanese",
    category: "Camisaria",
    price: "R$ 480",
    fabric: "Piquet de algodão",
    weight: "220 g/m²",
    origin: "São Paulo, Brasil",
    image: U("photo-1571455786673-9d9d6c194f90", 1400),
    video: "/videos/polo-off-white.mp4",
    videoMobile: "/videos/polo-off-white-mobile.mp4",
  },
];

// Índice editorial (lookbook)
export const index = [
  {
    n: "01",
    title: "Camisas",
    note: "Do oxford ao linho, cada camisa cortada para o corpo real.",
    image: "/products/camisa-oxford-branca.png",
    grupo: "camisas",
  },
  {
    n: "02",
    title: "Bermudas",
    note: "Tecidos leves para os dias mais quentes, sem perder a estrutura.",
    image: "/products/bermuda-sarja-branca.png",
    grupo: "bermudas",
  },
  {
    n: "03",
    title: "Mais estilo",
    note: "Combinações que valorizam o guarda-roupa inteiro, peça por peça.",
    image: "/products/kit-polo-branca.png",
    grupo: "kits",
  },
];
