import { useRef } from 'react';

// Disabled smooth scroll for better performance
export const useLenis = () => {
  const lenisRef = useRef<null>(null);
  return lenisRef;
};

export default useLenis;
