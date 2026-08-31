/**
 * Contato oficial da ItalosLine — fonte única para os links de WhatsApp
 * (botão flutuante e rodapé). Trocar o número aqui atualiza os dois.
 */

/** Formato exigido pelo wa.me: DDI + DDD + número, só dígitos. */
export const WHATSAPP_PHONE = "5599984491810"; // +55 (99) 98449-1810

const WHATSAPP_MESSAGE =
  "Olá! Vim pelo site da ItalosLine e gostaria de agendar uma prova.";

export const WHATSAPP_URL =
  `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
