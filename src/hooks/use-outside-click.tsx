import React, { useEffect } from "react";

type OutsideEvent = MouseEvent | TouchEvent;
type OutsideCallback = (event: OutsideEvent) => void;

export const useOutsideClick = (
  ref: React.RefObject<HTMLDivElement | null>,
  callback: OutsideCallback
) => {
  useEffect(() => {
    const listener = (event: OutsideEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      callback(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback]);
};
