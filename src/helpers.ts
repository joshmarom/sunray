export const isToday = (date: string): boolean => date === new Date().toISOString().split('T')[0];
