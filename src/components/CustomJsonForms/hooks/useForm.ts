import { useReducer, useEffect } from 'react'
import { ErrorObject, ValidateFunction } from 'ajv'
import { validate, createAjv } from '@jsonforms/core'
import type { ValidationMode, JsonFormsCore } from '@jsonforms/core'

import type { Form, Config, Category, Place } from '@maps/types/index'
import { useMapData } from '@maps/components/CommunityProvider'
import {
  useTranslateError,
  TranslateErrorFn
} from '@maps/components/CustomJsonForms/hooks/useTranslateError'
import {
  useTranslate,
  TranslateFn,
  TranslateBuilderFn
} from '@maps/components/CustomJsonForms/hooks/useTranslate'
import useMakeRequest, { Response, Method } from '@maps/hooks/useMakeRequest'

export enum EntityForm {
  place = 'place',
  suggestPlace = 'suggestPlace'
}
type EntityType = Category | Place | null
type FormEntity = { entityType: EntityForm; entity: EntityType }

const RUN_VALIDATION = 'ValidateAndShow' as ValidationMode
const NO_VALIDATION = 'NoValidation' as ValidationMode
type FormInstance = {
  identifier: string
  instance: Form
  data: Object
  submitting: boolean
  validator: ValidateFunction | null
  validationMode: ValidationMode
  requiredFields: string[]
  errors: ErrorObject[]
  response: null | Response
  valid: boolean
  entityType: EntityForm
  i18n: {
    translateError: TranslateErrorFn
    translate: TranslateFn
  }
}

// Form instances indexed by slug generated with `buildIdentifier`
type FormInstances = Record<string, FormInstance>

/**
 * DRY the way we build the index on state.forms
 */
const buildIdentifier = (entityType: EntityForm, slug: string | null): string =>
  `${entityType}_${slug}`

type InitFormInstanceProps = {
  config: Config
  identifier: string
  formSlug: string | null
  entityType: EntityForm
  translateError: TranslateErrorFn
  translateBuilderFn: TranslateBuilderFn
}
const FORM_RESET_VALUES: Partial<FormInstance> = {
  submitting: false,
  valid: false,
  errors: null,
  response: null,
  validationMode: NO_VALIDATION
}

function initFormInstance({
  config,
  identifier,
  formSlug,
  entityType,
  translateError,
  translateBuilderFn
}: InitFormInstanceProps): null | FormInstance {
  const { forms, suggestPlaceForms } = config
  const form =
    entityType === EntityForm.place
      ? forms[formSlug]
      : suggestPlaceForms[formSlug]

  if (!form) return null

  let validationMode = NO_VALIDATION
  let validator = null
  try {
    validator = createAjv().compile(form.jsonSchema)
  } catch {
    validationMode = RUN_VALIDATION
  }

  return {
    identifier,
    data: form.initialData || {},
    validator,
    validationMode,
    instance: form,
    requiredFields: form.jsonSchema.required || [],
    errors: null,
    response: null,
    valid: false,
    submitting: false,
    entityType,
    i18n: {
      translate: translateBuilderFn(form.jsonSchema),
      translateError
    }
  }
}

type State = {
  genericSuggestIdentifier: string
  forms: FormInstances
  form: FormInstance | null
}
const INITIAL_STATE: State = {
  genericSuggestIdentifier: `${EntityForm.suggestPlace}_generic`,
  forms: {},
  form: null
}
type InitFormsProps = {
  entities: FormEntity[]
  currentEntity: FormEntity
  config: Config
  translateError: TranslateErrorFn
  translateBuilderFn: TranslateBuilderFn
}
const initForms =
  ({
    entities,
    currentEntity,
    config,
    translateError,
    translateBuilderFn
  }: InitFormsProps) =>
  (state: State): State => {
    const common = { config, translateBuilderFn, translateError }
    const forms = entities.reduce<FormInstances>(
      (instances: FormInstances, { entityType, entity }: FormEntity) => {
        const identifier = buildIdentifier(entityType, entity?.slug)
        const formInstance =
          entityType === EntityForm.place
            ? initFormInstance({
                ...common,
                identifier,
                formSlug: (entity as Place)?.form_slug,
                entityType
              })
            : initFormInstance({
                ...common,
                identifier,
                formSlug: entity?.slug,
                entityType
              })

        if (!formInstance) return instances

        instances[identifier] = formInstance
        return instances
      },
      {
        [state.genericSuggestIdentifier]: initFormInstance({
          ...common,
          identifier: state.genericSuggestIdentifier,
          formSlug: 'suggest_place_generic',
          entityType: EntityForm.suggestPlace
        })
      }
    )

    // Set current form if there is one
    const currentSlug = buildIdentifier(
      currentEntity.entityType,
      currentEntity.entity?.slug
    )
    const form = forms[currentSlug]

    return { ...INITIAL_STATE, forms, form }
  }

/**
 * Only update current form instance if already there.
 * This method defend us form destructuring `form=null`
 */
function updateFormState(
  prevState: State,
  nextFormState: Partial<FormInstance>
): State {
  const form = prevState.form

  if (!form) return prevState

  return {
    ...prevState,
    form: {
      ...form,
      ...nextFormState
    }
  }
}

enum Actions {
  SetForm,
  SetData,
  SetErrors,
  SetSubmitting,
  SetResponse,
  SetValidationMode,
  ResetState
}
type Action =
  | {
      type: Actions.SetForm
      entityType: EntityForm
      formSlug: string
      identifier: string
    }
  | { type: Actions.SetData; data: Object }
  | { type: Actions.SetErrors; errors: ErrorObject[] }
  | { type: Actions.SetSubmitting; submitting: boolean }
  | { type: Actions.SetResponse; response: Response }
  | { type: Actions.SetValidationMode; validationMode: ValidationMode }
  | { type: Actions.ResetState }
const reducer =
  (
    config: Config,
    translateError: TranslateErrorFn,
    translateBuilderFn: TranslateBuilderFn
  ) =>
  (state: State, action: Action) => {
    switch (action.type) {
      case Actions.SetForm:
        const instance =
          state.forms[action.identifier] ||
          initFormInstance({
            config,
            identifier: action.identifier,
            translateError,
            translateBuilderFn,
            formSlug: action.formSlug,
            entityType: action.entityType
          })
        const form: FormInstance | null =
          action.entityType === EntityForm.place
            ? instance
            : instance || state.forms[state.genericSuggestIdentifier]

        // Do nothing if the identifier is the same
        if (form && form?.identifier === state?.form?.identifier) return state

        // Copy data from previous current form into forms
        return {
          ...state,
          forms: {
            ...state.forms,
            ...(state.form ? { [state.form.identifier]: state.form } : {}),
            ...(form ? { [form.identifier]: form } : {})
          },
          form
        }
      case Actions.SetData:
        return updateFormState(state, { data: action.data })
      case Actions.SetErrors:
        const errors = action.errors
        return updateFormState(state, {
          errors,
          valid:
            state.form?.validationMode === RUN_VALIDATION &&
            !action.errors.length
        })
      case Actions.SetSubmitting:
        return updateFormState(state, { submitting: action.submitting })
      case Actions.SetResponse:
        return updateFormState(state, { response: action.response })
      case Actions.SetValidationMode:
        return updateFormState(state, { validationMode: action.validationMode })
      case Actions.ResetState:
        return {
          ...state,
          forms: Object.keys(state.forms).map((identifier: string) => ({
            ...state.forms[identifier],
            ...FORM_RESET_VALUES
          })),
          ...(state.form
            ? {
                form: {
                  ...state.form,
                  ...FORM_RESET_VALUES,
                  data: state.form.instance.initialData || {}
                }
              }
            : {})
        }
      default:
        throw new Error('Unhandle reducer action')
    }
  }

export type FormReturnType = FormInstance & {
  onChange: (jsonForm: JsonFormsCore) => void
  onSubmit: (closeFn: Function) => void
  reset: (callback: Function, timeout?: number) => void
}
type Props = {
  entities: FormEntity[]
  currentEntity: FormEntity
  getExtraData: () => Object
  onResponseSuccess?: () => void
}
export const useForm = ({
  entities,
  currentEntity,
  getExtraData,
  onResponseSuccess
}: Props): FormReturnType | null => {
  const { config, community, mapSlug } = useMapData()
  const makeRequest = useMakeRequest({ community })
  const translateBuilderFn = useTranslate()
  const translateError = useTranslateError()

  // Init reducer
  const [{ form }, dispatch] = useReducer(
    reducer(config, translateError, translateBuilderFn),
    INITIAL_STATE,
    initForms({
      entities,
      currentEntity,
      config,
      translateError,
      translateBuilderFn
    })
  )

  // When entity change change used form
  const entityType = currentEntity.entityType
  const slug = currentEntity.entity?.slug
  const formSlug =
    entityType === EntityForm.place
      ? (currentEntity.entity as Place)?.form_slug
      : slug
  useEffect(() => {
    if (!slug) return

    const identifier = buildIdentifier(entityType, slug)
    dispatch({ type: Actions.SetForm, entityType, identifier, formSlug })
  }, [slug, formSlug, entityType])

  // When data change on current form update data and errors
  const onChange = ({ data, errors }: JsonFormsCore) => {
    dispatch({ type: Actions.SetData, data })
    dispatch({ type: Actions.SetErrors, errors })
  }

  // Reset form after X timeout also execute the callback passed.
  const reset = (callback: Function, timeout: number = 500) => {
    setTimeout(() => {
      dispatch({ type: Actions.ResetState })
      callback()
    }, timeout)
  }

  // Handle form submission
  const onSubmit = async (_closeFn: Function) => {
    if (!form) return

    const errors = validate(form.validator, form.data)
    if (errors.length > 0) {
      dispatch({
        type: Actions.SetValidationMode,
        validationMode: RUN_VALIDATION
      })
      return
    }

    dispatch({ type: Actions.SetSubmitting, submitting: true })
    const response = await makeRequest({
      method: Method.POST,
      path: 'forms',
      body: {
        type: form.entityType,
        slug,
        mapSlug,
        data: { ...getExtraData(), ...form.data }
      }
    })
    dispatch({ type: Actions.SetResponse, response })
    dispatch({ type: Actions.SetSubmitting, submitting: false })

    if (response.ok) {
      setInterval(() => {
        if (onResponseSuccess) onResponseSuccess()
      }, 2000)
    }
  }
  if (!form) return null

  return {
    ...form,
    onSubmit,
    onChange,
    reset
  }
}

export default useForm
