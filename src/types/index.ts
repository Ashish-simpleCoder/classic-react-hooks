import type { RefObject } from "react"

export interface EventTypes {
   Target: null | EventTarget | RefObject<EventTarget> | (() => EventTarget | null)
   Options : boolean | Prettify<AddEventListenerOptions & { shouldInjectEvent?: boolean | any }>
   Handler : (event: Event) => void
}
type Target = HTMLElement | RefObject<HTMLElement> | (() => HTMLElement | null) | null

// utility type
export type Prettify<K> = {
   [Key in keyof K]: K[Key]
} & {}