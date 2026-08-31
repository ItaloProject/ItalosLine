/**
 * Contato oficial da ItalosLine — fonte única para os links de WhatsApp
 * (botão flutuante e rodapé). Trocar o número aqui atualiza os dois.
 */

/** Formato exigido pelo wa.me: DDI + DDD + número, só dígitos. */
export const WHATSAPP_PHONE = "5599984491810"; // +55 (99) 98449-1810

/**
 * Endereço público do site. Serve de fallback para montar links absolutos
 * quando `window.location.origin` não está disponível (render no servidor).
 */
export const SITE_URL = "https://italos-line.vercel.app";

const WHATSAPP_MESSAGE =
  "Olá! Vim pelo site da ItalosLine e gostaria de agendar uma prova.";

export const WHATSAPP_URL =
  `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
