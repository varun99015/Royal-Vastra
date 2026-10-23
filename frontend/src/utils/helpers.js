export function formatPrice(amount, currency = 'INR') {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency || 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getDiscountPercent(originalPrice, price) {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export function calculateOrderTotals(items, coupon = null, freeAbove = 999, standardFee = 99) {
  const subtotal = items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
  
  let discount = 0;
  let couponError = null;

  if (coupon) {
    const code = coupon.toUpperCase().trim();
    if (code === 'ROYAL10') {
      discount = Math.round(subtotal * 0.1);
    } else if (code === 'VASTRA500') {
      if (subtotal >= 2999) {
        discount = 500;
      } else {
        couponError = 'Coupon VASTRA500 requires a minimum order of ₹2,999';
      }
    } else if (code === 'WELCOME') {
      discount = Math.min(200, Math.round(subtotal * 0.15));
    } else {
      couponError = 'Invalid coupon code';
    }
  }

  const discountedSubtotal = Math.max(0, subtotal - discount);
  const isFreeShipping = discountedSubtotal >= freeAbove;
  const shipping = isFreeShipping ? 0 : standardFee;
  const total = discountedSubtotal + shipping;

  return {
    subtotal,
    discount,
    couponError,
    discountedSubtotal,
    shipping,
    isFreeShipping,
    total,
    remainingForFreeShipping: Math.max(0, freeAbove - discountedSubtotal),
  };
}
