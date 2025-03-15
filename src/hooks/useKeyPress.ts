import { useEffect } from 'react';

interface UseKeyPressProps {
  targetKey?: string;
  keyUpCb?: () => void;
  keyDownCb?: () => void;
}

const useKeyPress = ({ targetKey, keyUpCb, keyDownCb }: UseKeyPressProps): void => {
  
  useEffect(() => {
    if (!targetKey) return;
    const downHandler = ({ key }: KeyboardEvent): void => {
      if (targetKey && key === targetKey && keyDownCb) {
        keyDownCb();
      }
    };
    
    const upHandler = ({ key }: KeyboardEvent): void => {
      if (targetKey && key === targetKey && keyUpCb ) {
        keyUpCb();
      } 
    };

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    
    return () => {
      if (!targetKey) return;
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyDownCb, keyUpCb]);
};

export default useKeyPress