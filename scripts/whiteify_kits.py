"""
whiteify_kits.py — Converte o fundo xadrez das imagens de kit para branco solido.

Algoritmo:
  1. Classifica cada pixel como "fundo candidato" se tiver baixa saturacao
     (saturation < 28) e brilho suficiente (brightness > 130).
     O xadrez de transparencia tem saturacao = 0. Tecidos coloridos tem
     saturacao > 30 e criam paredes naturais para o flood-fill.
  2. Flood-fill a partir de todas as bordas, percorrendo APENAS pixels
     "fundo candidato". Para ao tocar qualquer tecido mais saturado.
  3. Substitui todos os pixels marcados pelo flood-fill por branco (255,255,255).
  4. Salva como PNG RGB sem alfa (mix-blend-multiply remove o branco no CSS).

Uso:
  python scripts/whiteify_kits.py
  python scripts/whiteify_kits.py --saturation 28 --brightness 130
"""

import os
import sys
import argparse
from collections import deque
from PIL import Image

PRODUCTS_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "products")
KIT_PREFIX = "kit-"


def make_bg_mask(img_rgb, sat_threshold, bright_threshold):
    """
    Retorna uma lista booleana: True se o pixel e candidato a fundo.
    Candidato = baixa saturacao E brilho suficiente.
    """
    w, h = img_rgb.size
    mask = []
    px = img_rgb.load()
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            brightness = (r + g + b) / 3
            saturation = max(r, g, b) - min(r, g, b)
            mask.append(saturation < sat_threshold and brightness > bright_threshold)
    return mask, w, h


def flood_fill_bg(mask, w, h):
    """
    BFS a partir de todas as bordas, apenas em pixels com mask=True.
    Retorna um bytearray: 1 = fundo confirmado, 0 = peça ou interior neutro.
    """
    visited = bytearray(w * h)
    queue = deque()

    def seed(x, y):
        i = y * w + x
        if mask[i] and not visited[i]:
            visited[i] = 1
            queue.append((x, y))

    for x in range(w):
        seed(x, 0)
        seed(x, h - 1)
    for y in range(h):
        seed(0, y)
        seed(w - 1, y)

    while queue:
        cx, cy = queue.popleft()
        for nx, ny in ((cx-1, cy), (cx+1, cy), (cx, cy-1), (cx, cy+1)):
            if 0 <= nx < w and 0 <= ny < h:
                ni = ny * w + nx
                if mask[ni] and not visited[ni]:
                    visited[ni] = 1
                    queue.append((nx, ny))

    return visited


def process_kit(path, sat_threshold, bright_threshold):
    print(f"  {os.path.basename(path)}")
    img = Image.open(path)

    # Se tem canal alfa real: composita sobre branco diretamente
    if img.mode in ("RGBA", "LA"):
        alpha = img.getchannel("A")
        if any(v < 250 for v in alpha.tobytes()):
            print("    [alfa real] composita sobre branco")
            bg = Image.new("RGB", img.size, (255, 255, 255))
            bg.paste(img.convert("RGBA"), mask=img.getchannel("A"))
            bg.save(path, "PNG")
            print("    OK")
            return

    # Fundo xadrez baked-in: usa flood-fill por saturacao
    rgb = img.convert("RGB")
    mask, w, h = make_bg_mask(rgb, sat_threshold, bright_threshold)
    bg_pixels = flood_fill_bg(mask, w, h)

    px = rgb.load()
    removed = 0
    for y in range(h):
        for x in range(w):
            if bg_pixels[y * w + x]:
                px[x, y] = (255, 255, 255)
                removed += 1

    total = w * h
    pct = 100 * removed / total
    print(f"    [flood-fill] {removed}/{total} pixels ({pct:.1f}%) removidos -> branco")

    # Verificacao: centro da imagem deve ter a peca (nao pode ser branco)
    cx, cy = w // 2, h // 2
    center = px[cx, cy]
    if center == (255, 255, 255):
        print(f"    AVISO: centro ainda branco {center} - peca pode ter sido removida")
    else:
        print(f"    Centro da peca: RGB{center}")

    rgb.save(path, "PNG")
    print(f"    OK")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--saturation", type=int, default=28,
                        help="Threshold de saturacao (default=28)")
    parser.add_argument("--brightness", type=int, default=130,
                        help="Threshold minimo de brilho (default=130)")
    args = parser.parse_args()

    kit_files = [
        os.path.join(PRODUCTS_DIR, f)
        for f in sorted(os.listdir(PRODUCTS_DIR))
        if f.startswith(KIT_PREFIX) and f.endswith(".png")
    ]

    if not kit_files:
        print("Nenhum arquivo kit-*.png encontrado em", PRODUCTS_DIR)
        sys.exit(1)

    print(f"Encontrados {len(kit_files)} kits")
    print(f"Parametros: saturacao<{args.saturation}, brilho>{args.brightness}\n")

    for path in kit_files:
        process_kit(path, args.saturation, args.brightness)

    print(f"\nConcluido. {len(kit_files)} imagens processadas.")


if __name__ == "__main__":
    main()
