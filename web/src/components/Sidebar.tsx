"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useSettings } from "@/lib/settings";
import { visibleNav } from "@/lib/nav";
import { Wordmark } from "@/components/Logo";

export function Sidebar() {
  const { user } = useAuth();
  const settings = useSettings();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;
  const items = visibleNav(user.role, settings?.enabledAddons || []);

  const nav = (
    <nav className="flex flex-col gap-0.5 px-3 py-3 overflow-y-auto flex-1">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <Link key={item.key} href={item.href} onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors relative"
            style={active
              ? { background: "var(--olive-wash)", color: "var(--olive-700)" }
              : { color: "var(--muted)" }}
            onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "var(--panel-2)"; }}
            onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}>
            {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full" style={{ background: "var(--clay)" }} />}
            <Icon size={18} strokeWidth={active ? 2.3 : 1.9} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* mobile toggle */}
      <button onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-3 left-3 z-[60] gb-card p-2.5 shadow-sm">
        <Menu size={20} />
      </button>

      {/* desktop sidebar */}
      <aside className="hidden md:flex fixed top-0 left-0 bottom-0 w-[236px] z-50 flex-col"
        style={{ background: "var(--panel)", borderRight: "1px solid var(--line)" }}>
        <div className="h-[60px] flex items-center px-4 border-b border-line-soft shrink-0">
          <Wordmark />
        </div>
        {nav}
        <div className="px-4 py-3 border-t border-line-soft text-[11px] text-muted">
          {settings?.businessName || "Golden Beach"} · POS
        </div>
      </aside>

      {/* mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-[70]" style={{ background: "rgba(27,24,14,.5)" }} onClick={() => setMobileOpen(false)}>
          <aside className="absolute top-0 left-0 bottom-0 w-[260px] flex flex-col gb-enter"
            style={{ background: "var(--panel)" }} onClick={(e) => e.stopPropagation()}>
            <div className="h-[60px] flex items-center justify-between px-4 border-b border-line-soft">
              <Wordmark />
              <button onClick={() => setMobileOpen(false)} className="text-muted"><X size={20} /></button>
            </div>
            {nav}
          </aside>
        </div>
      )}
    </>
  );
}
