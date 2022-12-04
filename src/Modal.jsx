import React from "react";
import ReactDOM from "react-dom";

export function Modal({ children, isOpen, setOpen, onClosing, closeButton }) {
  const divRef = React.useRef(null);
  const backdropRef = React.useRef(null);
  const [hasAnimationEnded, setAnimationEnded] = React.useState(true);
  const restoreScrollY = React.useRef(0);

  const close = React.useCallback(() => {
    const closing = new Event("closing", { cancelable: true });
    onClosing && onClosing(closing);
    if (!closing.defaultPrevented) {
      setOpen(false);
    }
  }, [onClosing]);

  React.useEffect(() => {
    const root = getModalDivRoot();

    if (isOpen) {
      const div = divRef.current;

      function hotkeyHandler(e) {
        switch (e.key) {
          case "Escape": {
            e.stopPropagation();
            e.preventDefault();

            close();
            break;
          }
        }
      }

      const clickOutsideHandler = (e) => {
        if (div.contains(e.target)) {
          return;
        }
        close();
      };

      document.addEventListener("mouseup", clickOutsideHandler);
      document.addEventListener("keydown", hotkeyHandler);

      setAnimationEnded(false);

      document.body.classList.remove("modal-close");
      document.body.classList.add("modal-open");

      return () => {
        document.removeEventListener("mouseup", clickOutsideHandler);
        document.removeEventListener("keydown", hotkeyHandler);
      };
    } else {
      document.body.classList.remove("modal-open");
      document.body.classList.add("modal-close");

      function handleAnimationEnd(e) {
        if (e.animationName === "modalFadeOutAnimation") {
          setAnimationEnded(true);
          document.body.classList.remove("modal-close");
        }
      }

      root.addEventListener("animationend", handleAnimationEnd);
      return () => {
        root.removeEventListener("animationend", handleAnimationEnd);
      };
    }
  }, [isOpen, close]);

  React.useEffect(() => {
    if (isOpen) {
      const scrollY = document.documentElement.scrollTop;
      document.body.style.position = "fixed";
      document.body.style.overflowY = "scroll";
      document.body.style.top = `-${scrollY}px`;
      restoreScrollY.current = scrollY;
      return () => {
        // restore
        document.body.style.position = "";
        document.body.style.overflowY = "";
        document.body.style.top = "";
        if (0 < restoreScrollY.current) {
          window.scrollTo(0, restoreScrollY.current);
        }
      };
    }
  }, [isOpen]);

  if (!isOpen && hasAnimationEnded) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="modal-wrap">
      <div className="modal-component">
        <div className="modal-grid">
          <div className="modal-content" ref={divRef}>
            {closeButton !== undefined ? (
              closeButton
            ) : (
              <button className="close" onClick={close}>
                Close
              </button>
            )}
            <div className="inner-grid">{children}</div>
          </div>
        </div>
      </div>
      <div className="backdrop" ref={backdropRef} />
    </div>,
    getModalDivRoot()
  );
}

function getModalDivRoot() {
  let modalRoot = document.getElementById("modal-root");
  if (!modalRoot) {
    modalRoot = document.createElement("div");
    modalRoot.id = "modal-root";
    document.body.appendChild(modalRoot);
  }
  return modalRoot;
}
