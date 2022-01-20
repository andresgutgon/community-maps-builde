import { renderHook } from '@testing-library/react-hooks'

import { Place } from '@maps/types/index'
import useFilters, { FilterFn, State } from './useFilters'

const commonPlace = {
  slug: 'no',
  map_slug: 'no',
  form_slug: null,
  lat: 'no',
  lng: 'no',
  name: 'no',
  address: null
}
enum allCat {
  car = 'car',
  train = 'train',
  bike = 'bike',
  van = 'van'
}
let categories = [allCat.car, allCat.train, allCat.bike, allCat.van]
const active: Place = {
  ...commonPlace,
  category_slug: allCat.car,
  active: true,
  goalProgress: 68
}
const starting: Place = {
  ...commonPlace,
  category_slug: allCat.car,
  active: false,
  goalProgress: 4.9
}
const middle: Place = {
  ...commonPlace,
  category_slug: allCat.train,
  active: false,
  goalProgress: 73
}
const finishing: Place = {
  ...commonPlace,
  category_slug: allCat.train,
  active: false,
  goalProgress: 100
}
const places = [starting, middle, finishing, active]
let filterPlaces: FilterFn
beforeEach(() => {
  const { result } = renderHook(() => useFilters())
  filterPlaces = result.current.filterPlaces
})

describe('#filterPlaces by state', () => {
  test('all places', () => {
    const filtered = filterPlaces({
      places,
      filters: { state: State.all, categories },
      showFilters: null
    })
    expect(filtered).toStrictEqual(places)
  })

  test('all places but not with category', () => {
    const filtered = filterPlaces({
      places,
      filters: { state: State.all, categories: [allCat.car] },
      showFilters: null
    })
    expect(filtered).toStrictEqual([starting, active])
  })

  test('active places', () => {
    const filtered = filterPlaces({
      places,
      filters: { state: State.active, categories },
      showFilters: null
    })
    expect(filtered).toStrictEqual([active])
  })

  test('active but not with category', () => {
    const filtered = filterPlaces({
      places,
      filters: { state: State.active, categories: [allCat.van] },
      showFilters: null
    })
    expect(filtered).toStrictEqual([])
  })

  test('active but not with category ignoring categories', () => {
    const filtered = filterPlaces({
      places,
      filters: { state: State.active, categories: [allCat.van] },
      showFilters: { status: true, crowdfounding: true, categories: false }
    })
    expect(filtered).toStrictEqual([active])
  })

  test('crowdfounding', () => {
    const filtered = filterPlaces({
      places,
      filters: {
        state: State.middle,
        categories
      },
      showFilters: null
    })
    expect(filtered).toStrictEqual([middle])
  })

  test('crowdfounding ignoring active', () => {
    const filtered = filterPlaces({
      places,
      filters: {
        state: State.middle,
        categories
      },
      showFilters: { status: false, crowdfounding: true, categories: true }
    })
    expect(filtered).toStrictEqual([middle])
  })

  test('active ignoring crowdfounding', () => {
    const filtered = filterPlaces({
      places,
      filters: {
        state: State.active,
        categories
      },
      showFilters: { status: true, crowdfounding: false, categories: true }
    })
    expect(filtered).toStrictEqual([active])
  })

  test('filter train category and middle crowdfounding', () => {
    const filtered = filterPlaces({
      places,
      filters: {
        state: State.middle,
        categories: [allCat.train]
      },
      showFilters: null
    })
    expect(filtered).toStrictEqual([middle])
  })
})

describe('#showFilters', () => {
  test('ignore active state', () => {
    const filtered = filterPlaces({
      places,
      filters: {
        state: State.active,
        categories: categories
      },
      showFilters: { status: false, crowdfounding: true, categories: true }
    })
    expect(filtered).toStrictEqual(places)
  })

  test('ignore active state but use categories', () => {
    const filtered = filterPlaces({
      places,
      filters: {
        state: State.active,
        categories: [allCat.car]
      },
      showFilters: { status: false, crowdfounding: true, categories: true }
    })
    expect(filtered).toStrictEqual([starting, active])
  })

  test('ignore crowdfounding', () => {
    const filtered = filterPlaces({
      places,
      filters: {
        state: State.middle,
        categories: categories
      },
      showFilters: { status: true, crowdfounding: false, categories: true }
    })
    expect(filtered).toStrictEqual(places)
  })

  test('ignore crowdfounding but use categories', () => {
    const filtered = filterPlaces({
      places,
      filters: {
        state: State.middle,
        categories: [allCat.car]
      },
      showFilters: { status: true, crowdfounding: false, categories: true }
    })
    expect(filtered).toStrictEqual([starting, active])
  })

  test('ignore categories', () => {
    const filtered = filterPlaces({
      places,
      filters: {
        state: State.all,
        categories: [allCat.car]
      },
      showFilters: { status: true, crowdfounding: true, categories: false }
    })
    expect(filtered).toStrictEqual(places)
  })

  test('do not show active places when filtering by crowdfounding', () => {
    const filtered = filterPlaces({
      places,
      filters: {
        state: State.middle,
        categories: [allCat.car]
      },
      showFilters: { status: true, crowdfounding: true, categories: false }
    })
    expect(filtered).toStrictEqual([middle])
  })
})
