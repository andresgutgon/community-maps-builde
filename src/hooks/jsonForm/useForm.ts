import { useMemo, useEffect, useState } from 'react'
import { JsonFormsCore } from '@jsonforms/core'

import type { Form, JsonSchema, UIJsonFormSchema, Config, Place } from '@maps/types/index'
import { useMapData } from '@maps/components/CommunityProvider'
import { useTranslateError } from './useTranslateError'
import type { TranslateErrorFn } from './useTranslateError'

/**
 * We try to look in config.categoryForms to see if
 * the backend has a form for this category. If not we fallback
 * to default config.mapForms which always should have a form
 * for a map.
 */
function findForm (config: Config, place: Place | null): Form | null {
  if (!place) return null
  const category = config.categories[place.category_slug]
  const categoryForm = config.categoryForms[category.slug]

  if (categoryForm) return categoryForm

  return config.mapForms[category.map_slug]
}

type Props = {
  place: Place | null,
  isOpen: boolean
}
type OnChangeFn = (jsonForm: JsonFormsCore) => void
type ReturnType = {
  translateError: TranslateErrorFn,
  jsonSchema: JsonSchema,
  uiSchema: UIJsonFormSchema,
  onSubmit: (closeFn: Function) => void,
  onChange: OnChangeFn,
  data: any
}
const useForm = ({ place, isOpen }: Props): ReturnType | null=> {
  const [data, setData] = useState({})
  const { config } = useMapData()
  const translateError = useTranslateError()
  const form = useMemo(() => findForm(config, place), [place, config])

  // NOTE:
  // because we never destroy de Dialog to get animation
  // working we need to clean the data when the modal is closed
  useEffect(() => { if (!isOpen) { setData({}) } }, [isOpen])

  if (!form) return null

  const { jsonSchema, uiSchema } = form
  const onChange = ({ data, errors }: JsonFormsCore) => {
    setData(data)
  }
  const onSubmit = async (closeFn: Function) => {
    console.log('Submit')
  }
  return {
    translateError,
    jsonSchema,
    uiSchema,
    onSubmit,
    onChange,
    data
  }
}

export default useForm
