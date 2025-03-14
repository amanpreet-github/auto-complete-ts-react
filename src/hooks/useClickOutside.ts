import React, {useEffect} from 'react'

const useClickOutside =<T extends HTMLElement>(ref: React.RefObject<T>, callback: () => void): void => {
  
  useEffect(() => {
      const handleClick = (e: MouseEvent) => {
          if (ref.current && !ref.current.contains(e.target as Node)) {
          callback();
        }
      };
    
    document.addEventListener('click', handleClick);
    
      return () => {
        document.removeEventListener('click', handleClick);
      };
    
    }, [ref, callback]);
  };

export default useClickOutside;