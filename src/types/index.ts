export type Prettify<K> = {
   [Key in keyof K]: K[Key]
} & {}

export type EvTarget = () => EventTarget | null
export interface EvOptions extends AddEventListenerOptions {
   shouldInjectEvent?: boolean | any
}
export type EvHandler = (event: Event) => void
