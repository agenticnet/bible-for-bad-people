import { Suspense } from "react";
import OracleOfDoom from "@/components/oracle/OracleOfDoom";

export default function OraclePage() {
  return (
    <Suspense fallback={<p className="p-8 text-center text-ink-soft">Consulting the void...</p>}>
      <OracleOfDoom />
    </Suspense>
  );
}
