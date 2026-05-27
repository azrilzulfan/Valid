import { createFileRoute } from "@tanstack/react-router";
import { ProDashboard } from "../pages/ProDashboard";

export const Route = createFileRoute("/pro/dashboard")({
  component: ProDashboard,
});
