type Prettify<K> = {
   [Key in keyof K]: K[Key]
} & {}
