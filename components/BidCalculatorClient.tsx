'use client'

import { useMemo, useState } from 'react'

export default function BidCalculatorClient() {
  const [expectedSalePrice, setExpectedSalePrice] = useState('18000')
  const [desiredProfit, setDesiredProfit] = useState('2500')
  const [repairCost, setRepairCost] = useState('2500')
  const [fees, setFees] = useState('800')
  const [transport, setTransport] = useState('400')
  const [buffer, setBuffer] = useState('500')

  const expectedSaleValue = Number(expectedSalePrice || 0)
  const desiredProfitValue = Number(desiredProfit || 0)
  const repairCostValue = Number(repairCost || 0)
  const feesValue = Number(fees || 0)
  const transportValue = Number(transport || 0)
  const bufferValue = Number(buffer || 0)

  const totalNonBidCosts = useMemo(() => {
    return (
      desiredProfitValue +
      repairCostValue +
      feesValue +
      transportValue +
      bufferValue
    )
  }, [
    desiredProfitValue,
    repairCostValue,
    feesValue,
    transportValue,
    bufferValue,
  ])

  const maxBid = useMemo(() => {
    return (
      expectedSaleValue -
      desiredProfitValue -
      repairCostValue -
      feesValue -
      transportValue -
      bufferValue
    )
  }, [
    expectedSaleValue,
    desiredProfitValue,
    repairCostValue,
    feesValue,
    transportValue,
    bufferValue,
  ])

  const breakEvenBid = useMemo(() => {
    return (
      expectedSaleValue -
      repairCostValue -
      feesValue -
      transportValue -
      bufferValue
    )
  }, [expectedSaleValue, repairCostValue, feesValue, transportValue, bufferValue])

  const safeMaxBid = Math.max(maxBid, 0)
  const safeBreakEvenBid = Math.max(breakEvenBid, 0)

  const inputClass =
    'w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-slate-500'

  const labelClass =
    'mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400'

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 shadow-xl">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Bid Calculator
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Enter your sale estimate and costs to see your max bid before you buy.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-xl">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-white">Calculator Inputs</h2>
            <p className="mt-2 text-sm text-slate-400">
              Adjust these numbers based on the deal you are evaluating.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Expected Sale Price</label>
              <input
                type="number"
                className={inputClass}
                value={expectedSalePrice}
                onChange={(e) => setExpectedSalePrice(e.target.value)}
                placeholder="18000"
              />
            </div>

            <div>
              <label className={labelClass}>Desired Profit</label>
              <input
                type="number"
                className={inputClass}
                value={desiredProfit}
                onChange={(e) => setDesiredProfit(e.target.value)}
                placeholder="2500"
              />
            </div>

            <div>
              <label className={labelClass}>Estimated Repair Cost</label>
              <input
                type="number"
                className={inputClass}
                value={repairCost}
                onChange={(e) => setRepairCost(e.target.value)}
                placeholder="2500"
              />
            </div>

            <div>
              <label className={labelClass}>Fees</label>
              <input
                type="number"
                className={inputClass}
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                placeholder="800"
              />
            </div>

            <div>
              <label className={labelClass}>Transport</label>
              <input
                type="number"
                className={inputClass}
                value={transport}
                onChange={(e) => setTransport(e.target.value)}
                placeholder="400"
              />
            </div>

            <div>
              <label className={labelClass}>Buffer</label>
              <input
                type="number"
                className={inputClass}
                value={buffer}
                onChange={(e) => setBuffer(e.target.value)}
                placeholder="500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Max Bid
            </p>
            <p
              className={`mt-3 text-4xl font-bold tracking-tight ${
                maxBid >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              ${safeMaxBid.toLocaleString()}
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Based on your desired profit and total expected costs.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Break-Even Bid
            </p>
            <p className="mt-3 text-3xl font-bold tracking-tight text-white">
              ${safeBreakEvenBid.toLocaleString()}
            </p>
            <p className="mt-2 text-sm text-slate-400">
              This is your ceiling before profit drops to zero.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Total Non-Bid Costs
            </p>
            <p className="mt-3 text-3xl font-bold tracking-tight text-white">
              ${totalNonBidCosts.toLocaleString()}
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Desired profit + repairs + fees + transport + buffer.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white">Formula</h2>
        <div className="mt-4 space-y-3 text-sm text-slate-300">
          <p>
            <span className="font-semibold text-white">Max Bid</span> = Expected Sale
            Price - Desired Profit - Estimated Repair Cost - Fees - Transport - Buffer
          </p>
          <p>
            <span className="font-semibold text-white">Break-Even Bid</span> = Expected
            Sale Price - Estimated Repair Cost - Fees - Transport - Buffer
          </p>
        </div>
      </section>
    </div>
  )
}