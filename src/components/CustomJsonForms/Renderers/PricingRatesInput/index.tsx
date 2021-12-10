import { useCallback, MouseEvent, memo, useRef, useState, useEffect, useMemo } from 'react'
import cn from 'classnames'
import debounce from 'lodash/debounce'
import { FormattedMessage } from 'react-intl'
import { rankWith, RankedTester, uiTypeIs, and, or, schemaTypeIs, schemaMatches, optionIs, ControlProps, computeLabel } from '@jsonforms/core'
import { withJsonFormsControlProps } from '@jsonforms/react'
import { withVanillaControlProps, VanillaRendererProps } from '@jsonforms/vanilla-renderers'

import { Format, Currency, fromCentsToFloat, toCentsFromFloat, useFormatValue } from '@maps/hooks/useFormatValue'
import Slider, { Color } from '@maps/components/Slider'
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
  bestRate: PricingRateConfig,
  rates: PricingRateConfig[],
  format: Format,
  currency: null | Currency,
  currentValue: null | number,
  onRateClick: (minimumRate: number) => void
}
const PricingRates = ({ bestRate, rates, currentValue, format, currency, onRateClick }: PricingRatesProps) => {
  const maximumOfAllRates = useMemo<number>(() => {
    const maxArray = rates.map(rate => rate.maximum)
    return Math.max(...maxArray)
  }, [rates])
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
  const [value, setValue] = useState(fromCentsToFloat(data || schema.default, inCents))
  const step = uischema?.options?.step || 10
  const format = uischema?.options?.formatValue || 'number'
  const currency = uischema?.options?.currency || 'EUR'
  const formattedValue = useFormatValue({ value, format, currency })
  const pricingRates = useMemo(
    () => parsePricingRates(uischema?.options?.pricingRates, inCents),
    [uischema?.options.pricingRates, inCents]
  )
  const [bestRate] = useRef([...pricingRates].sort((a, b) => {
    if (a.rates.daily < b.rates.daily) return -1
    if (a.rates.daily > b.rates.daily) return 1
    return 0
  })).current
  /**
   * Debounce 200 miliseconds the change on the JSONForms
   * A slider is too much change for the store.
   */
  const onChangeDebounced = useMemo<(path: string, value: number) => void>(
    () => debounce(handleChange, 200),
    [handleChange]
  )
  const onChange = (newValue: number) => {
    setValue(newValue)
    onChangeDebounced(path, toCentsFromFloat(newValue, inCents))
  }
  const niceContribution = value >= bestRate.minimum
  return (
    <div className={classNames.wrapper} hidden={!visible}>
      <Label
        id={id}
        label={label}
        required={required}
        uischema={uischema}
        classNames={classNames}
        rightValue={
          <div className={cn('transition-colors', { 'text-green-600': niceContribution })}>
            {formattedValue}
          </div>
        }
      />
      <Slider
        color={niceContribution ? Color.success : Color.default}
        defaultValue={defaultValue}
        value={value}
        minimum={minimum}
        maximum={maximum}
        step={step}
        onChange={onChange}
      />
      <Description
        errors={errors}
        uischema={uischema}
        visible={visible}
        description={description}
      />
      {pricingRates ? (
        <PricingRates
          bestRate={bestRate}
          rates={pricingRates}
          onRateClick={onChange}
          format={format}
          currency={currency}
          currentValue={value}
        />
      ) : null}
    </div>
  )
}

export default withVanillaControlProps(withJsonFormsControlProps(PricingRatesInput))
