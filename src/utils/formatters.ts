// ─── Formatters ───────────────────────────────────────────────────────────────

/**
 * Format distance in meters to human-readable string.
 * e.g. 800 → "0.8 km", 250 → "250 m"
 */
export const formatDistance = (meters: number): string => {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${Math.round(meters)} m`;
};

/**
 * Format price in paise/cents to INR string.
 * e.g. 4800 → "₹48", 4850 → "₹48.50"
 */
export const formatPrice = (amount: number): string => {
  const rupees = amount / 100;
  return `₹${rupees % 1 === 0 ? rupees.toFixed(0) : rupees.toFixed(2)}`;
};

/**
 * Format price directly from rupees.
 * e.g. 48 → "₹48"
 */
export const formatRupees = (amount: number): string => `₹${amount}`;

/**
 * Format a Date or ISO string to a relative time string.
 * e.g. "2 hours ago", "Just now"
 */
export const formatRelativeTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const diffMs = Date.now() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

/**
 * Format a Date or ISO string to "Mon, 19 Jun" format.
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
};

/**
 * Format time to "10:30 PM" format.
 */
export const formatTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
};

/**
 * Capitalize the first letter of a string.
 */
export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Mask a phone number: "+91 98765 43210" → "+91 98765 ****0"
 */
export const maskPhone = (phone: string): string =>
  phone.replace(/(\d{5})\d{4}(\d{1})/, '$1****$2');

/**
 * Format an ISO timestamp for order timeline display.
 * Today    → "10:30 AM"
 * Past day → "14 Jun, 10:30 AM"
 */
export const formatTimestamp = (iso: string | undefined): string => {
  if (!iso) return '';
  const d   = new Date(iso);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  return isToday
    ? d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
};
