import { useEffect, useState } from 'react'
import { JsonFormsCore } from '@jsonforms/core'

import type { JsonSchema, UIJsonFormSchema, Place } from '@maps/types/index'
import { useMapData } from '@maps/components/CommunityProvider'
import { useTranslateError } from './useTranslateError'
import type { TranslateErrorFn } from './useTranslateError'
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

  // NOTE:
  // because we never destroy de Dialog to get animation
  // working we need to clean the data when the modal is closed
  useEffect(() => { if (!isOpen) { setData({}) } }, [isOpen])

  if (!place) return null

  const onChange = ({ data, errors }: JsonFormsCore) => {
    setData(data)
  }
  const onSubmit = async (closeFn: Function) => {
    console.log('Submit')
  }
  const category = config.categories[place.category_slug]
  const { jsonSchema, uiSchema } = config.forms[category.map_slug]
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
