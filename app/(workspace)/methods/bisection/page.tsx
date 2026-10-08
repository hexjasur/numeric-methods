import type { Metadata } from "next";
import { BisectionMethod } from "@/components/bisection-method";

export const metadata: Metadata = {
  title: "Bisection Method",
  description: "Kesmani teng ikkiga bo‘lish usuli bilan tenglama ildizini interaktiv toping.",
};

export default function BisectionPage() {
  return <BisectionMethod />;
}
