import ResultsPage from "@/components/ResultsPage";
import RootLayout from "../app/layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Campionatul 5C - Rezultate",
};

export default function Home() {
  return <ResultsPage />;
}
