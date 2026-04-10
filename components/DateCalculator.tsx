"use client"

import { differenceInDays } from "date-fns"
import { useState } from "react"

interface Props {
  price: number
  quantity: number
}

export default function DateCalculator({ price, quantity }: Props) {

  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")

  let total = 0

  if (start && end) {
    const days =
      differenceInDays(new Date(end), new Date(start)) + 1

    total = days * price * quantity
  }

  return (
    <div className="space-y-2">

      <input
        type="date"
        onChange={(e) => setStart(e.target.value)}
        className="border p-2"
      />

      <input
        type="date"
        onChange={(e) => setEnd(e.target.value)}
        className="border p-2"
      />

      <div className="font-bold">
        Total: Rp {total.toLocaleString()}
      </div>

    </div>
  )
}