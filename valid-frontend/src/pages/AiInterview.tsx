// HALAMAN: C:\laragon\www\valid-react\src\pages\AiInterview.tsx
// FUNGSI: Komponen/Halaman (TODO)
// API YANG DIBUTUHKAN: (TODO)
// DUMMY DATA: (TODO)

import { motion, Variants } from "framer-motion";
import {
  LayoutDashboard,
  FolderOpen,
  Mic,
  Star,
  Users,
  Coins as CoinsIcon,
  LogOut,
  ChevronRight,
  Play,
  Clock,
  Sparkles,
  AlertCircle,
  Compass,
} from "lucide-react";
import { useState, useEffect } from "react";
import { InterviewPage } from "../routes/interview";
import { UserSidebar } from "../components/valid/UserSidebar";

export function AiInterview() {
  return (
    <div className="flex w-full h-screen bg-[var(--bg-a)] overflow-hidden text-[var(--text-color)] font-sans">
      {/* SIDEBAR */}
      <UserSidebar />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 h-[calc(100vh-75px)] md:h-screen overflow-y-auto bg-[var(--bg-a)] relative">
        <InterviewPage />
      </div>
    </div>
  );
}
