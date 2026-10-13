"use client";

import { useEffect, useState, createContext, useContext, useCallback } from "react";
import { Loader2, X, CheckCircle2, AlertTriangle, Info } from "lucide-react";

export function Spinner({ size = 18 }: { size?: number }) {
  return <Loader2 size={size} className="animate-spin" />;
}

export function PageLoader({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted">
      <Spinner size={26} />
      <span className="text-sm">{label}…</span>
    </div>
  );
}

export function EmptyState({ title, hint, icon }: { title: string; hint?: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
      {icon && <div className="text-olive/60 mb-1">{icon}</div>}
      <div className="font-head text-lg text-ink">{title}</div>
      {hint && <div className="text-sm text-muted max-w-sm">{hint}</div>}
    </div>
  );
}

export function PageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
      <div>
        <div className="eyebrow mb-1">Golden Beach</div>
        <h1 className="text-[26px] font-head font-semibold text-ink leading-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted mt-1">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2 flex-wrap">{children}</div>}
    </div>
  );
}

/* ---------------- Toasts ---------------- */
type Toast = { id: number; kind: "ok" | "bad" | "info"; msg: string };
const ToastCtx = createContext<{ push: (kind: Toast["kind"], msg: string) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((kind: Toast["kind"], msg: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, kind, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800);
  }, []);
  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2 max-w-[92vw]">
        {toasts.map((t) => (
          <div key={t.id}
            className="gb-card flex items-start gap-2.5 px-4 py-3 shadow-md animate-[gbFade_.2s_ease] min-w-[240px]"
            style={{ borderLeftWidth: 4, borderLeftColor: t.kind === "ok" ? "var(--ok)" : t.kind === "bad" ? "var(--bad)" : "var(--olive)" }}>
            {t.kind === "ok" ? <CheckCircle2 size={18} className="text-ok mt-0.5" /> :
             t.kind === "bad" ? <AlertTriangle size={18} className="text-bad mt-0.5" /> :
             <Info size={18} className="text-olive mt-0.5" />}
            <span className="text-sm text-ink">{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const v = useContext(ToastCtx);
  return v || { push: () => {} };
}

/* ---------------- Modal ---------------- */
export function Modal({ open, onClose, title, children, width = 460 }: {
  open: boolean; onClose: () => void; title?: string; children: React.ReactNode; width?: number;
}) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4"
      style={{ background: "rgba(27,24,14,.5)" }} onClick={onClose}>
      <div className="gb-card shadow-lg w-full gb-enter" style={{ maxWidth: width }} onClick={(e) => e.stopPropagation()}>
        {title && (
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-line">
            <h3 className="font-head text-lg text-ink">{title}</h3>
            <button onClick={onClose} className="text-muted hover:text-ink transition-colors"><X size={19} /></button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
