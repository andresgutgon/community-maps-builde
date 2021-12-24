import { useMemo, useEffect, useState } from 'react'
import { ValidationMode, JsonFormsCore } from '@jsonforms/core'

import type { Form, JsonSchema, UIJsonFormSchema, Config, Place } from '@maps/types/index'
import { useMapData } from '@maps/components/CommunityProvider'
import { useTranslateError } from './useTranslateError'
import type { TranslateErrorFn } from './useTranslateError'

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
  const { config } = useMapData()
  const form = useMemo(() => config.forms[place?.form_slug], [place, config])
  const [data, setData] = useState(form?.initialData || {})
  const [errors, setErrors] = useState([])
  const [validationMode, setValidationMode] = useState<ValidationMode>(noValidationMode)
  const [isValid, setValid] = useState(false)
  const translateError = useTranslateError()
  const jsonSchema = form?.jsonSchema
  const requiredFields = useMemo(() => jsonSchema?.required || [], [jsonSchema])
  const uiSchema = form?.uiSchema

  // Set initialData when form is present for the first time
  useEffect(() => {
    if (!form) return
    setData(form.initialData || {})
    // NOTE: Using place here we make this useEffect run
    // always the place is changed.
  }, [setData, form, place])

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

  useEffect(() => {
    if (!form) return
    if (!isOpen) {
      setValidationMode(noValidationMode)
      setData(form.initialData || {})
    }
  }, [isOpen, form])

  if (!form) return null

  const onChange = ({ data, errors }: JsonFormsCore) => {
    setData(data)
    setErrors(errors)
  }
  const onSubmit = async (closeFn: Function) => {
    // TODO: Implement this
    console.log('Submit', data)
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
