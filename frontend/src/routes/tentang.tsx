import { createFileRoute } from "@tanstack/react-router";
import { Tentang } from "@/components/valid/Tentang";

export const Route = createFileRoute("/tentang")({
  component: TentangPage,
});

function TentangPage() {
  return <Tentang />;
}
