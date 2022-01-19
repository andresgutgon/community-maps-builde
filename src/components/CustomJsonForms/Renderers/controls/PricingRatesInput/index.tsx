import { MouseEvent, useRef, useState, useMemo } from 'react'
import cn from 'classnames'
import debounce from 'lodash/debounce'
import { useIntl, FormattedMessage } from 'react-intl'
import { rankWith, RankedTester, uiTypeIs, and, or, schemaTypeIs, schemaMatches, optionIs, ControlProps } from '@jsonforms/core'
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
  if (!pricingRates) return []

  return pricingRates.map((config: PricingRateConfig) => ({
    minimum: fromCentsToFloat(config.minimum, inCents),
    maximum: fromCentsToFloat(config.maximum, inCents),
    rates: {
      hourly: fromCentsToFloat(config.rates.hourly, inCents),
      daily: fromCentsToFloat(config.rates.daily, inCents)
    }
  }))
}

enum TimeRate { hourly = 'hourly', daily = 'daily' }
type RateProps = {
  currentTimeRate: TimeRate,
  bestRate: PricingRateConfig,
  isCurrent: boolean,
  rateConfig: PricingRateConfig,
  format: Format,
  currency: null | Currency,
  onRateClick: (minimumRate: number) => void
}
const Rate = ({ currentTimeRate, bestRate, isCurrent, format, currency, rateConfig, onRateClick }: RateProps) => {
  const isTheBestRate = bestRate.rates.daily === rateConfig.rates.daily
  const timeRateValue = useFormatValue({
    value: currentTimeRate === TimeRate.hourly ? rateConfig.rates.hourly : rateConfig.rates.daily,
    format,
    currency
  })
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
            'relative flex-1 space-y-1 w-full flex flex-col items-center bg-white border rounded p-2 transition-colors',
            {
              'border-gray-300 hover:border-gray-700 hover:shadow': !isCurrent,
              'border-green-700 bg-green-50 text-green-600 shadow': isCurrent && isTheBestRate,
              'border-gray-700 shadow': isCurrent && !isTheBestRate
            }
          )
        }
      >
        {isTheBestRate ? (
          <div
            className={
                cn(
                  'absolute -top-3 leading-4 rounded px-1 py-0.5 font-semibold text-[9px] uppercase tracking-wider text-white',
                  {
                    'bg-gray-700': !isCurrent,
                    'bg-green-700': isCurrent
                  }
                )
              }
          >
            <FormattedMessage id='TKx/Q8' defaultMessage="Mejor" />
          </div>
        ) : null}
        <div className='h-full flex flex-col justify-center items-center text-base'>
          {timeRateValue}
        </div>
      </div>
    </button>
  )
}

type TimeCopy = { button: string, word: string }
type RateTimeCopies = {
  [TimeRate.hourly]: TimeCopy
  [TimeRate.daily]: TimeCopy
}
type PricingRatesProps = {
  path: string,
  bestRate: PricingRateConfig,
  rates: PricingRateConfig[],
  format: Format,
  currency: null | Currency,
  currentValue: null | number,
  onRateClick: (minimumRate: number) => void
}
const PricingRates = ({ path, bestRate, rates, currentValue, format, currency, onRateClick }: PricingRatesProps) => {
  const intl = useIntl()
  const { radio: radioStyles } = useStyles()
  const timeRateCopies = useRef<RateTimeCopies>({
    [TimeRate.hourly]: {
      button: intl.formatMessage({ id: 'Ne/FEr', defaultMessage: 'Precio por hora' }),
      word: intl.formatMessage({ id: 'puO6Zk', defaultMessage: 'hora' })
    },
    [TimeRate.daily]: {
      button: intl.formatMessage({ id: 'tHIDSe', defaultMessage: 'Precio por día' }),
      word: intl.formatMessage({ id: '3sBbAu', defaultMessage: 'día' })
    }
  }).current
  const maximumOfAllRates = useMemo<number>(() => {
    const maxArray = rates.map(rate => rate.maximum)
    return Math.max(...maxArray)
  }, [rates])
  const current = useMemo(() => rates.find((rateConfig: PricingRateConfig) =>
    rateConfig.maximum === maximumOfAllRates
      ? rateConfig.minimum <= currentValue
      : rateConfig.minimum <= currentValue && currentValue <= rateConfig.maximum
  ), [rates, currentValue, maximumOfAllRates])
  const minimum = useFormatValue({ value: current.minimum, format, currency })
  const maximum = useFormatValue({ value: current.maximum, format, currency })
  const [currentTimeRate, setTimeRate] = useState(TimeRate.hourly)
  const timeRateValue = useFormatValue({
    value: currentTimeRate === TimeRate.hourly ? current.rates.hourly : current.rates.daily,
    format,
    currency
  })
  const sameMinMax = current.minimum === current.maximum
  return (
    <div className='space-y-4'>
      <div>
        <h3 className='text-sm font-semibold text-gray-800'>
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
      <div className='flex flex-col space-y-2'>
        {[TimeRate.hourly, TimeRate.daily].map((timeRate: TimeRate) =>
          <label
            key={`${path}--${timeRate}`}
            className='text-xs cursor-pointer flex flex-rows items-center space-x-2'
            htmlFor={`${path}--${timeRate}`}
            onClick={(event) => {
              event.stopPropagation()
              setTimeRate(timeRate)
            }}
          >
            <input
              type="radio"
              id={`${path}--${timeRate}`}
              className={radioStyles.input}
              value={timeRate}
              name='timeRate'
              onChange={() => setTimeRate(timeRate)}
              checked={currentTimeRate === timeRate}
            />
            <span>{timeRateCopies[timeRate].button}</span>
          </label>
        )}
      </div>
      <div className='space-y-2 rounded bg-gray-50 border border-gray-100 p-2'>
        {/** NOTE: Hardcoded to pricing rates from 2 to 3 **/}
        <ul className={cn('grid gap-x-4', { 'grid-cols-2': rates.length === 2, 'grid-cols-3': rates.length === 3 })}>
          {rates.map((config: PricingRateConfig, index: number) =>
            <li key={index} className='w-full flex'>
              <Rate
                currentTimeRate={currentTimeRate}
                bestRate={bestRate}
                isCurrent={current.minimum === config.minimum && current.maximum === config.maximum}
                rateConfig={config}
                onRateClick={onRateClick}
                format={format}
                currency={currency}
              />
            </li>
          )}
        </ul>
        <div className='text-xs text-gray-800'>
          {!sameMinMax ? (
            <FormattedMessage
              id='OS3K9O'
              defaultMessage='Si tu aportación es de {min} a {max} tu tarifa por {timeRate} es {rate}'
              values={{
                min: <b>{minimum}</b>,
                max: <b>{maximum}</b>,
                timeRate: timeRateCopies[currentTimeRate].word,
                rate: <b>{timeRateValue}</b>
              }}
            />
          ) : (
            <FormattedMessage
              id='k3fpzo'
              defaultMessage="Si tu aportación es más de {value} tu tarifa por {timeRate} es {rate}"
              values={{
                value: <b>{minimum}</b>,
                timeRate: timeRateCopies[currentTimeRate].word,
                rate: <b>{timeRateValue}</b>
              }}
            />
          )}
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
  path,
  handleChange}: Props) => {
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
  const bestRate: null | PricingRateConfig = useRef([...pricingRates].sort((a, b) => {
    if (a.rates.daily < b.rates.daily) return -1
    if (a.rates.daily > b.rates.daily) return 1
    return 0
  })).current[0]
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
  const niceContribution = value >= bestRate?.minimum

  if (!visible) return null

  return (
    <div className={classNames.wrapper}>
      <div className='bg-gray-50 border border-gray-200 rounded p-2'>
        <Description
          errors={errors}
          uischema={uischema}
          visible={visible}
          description={description}
        />
      </div>
      <Label
        id={id}
        label={label}
        required={required}
        uischema={uischema}
        className={classNames.label}
        rightValue={
          <div className={cn('transition-colors', { 'text-green-600': niceContribution })}>
            {formattedValue}
          </div>
        }
      />
      <div className='space-y-6'>
        <Slider
          color={niceContribution ? Color.success : Color.default}
          defaultValue={defaultValue}
          value={value}
          minimum={minimum}
          maximum={maximum}
          step={step}
          onChange={onChange}
        />
        {(pricingRates && bestRate) ? (
          <PricingRates
            path={path}
            bestRate={bestRate}
            rates={pricingRates}
            onRateClick={onChange}
            format={format}
            currency={currency}
            currentValue={value}
          />
        ) : null}
      </div>
    </div>
  )
}

export default withVanillaControlProps(withJsonFormsControlProps(PricingRatesInput))
