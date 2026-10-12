import { createFileRoute } from "@tanstack/react-router";
import { PebbleApp } from "@/components/pebble/pebble-app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <PebbleApp />;
}
