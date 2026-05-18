import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const CanonicalHandler = () => {
  const location = useLocation();

  useEffect(() => {
    // Get the base URL (you can also use import.meta.env.VITE_APP_URL if defined)
    const baseUrl = 'https://sharadatrust.org';
    
    // Construct the canonical URL based on the current pathname
    const canonicalUrl = `${baseUrl}${location.pathname}`;

    // Find the canonical link tag in the document head
    let canonicalLink = document.getElementById('canonical-link');
    
    // If it exists, update its href
    if (canonicalLink) {
      canonicalLink.setAttribute('href', canonicalUrl);
    } else {
      // If for some reason it doesn't exist, create it
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      canonicalLink.setAttribute('id', 'canonical-link');
      canonicalLink.setAttribute('href', canonicalUrl);
      document.head.appendChild(canonicalLink);
    }
  }, [location]);

  return null;
};

export default CanonicalHandler;
