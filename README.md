# ItalosLine — Casa de Alfaiataria · Arquivo Nº 01

Site editorial de uma casa de alfaiataria de luxo. **Next.js 14 (App Router)**,
**Tailwind CSS** e **Framer Motion**.

## Conceito

Nada de "preto + dourado com shimmer". A direção de arte trata o site como o
**arquivo impresso de uma maison**: papel bone (cor de linho), tipografia
editorial com **serifa Fraunces + monoespaçada Spline Sans Mono**, grid com fios
de coluna, numerais gigantes e peças tratadas como "pranchas" numeradas.

Elementos que dão a assinatura humana / art-directed:

- **Fita métrica** fixa na lateral, marcando a profundidade do scroll em cm.
- **Passarela horizontal** — a coleção rola de lado enquanto se rola a página.
- **Ficha técnica no hover** — tecido, gramatura (g/m²) e origem, como a
  etiqueta real de uma peça.
- **"Sob medida" como ficha de pedido** — formulário de agendamento de prova.
- **Arquivo interativo** — índice cujo hover troca a foto no painel lateral.
- Cor mínima: um único acento oxblood, usado com parcimônia.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Estrutura

```
src/
├─ app/
│  ├─ layout.tsx      # fontes Fraunces + Spline Sans Mono + Archivo, metadata
│  ├─ page.tsx        # monta as seções
│  └─ globals.css     # papel, grid, etiquetas mono, contorno de texto
├─ components/
│  ├─ Ruler.tsx           # fita métrica lateral (scroll em cm)
│  ├─ Nav.tsx             # navegação-índice + menu mobile
│  ├─ Hero.tsx            # capa editorial (masthead + prancha)
│  ├─ Ticker.tsx          # ticker mono de materiais
│  ├─ Runway.tsx          # passarela horizontal com fichas técnicas
│  ├─ Casa.tsx            # manifesto + números
│  ├─ MadeToMeasure.tsx   # ficha de pedido / agendar prova
│  ├─ Arquivo.tsx         # índice interativo (hover troca imagem)
│  ├─ Footer.tsx          # wordmark gigante + colofão
│  └─ Reveal.tsx          # animações de entrada (Reveal / LineReveal)
└─ lib/
   └─ data.ts         # peças, fichas técnicas, índice e imagens
```

## Trocar pelas suas fotos

As imagens são placeholders do Unsplash (alfaiataria, camisas, calças).

1. Coloque as fotos em `public/` (ex.: `public/il-001.jpg`).
2. Em `src/lib/data.ts`, troque as URLs por caminhos locais (ex.: `"/il-001.jpg"`).
3. A foto do ateliê está em `src/components/Casa.tsx`.

## Personalizar

- **Cores / papel / oxblood:** `tailwind.config.ts`.
- **Peças, preços e fichas técnicas:** `src/lib/data.ts`.
- **Ficha de prova:** hoje é só visual — conecte o `onSubmit` de
  `MadeToMeasure.tsx` a um serviço real (Resend, e-mail, CRM).

Feito à mão, peça por peça. ✳
