# SMC/ICT Scalp Terminal

Mobile-first NQ/GC SMC/ICT dashboard designed to consume REAL market data.

## Important market-data rule

This project contains **no fake/simulated price fallback**. If a data endpoint is unavailable or returns invalid data, the UI stays `DATA OFFLINE`.

The frontend is a static web app. It does not magically provide CME futures data. You must connect an authorized real-time market-data provider/broker feed. TradingView's charting libraries do not themselves grant you a futures market-data entitlement, and you should not scrape TradingView.

## What is included

- NQ / GC selector
- 1-minute OHLCV chart
- Real-time polling adapter
- Structure analysis
- BOS / MSS
- Liquidity levels
- Sweep detection
- FVG detection
- Order-block candidates
- Session buckets
- Volume / relative volume when supplied
- Displacement / ATR
- Confluence score
- Mobile PWA shell
- Cloudflare Worker proxy skeleton
- No simulated data

## Fastest way to run locally

No compilation is required for the frontend.

1. Download/unzip the project.
2. Run a local static server:
   - Python: `python -m http.server 8080`
   - Then open `http://localhost:8080`
3. In Settings, enter your backend URL.

Do not open `index.html` directly with `file://` if your browser blocks fetch requests.

## GitHub Pages

1. Create a public GitHub repository.
2. Upload `index.html`, `manifest.json`, `sw.js`, `css/`, and `js/`.
3. Open repository Settings → Pages.
4. Choose Deploy from branch → `main` → `/root`.
5. Save.
6. Wait for the Pages deployment.
7. Open the Pages URL on your phone.

GitHub Pages is static hosting, so it cannot safely hide an API key. Use the Cloudflare Worker as the backend.

## Cloudflare Worker

Install Wrangler on a computer/Termux environment, or use Cloudflare's web dashboard if you prefer.

Typical CLI flow:

```bash
cd worker
npx wrangler login
npx wrangler secret put MARKET_API_KEY
npx wrangler deploy
```

Set the real provider endpoint in `worker/wrangler.toml`, or configure it as a Worker variable.

Then put the Worker URL into the dashboard Settings.

## Provider response contract

The Worker normalizes the provider response to:

```json
{
  "candles": [
    {
      "time": 1766400000,
      "open": 24000.25,
      "high": 24010.50,
      "low": 23998.00,
      "close": 24008.75,
      "volume": 12345
    }
  ]
}
```

`time` must be Unix seconds.

## Mobile-only workflow

You can edit the repository from GitHub's mobile website/app.

For a more complete terminal workflow on Android, Termux can run Git and Node tooling, but GitHub Pages itself needs no build step.

## Production hardening before live trading

- Use a licensed/authorized real-time futures feed.
- Keep API keys server-side.
- Add authentication/rate limiting to the Worker.
- Use WebSocket streaming where the provider supports it.
- Validate timestamps and symbol mapping.
- Handle market holidays and contract rollovers.
- Use the correct active CME contract rather than blindly assuming a perpetual symbol.
- Validate all SMC rules against your own trading specification.
- Paper-test the dashboard before relying on signals.

## Important SMC implementation note

The included detectors are intentionally transparent starter algorithms, not a claim that there is one universally correct definition of ICT/SMC. You should tune swing length, displacement thresholds, FVG rules, order-block qualification, sessions, and confluence weights to your exact strategy before treating the score as a trading signal.
