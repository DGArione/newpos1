"use client";

import { useEffect, useRef, useState } from "react";
import { Sun, Moon, LogOut, ChevronDown, Store } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { apiGet } from "@/lib/api";

const ROLE_LABEL: Record<string, string> = {
  admin: "Administrator", superManager: "Super Manager", manager: "Manager",
  finance: "Finance", server: "Server", cashier: "Cashier", kitchen: "Kitchen",
};

export function Topbar() {
  const { user, logout, branchId, selectBranch } = useAuth();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [menuOpen, setMenuOpen] = useState(false);
  const [branches, setBranches] = useState<{ id: number; name: string }[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = (document.documentElement.getAttribute("data-theme") as "light" | "dark") || "light";
    setTheme(t);
  }, []);

  useEffect(() => {
    if (user?.role === "superManager") {
      apiGet<{ id: number; name: string }[]>("/branches").then(setBranches).catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("gb-theme", next); } catch {}
  }

  if (!user) return null;
  const activeBranch = branches.find((b) => b.id === branchId);

  return (
    <header className="fixed top-0 right-0 left-0 md:left-[236px] h-[60px] z-40 flex items-center justify-end gap-2 px-4 md:px-6"
      style={{ background: "color-mix(in srgb, var(--panel) 85%, transparent)", backdropFilter: "blur(10px)", borderBottom: "1px solid var(--line-soft)" }}>

      {user.role === "superManager" && (
        <div className="relative" ref={ref}>
          <button onClick={() => setMenuOpen((o) => !o)}
            className="btn btn-soft btn-sm">
            <Store size={15} />
            {activeBranch ? activeBranch.name : "Select branch"}
            <ChevronDown size={14} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 gb-card shadow-md py-1.5 z-50">
              {branches.map((b) => (
                <button key={b.id} onClick={() => { selectBranch(b.id); setMenuOpen(false); }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-panel-2 transition-colors"
                  style={{ color: b.id === branchId ? "var(--olive-700)" : "var(--ink)", fontWeight: b.id === branchId ? 600 : 400 }}>
                  {b.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <button onClick={toggleTheme} className="btn btn-ghost btn-sm !px-2.5" aria-label="Toggle theme">
        {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
      </button>

      <div className="h-6 w-px bg-line mx-1" />

      <div className="flex items-center gap-2.5">
        <div className="hidden sm:block text-right leading-tight">
          <div className="text-[13px] font-semibold text-ink">{user.name}</div>
          <div className="text-[11px] text-muted">{ROLE_LABEL[user.role] || user.role}</div>
        </div>
        <div className="w-9 h-9 rounded-full flex items-center justify-center font-head text-sm font-semibold"
          style={{ background: "var(--olive)", color: "#f2efe0" }}>
          {user.name.charAt(0).toUpperCase()}
        </div>
        <button onClick={logout} className="btn btn-ghost btn-sm !px-2.5" title="Log out">
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
