import { createFileRoute } from "@tanstack/react-router";
import { Reviews } from "../pages/Reviews";

export const Route = createFileRoute("/dashboard_/reviews")({
  component: Reviews,
});
