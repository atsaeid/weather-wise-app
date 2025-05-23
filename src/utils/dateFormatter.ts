/**
 * Formats a date string into a readable format
 * @param dateString - ISO date string or any valid date string
 * @param options - Formatting options
 * @returns Formatted date string
 */
export const formatDateTime = (dateString: string, options: {
  showDate?: boolean;
  showTime?: boolean;
  showSeconds?: boolean;
  showTimezone?: boolean;
} = {}): string => {
  const {
    showDate = true,
    showTime = true,
    showSeconds = false,
    showTimezone = false
  } = options;

  try {
    const date = new Date(dateString);
    
    // Format parts
    const datePart = showDate ? date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) : '';

    const timePart = showTime ? date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      ...(showSeconds ? { second: '2-digit' } : {}),
      hour12: true
    }) : '';

    const timezonePart = showTimezone ? 
      date.toLocaleString('en-US', { timeZoneName: 'short' }).split(' ').pop() : '';

    // Combine parts
    return [
      datePart,
      timePart,
      timezonePart
    ].filter(Boolean).join(' ');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString; // Return original string if parsing fails
  }
};

/**
 * Formats time only in a concise format (e.g., "2:30 PM")
 */
export const formatTimeOnly = (dateString: string): string => {
  return formatDateTime(dateString, {
    showDate: false,
    showTime: true,
    showSeconds: false,
    showTimezone: false
  });
};

/**
 * Formats date only in a concise format (e.g., "May 23, 2025")
 */
export const formatDateOnly = (dateString: string): string => {
  return formatDateTime(dateString, {
    showDate: true,
    showTime: false,
    showSeconds: false,
    showTimezone: false
  });
};

/**
 * Formats date and time for weather display (e.g., "May 23, 2:30 PM")
 */
export const formatWeatherDateTime = (dateString: string): string => {
  return formatDateTime(dateString, {
    showDate: false,
    showTime: true,
    showSeconds: false,
    showTimezone: false
  });
};

/**
 * Formats date to ISO string with milliseconds (e.g., "2025-05-24T00:00:00.0000000")
 */
export const formatToISOWithMilliseconds = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const isoString = d.toISOString();
  return isoString.replace(/\.\d{3}Z$/, '.0000000');
}; 