import {useState, useEffect} from 'react';

function getWindowDimensions() {
  const {innerWidth: width, innerHeight: height} = window;
  return {
    width,
    height,
  };
}

export default function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize(event) {
      event.preventDefault();
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize, {passive: false, capture: false});
    console.log('Ayyyyyyy');
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}
