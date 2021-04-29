import { useEffect, useMemo, useRef } from "react";
import { createPortal }               from "react-dom";
import { useClickAway }               from "react-use";

const root = document.querySelector("#modal");

export default function Modal({ children, onHide }) {
  const el  = useMemo(() => document.createElement("div"), []);
  const ref = useRef(null);

  useClickAway(ref, onHide);

  useEffect(() => {
    root.appendChild(el);

    return () => {
      root.removeChild(el);
    };
  }, [el]);

  return createPortal(<div ref={ref}>{children}</div>, el);
}
