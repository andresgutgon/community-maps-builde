import { Fragment, lazy, useEffect, useState, SyntheticEvent } from 'react'
import dynamic from 'next/dynamic'
import { useIntl, FormattedMessage } from 'react-intl'

import type { Category } from '@maps/types/index'
import LoadingCode from '@maps/components/LoadingCode'
import { useMapData } from '@maps/components/CommunityProvider'
import Button, { Types as ButtonType, Styles as ButtonStyles } from '@maps/components/Button'
import { EntityForm, useForm } from '@maps/components/CustomJsonForms/hooks/useForm'
import Dialog from '@maps/components/Dialog'
import SuccessMessage from '@maps/components/Dialog/SuccessMessage'
import ErrorMessage from '@maps/components/Dialog/ErrorMessage'

import CategoryChooser from '../CategoryChooser'

type Props = {
  isOpen: boolean
  closeFn: () => void,
  onLoadingFinish: () => void
}
export default function SubmissionDialog ({ isOpen, closeFn, onLoadingFinish }: Props) {
  const intl = useIntl()
  const { config: { suggestPlaceForms }, categories } = useMapData()
  const [legalTermsAccepted, setLegalTermsAccepted] = useState<boolean>(false)
  const [category, setCategory] = useState<Category | null>(
    categories.length === 1 ? categories[0] : null
  )
  const form = useForm({ entity: category, entityType: EntityForm.suggestPlace, isOpen })
  const [Form, setFormComponent] = useState(null)
  useEffect(() => {
    if (Form || !category) return
    async function loadComponent () {
      if (!category) return
      const Component = await dynamic(
        () => import('../Form'),
        { loading: () => <LoadingCode /> }
      )
      setFormComponent(Component)
    }
    loadComponent()
  }, [category, Form])

  useEffect(() => {
    // If not passed config for any suggest form we close this dialog
    // At least you need to define a key in config called
    // `suggestPlaceForms` and inside a form with the key: `generic`
    if (Object.keys(suggestPlaceForms || {}).length > 0) return
    onLoadingFinish()
    closeFn()
  }, [closeFn, onLoadingFinish, suggestPlaceForms])

  const defaultError = intl.formatMessage({ defaultMessage: 'Hubo un error al enviar la información', id: 'gNB19l' })
  const title = intl.formatMessage({ defaultMessage: 'Sugierenos un lugar', id: 'bPxeVs' })
  const chooseCategoryDescription = intl.formatMessage({ defaultMessage: 'Elige una categoría', id: 'GKFYo5' })
  const defaultDescription = intl.formatMessage({ defaultMessage: 'Elige el tipo de lugar', id: 'FmR1T5' })
  const defaultButtonLabel = intl.formatMessage({ id: 'yq+tl0', defaultMessage: 'Sugerir lugar' })
  const buttonLabel = form?.formButtonLabel || defaultButtonLabel
  const submit = form.submitting
    ? `${intl.formatMessage({ id: 'tClzXv', defaultMessage: 'Enviando' })}...`
    : buttonLabel
  const disabled = !legalTermsAccepted || !form?.isValid || form?.submitting
  const hasToChooseCategory = categories.length > 1 && !category
  const onClose = () => {
    setCategory(null)
    closeFn()
  }
  const showForm = !form?.submitResponse?.ok
  return (
    <Dialog
      onSubmit={form.onSubmit}
      onLoadingFinish={onLoadingFinish}
      isOpen={isOpen}
      title={title}
      description={hasToChooseCategory
        ? chooseCategoryDescription
        : form?.description || defaultDescription
      }
      onClose={onClose}
      closeFn={onClose}
      footer={
        <>
          {showForm ? (
            <Button
              disabled={disabled}
              type={ButtonType.submit}
              fullWidth
              style={ButtonStyles.branded}
            >
              {submit}
            </Button>
          ) : null}
          {showForm ? (
            <Button
              disabled={form.submitting}
              fullWidth
              outline
              style={ButtonStyles.secondary}
              onClick={closeFn}
            >
              <FormattedMessage defaultMessage='Cancelar' id='nZLeaQ' />
            </Button>
          ) : null}
        </>
      }
    >
      <ErrorMessage
        key={form.submitting.toString()}
        show={form?.submitResponse?.ok === false}
        message={form?.submitResponse?.message || defaultError}
      />
      <SuccessMessage
        show={!!form?.submitResponse?.ok}
        message={form?.submitResponse?.message}
      />
      {showForm ? (
        <>
          <div className='mb-6'>
            <CategoryChooser setCategory={setCategory} selectedCategory={category} />
          </div>
          {(Form !== null && category) ? (
            <Form
              form={form}
              key={category.slug}
              legalTermsAccepted={legalTermsAccepted}
              setLegalTermsAccepted={setLegalTermsAccepted}
            />
          ) : null}
        </>
      ) : null}
    </Dialog>
  )
}
