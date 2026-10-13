import { useCallback, useEffect, useRef, useState } from "react";

/** Toast notification with auto-dismiss. Returns { toast, notify }. */
export function useToast(timeout = 2800) {
  const [toast, setToast] = useState("");
  const timer = useRef(null);

  const notify = useCallback(
    (message) => {
      setToast(message);
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setToast(""), timeout);
    },
    [timeout]
  );

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    []
  );

  return { toast, notify };
}
