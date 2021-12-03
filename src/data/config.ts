import { Form, Category, TileStyle } from '@maps/types/index'
import { TILES } from '@maps/lib/tiles'
import mapForms from './mapForms.json'
import categoryForms from './categoryForms.json'
import categories from './categories.json'

const data = {
  theme: {
    color: 'green',
    tileStyle: 'osm' as TileStyle
  },
  mapForms: mapForms as Record<string, Form>,
  categoryForms: categoryForms as Record<string, Form>,
  categories: categories as Record<string, Category>,
  maps: {
    'first-map': {
      slug: 'first-map',
      name: 'First map',
      description: 'A description of this map maybe',
    }
  }
}

export default data
