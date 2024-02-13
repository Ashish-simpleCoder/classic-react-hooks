import React, { Fragment, ReactNode } from "react"
import useCounter from "../lib/use-counter/use-counter"
import { useEventListener } from "../lib/use-event-listener/use-event-listener"

export default function ResetWrapper({ children }: { children: ReactNode }) {
   const { counter, incrementCounter } = useCounter()

   useEventListener(() => document.querySelector('.reset-btn'), 'click', incrementCounter)

   return <Fragment key={counter}>{children}</Fragment>
}
