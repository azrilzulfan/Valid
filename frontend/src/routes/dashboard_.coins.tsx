import { createFileRoute } from "@tanstack/react-router";
import { Coins } from "../pages/Coins";

export const Route = createFileRoute("/dashboard_/coins")({
  component: Coins,
});
