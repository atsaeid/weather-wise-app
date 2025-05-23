import { useEffect } from 'react';

/**
 * Custom hook to update page title dynamically
 * @param pageTitle - The title of the current page
 */
const usePageTitle = (pageTitle?: string) => {
  useEffect(() => {
    const baseTitle = 'WeatherWise';
    document.title = pageTitle ? `${pageTitle} | ${baseTitle}` : baseTitle;
  }, [pageTitle]);
};

export default usePageTitle; 