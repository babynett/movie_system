import { useState, useEffect } from 'react';

// SSR-safe useRef hook
export const useSSRSafeRef = <T>(initialValue: T | null) => {
  const [ref] = useState(() => ({ current: initialValue }));
  return ref;
};

// SSR-safe useEffect hook
export const useSSRSafeEffect = (effect: () => void | (() => void), deps?: React.DependencyList) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      return effect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

// SSR-safe useRef that only works on client
export const useClientRef = <T>(initialValue: T | null) => {
  const [ref] = useState(() => {
    if (typeof window === 'undefined') {
      return { current: initialValue };
    }
    return { current: initialValue };
  });
  return ref;
};
