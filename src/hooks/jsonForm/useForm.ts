import { useMemo, useEffect, useState } from 'react'
import { ValidationMode, JsonFormsCore } from '@jsonforms/core'

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

const showValidationMode = 'ValidateAndShow' as ValidationMode
const noValidationMode = 'NoValidation' as ValidationMode
type Props = {
  place: Place | null,
  isOpen: boolean
}
type OnChangeFn = (jsonForm: JsonFormsCore) => void
type ReturnType = {
  translateError: TranslateErrorFn,
  jsonSchema: JsonSchema,
  isValid: boolean,
  validationMode: ValidationMode,
  uiSchema: UIJsonFormSchema,
  onSubmit: (closeFn: Function) => void,
  onChange: OnChangeFn,
  data: any
}
export const useForm = ({ place, isOpen }: Props): ReturnType | null => {
  const [data, setData] = useState({})
  const [errors, setErrors] = useState([])
  const [validationMode, setValidationMode] = useState<ValidationMode>(noValidationMode)
  const [isValid, setValid] = useState(false)
  const { config } = useMapData()
  const translateError = useTranslateError()
  const form = useMemo(() => findForm(config, place), [place, config])
  const jsonSchema = form?.jsonSchema
  const requiredFields = useMemo(() => jsonSchema?.required || [], [jsonSchema])
  const uiSchema = form?.uiSchema


  // Check all fields that are required are filled by the user
  useEffect(() => {
    if (validationMode === showValidationMode) return
    const dataKeys = Object.keys(data)
    if (!requiredFields.length) {
      setValidationMode(noValidationMode)
    } else if (requiredFields.every(required => dataKeys.includes(required))) {
      setValidationMode(showValidationMode)
    }
  }, [data, validationMode, requiredFields])
  useEffect(() => {
    setValid(validationMode === showValidationMode && !errors.length)
  }, [validationMode, errors])

  // NOTE:
  // because we never destroy de Dialog to get animation
  // working we need to clean the data when the modal is closed
  useEffect(() => {
    if (!isOpen) {
      setValidationMode(noValidationMode)
      setData({})
    }
  }, [isOpen])

  if (!form) return null

  const onChange = ({ data, errors }: JsonFormsCore) => {
    setData(data)
    setErrors(errors)
  }
  const onSubmit = async (closeFn: Function) => {
    // TODO: Implement this
    console.log('Submit')
  }
  return {
    translateError,
    jsonSchema,
    uiSchema,
    onSubmit,
    onChange,
    validationMode,
    isValid,
    data
  }
}

export default useForm
