import { useMemo } from 'react'
export enum Format {
  number = 'number',
  currency = 'currency'
}
export enum Currency {
  EUR = 'EUR'
}

export function fromCentsToFloat(
  amount: null | number,
  inCents: boolean
): number {
  if (!inCents) return amount
  if (!amount) return 0

  return amount / 100
}

export function toCentsFromFloat(
  amount: null | number,
  inCents: boolean
): number {
  if (!inCents) return amount
  if (!amount) return 0

  return amount * 100
}
type Props = {
  value: number
  format: Format
  currency?: Currency
}
export function useFormatValue({
  value,
  format = Format.number,
  currency = Currency.EUR
}: Props): string {
  return useMemo(() => {
    if (format === 'currency') {
      return new Intl.NumberFormat(
        'de-DE', // Hardcoded for now. Change if currency is other than EUR
        {
          style: 'currency',
          minimumFractionDigits: 0,
          currency
        }
      ).format(value)
    }
    return value.toString()
  }, [value, format, currency])
}
