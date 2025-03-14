import { useState, useEffect, useRef } from 'react';
import { Timeout } from '../types/commonTypes';

// useDebounceValue to optimize rendering & prevent extra calls of any action based on the debouncedValue
function useDebounceValue<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timer = useRef<Timeout | null>(null);

  useEffect(() => {
    timer.current = setTimeout(() => setDebouncedValue(value), delay);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [delay, value]);

  return debouncedValue;
}




export default useDebounceValue;