"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { ToastProvider, PageLoader } from "@/components/ui";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  if (!ready || !user) {
    return <div className="min-h-screen"><PageLoader label="Starting Golden Beach POS" /></div>;
  }

  return (
    <ToastProvider>
      <div className="min-h-screen">
        <Sidebar />
        <Topbar />
        <main className="md:pl-[236px] pt-[60px]">
          <div className="max-w-content mx-auto px-5 md:px-8 py-7 gb-enter">{children}</div>
        </main>
      </div>
    </ToastProvider>
  );
}
