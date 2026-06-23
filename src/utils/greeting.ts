/** Time-of-day greeting for the home header. */
export const getTimeGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

/** First name from full name for display. */
export const getFirstName = (name?: string | null): string => {
  if (!name?.trim()) return 'there';
  return name.trim().split(/\s+/)[0];
};
