// Calculation logic. Kept separate from the UI so it is easy to test.
//
// qty   = how many coins the user holds
// price = price of one coin right now
// pct   = price change in percent (10 means +10%, -25 means -25%)
export function impact(qty, price, pct) {
  const current = qty * price               // value today
  const next = current * (1 + pct / 100)    // value after the price change
  return { current, next, diff: next - current } // diff > 0 is a gain, diff < 0 is a loss
}
