# ItalosLine — Status do Projeto

> Última atualização: 2026-08-31. Este arquivo existe para dar contexto rápido a quem (ou qual sessão do Claude) continuar o trabalho em outro computador.

## O que é

Site institucional/e-commerce da **ItalosLine**, casa de alfaiataria masculina (Next.js 14 + TypeScript + Tailwind). Editorial, dark theme na home, light theme na Vitrine.

## Stack

- Next.js 14.2.13 (App Router) + TypeScript + Tailwind CSS
- Framer Motion v11 (reveals, crossfades, scroll-driven horizontal na Passarela)
- GSAP + ScrollTrigger (animação de entrada do Hero)
- Deploy: Vercel · Repositório: GitHub

## Onde as coisas estão

| Recurso | Local |
|---|---|
| Repositório GitHub | https://github.com/ItaloProject/ItalosLine (conta `ItaloProject`) |
| Deploy produção | https://italos-line.vercel.app (conta Vercel `italoproject`) |
| Vercel autenticado como | `italoproject` (conectado via GitHub — push na `master` faz deploy automático) |

**Atenção:** existe uma conta Vercel diferente (`cgb1`) onde o projeto foi hospedado por engano no início — já foi removido de lá. O projeto correto e único agora vive em `italoproject`.

## Como rodar localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:3000` (ou próxima porta livre).

Se aparecer erro tipo `Cannot find module './XXX.js'` no dev server, é cache do Next corrompido — resolve com:

```bash
rm -rf .next
npm run dev
```

## Histórico recente (mais novo primeiro)

1. **`5be082c`** — fix: **causa raiz** do scroll lateral / conteúdo cortado no mobile. `grid-cols-12 gap-10` no Arquivo e no MadeToMeasure estourava 74px em telas de 414px (só os gaps somam 440px). Agora coluna única no mobile, 12 colunas só a partir de `lg:`. Hero também passou a empilhar.
2. **`a0b0108`** — fix: `position:relative` no `<html>` para silenciar o aviso de scroll offset do Framer Motion
3. **`a231bb4`** — fix: botão do WhatsApp estava a 24px da borda (`right-6`), e o anel de pulso (`animate-ping`) escala 2x durante a animação — ultrapassava a viewport continuamente, causando overflow horizontal (faixa preta ao rolar no mobile). Corrigido afastando para `right-8/bottom-8`.
4. **`57de0c5`** — fix: reverte `overflow-x:hidden` do `<html>` (estava quebrando o `position:sticky` da Passarela — as camisas pararam de deslizar lateralmente ao rolar)
5. **`a50721e`** — feat: passada geral de UX mobile (viewport/theme-color, tap-highlight removido, alvos de toque maiores na Vitrine, `touch-manipulation`, qualidade de imagem 100→85)
6. **`89b1409`** — fix: overflow horizontal causado pela "camisa em trânsito" do Hero sem `width`/`height` no caminho que pula a animação de intro
7. **`e9a0cf7`** — fix: responsividade mobile (CTA do Hero quebra linha, wordmark do rodapé não estoura mais, descrições do Arquivo/Passarela visíveis em touch — antes só apareciam com `:hover`)
8. **`671cc58`** — perf: vídeos do Hero recomprimidos (17MB→4.2MB, corrigido `faststart`) + animação de entrada só roda 1x por sessão (`sessionStorage`)
9. **`8572099`** — fix: trava scroll durante a animação de entrada da camisa
10. **`0ffec62`** — commit inicial do projeto completo

## Decisões / armadilhas já resolvidas (não repetir)

- **`overflow-x:hidden` só no `body`, nunca no `<html>` também.** Ter nos dois ao mesmo tempo quebra `position:sticky` em elementos filhos (a Passarela usa sticky+scroll para o efeito de deslize lateral).
- **Todo `<div>` com `position:fixed` precisa de `width`/`height` explícitos** (ou `inset`/`left+right`) — se depender de um filho com `w-full`/`h-full` sem isso, o navegador usa o tamanho intrínseco do conteúdo (ex: 1280px de um vídeo), estourando a largura da página inteira. Foi o caso do Hero (`flyerRef`).
- **MP4s precisam de `-movflags +faststart`** (moov atom no início do arquivo) — sem isso o navegador baixa o vídeo inteiro antes de conseguir tocar qualquer frame.
- **Conteúdo que só aparece em `:hover` fica invisível no mobile** (sem mouse, sem hover). Onde isso importava (descrição do Arquivo, ficha técnica da Passarela), foi trocado para: visível por padrão, e só vira efeito hover a partir de `lg:` (telas grandes/desktop).
- **`grid-cols-12` + `gap` grande no mobile estoura a tela.** Foi a causa raiz do scroll lateral / conteúdo cortado que apareceu em várias seções. Num grid de 12 colunas, os espaçamentos somam `11 × gap` e são **fixos** — as colunas (`minmax(0,1fr)`) encolhem até zero, mas os gaps não. Com `gap-10` (40px): 440px só de gaps, contra ~366px de container num iPhone XR. Regra: grids de 12 colunas só a partir de `lg:`; no mobile, coluna única. E escopar `col-span-*`/`col-start-*` em `lg:` também — num grid de coluna única, `col-span-12` cria 11 colunas implícitas e reintroduz o estouro.
- **Overflow em qualquer seção deixa a página inteira rolável na horizontal**, porque a largura do documento é global. Se o topo do site "anda pro lado", o culpado pode estar numa seção lá embaixo.
- **Elemento `fixed` perto da borda + animação `scale()` = overflow horizontal.** O botão de WhatsApp (`fixed right-6`) tinha um anel `animate-ping` que escala 2x em loop — isso ultrapassava a borda direita da viewport continuamente. Qualquer elemento fixo próximo da borda que anima `scale`/`transform` precisa de folga suficiente para o estado expandido não vazar da tela.
- O usuário **pediu para não usar o browser preview** para verificar mudanças — todo trabalho de responsividade foi feito por auditoria de código, e a verificação visual é feita pelo próprio usuário, que manda screenshots.

## Pendências conhecidas

- ~~Número de WhatsApp placeholder~~ — **resolvido**. Número real (+55 99 98449-1810) centralizado em [`src/lib/contact.ts`](src/lib/contact.ts); o botão flutuante e o rodapé importam de lá. Para trocar no futuro, mexer só nesse arquivo.
- **Links sociais do rodapé** (Instagram, Pinterest, Newsletter) ainda apontam para `#` — faltam as URLs reais.
- **Grade de tamanhos é inventada.** O campo `sizes` de cada modelo em [`src/lib/vitrine.ts`](src/lib/vitrine.ts) foi preenchido com uma variação plausível (alguns modelos sem P, outros sem XG) para o filtro ter o que filtrar. **Precisa ser trocado pela disponibilidade real.**
- **Checkout sai pelo WhatsApp.** Não há gateway de pagamento: a sacola monta a mensagem do pedido e abre o WhatsApp da loja. Se um dia entrar pagamento online, o ponto a mexer é `checkoutUrl` em [`src/lib/cart.tsx`](src/lib/cart.tsx).
- **Estoque não é controlado** — dá para adicionar qualquer quantidade de qualquer peça.
- **Formulário "Sob Medida"** (`src/components/MadeToMeasure.tsx`) só atualiza estado local ao enviar — não manda e-mail nem WhatsApp de verdade ainda. Com a sacola no ar, vale decidir se essa seção ainda faz sentido como está (ver ponto de copy abaixo).
- **Copy da seção "Sob Medida" está desalinhada com a virada para venda pronta**: o título ainda é "03 — Sob Medida", o texto fala em "reserve uma prova privada no ateliê" e a lista de peças (Blazer/Terno, Calça, Colete) não bate com o catálogo real (camisas, bermudas, polos, kits).
- **Origem dos tecidos** ainda diz "São Paulo, Brasil" em 20 pontos de `vitrine.ts`/`data.ts`. É a origem do *tecido*, não da marca — foi deixado de propósito quando a cidade da marca virou Bacabal. Confirmar se deve mudar.
- **Favicon/OG image**: só existe o `icon.svg` gerado automaticamente pelo Next; não há imagem de Open Graph customizada para compartilhamento em redes sociais.

## Estrutura de páginas

- `/` — Home: Hero (animação de entrada) → Ticker → Passarela (scroll horizontal) → Sob Medida (formulário) → Arquivo (índice editorial) → Footer
- `/vitrine` — Catálogo filtrável por grupo/cor, tema claro
