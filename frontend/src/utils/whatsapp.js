/**
 * WhatsApp Shopping Helper for Royal Vastra
 * Official click-to-chat format: https://wa.me/<number>?text=<encoded_text>
 */

export const DEFAULT_WHATSAPP_NUMBER = '919876543210';

export function getCleanWhatsAppNumber(rawNumber) {
  if (!rawNumber) return DEFAULT_WHATSAPP_NUMBER;
  return String(rawNumber).replace(/[^\d]/g, '');
}

export function buildWhatsAppUrl(message, phoneNumber = DEFAULT_WHATSAPP_NUMBER) {
  const cleanNumber = getCleanWhatsAppNumber(phoneNumber);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}

export function openWhatsAppChat(message, phoneNumber = DEFAULT_WHATSAPP_NUMBER) {
  const url = buildWhatsAppUrl(message, phoneNumber);
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * General store concierge inquiry
 */
export function buildGeneralInquiryMessage(storeName = 'Royal Vastra') {
  return `Hello ${storeName}, I would like assistance with finding the right ethnic wear for an upcoming celebration. Could you guide me?`;
}

/**
 * Product-specific inquiry
 */
export function buildProductInquiryMessage({
  productName,
  productId,
  size,
  color,
  price,
  storeName = 'Royal Vastra',
}) {
  const parts = [
    `Hello ${storeName}, I'm interested in the *${productName}*.`,
  ];
  if (size) parts.push(`Size: *${size}*`);
  if (color) parts.push(`Colour: *${color}*`);
  if (price) parts.push(`Listed Price: *₹${price}*`);
  parts.push(`Product Reference: ${productId}`);
  parts.push(`Could you please confirm availability and estimated delivery time?`);

  return parts.join('\n');
}

/**
 * Sizing / custom fitting inquiry
 */
export function buildSizeInquiryMessage(productName, storeName = 'Royal Vastra') {
  return `Hello ${storeName}, I am interested in *${productName}* and need some advice on selecting the best size and fit for my measurements.`;
}

/**
 * Cart sharing inquiry
 */
export function buildCartShareMessage(cartItems, totals, storeName = 'Royal Vastra') {
  let message = `Hello ${storeName}, I've created a cart and would like to proceed or confirm details:\n\n`;

  cartItems.forEach((item, idx) => {
    message += `${idx + 1}. *${item.name}*\n   Size: ${item.size || 'M'} | Colour: ${item.color || 'Standard'} | Qty: ${item.quantity} × ₹${item.price}\n`;
  });

  message += `\n*Subtotal:* ₹${totals.subtotal}`;
  if (totals.shipping === 0) {
    message += `\n*Shipping:* FREE`;
  } else {
    message += `\n*Shipping:* ₹${totals.shipping}`;
  }
  message += `\n*Estimated Total:* *₹${totals.total}*`;
  message += `\n\nPlease let me know how to finalize this order. Thank you!`;

  return message;
}

/**
 * Order inquiry
 */
export function buildOrderInquiryMessage(orderId, customerName, storeName = 'Royal Vastra') {
  return `Hello ${storeName}, I placed Order *#${orderId}* for ${customerName}. Could you share an update on confirmation and dispatch?`;
}
