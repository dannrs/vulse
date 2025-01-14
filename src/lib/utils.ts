import { type ClassValue, clsx } from 'clsx';
import type { Session, User } from 'lucia';
import { twMerge } from 'tailwind-merge';
import { env } from '~/env';
import { Period } from '~/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  return new URL(path, env.NEXT_PUBLIC_APP_URL).href;
}

export function formatDateDifference(dateString: string): string {
  const currentDate = Date.now();
  const inputDate = new Date(dateString).getTime();
  const timeDifference = currentDate - inputDate;

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (weeks > 0) {
    return weeks === 1 ? 'a week ago' : `${weeks} weeks ago`;
  } else if (days > 0) {
    return days === 1 ? 'a day ago' : `${days} days ago`;
  } else if (hours > 0) {
    return hours === 1 ? 'an hour ago' : `${hours} hours ago`;
  } else if (minutes > 0) {
    return minutes === 1 ? 'a minute ago' : `${minutes} minutes ago`;
  } else {
    return 'just now';
  }
}

export function getSectionDescription({
  period,
  session,
  user,
  section,
}: {
  period: Period;
  session: Session | null;
  user: User;
  section: string;
}) {
  const periodDescription =
    period === Period.LONG_TERM
      ? '1 year'
      : `from the past ${period === Period.SHORT_TERM ? '4 weeks' : '6 months'}`;
  const userDescription = session ? 'Your' : `${user.name}'s`;
  const sectionDescription =
    period === Period.LONG_TERM
      ? `${userDescription} ${periodDescription} ${section}`
      : `${userDescription} ${section} ${periodDescription}`;

  return sectionDescription;
}

export const formatGenre = (genre: string) => {
  return genre
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('-');
};

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  } else {
    return num.toString();
  }
}

export const capitalizeWords = (str: string) => {
  // First, split camelCase
  const words = str
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .split(' ');

  // Then capitalize each word
  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
