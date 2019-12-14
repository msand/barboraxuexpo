import { useEffect, useState } from 'react';

export const useFocus = () => {
  const [state, setState] = useState(null);
  const onFocusEvent = () => {
    setState(true);
  };
  const onBlurEvent = () => {
    setState(false);
  };
  useEffect(() => {
    window.addEventListener('focus', onFocusEvent);
    window.addEventListener('blur', onBlurEvent);
    return () => {
      window.removeEventListener('focus', onFocusEvent);
      window.removeEventListener('blur', onBlurEvent);
    };
  });
  return state;
};
