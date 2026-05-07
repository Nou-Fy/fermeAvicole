"use client";
import { useEffect } from "react";
import { SectionCard } from "../ui";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  hint?: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, hint, children }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}>
      <div style={{ width: "100%", maxWidth: "500px" }}>
        <SectionCard title={title} hint={hint}>
          <div className="stack">
            {children}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button className="button-ghost" onClick={onClose}>
                Annuler
              </button>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
