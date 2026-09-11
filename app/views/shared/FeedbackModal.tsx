"use client";

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";

type FeedbackModalProps = {
  open: boolean;
  eyebrow: string;
  title: string;
  description: ReactNode;
  code?: string;
  codeLabel?: string;
  closeLabel?: string;
  onClose: () => void;
};

export default function FeedbackModal({
  open,
  eyebrow,
  title,
  description,
  code,
  codeLabel = "Your code",
  closeLabel = "Close",
  onClose,
}: FeedbackModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [copied, setCopied] = useState(false);

  const close = useCallback(() => {
    setCopied(false);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [close, open]);

  const copyCode = async () => {
    if (!code) return;

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#263443]/60 px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <div className="voucher-modal feedback-modal relative max-h-full w-full max-w-[520px] overflow-y-auto rounded-[24px] bg-white p-8 text-left text-[#263443] shadow-2xl max-[600px]:p-5">
        <button
          ref={closeButtonRef}
          type="button"
          className="absolute top-4 right-5 text-2xl text-[#515151]"
          onClick={close}
          aria-label="Close confirmation"
        >
          ×
        </button>
        <p className="voucher-modal-eyebrow">{eyebrow}</p>
        <div className="py-5 text-center">
          <h2 id={titleId} className="voucher-modal-heading">
            {title}
          </h2>
          <div id={descriptionId} className="mt-4 text-[15px] leading-[1.5] text-[#515151]">
            {description}
          </div>
          {code && (
            <div className="mt-5">
              <p className="mb-2 text-center font-[Arial] text-[11px] font-bold uppercase tracking-[0.18em] text-[#00a873]">
                {codeLabel}
              </p>
              <div className="flex items-center gap-2 rounded-xl bg-[#97ff77] p-2 max-[400px]:items-stretch">
                <p className="min-w-0 flex-1 break-all px-2 py-2 text-[22px] font-bold tracking-wider">
                  {code}
                </p>
                <button
                  type="button"
                  className="rounded-full bg-white px-4 py-2 text-[14px] font-semibold text-[#263443] shadow-sm transition hover:bg-[#f2fff0]"
                  onClick={copyCode}
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          )}
          <button type="button" className="button-primary mt-6 min-h-[50px] w-full rounded-full border-0 text-[14px]" onClick={close}>
            {closeLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
