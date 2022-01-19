import { useMemo } from 'react'
enum RoundedType {
  topLeft = 'topLeft',
  bottomLeft = 'bottomLeft',
  topRight = 'topRight',
  bottomRight = 'bottomRight'
}
export enum RoundedSize {
  none = 'none',
  md = 'md'
}
type RoundedCorners = Record<RoundedType, Record<RoundedSize, string>>
const ROUNDED_CORNERS: RoundedCorners = {
  topLeft: { none: 'rounded-tl-none', md: 'rounded-tl' },
  bottomLeft: { none: 'rounded-bl-none', md: 'rounded-bl' },
  topRight: { none: 'rounded-tr-none', md: 'rounded-tr' },
  bottomRight: { none: 'rounded-br-none', md: 'rounded-br' }
}
type AllRounded = Record<RoundedType, RoundedSize>
export type Rounded = Partial<AllRounded>
const DEFAULT_ROUNDED: AllRounded = {
  topLeft: RoundedSize.md,
  bottomLeft: RoundedSize.md,
  topRight: RoundedSize.md,
  bottomRight: RoundedSize.md
}
type Props = { rounded: null | Rounded }
const useBorderRadius = ({ rounded }: Props): string | string[] =>
  useMemo<string | string[]>(() => {
    if (!rounded) return 'rounded'

    const allCorners = { ...DEFAULT_ROUNDED, ...rounded }
    return Object.keys(allCorners).map((cornerKey: RoundedType) => {
      const value: RoundedSize = allCorners[cornerKey]
      return ROUNDED_CORNERS[cornerKey][value]
    })
  }, [rounded])

export default useBorderRadius
