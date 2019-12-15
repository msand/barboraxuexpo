import { useEffect } from 'react';
import { useFocus } from './useFocus';

export function useRevalidateOnFocus(etag) {
  const focused = useFocus();
  useEffect(() => {
    if (focused) {
      fetch(window.location, {
        headers: {
          pragma: 'no-cache',
        },
      }).then(({ ok, headers }) => {
        if (ok && headers.get('x-version') !== etag) {
          window.location.reload();
        }
      });
    }
  }, [focused]);
}
