import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cnMerge = (...classes: ClassValue[]) => twMerge(clsx(...classes))
