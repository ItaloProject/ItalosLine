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

1. **`57de0c5`** — fix: reverte `overflow-x:hidden` do `<html>` (estava quebrando o `position:sticky` da Passarela — as camisas pararam de deslizar lateralmente ao rolar)
2. **`a50721e`** — feat: passada geral de UX mobile (viewport/theme-color, tap-highlight removido, alvos de toque maiores na Vitrine, `touch-manipulation`, qualidade de imagem 100→85)
3. **`89b1409`** — fix: overflow horizontal causado pela "camisa em trânsito" do Hero sem `width`/`height` no caminho que pula a animação de intro
4. **`e9a0cf7`** — fix: responsividade mobile (CTA do Hero quebra linha, wordmark do rodapé não estoura mais, descrições do Arquivo/Passarela visíveis em touch — antes só apareciam com `:hover`)
5. **`671cc58`** — perf: vídeos do Hero recomprimidos (17MB→4.2MB, corrigido `faststart`) + animação de entrada só roda 1x por sessão (`sessionStorage`)
6. **`8572099`** — fix: trava scroll durante a animação de entrada da camisa
7. **`0ffec62`** — commit inicial do projeto completo

## Decisões / armadilhas já resolvidas (não repetir)

- **`overflow-x:hidden` só no `body`, nunca no `<html>` também.** Ter nos dois ao mesmo tempo quebra `position:sticky` em elementos filhos (a Passarela usa sticky+scroll para o efeito de deslize lateral).
- **Todo `<div>` com `position:fixed` precisa de `width`/`height` explícitos** (ou `inset`/`left+right`) — se depender de um filho com `w-full`/`h-full` sem isso, o navegador usa o tamanho intrínseco do conteúdo (ex: 1280px de um vídeo), estourando a largura da página inteira. Foi o caso do Hero (`flyerRef`).
- **MP4s precisam de `-movflags +faststart`** (moov atom no início do arquivo) — sem isso o navegador baixa o vídeo inteiro antes de conseguir tocar qualquer frame.
- **Conteúdo que só aparece em `:hover` fica invisível no mobile** (sem mouse, sem hover). Onde isso importava (descrição do Arquivo, ficha técnica da Passarela), foi trocado para: visível por padrão, e só vira efeito hover a partir de `lg:` (telas grandes/desktop).
- O usuário **pediu para não usar o browser preview** para verificar mudanças — todo trabalho de responsividade foi feito por auditoria de código, e a verificação visual é feita pelo próprio usuário, que manda screenshots.

## Pendências conhecidas

- **Número de WhatsApp é placeholder**: `5511999999999` em [`src/components/WhatsApp.tsx:1`](src/components/WhatsApp.tsx) e [`src/components/Footer.tsx:1`](src/components/Footer.tsx) — trocar pelo número real (DDI+DDD+número, sem símbolos).
- **Links sociais do rodapé** (Instagram, Pinterest, Newsletter) ainda apontam para `#` — faltam as URLs reais.
- **Formulário "Sob Medida"** (`src/components/MadeToMeasure.tsx`) só atualiza estado local ao enviar — não manda e-mail nem WhatsApp de verdade ainda.
- **Favicon/OG image**: só existe o `icon.svg` gerado automaticamente pelo Next; não há imagem de Open Graph customizada para compartilhamento em redes sociais.

## Estrutura de páginas

- `/` — Home: Hero (animação de entrada) → Ticker → Passarela (scroll horizontal) → Sob Medida (formulário) → Arquivo (índice editorial) → Footer
- `/vitrine` — Catálogo filtrável por grupo/cor, tema claro
