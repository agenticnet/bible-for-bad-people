import { Suspense } from "react";
import OracleOfDoom from "@/components/oracle/OracleOfDoom";
import { LoadingState } from "@/components/ui";

export default function OraclePage() {
  return (
    <Suspense fallback={<LoadingState message="Consulting the void…" />}>
      <OracleOfDoom />
    </Suspense>
  );
}
