/**
 * Calculate the total price including tax
 * @param {number} basePrice - The base price of the item
 * @param {number} taxRate - The tax rate as a decimal (e.g., 0.1 for 10%)
 * @returns {number} The total price including tax
 */
export const calculateTotalWithTax = (basePrice, taxRate) => {
  return basePrice * (1 + taxRate);
};

/**
 * Calculate the discounted price
 * @param {number} originalPrice - The original price of the item
 * @param {number} discountPercentage - The discount percentage (e.g., 20 for 20% off)
 * @returns {number} The discounted price
 */
export const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
  const discountAmount = originalPrice * (discountPercentage / 100);
  return originalPrice - discountAmount;
};

/**
 * Calculate the total price for multiple items
 * @param {Array<{price: number, quantity: number}>} items - Array of items with price and quantity
 * @returns {number} The total price for all items
 */
export const calculateTotalForItems = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

/**
 * Calculate the final price including tax and discount
 * @param {number} basePrice - The base price of the item
 * @param {number} taxRate - The tax rate as a decimal (e.g., 0.1 for 10%)
 * @param {number} discountPercentage - The discount percentage (e.g., 20 for 20% off)
 * @returns {number} The final price including tax and discount
 */
export const calculateFinalPrice = (basePrice, taxRate, discountPercentage) => {
  const discountedPrice = calculateDiscountedPrice(basePrice, discountPercentage);
  return calculateTotalWithTax(discountedPrice, taxRate);
};
