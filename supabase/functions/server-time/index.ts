import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve((_req) => {
  if (_req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const now = new Date();
  return new Response(
    JSON.stringify({
      serverTime: now.toISOString(),
      unixMs: now.getTime(),
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
});
