export type Prettify<K> = {
   [Key in keyof K]: K[Key]
} & {}

export type EvTarget = () => EventTarget | null
export interface EvOptions extends AddEventListenerOptions {
   shouldInjectEvent?: boolean | any
}
export type EvHandler = (event: Event) => void

// use-intersection type
export interface IntersectionOptions extends IntersectionObserverInit {
   only_trigger_once?: boolean | Array<boolean>
}
export type IntersectionObserverTarget = () => HTMLElement | null
export type IsTargetIntersecting = boolean
