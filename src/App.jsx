import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ArrowRight, ChevronDown, Coins, Percent, ShieldCheck, TrendingDown, TrendingUp, Wallet, Zap } from 'lucide-react'
import { impact } from './utils/calc'
import { CURRENCIES } from './data'
import { useCoins } from './useCoins'
import { Dropdown } from './components/Dropdown'
import { Num, Reveal } from './components/motion'
import { HeroArt } from './components/HeroArt'

const STEP_ICONS = [Coins, Percent, TrendingUp] // one icon for each step
const compact = v => new Intl.NumberFormat('en', { notation: 'compact' }).format(v) // 1500000 -> 1.5M

const PRESETS = [-25, -10, -5, 5, 10, 25] // quick percentage buttons

// Text for the page sections
const NAV = [['Calculator', '#calculator'], ['How it works', '#how'], ['FAQ', '#faq']]
const STEPS = [
  ['Choose your coin', 'Pick the coin you hold and the currency you want to see.'],
  ['Set a price change', 'Use the slider or type a percentage, up or down.'],
  ['See the impact', 'Get the new value and your gain or loss right away.'],
]
const FAQ = [
  ['Where do the prices come from?', 'Live prices come from the CoinGecko API and are refreshed about every minute.'],
  ['Is the result exact?', 'No. It is an estimate based on today’s price and the change you enter.'],
  ['Can I check a price fall?', 'Yes. Use a negative percentage, for example -10, to see a possible loss.'],
]

// Shared style for inputs and dropdowns
const field = 'w-full rounded-lg border border-line bg-white px-3 py-2.5 text-base transition hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/10'

export default function App() {
  // What the user chooses
  const [coin, setCoin] = useState('bitcoin')
  const [cur, setCur] = useState('inr')
  const [qty, setQty] = useState('0.5')
  const [pct, setPct] = useState(10)

  // Live price data and its status
  const [price, setPrice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [retry, setRetry] = useState(0) // changing this number runs the fetch again
  const coins = useCoins(cur) // top coins with real icons and live prices

  // Get the live price whenever the coin or currency changes
  useEffect(() => {
    let cancelled = false // ignore old responses if the user changes the coin quickly
    setLoading(true)
    setErr('')
    fetch(`/api/price?coin=${coin}&currency=${cur}`)
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(d => !cancelled && setPrice(d.price))
      .catch(() => !cancelled && (setPrice(null), setErr('Could not load the live price. Check your connection and try again.')))
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [coin, cur, retry])

  // Validate the inputs
  const q = parseFloat(qty)
  const qtyOk = Number.isFinite(q) && q > 0
  const pctOk = Number.isFinite(pct) && pct >= -100 && pct <= 1000
  const ready = qtyOk && pctOk && price !== null

  // Calculate only when everything is valid
  const r = ready ? impact(q, price, pct) : null
  const up = r && r.diff >= 0 // true = gain, false = loss

  // Chart data: gain or loss at several price changes, plus the one the user chose
  const chart = ready
    ? [...new Set([-50, -40, -30, -20, -10, 10, 20, 30, 40, 50, pct])].filter(p => p !== 0).sort((a, b) => a - b).map(p => ({ pct: p, diff: impact(q, price, p).diff }))
    : []

  // Format numbers as money, for example 1,50,000.00 for INR
  const money = v => new Intl.NumberFormat(cur === 'inr' ? 'en-IN' : 'en-US', { style: 'currency', currency: cur.toUpperCase(), maximumFractionDigits: 2 }).format(v)

  return (
    <div id="top">
      {/* Top navigation bar (slightly see-through, blurs the page behind it) */}
      <header className="sticky top-0 z-30 border-b border-line/70 bg-white/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5" aria-label="Main">
          <a href="#top" className="flex items-center gap-2.5 text-lg font-bold tracking-tight">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-white"><TrendingUp className="h-5 w-5" /></span>CryptoCalc
          </a>
          <div className="flex items-center gap-1 text-sm font-medium text-muted">
            {NAV.map(([t, h]) => <a key={h} href={h} className="rounded-md px-3 py-2 transition-colors hover:bg-paper hover:text-ink">{t}</a>)}
          </div>
        </nav>
      </header>

      {/* Hero section: dark navy banner with an illustration on the right */}
      <section className="dots relative overflow-hidden bg-navy pb-36 pt-12 text-white sm:pt-16">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 md:grid-cols-[1.1fr_1fr]">
          <div className="animate-rise">
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">Price Change Impact <span className="text-hl">Calculator</span></h1>
            <p className="mt-5 text-lg text-white/85">See <span className="text-hl">how a price change can</span> affect the value of your crypto holdings.</p>
            <p className="mt-3 max-w-md text-white/60">Enter your holding details and expected price change to get an instant estimate of potential profit or loss.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#calculator" className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-semibold text-navy transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20">Try the calculator<ArrowRight className="h-4 w-4" /></a>
              <a href="#how" className="rounded-lg border border-white/25 px-5 py-3 font-semibold text-white transition hover:bg-white/10">How it works</a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/60">
              {[[Zap, 'Live prices'], [Coins, `${coins.length} top coins`], [ShieldCheck, 'Nothing is saved']].map(([I, t]) => <li key={t} className="flex items-center gap-2"><I className="h-4 w-4 text-hl" />{t}</li>)}
            </ul>
          </div>
          <HeroArt />
        </div>
      </section>

      <main>
        {/* Calculator card. The negative top margin makes it overlap the hero */}
        <section id="calculator" className="relative z-10 mx-auto -mt-20 max-w-6xl px-5">
          <div className="rounded-2xl border border-line bg-white p-5 shadow-xl shadow-ink/5 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><Percent className="h-5 w-5" /></span>
              <div><h2 className="text-lg font-semibold">Price change calculator</h2><p className="text-sm text-muted">Change any value and the result updates instantly.</p></div>
            </div>

            {/* Inputs */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Dropdown label="Coin" value={coin} onChange={setCoin} options={coins} searchable />
              <Dropdown label="Currency" value={cur} onChange={setCur} options={CURRENCIES} />
              <label className="block text-sm font-medium"><span className="mb-1.5 block">Quantity you hold</span>
                <div className="relative">
                  <Wallet className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <input className={field + ' pl-9'} type="number" min="0" step="any" inputMode="decimal" value={qty} onChange={e => setQty(e.target.value)} aria-invalid={!qtyOk} />
                </div>
              </label>
              <label className="block text-sm font-medium"><span className="mb-1.5 block">Price change (%)</span>
                <div className="relative">
                  <Percent className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  {/* An empty box becomes NaN, which fails validation */}
                  <input className={field + ' pl-9'} type="number" step="0.5" value={pct} onChange={e => setPct(e.target.value === '' ? NaN : parseFloat(e.target.value))} aria-invalid={!pctOk} />
                </div>
              </label>
            </div>
            {!qtyOk && <p className="mt-2 text-sm text-loss">Enter a quantity greater than 0.</p>}
            {!pctOk && <p className="mt-2 text-sm text-loss">Enter a change between -100% and 1000%.</p>}

            {/* Slider (-50 to +50) and quick buttons */}
            <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex-1">
                <input className="w-full" type="range" min="-50" max="50" step="1" value={Math.max(-50, Math.min(50, Number.isFinite(pct) ? pct : 0))} onChange={e => setPct(+e.target.value)} aria-label="Price change slider" />
                <div className="flex justify-between text-xs text-muted"><span>-50%</span><span>0</span><span>+50%</span></div>
              </div>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map(p => (
                  <button key={p} onClick={() => setPct(p)} className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${pct === p ? 'border-primary bg-primary text-white' : 'border-line hover:border-primary/40 hover:bg-paper'}`}>{p > 0 ? '+' : ''}{p}%</button>
                ))}
              </div>
            </div>

            {/* Result area: loading, error, invalid input, or the result */}
            <div className="mt-6 border-t border-line pt-6" aria-live="polite">
              {loading && <div className="grid animate-pulse gap-4 sm:grid-cols-3" role="status"><div className="h-24 rounded-xl bg-line" /><div className="h-24 rounded-xl bg-line" /><div className="h-24 rounded-xl bg-line" /><span className="sr-only">Loading live price</span></div>}

              {!loading && err && (
                <div className="rounded-lg border border-loss/30 bg-loss/5 p-4">
                  <p className="text-sm">{err}</p>
                  <button onClick={() => setRetry(n => n + 1)} className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Try again</button>
                </div>
              )}

              {!loading && !err && !ready && <p className="text-muted">Enter a valid quantity and price change to see the result.</p>}

              {!loading && !err && ready && (
                <>
                  <p className="flex items-center gap-2 text-sm text-muted"><span className="h-2 w-2 animate-pulse rounded-full bg-gain" />Live price: 1 {coins.find(c => c.value === coin)?.label || coin} = {money(price)}</p>
                  <div className="mt-3 grid gap-4 sm:grid-cols-3">
                    <Stat icon={Wallet} label="Current value" value={r.current} format={money} />
                    <Stat icon={up ? TrendingUp : TrendingDown} label="Value after change" value={r.next} format={money} />
                    <Stat icon={up ? TrendingUp : TrendingDown} label={up ? 'Estimated gain' : 'Estimated loss'} value={r.diff} format={v => `${v >= 0 ? '+' : '-'}${money(Math.abs(v))}`} color={up ? 'text-gain' : 'text-loss'} chip={up ? 'bg-gain/10 text-gain' : 'bg-loss/10 text-loss'} note={`${up ? '+' : ''}${pct}% on your holding`} />
                  </div>

                  {/* Impact chart: gain or loss at different price changes. Your chosen change is the brightest bar */}
                  <h3 className="mt-8 font-semibold">How different price changes would affect you</h3>
                  <p className="text-sm text-muted">Green bars are gains and red bars are losses. Your chosen change ({pct > 0 ? '+' : ''}{pct}%) is highlighted.</p>
                  <div className="mt-3">
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={chart} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                        <CartesianGrid stroke="#e6ecec" vertical={false} />
                        <XAxis dataKey="pct" tickFormatter={v => `${v > 0 ? '+' : ''}${v}%`} tick={{ fontSize: 12 }} />
                        <YAxis tickFormatter={compact} tick={{ fontSize: 12 }} width={56} />
                        <ReferenceLine y={0} stroke="#9aa9ad" />
                        <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} formatter={v => [money(v), 'Gain or loss']} labelFormatter={l => `Price change: ${l > 0 ? '+' : ''}${l}%`} />
                        <Bar dataKey="diff" radius={[4, 4, 0, 0]}>
                          {chart.map(d => <Cell key={d.pct} fill={d.diff >= 0 ? '#2c7a55' : '#b0453b'} fillOpacity={d.pct === pct ? 1 : 0.4} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* How it works: three steps */}
        <section id="how" className="mx-auto max-w-6xl px-5 py-20">
          <Reveal><h2 className="text-2xl font-bold sm:text-3xl">How it works</h2><p className="mt-1 text-muted">Three simple steps.</p></Reveal>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {STEPS.map(([t, d], i) => {
              const Icon = STEP_ICONS[i]
              return (
                <Reveal key={t} delay={i * 120}>
                  <div className="h-full rounded-2xl border border-line bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-ink/5">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span>
                    <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-primary">Step {i + 1}</p>
                    <h3 className="mt-1 text-lg font-semibold">{t}</h3>
                    <p className="mt-1 text-muted">{d}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </section>

        {/* FAQ: click a question to open the answer */}
        <section id="faq" className="mx-auto max-w-3xl px-5 pb-20">
          <Reveal><h2 className="text-2xl font-bold sm:text-3xl">Frequently asked questions</h2></Reveal>
          <div className="mt-6 space-y-3">
            {FAQ.map(([q, a]) => (
              <details key={q} className="group rounded-xl border border-line bg-white p-4 transition hover:border-primary/30">
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold [&::-webkit-details-marker]:hidden">{q}<ChevronDown className="h-5 w-5 text-muted transition-transform group-open:rotate-180" /></summary>
                <p className="mt-2 text-muted">{a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-ink text-white/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5 font-semibold text-white"><span className="grid h-8 w-8 place-items-center rounded-lg bg-white/10"><TrendingUp className="h-4 w-4" /></span>CryptoCalc</div>
          <p className="max-w-md text-sm">Prices from CoinGecko. Estimates only, not financial advice.</p>
        </div>
      </footer>
    </div>
  )
}

// A card that shows one number with an icon. The number counts up smoothly.
function Stat({ icon: Icon, label, value, format, color = 'text-ink', chip = 'bg-primary/10 text-primary', note }) {
  return (
    <div className="rounded-xl border border-line bg-paper/60 p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-2 text-sm text-muted"><span className={`grid h-7 w-7 place-items-center rounded-lg ${chip}`}><Icon className="h-4 w-4" /></span>{label}</div>
      <p className={`mt-2 text-2xl font-bold ${color}`}><Num value={value} format={format} /></p>
      {note && <p className={`text-sm font-medium ${color}`}>{note}</p>}
    </div>
  )
}
