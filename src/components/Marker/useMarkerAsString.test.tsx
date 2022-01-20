import { renderToString } from 'react-dom/server'
import { renderHook, act } from '@testing-library/react-hooks'

import { CategoryIcon } from '@maps/types/index'
import Marker, {
  Percentage,
  MarkerSize,
  MarkerColor
} from '@maps/components/Marker'
import useMarkerAsString, { MarkerPropsItem } from './useMarkersAsString'

const buildMarker = ({ color, iconKey, percentage, active }: MarkerPropsItem) =>
  renderToString(
    <Marker
      active={active}
      isSelected
      withArrow
      iconKey={iconKey}
      color={color}
      percentage={percentage}
      size={MarkerSize.normal}
    />
  ).toString()

const carCat = {
  slug: 'car',
  iconKey: CategoryIcon.car,
  iconColor: MarkerColor.pink,
  name: 'Cars places',
  description: null
}
let categories = [carCat]
let showPercentage = true

const defaultProps = { iconKey: carCat.iconKey, color: carCat.iconColor }
describe('#useMarkerAsString', () => {
  test('build strings of markers', () => {
    const { result } = renderHook(() => useMarkerAsString())
    act(() => {
      result.current.buildIconMarkers(categories, showPercentage)
    })
    expect(result.current.iconMarkers).toStrictEqual({
      car_pink_100_inactive: buildMarker({
        ...defaultProps,
        percentage: Percentage.full,
        active: false
      }),
      car_pink_100_active: buildMarker({
        ...defaultProps,
        percentage: Percentage.full,
        active: true
      }),
      car_pink_30_active: buildMarker({
        ...defaultProps,
        percentage: Percentage.thirty,
        active: true
      }),
      car_pink_30_inactive: buildMarker({
        ...defaultProps,
        percentage: Percentage.thirty,
        active: false
      }),
      car_pink_50_active: buildMarker({
        ...defaultProps,
        percentage: Percentage.fifty,
        active: true
      }),
      car_pink_50_inactive: buildMarker({
        ...defaultProps,
        percentage: Percentage.fifty,
        active: false
      }),
      car_pink_70_active: buildMarker({
        ...defaultProps,
        percentage: Percentage.seventy,
        active: true
      }),
      car_pink_70_inactive: buildMarker({
        ...defaultProps,
        percentage: Percentage.seventy,
        active: false
      })
    })
  })

  it('do not render percentage markers', () => {
    const { result } = renderHook(() => useMarkerAsString())
    showPercentage = false
    act(() => {
      result.current.buildIconMarkers(categories, showPercentage)
    })
    expect(result.current.iconMarkers).toStrictEqual({
      car_pink_100_inactive: buildMarker({
        ...defaultProps,
        percentage: Percentage.full,
        active: false
      }),
      car_pink_100_active: buildMarker({
        ...defaultProps,
        percentage: Percentage.full,
        active: true
      })
    })
  })
})
