import { createFileRoute } from "@tanstack/react-router";
import { ProHistory } from "../pages/ProHistory";

export const Route = createFileRoute("/pro/history")({
  component: ProHistory,
});
