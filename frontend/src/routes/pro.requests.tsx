import { createFileRoute } from "@tanstack/react-router";
import { ProRequests } from "../pages/ProRequests";

export const Route = createFileRoute("/pro/requests")({
  component: ProRequests,
});
