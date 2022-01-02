import { useRef,useMemo, useEffect, useState } from 'react'
import { ValidationMode, JsonFormsCore } from '@jsonforms/core'

import type { Form, JsonSchema, UIJsonFormSchema, Config, Category, Place } from '@maps/types/index'
import { useMapData } from '@maps/components/CommunityProvider'
import { useTranslateError } from './useTranslateError'
import type { TranslateErrorFn } from './useTranslateError'

export enum EntityForm { place = 'place', suggestPlace = 'suggestPlace' }
type UseGetFormProps = { entityType: EntityForm, entity: Category | Place | null }
export const useGetForm = ({ entityType, entity }: UseGetFormProps): Form | null => {
  const { config } = useMapData()
  return useRef(
    entityType === EntityForm.place
      ? config.forms[(entity as Place)?.form_slug]
      : entityType === EntityForm.suggestPlace
        ? Object.keys(config.suggestPlaceForms).length > 0
          ? (
            config.suggestPlaceForms[entity?.slug]
            || config.suggestPlaceForms['suggest_place_generic']
          ) : null
        : null
  ).current
}

const showValidationMode = 'ValidateAndShow' as ValidationMode
const noValidationMode = 'NoValidation' as ValidationMode
type Props = {
  entityType: EntityForm
  entity: Category | Place | null
  isOpen: boolean
}
type SubmitResponse = { ok: boolean; message: string }
type OnChangeFn = (jsonForm: JsonFormsCore) => void
export type FormReturnType = {
  formButtonLabel: string | null,
  description: string | null,
  translateError: TranslateErrorFn,
  jsonSchema: JsonSchema,
  isValid: boolean,
  validationMode: ValidationMode,
  uiSchema: UIJsonFormSchema,
  onSubmit: (closeFn: Function) => void,
  onChange: OnChangeFn,
  data: any,
  submitting: boolean,
  submitResponse: null | SubmitResponse
}
export const useForm = ({ entity, entityType, isOpen }: Props): FormReturnType | null => {
  const { community } = useMapData()
  const form = useGetForm({ entityType, entity })
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [submitResponse, setResponse] = useState<SubmitResponse | null>(null)
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
    // NOTE: Using entity here we make this useEffect run
    // always the entity is changed. This happens when the place
    // data is being fetched when open a place popup
  }, [setData, form, entity])

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
  const onSubmit = async (_closeFn: Function) => {
    setSubmitting(true)
    const response = await fetch(
      `/api/${community}/maps/forms/${form.slug}`,
      {
        method: 'POST',
        body: JSON.stringify(data)
      }
    )
    const responseData = await response.json()
    setResponse(responseData)
    setSubmitting(false)
  }
  return {
    submitting,
    submitResponse,
    description: form.description,
    formButtonLabel: form.formButtonLabel,
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
