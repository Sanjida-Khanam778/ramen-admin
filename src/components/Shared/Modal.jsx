import { useEffect } from "react";

const Modal = ({ isOpen, onClose, children, className }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal Content */}
      <div
        className={`relative bg-white m-8 rounded-lg shadow-lg p-6 z-10 ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
