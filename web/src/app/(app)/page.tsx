"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useSettings, money } from "@/lib/settings";
import { visibleNav } from "@/lib/nav";
import { apiGet } from "@/lib/api";

interface DashSummary { totals?: { totalRevenue?: number; totalOrders?: number; totalKitchen?: number; totalOpenTables?: number }; }

export default function HomePage() {
  const { user } = useAuth();
  const settings = useSettings();
  const [sum, setSum] = useState<DashSummary | null>(null);
  const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 17 ? "Good afternoon" : "Good evening";

  const items = user ? visibleNav(user.role, settings?.enabledAddons || []).filter((i) => i.key !== "settings") : [];

  useEffect(() => {
    apiGet<DashSummary>("/dashboard/summary").then(setSum).catch(() => {});
  }, []);

  const currency = settings?.currencySymbol || "Rs. ";

  return (
    <div>
      {/* Hero */}
      <div className="gb-card overflow-hidden mb-7 relative"
        style={{ background: "linear-gradient(135deg, var(--olive-700), var(--olive))", borderColor: "transparent" }}>
        <div className="relative z-10 px-7 py-8 text-[#f2efe0]">
          <div className="text-xs font-bold tracking-[0.25em] uppercase opacity-80 mb-2">
            {settings?.businessName || "Golden Beach Restaurant"}
          </div>
          <h1 className="script text-[40px] leading-none mb-1" style={{ color: "#f4e9cf" }}>
            {greeting}, {user?.name?.split(" ")[0]}
          </h1>
          <p className="text-sm opacity-80 mt-2">Pick up where you left off — the house is yours.</p>
        </div>
        <svg className="absolute -bottom-8 right-0 opacity-15" viewBox="0 0 400 80" preserveAspectRatio="none" style={{ height: 160, width: "60%" }}>
          <path d="M0 40c40 0 40-22 80-22s40 22 80 22 40-22 80-22 40 22 80 22 40-22 80-22v80H0z" fill="#f4e9cf" />
        </svg>
      </div>

      {/* Snapshot (managers/finance) */}
      {sum && (user?.role === "manager" || user?.role === "superManager" || user?.role === "finance") && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7">
          <Stat label="Today's sales" value={money(sum.totals?.totalRevenue || 0, currency)} />
          <Stat label="Orders today" value={String(sum.totals?.totalOrders ?? 0)} />
          <Stat label="In kitchen" value={String(sum.totals?.totalKitchen ?? 0)} />
          <Stat label="Open tables" value={String(sum.totals?.totalOpenTables ?? 0)} />
        </div>
      )}

      <div className="eyebrow mb-3">Quick access</div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.key} href={item.href}
              className="gb-card group p-5 flex flex-col gap-3 hover:shadow-md transition-all relative overflow-hidden">
              <span className="absolute top-3 right-3 text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight size={16} />
              </span>
              <span className="w-11 h-11 rounded-md flex items-center justify-center"
                style={{ background: "var(--olive-wash)", color: "var(--olive-700)" }}>
                <Icon size={21} />
              </span>
              <span className="font-head text-[15px] text-ink">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="gb-card px-5 py-4">
      <div className="text-[11px] uppercase tracking-wider text-muted font-semibold">{label}</div>
      <div className="font-head text-2xl text-ink mt-1 mono">{value}</div>
    </div>
  );
}
