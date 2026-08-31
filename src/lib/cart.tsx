"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { WHATSAPP_PHONE } from "./contact";
import { colorOf, type ColorId, type SizeId } from "./vitrine";

export type CartItem = {
  /** ref da variante + tamanho — duas peças iguais em tamanhos diferentes são linhas distintas. */
  key: string;
  ref: string;
  name: string;
  color: ColorId;
  size: SizeId;
  /** Em centavos, para não somar float. */
  priceCents: number;
  image?: string;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  totalCents: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (item: Omit<CartItem, "key" | "qty">) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  checkoutUrl: string;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "il-cart-v1";

/** "R$ 780" / "R$ 1.280,50" -> centavos. */
export function parsePriceCents(price: string): number {
  const digits = price.replace(/[^\d,]/g, "").replace(",", ".");
  return Math.round(parseFloat(digits || "0") * 100);
}

export function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Restaura a sacola. Só depois disso passamos a gravar, senão o
  // primeiro render (lista vazia) apagaria o que estava salvo.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* storage indisponível ou conteúdo inválido — começa vazia */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* cota cheia ou modo privado — a sacola segue só em memória */
    }
  }, [items, hydrated]);

  // Trava o scroll do fundo enquanto a sacola está aberta.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Fecha no Esc.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const add: CartContextValue["add"] = (item) => {
    const key = `${item.ref}::${item.size}`;
    setItems((prev) => {
      const found = prev.find((i) => i.key === key);
      if (found) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...item, key, qty: 1 }];
    });
    setOpen(true);
  };

  const remove = (key: string) =>
    setItems((prev) => prev.filter((i) => i.key !== key));

  const setQty = (key: string, qty: number) =>
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.key !== key)
        : prev.map((i) => (i.key === key ? { ...i, qty } : i))
    );

  const clear = () => setItems([]);

  const count = useMemo(
    () => items.reduce((sum, i) => sum + i.qty, 0),
    [items]
  );

  const totalCents = useMemo(
    () => items.reduce((sum, i) => sum + i.priceCents * i.qty, 0),
    [items]
  );

  // Sem gateway de pagamento: o pedido é fechado pelo WhatsApp.
  const checkoutUrl = useMemo(() => {
    const linhas = items.map(
      (i) =>
        `• ${i.qty}x ${i.name} — ${colorOf(i.color).label}, tam. ${i.size} (${i.ref}) — ${formatBRL(i.priceCents * i.qty)}`
    );
    const texto = [
      "Olá! Gostaria de fechar este pedido pelo site da ItalosLine:",
      "",
      ...linhas,
      "",
      `Total: ${formatBRL(totalCents)}`,
    ].join("\n");
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(texto)}`;
  }, [items, totalCents]);

  const value: CartContextValue = {
    items,
    count,
    totalCents,
    open,
    setOpen,
    add,
    remove,
    setQty,
    clear,
    checkoutUrl,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart precisa estar dentro de <CartProvider>");
  return ctx;
}
