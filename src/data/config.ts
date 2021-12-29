import { Form, Theme, ThemeColor, Category, TileStyle } from '@maps/types/index'
import { TILES } from '@maps/lib/tiles'
import forms from './forms.json'
import categories from './categories.json'

const data = {
  theme: {
    color: {
      textColorBase: '63, 62, 62',
      fillColor: '233, 189, 0',
      borderColor: '30, 49, 64',
      buttonColor: '233, 189, 0',
      buttonColorHover: '30, 49, 64',
      buttonTextColor: '63, 62, 62',
      buttonTextColorHover: '255, 255, 255',
      buttonTextInvertedColor: '30, 49, 64',
      buttonTextInvertedColorHover: '30, 49, 64'
    } as ThemeColor,
    tileStyle: 'osm' as TileStyle
  } as Theme,
  forms: forms as Record<string, Form>,
  categories: categories as Record<string, Category>
}

export default data
