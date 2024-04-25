import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollTop = (): null => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
};

export default ScrollTop;
