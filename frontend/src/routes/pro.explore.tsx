import { createFileRoute } from "@tanstack/react-router";
import { ProExplore } from "../pages/ProExplore";

export const Route = createFileRoute("/pro/explore")({
  component: ProExplore,
});
