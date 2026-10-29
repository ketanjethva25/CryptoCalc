// Serverless function on Vercel.  URL: /api/price?coin=bitcoin&currency=inr
// The browser calls this file, and this file calls CoinGecko.
// Why? It keeps the API key private and lets us cache answers.
// Explains a CoinGecko error in simple words (the real reason is also printed in the terminal)
function explain(status) {
  if (status === 401 || status === 403) return 'CoinGecko rejected the request. Check that COINGECKO_API_KEY is set and correct.'
  if (status === 429) return 'Too many requests to CoinGecko. Please wait a minute and try again.'
  return 'CoinGecko could not return the data (status ' + status + ').'
}

export default async function handler(req, res) {
  const { coin = 'bitcoin', currency = 'inr' } = req.query

  // Only allow simple values, so nobody can send strange input
  if (!/^[a-z0-9-]+$/.test(coin) || !/^[a-z]{3}$/.test(currency)) {
    return res.status(400).json({ error: 'Invalid input' })
  }

  try {
    const key = process.env.COINGECKO_API_KEY
    if (!key) console.warn('COINGECKO_API_KEY is not set. Add it to your .env file and restart the server.')
    const headers = key ? { 'x-cg-demo-api-key': key } : {}
    const r = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=${currency}`, { headers })
    if (!r.ok) {
      console.error('CoinGecko error', r.status, await r.text())
      return res.status(502).json({ error: explain(r.status) })
    }

    const price = (await r.json())?.[coin]?.[currency]
    if (typeof price !== 'number') return res.status(502).json({ error: 'CoinGecko did not return a price for this coin.' })

    // Cache for 60 seconds so many visitors do not use up the API limit
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120')
    res.status(200).json({ price })
  } catch (e) {
    console.error('Request failed', e)
    res.status(502).json({ error: 'Could not reach CoinGecko. Check your internet connection.' })
  }
}
