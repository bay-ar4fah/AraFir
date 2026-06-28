import {
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({
  children,
}: MainLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] =
    useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() =>
          setIsSidebarCollapsed((prev) => !prev)
        }
      />

      <div
        className={`min-h-screen transition-all duration-300 ${
          isSidebarCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        <Navbar />

        <main className="min-h-[calc(100vh-4rem)] bg-zinc-950">
          {children}
        </main>
      </div>
    </div>
  );
}