import { nanoid } from 'nanoid';

export const generateEscrowId = (): string => {
  return `ESC-${nanoid(10).toUpperCase()}`;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};