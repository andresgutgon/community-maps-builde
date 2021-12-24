import { Form, Category, TileStyle } from '@maps/types/index'
import { TILES } from '@maps/lib/tiles'
import forms from './forms.json'
import categories from './categories.json'

const data = {
  theme: {
    color: 'green',
    tileStyle: 'osm' as TileStyle
  },
  forms: forms as Record<string, Form>,
  categories: categories as Record<string, Category>,
}

export default data
