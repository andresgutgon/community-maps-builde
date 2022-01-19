import { Dispatch, SetStateAction, useState } from 'react'
import { useIntl } from 'react-intl'
import { LatLngLiteral } from 'leaflet'

import {
  FormReturnType,
  EntityForm,
  useForm
} from '@maps/components/CustomJsonForms/hooks/useForm'
import { useMapData } from '@maps/components/CommunityProvider'
import type { Category } from '@maps/types/index'

export type AddressType = {
  latitude: string
  longitude: string
  address: string
}
export enum Step {
  category,
  address,
  form
}
type ReturnCopy = {
  title: string | null
  description: string | null
  submitButton: string
}
type UseCopiesProps = {
  form: FormReturnType | null
  step: Step
}
const useCopies = ({ form, step }: UseCopiesProps): ReturnCopy => {
  const intl = useIntl()
  let description = null
  let button = intl.formatMessage({ defaultMessage: 'Siguiente', id: 'w2xatL' })
  const title = intl.formatMessage({
    defaultMessage: 'Sugierenos un lugar',
    id: 'bPxeVs'
  })

  if (step === Step.category) {
    description = intl.formatMessage({
      defaultMessage: 'Elige una categoría para el lugar que vas a sugerir',
      id: 'VMmmhi'
    })
  } else if (step === Step.address) {
    description = intl.formatMessage({
      defaultMessage:
        '¿Dónde está el lugar? Busca la direccón donde quieres sugerir el lugar',
      id: 'LxAGKW'
    })
  } else if (step === Step.form && !form?.response?.ok) {
    const defaultDescription = intl.formatMessage({
      defaultMessage: 'Elige el tipo de lugar',
      id: 'FmR1T5'
    })
    description = form?.instance?.description || defaultDescription
    const defaultButton = intl.formatMessage({
      id: 'yq+tl0',
      defaultMessage: 'Sugerir lugar'
    })
    button = form?.instance?.formButtonLabel || defaultButton
  }

  const submitButton = form?.submitting
    ? `${intl.formatMessage({ id: 'tClzXv', defaultMessage: 'Enviando' })}...`
    : button
  return { title, description, submitButton }
}

export type MoveToStepFn = (step: Step) => () => void
export type SuggestReturnType = {
  form: FormReturnType
  showForm: boolean
  reset: () => void
  step: Step
  copies: ReturnCopy
  submitButtonDisabled: boolean
  legalTermsAccepted: boolean
  setLegalTermsAccepted: Dispatch<SetStateAction<boolean>>
  category: Category | null
  onCategoryChange: (category: Category) => void
  address: AddressType | null
  addressLatLng: LatLngLiteral | null
  setAddress: Dispatch<SetStateAction<AddressType | null>>
  onAddressChange: (latLng: LatLngLiteral, address: string) => void
  addressAditionalInfo: string
  setAddressAditionalInfo: Dispatch<SetStateAction<string>>
  moveToStep: MoveToStepFn
  onSubmit: (closeFn: Function) => void
}
type Props = { onResponseSuccess?: () => void }
const useSuggest = ({ onResponseSuccess }: Props = {}): SuggestReturnType => {
  const { categories } = useMapData()
  const [legalTermsAccepted, setLegalTermsAccepted] = useState<boolean>(false)
  const [address, setAddress] = useState<AddressType | null>(null)
  const [addressAditionalInfo, setAddressAditionalInfo] = useState('')
  const [addressLatLng, setLatLng] = useState<LatLngLiteral | null>(null)
  const [category, setCategory] = useState<Category | null>(
    categories.length === 1 ? categories[0] : null
  )
  const [step, setStep] = useState(
    !category ? Step.category : !address ? Step.address : Step.form
  )
  const form = useForm({
    entities: categories.map((entity: Category) => ({
      entity,
      entityType: EntityForm.suggestPlace
    })),
    currentEntity: {
      entity: category,
      entityType: EntityForm.suggestPlace
    },
    getExtraData: () => ({
      legalTermsAccepted,
      categorySlug: category?.slug,
      address,
      addressAditionalInfo
    }),
    onResponseSuccess
  })
  const copies = useCopies({ form, step })
  const reset = () => {
    setCategory(null)
  }
  const showForm = step === Step.form && !form?.response?.ok
  const submitButtonDisabled =
    Step.category === step
      ? !category
      : Step.address === step
      ? !address
      : false

  const onCategoryChange = (selectedCategory: Category) => {
    setCategory(selectedCategory)
  }
  const onAddressChange = (latLng: LatLngLiteral, address: string) => {
    const { lat, lng } = latLng
    setLatLng(latLng)
    setAddress({ latitude: lat.toString(), longitude: lng.toString(), address })
  }
  const moveToStep = (step: Step) => () => {
    setStep(step)
  }
  const onSubmit = (closeFn: Function) => {
    if (step === Step.category) {
      return setStep(!address ? Step.address : Step.form)
    }
    if (step === Step.address) {
      return setStep(Step.form)
    }
    form.onSubmit(closeFn)
  }
  return {
    form,
    showForm,
    submitButtonDisabled,
    reset,
    step,
    copies,
    legalTermsAccepted,
    setLegalTermsAccepted,
    moveToStep,
    category,
    onCategoryChange,
    address,
    addressLatLng,
    setAddress,
    onAddressChange,
    addressAditionalInfo,
    setAddressAditionalInfo,
    onSubmit
  }
}

export default useSuggest
