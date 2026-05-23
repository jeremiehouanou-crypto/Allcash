import { addBusinessDays, isWeekend, format, parse, isWithinInterval } from 'date-fns';

const HOLIDAYS_2024 = [
  '2024-01-01', // New Year's Day
  '2024-01-15', // Martin Luther King Jr. Day
  '2024-02-19', // Presidents' Day
  '2024-05-27', // Memorial Day
  '2024-07-04', // Independence Day
  '2024-09-02', // Labor Day
  '2024-11-28', // Thanksgiving Day
  '2024-12-25', // Christmas Day
];

export const isHoliday = (date: Date): boolean => {
  const formattedDate = format(date, 'yyyy-MM-dd');
  return HOLIDAYS_2024.includes(formattedDate);
};

export const isBusinessHour = (date: Date): boolean => {
  const hours = date.getHours();
  return hours >= 9 && hours < 16; // Changed to 4:00 PM
};

export const isBusinessDay = (date: Date): boolean => {
  return !isWeekend(date) && !isHoliday(date);
};

export const getNextBusinessDay = (date: Date): Date => {
  let nextDay = new Date(date);
  do {
    nextDay.setDate(nextDay.getDate() + 1);
  } while (!isBusinessDay(nextDay));
  return nextDay;
};

export const adjustToBusinessHours = (date: Date): Date => {
  const hours = date.getHours();
  const adjustedDate = new Date(date);
  
  if (hours < 9) {
    adjustedDate.setHours(9, 0, 0, 0);
  } else if (hours >= 16) {
    adjustedDate.setHours(15, 45, 0, 0);
  }
  
  return adjustedDate;
};

export const calculateDeliveryWindow = (
  priority: 'standard' | 'express' | 'instant'
): { earliest: Date; latest: Date } => {
  const now = new Date();
  const currentBusinessDay = isBusinessDay(now) && isBusinessHour(now) ? now : getNextBusinessDay(now);

  switch (priority) {
    case 'instant':
      return {
        earliest: adjustToBusinessHours(new Date(currentBusinessDay.getTime() + 1 * 60 * 60 * 1000)),
        latest: adjustToBusinessHours(new Date(currentBusinessDay.getTime() + 4 * 60 * 60 * 1000)),
      };
    case 'express':
      return {
        earliest: adjustToBusinessHours(addBusinessDays(currentBusinessDay, 1)),
        latest: adjustToBusinessHours(addBusinessDays(currentBusinessDay, 2)),
      };
    default: // standard
      return {
        earliest: adjustToBusinessHours(addBusinessDays(currentBusinessDay, 2)),
        latest: adjustToBusinessHours(addBusinessDays(currentBusinessDay, 4)),
      };
  }
};

export const formatDeliveryTime = (date: Date): string => {
  const adjustedDate = adjustToBusinessHours(date);
  return format(adjustedDate, 'EEE, MMM d, h:mm a');
};