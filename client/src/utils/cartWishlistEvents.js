/**
 * Custom event utility for cart and wishlist operations
 * Dispatches events whenever cart or wishlist is updated
 * This allows Header and other components to listen and update immediately
 */

// Event names
export const CART_EVENTS = {
  ITEM_ADDED: 'cartItemAdded',
  ITEM_REMOVED: 'cartItemRemoved',
  QUANTITY_UPDATED: 'cartQuantityUpdated',
  SIZE_UPDATED: 'cartSizeUpdated',
  CART_UPDATED: 'cartUpdated'
};

export const WISHLIST_EVENTS = {
  ITEM_ADDED: 'wishlistItemAdded',
  ITEM_REMOVED: 'wishlistItemRemoved',
  WISHLIST_UPDATED: 'wishlistUpdated'
};

/**
 * Dispatch a cart event
 * @param {string} eventType - Type of event (from CART_EVENTS)
 * @param {object} data - Event data to pass
 */
export const dispatchCartEvent = (eventType, data = {}) => {
  const event = new CustomEvent(eventType, { detail: data });
  window.dispatchEvent(event);
};

/**
 * Dispatch a wishlist event
 * @param {string} eventType - Type of event (from WISHLIST_EVENTS)
 * @param {object} data - Event data to pass
 */
export const dispatchWishlistEvent = (eventType, data = {}) => {
  const event = new CustomEvent(eventType, { detail: data });
  window.dispatchEvent(event);
};

/**
 * Get current cart count from localStorage
 */
export const getCartCount = () => {
  const cartDetail = JSON.parse(localStorage.getItem('CartDetail')) || [];
  return Array.isArray(cartDetail) ? cartDetail.length : (cartDetail.pid ? 1 : 0);
};

/**
 * Get current wishlist count from localStorage
 */
export const getWishlistCount = () => {
  const wishlist = JSON.parse(localStorage.getItem('Wishlist')) || [];
  return Array.isArray(wishlist) ? wishlist.length : 0;
};

/**
 * Listen to cart events
 * @param {string} eventType - Type of event to listen for
 * @param {function} callback - Callback function when event fires
 */
export const onCartEvent = (eventType, callback) => {
  window.addEventListener(eventType, callback);
  
  // Return unsubscribe function
  return () => {
    window.removeEventListener(eventType, callback);
  };
};

/**
 * Listen to wishlist events
 * @param {string} eventType - Type of event to listen for
 * @param {function} callback - Callback function when event fires
 */
export const onWishlistEvent = (eventType, callback) => {
  window.addEventListener(eventType, callback);
  
  // Return unsubscribe function
  return () => {
    window.removeEventListener(eventType, callback);
  };
};
