"use client";

import { useEffect, useState } from "react";
import { TrendingUp, ShoppingBag, ChefHat, Grid3x3, AlertTriangle, RotateCcw, Banknote, CreditCard, Globe } from "lucide-react";
import { apiGet } from "@/lib/api";
import { money, useSettings } from "@/lib/settings";
import { PageHeader, PageLoader } from "@/components/ui";

interface Method { gross: number; fee: number; net: number; }
interface Branch { id: number; name: string; revenueToday: number; openTables: number; inKitchen: number; lowStockCount: number; }
interface Totals { totalRevenue: number; totalOrders: number; totalKitchen: number; totalOpenTables: number; totalLowStock: number; totalRefunds: number; byMethod: Record<string, Method>; }
interface Summary { branches: Branch[]; totals: Totals; }
interface Report { trend: number[]; orderCount: number; voidedCount: number; refundCount: number; }

export default function DashboardPage() {
  const settings = useSettings();
  const currency = settings?.currencySymbol || "Rs. ";
  const [sum, setSum] = useState<Summary | null>(null);
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    apiGet<Summary>("/dashboard/summary").then(setSum).catch(() => {});
    apiGet<Report>("/reports/summary").then(setReport).catch(() => {});
  }, []);

  if (!sum) return <PageLoader label="Loading dashboard" />;
  const t = sum.totals;
  const maxTrend = report ? Math.max(1, ...report.trend) : 1;

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Today across the house." />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <Tile icon={<TrendingUp size={18} />} label="Revenue today" value={money(t.totalRevenue, currency)} accent />
        <Tile icon={<ShoppingBag size={18} />} label="Orders" value={String(t.totalOrders)} />
        <Tile icon={<ChefHat size={18} />} label="In kitchen" value={String(t.totalKitchen)} />
        <Tile icon={<Grid3x3 size={18} />} label="Open tables" value={String(t.totalOpenTables)} />
        <Tile icon={<AlertTriangle size={18} />} label="Low stock" value={String(t.totalLowStock)} warn={t.totalLowStock > 0} />
        <Tile icon={<RotateCcw size={18} />} label="Refunds" value={money(t.totalRefunds, currency)} />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* payment methods */}
        <div className="gb-card p-5">
          <div className="eyebrow mb-4">Today by payment method</div>
          <div className="space-y-3">
            {([["cash", <Banknote key="c" size={16} />], ["card", <CreditCard key="k" size={16} />], ["online", <Globe key="o" size={16} />]] as const).map(([m, icon]) => {
              const d = t.byMethod[m] || { gross: 0, net: 0, fee: 0 };
              const pct = t.totalRevenue > 0 ? Math.round((d.gross / t.totalRevenue) * 100) : 0;
              return (
                <div key={m}>
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span className="flex items-center gap-2 capitalize text-ink">{icon} {m}</span>
                    <span className="mono font-semibold">{money(d.gross, currency)}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--panel-2)" }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--olive)" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 7-day trend */}
        <div className="gb-card p-5">
          <div className="eyebrow mb-4">Revenue — last 7 days</div>
          {report ? (
            <div className="flex items-end gap-2 h-40">
              {report.trend.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 justify-end h-full">
                  <div className="w-full rounded-t-md transition-all" style={{ height: `${Math.max(3, (v / maxTrend) * 100)}%`, background: i === report.trend.length - 1 ? "var(--clay)" : "var(--olive-300)" }} />
                  <span className="text-[10px] text-muted">{["6d", "5d", "4d", "3d", "2d", "1d", "Today"][i]}</span>
                </div>
              ))}
            </div>
          ) : <div className="text-sm text-muted">No data yet.</div>}
        </div>
      </div>

      {sum.branches.length > 1 && (
        <div className="gb-card p-5 mt-5">
          <div className="eyebrow mb-4">Branches</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-muted text-[12px] uppercase tracking-wide">
                <th className="py-2">Branch</th><th>Revenue</th><th>In kitchen</th><th>Open tables</th><th>Low stock</th>
              </tr></thead>
              <tbody>
                {sum.branches.map((b) => (
                  <tr key={b.id} className="border-t border-line-soft">
                    <td className="py-2.5 font-medium">{b.name}</td>
                    <td className="mono">{money(b.revenueToday, currency)}</td>
                    <td className="mono">{b.inKitchen}</td>
                    <td className="mono">{b.openTables}</td>
                    <td className="mono">{b.lowStockCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function Tile({ icon, label, value, accent, warn }: { icon: React.ReactNode; label: string; value: string; accent?: boolean; warn?: boolean }) {
  return (
    <div className="gb-card p-4" style={accent ? { background: "linear-gradient(135deg, var(--olive-700), var(--olive))", borderColor: "transparent" } : {}}>
      <div className="flex items-center gap-2 mb-2" style={{ color: accent ? "#d9e0c2" : warn ? "var(--warn)" : "var(--olive)" }}>
        {icon}
        <span className="text-[11px] uppercase tracking-wider font-semibold" style={accent ? { color: "#d9e0c2" } : {}}>{label}</span>
      </div>
      <div className="font-head text-xl mono" style={{ color: accent ? "#f4e9cf" : "var(--ink)" }}>{value}</div>
    </div>
  );
}
