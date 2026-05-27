import { createFileRoute } from "@tanstack/react-router";
import { Portfolio } from "../pages/Portfolio";

export const Route = createFileRoute("/dashboard_/portfolio")({
  component: Portfolio,
});
