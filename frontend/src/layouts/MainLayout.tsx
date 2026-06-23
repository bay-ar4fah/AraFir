import type { ReactNode } from "react";

import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({
  children,
}: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Sidebar />

      <div className="ml-64 min-h-screen">
        <Navbar />

        <main className="min-h-[calc(100vh-4rem)] bg-zinc-950">
          {children}
        </main>
      </div>
    </div>
  );
}