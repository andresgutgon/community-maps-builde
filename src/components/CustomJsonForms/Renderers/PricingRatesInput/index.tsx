import { useCallback, MouseEvent, memo, useRef, useState, useEffect, useMemo } from 'react'
import cn from 'classnames'
import { FormattedMessage } from 'react-intl'
import { SliderInput, SliderTrack, SliderRange, SliderHandle } from '@reach/slider'
import { rankWith, RankedTester, uiTypeIs, and, or, schemaTypeIs, schemaMatches, optionIs, ControlProps, computeLabel } from '@jsonforms/core'
import { withJsonFormsControlProps } from '@jsonforms/react'
import { withVanillaControlProps, VanillaRendererProps } from '@jsonforms/vanilla-renderers'

import useStyles from '@maps/components/CustomJsonForms/hooks/useStyles'
import Label from '@maps/components/CustomJsonForms/components/Label'
import Description from '@maps/components/CustomJsonForms/components/Description'

const isPricingControl = and(
  uiTypeIs('Control'),
  or(schemaTypeIs('number'), schemaTypeIs('integer')),
  schemaMatches(
    schema =>
    schema.hasOwnProperty('maximum') &&
    schema.hasOwnProperty('minimum') &&
    schema.hasOwnProperty('default')
  ),
  optionIs('pricing', true)
)

export const pricingRatesTester: RankedTester = rankWith(10, isPricingControl)

type Format = 'number' | 'currency'
type Currency = 'EUR'
type FormatProps = {
  value: number
  format: Format
  currency?: Currency
}
function useFormatValue ({ value, format, currency = 'EUR' }: FormatProps): string {
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

type RangeInputSliderProps = {
  minimum: number,
  maximum: number,
  step: number,
  onValueChange: (value: number) => void,
  defaultValue?: number,
  valueProp?: number
}
function RangeSliderInput({
  minimum, maximum, step, onValueChange, defaultValue, valueProp
}: RangeInputSliderProps) {
  const backgroundColor = 'bg-gray-600'
  return (
    <SliderInput
      className='max-w-full disabled:pointer-events-none disabled:opacity-50'
      max={maximum}
      min={minimum}
      step={step}
      value={valueProp}
      onChange={onValueChange}
    >
      <SliderTrack
        className='w-full h-2 top-[calc(-0.5rem-1px)] relative rounded-full bg-gray-100 before:content-[""] before:absolute'
      >
        <SliderRange
          className={
            cn(
              'h-full rounded-inherit left-0 bottom-0 bg-opacity-70',
              backgroundColor
            )
          }
        />
        <SliderHandle
          className={
            cn(
              'cursor-cursor shadow w-4 h-4 rounded-full z-10 origin-center -top-1/2 outline-white',
              backgroundColor
            )
          }
        />
      </SliderTrack>
    </SliderInput>
  )
}

function fromCentsToFloat(amount: null | number, inCents: boolean): number {
  if (!inCents) return amount
  if (!amount) return 0

  return amount / 100
}
function toCentsFromFloat(amount: null | number, inCents: boolean): number {
  if (!inCents) return amount
  if (!amount) return 0

  return amount * 100
}

type PricingRate = { hourly: number, daily: number }
type PricingRateConfig  = {
  minimum: number,
  maximum: number,
  rates: PricingRate
}
function parsePricingRates (pricingRates: null | PricingRateConfig[], inCents: boolean): null | PricingRateConfig[] {
  if (!pricingRates) return null

  return pricingRates.map((config: PricingRateConfig) => ({
    minimum: fromCentsToFloat(config.minimum, inCents),
    maximum: fromCentsToFloat(config.maximum, inCents),
    rates: {
      hourly: fromCentsToFloat(config.rates.hourly, inCents),
      daily: fromCentsToFloat(config.rates.daily, inCents)
    }
  }))
}

type RateProps = {
  bestRate: PricingRateConfig,
  maximumOfAllRates: number,
  currentValue: null | number,
  rateConfig: PricingRateConfig,
  format: Format,
  currency: null | Currency,
  onRateClick: (minimumRate: number) => void
}
const Rate = ({ bestRate, maximumOfAllRates, currentValue, format, currency, rateConfig, onRateClick }: RateProps) => {
  const sameMinMax = useRef<boolean>(rateConfig.minimum === rateConfig.maximum).current
  const minimum = useFormatValue({ value: rateConfig.minimum, format, currency })
  const maximum = useFormatValue({ value: rateConfig.maximum, format, currency })
  const hourly = useFormatValue({ value: rateConfig.rates.hourly, format, currency })
  const daily = useFormatValue({ value: rateConfig.rates.daily, format, currency })
  const isTheBestRate = bestRate.rates.daily === rateConfig.rates.daily
  const inRange = rateConfig.maximum === maximumOfAllRates
    ? rateConfig.minimum <= currentValue
    : rateConfig.minimum <= currentValue && currentValue <= rateConfig.maximum
  return (
    <button
      className='cursor-pointer w-full space-y-2 flex flex-col items-center justify-between'
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        onRateClick(rateConfig.minimum)
      }}
    >
      <div
        className={
          cn(
            'relative flex-1 space-y-1 w-full flex flex-col items-center text-xs border rounded p-2 transition-colors',
            {
              'border-gray-300 hover:border-gray-700 hover:shadow bg-white': !inRange,
              'border-green-700 bg-green-50 text-green-600 shadow': inRange
            }
          )
        }
      >
        {isTheBestRate ? (
          <div
            className={
                cn(
                  'absolute -top-3  rounded px-1 py-0.5 font-semibold text-[9px] uppercase tracking-wider text-white',
                  {
                    'bg-gray-700': !inRange,
                    'bg-green-700': inRange
                  }
                )
              }
          >
            <FormattedMessage id='TKx/Q8' defaultMessage="Mejor" />
          </div>
        ) : null}
        <div className='h-full flex flex-col justify-center items-center'>
          <div>
            <FormattedMessage
              id='LrEb2L'
              defaultMessage="{value} / hora"
              values={{
                value: <span>{hourly}</span>
              }}
            />
          </div>
          <div>
            <FormattedMessage
              id='7DlC7w'
              defaultMessage="{value} / día"
              values={{
                value: <span>{daily}</span>
              }}
            />
          </div>
        </div>
      </div>
      <div className='text-xs text-center tracking-wide transition-colors text-gray-700'>
        {!sameMinMax ? (
          <FormattedMessage
            id='DCKDvH'
            defaultMessage="De {min} a {max}"
            values={{ min: <b>{minimum}</b>, max: <><br className='hidden sm:block' /><b>{maximum}</b></> }}
          />
        ) : (
          <FormattedMessage
            id='KBQ1Ru'
            defaultMessage="Más de {value}"
            values={{ value: <><br className='hidden sm:block' /><b>{minimum}</b></> }}
          />
        )}
      </div>
    </button>
  )
}

type PricingRatesProps = {
  rates: PricingRateConfig[],
  format: Format,
  currency: null | Currency,
  currentValue: null | number,
  onRateClick: (minimumRate: number) => void
}
const PricingRates = ({ rates, currentValue, format, currency, onRateClick }: PricingRatesProps) => {
  const maximumOfAllRates = useMemo<number>(() => {
    const maxArray = rates.map(rate => rate.maximum)
    return Math.max(...maxArray)
  }, [rates])
  const [bestRate] = [...rates].sort((a, b) => {
    if (a.rates.daily < b.rates.daily) return -1
    if (a.rates.daily > b.rates.daily) return 1
    return 0
  })
  return (
    <div className='space-y-2 rounded bg-gray-50 border border-gray-100 p-2'>
      <div>
        <h3 className='text-sm font-semibold text-gray-600'>
          <FormattedMessage
            id="DtZeeF"
            defaultMessage='Tarifa según tu aportación'
          />
        </h3>
        <p className='text-xs text-gray-600'>
          <FormattedMessage
            id="qc8eLe"
            defaultMessage='A más aportación te podemos ofrecer mejor tarifa'
          />
        </p>
      </div>
      {/** NOTE: Hardcoded to pricing rates from 2 to 3 **/}
      <ul className={cn('grid gap-x-4', { 'grid-cols-2': rates.length === 2, 'grid-cols-3': rates.length === 3 })}>
        {rates.map((config: PricingRateConfig, index: number) =>
          <li key={index} className='w-full flex'>
            <Rate
              bestRate={bestRate}
              maximumOfAllRates={maximumOfAllRates}
              currentValue={currentValue}
              rateConfig={config}
              onRateClick={onRateClick}
              format={format}
              currency={currency}
            />
          </li>
        )}
      </ul>
    </div>
  )
}

type InputProps = {
  path: string,
  hasErrors: boolean,
  minimum: number,
  maximum: number,
  step: number,
  value: null | number,
  formattedValue: string,
  onChange: (value: number) => void
}
const Input = ({
  path,
  hasErrors,
  value,
  formattedValue,
  minimum,
  maximum,
  step,
  onChange
}: InputProps) => {
  const styles = useStyles()
  const amountRef = useRef<HTMLDivElement>()
  const [isFocus, setFocus] = useState<boolean>(false)
  const width = amountRef.current?.offsetWidth || 0
  return (
    <div className='relative'>
      <input
        name={path}
        min={minimum}
        max={maximum}
        step={step}
        type='number'
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        className={
          cn(
            styles.input,
            'pr-8',
            {
              'border-red-600 focus:ring-red-600 focus:border-red-600': hasErrors,
              'cursor-pointer': !isFocus
            }
          )
        }
        value={value || 0}
        onChange={(event) => {
          onChange(+event.target.value)
        }}
      />
      <div
        style={{ width: isFocus ? width : '100%' }}
        className={
          cn(
            'pointer-events-none transition-width',
            'absolute top-0 bottom-0 right-0',
            'flex items-center h-full',
          )
        }
      >
        <div className='flex items-center my-1'>
          <div
            ref={amountRef}
            className={
              cn(
                'bg-white ml-1 pl-1 pr-3 text-xl sm:text-2xl text-gray-500 font-semibold',
                { 'bg-transparent': isFocus, 'text-red-600': hasErrors }
              )
            }
          >
            {formattedValue}
          </div>
          {!isFocus ? (
            <div role='button' className={cn('text-xs truncate w-full underline text-gray-700', { 'text-red-600': hasErrors } )}>
              <FormattedMessage id='2WfLC4' defaultMessage="Cambia la cantidad" />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

type Props = ControlProps & VanillaRendererProps
const PricingRatesInput = ({
  classNames,
  id,
  label,
  required,
  description,
  errors,
  data,
  schema,
  uischema,
  visible,
  config,
  path,
  handleChange,
  enabled
}: Props) => {
  const inCents = useRef<boolean>(!!path.match(/_in_cents$/)).current
  const minimum = useRef<number>(fromCentsToFloat(schema.minimum, inCents)).current
  const maximum = useRef<number>(fromCentsToFloat(schema.maximum, inCents)).current
  const defaultValue = useRef<number>(fromCentsToFloat(schema.default, inCents)).current
  const step = uischema?.options?.step || 10
  const format = uischema?.options?.formatValue || 'number'
  const currency = uischema?.options?.currency || 'EUR'
  const value = data ? fromCentsToFloat(data || schema.default, inCents) : null
  const formattedValue = useFormatValue({ value, format, currency })
  const pricingRates = useMemo(
    () => parsePricingRates(uischema?.options?.pricingRates, inCents),
    [uischema?.options.pricingRates, inCents]
  )
  const handleChangeValue = (newValue: number) => {
    handleChange(path, toCentsFromFloat(newValue, inCents))
  }
  return (
    <div className={classNames.wrapper} hidden={!visible}>
      <Label
        id={id}
        label={label}
        required={required}
        uischema={uischema}
        classNames={classNames}
      />
      <Input
        path={path}
        hasErrors={!!errors}
        value={value}
        formattedValue={formattedValue}
        minimum={minimum}
        maximum={maximum}
        step={step}
        onChange={(newValue: number) => handleChangeValue(newValue)}
      />
      <Description
        errors={errors}
        uischema={uischema}
        visible={visible}
        description={description}
      />
      {pricingRates ? (
        <PricingRates
          rates={pricingRates}
          onRateClick={handleChangeValue}
          format={format}
          currency={currency}
          currentValue={value}
        />
      ) : null}
    </div>
  )
}

export default withVanillaControlProps(withJsonFormsControlProps(PricingRatesInput))
