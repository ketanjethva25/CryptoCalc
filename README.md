# Price Change Impact Calculator

A simple web app that shows how much a crypto holding would gain or lose if the coin price rises or falls by a chosen percentage. Results are shown in the user's local currency.

**Live demo:** `ADD-YOUR-VERCEL-LINK-HERE`

## Features

- Brand name: **ImpactLens**, with a custom coin and currency dropdown
- Impact chart: gain or loss at many different price changes at once
- Choose a coin, quantity and currency (INR, USD, EUR, GBP, AED)
- Enter a percentage change with a slider, a number box or quick buttons (±5%, ±10%, ±25%)
- See the current value, the new value and the gain or loss
- Live prices from CoinGecko
- Input checks, loading state and a clear error message with a retry button
- Responsive layout for mobile, tablet and desktop

## Tech Stack

| Area | Technology |
|---|---|
| Frontend | React 18 (Vite) |
| Charts | Recharts |
| Styling | Tailwind CSS v4 |
| Backend | Vercel serverless function (Node.js) |
| Price data | CoinGecko API |
| Icons | Lucide React |
| Testing | Vitest |
| Hosting | Vercel |

## How It Works

1. The browser asks `/api/price` for the live price of the selected coin.
2. The serverless function gets the price from CoinGecko and caches it for 60 seconds.
3. The app calculates the result in `src/utils/calc.js`:
   - `current value = quantity x price`
   - `new value = current value x (1 + change% / 100)`
   - `gain or loss = new value - current value`

## Project Structure

```
price-impact-calculator/
├── api/price.js          # Serverless function (gets live price)
├── src/
│   ├── utils/calc.js     # Calculation logic
│   ├── utils/calc.test.js# Unit tests
│   ├── App.jsx           # Main page (navbar, hero, calculator, how it works, FAQ)
│   ├── index.css         # Colors, font and global styles
│   └── main.jsx          # App entry point
└── README.md
```

## Getting Started

You need Node.js 18 or newer.

```bash
npm install        # install packages
npm test           # run unit tests
npm run dev        # run the app (the /api function also works locally)
```

> Open the link shown in the terminal (usually http://localhost:5173). The `/api` function runs locally through a small plugin in `vite.config.js`. `npx vercel dev` also works.

## Environment Variables

| Name | Required | Purpose |
|---|---|---|
| `COINGECKO_API_KEY` | No | CoinGecko demo API key for higher rate limits |

For local use, copy `.env.example` to `.env` and paste your key, then restart `npm run dev`. The `.env` file is in `.gitignore`, so it is never uploaded to GitHub.

## Deployment

1. Push this project to GitHub.
2. Import the repository in Vercel.
3. (Optional) Add `COINGECKO_API_KEY` in the project settings.
4. Click Deploy.

## Limitations

- Results are estimates and are not financial advice.
- Free CoinGecko limits can slow down very frequent requests. Caching reduces this.
