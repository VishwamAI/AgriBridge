import { format, parseISO } from 'date-fns';

/**
 * Formats a date string into a specified format
 * @param {string} dateString - The date string to format
 * @param {string} formatString - The desired format (default: 'MM/dd/yyyy')
 * @returns {string} The formatted date string
 */
export const formatDate = (dateString, formatString = 'MM/dd/yyyy') => {
  try {
    const date = parseISO(dateString);
    return format(date, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

/**
 * Formats a date string to a relative time (e.g., "2 days ago")
 * @param {string} dateString - The date string to format
 * @returns {string} The relative time string
 */
export const formatRelativeTime = (dateString) => {
  try {
    const date = parseISO(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Invalid Date';
  }
};
