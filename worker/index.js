/*
Cloudflare Worker adapter.
IMPORTANT:
- Replace PROVIDER_URL and response mapping for your authorized market-data provider.
- Store the provider API key with: wrangler secret put MARKET_API_KEY
- Do not hard-code secrets into GitHub.
Expected frontend response:
{ "candles": [{ "time": 1710000000, "open": 1, "high": 2, "low": 0.5, "close": 1.5, "volume": 123 }] }
*/
const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"*","Access-Control-Allow-Methods":"GET,OPTIONS"};
export default {
 async fetch(request, env) {
   if(request.method==="OPTIONS") return new Response(null,{headers:cors});
   const u=new URL(request.url);
   if(u.pathname!=="/api/candles") return new Response("SMC market adapter",{headers:cors});
   const symbol=u.searchParams.get("symbol")||"NQ";
   const interval=u.searchParams.get("interval")||"1m";
   const limit=Math.min(Number(u.searchParams.get("limit")||300),500);

   /*
   Example provider request. Replace with the endpoint/schema of the provider
   you actually use. Never scrape TradingView.
   */
   const providerUrl=new URL(env.PROVIDER_URL);
   providerUrl.searchParams.set("symbol",symbol);
   providerUrl.searchParams.set("interval",interval);
   providerUrl.searchParams.set("limit",String(limit));

   const r=await fetch(providerUrl.toString(),{
     headers:{"Authorization":`Bearer ${env.MARKET_API_KEY||""}`,"Accept":"application/json"}
   });
   if(!r.ok)return new Response(JSON.stringify({error:"Provider error",status:r.status}),{status:502,headers:{...cors,"Content-Type":"application/json"}});
   const raw=await r.json();

   // EXPECTED NORMALIZED SHAPE. Adapt this section to your provider.
   const candles=Array.isArray(raw.candles)?raw.candles:[];
   return new Response(JSON.stringify({symbol,interval,candles}),{headers:{...cors,"Content-Type":"application/json"}});
 }
};