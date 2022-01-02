import { Fragment, lazy, useEffect, useState, SyntheticEvent } from 'react'
import dynamic from 'next/dynamic'
import { useIntl, FormattedMessage } from 'react-intl'

import type { Category } from '@maps/types/index'
import { useMapData } from '@maps/components/CommunityProvider'
import Button, { Types as ButtonType, Styles as ButtonStyles } from '@maps/components/Button'
import { EntityForm, useForm } from '@maps/components/CustomJsonForms/hooks/useForm'
import Dialog from '@maps/components/Dialog'

type Props = {
  isOpen: boolean
  closeFn: () => void,
  onLoadingFinish: () => void
}
export default function SubmissionDialog ({ isOpen, closeFn, onLoadingFinish }: Props) {
  const { config: { suggestPlaceForms }, categories } = useMapData()
  const [legalTermsAccepted, setLegalTermsAccepted] = useState<boolean>(false)
  const [category, setCategory] = useState<Category | null>(
    categories.length === 1 ? categories[0] : categories[0]
  )
  const form = useForm({ entity: category, entityType: EntityForm.suggestPlace, isOpen })
  const [Form, setFormComponent] = useState(null)
  useEffect(() => {
    if (Form || !category) return
    async function loadComponent () {
      if (!category) return
      const Component = await dynamic(
        () => import('../Form'),
        { loading: () => <div>Loading...</div> }
      )
      setFormComponent(Component)
    }
    loadComponent()
  }, [category, Form])
  const intl = useIntl()
  const title = intl.formatMessage({ defaultMessage: 'Sugierenos un lugar', id: 'bPxeVs' })
  const defaultDescription = intl.formatMessage({ defaultMessage: 'Elige el tipo de lugar', id: 'FmR1T5' })

  useEffect(() => {
    // If not passed config for any suggest form we close this dialog
    // At least you need to define a key in config called
    // `suggestPlaceForms` and inside a form with the key: `generic`
    if (Object.keys(suggestPlaceForms || {}).length > 0) return
    onLoadingFinish()
    closeFn()
  }, [closeFn, onLoadingFinish, suggestPlaceForms])

  const defaultButtonLabel = intl.formatMessage({ id: 'yq+tl0', defaultMessage: 'Sugerir lugar' })
  const buttonLabel = form?.formButtonLabel || defaultButtonLabel
  const submit = false
    ? `${intl.formatMessage({ id: 'tClzXv', defaultMessage: 'Enviando' })}...`
    : buttonLabel
  const disabled = !legalTermsAccepted || !form?.isValid || form?.submitting
  return (
    <Dialog
      onLoadingFinish={onLoadingFinish}
      isOpen={isOpen}
      title={title}
      description={form?.description || defaultDescription}
      onClose={closeFn}
      closeFn={closeFn}
      footer={
        <>
          {form ? (
            <Button
              disabled={disabled}
              type={ButtonType.submit}
              fullWidth
              style={ButtonStyles.branded}
            >
              {submit}
            </Button>
          ): null}
          {form ? (
            <Button
              fullWidth
              outline
              style={ButtonStyles.secondary}
              onClick={closeFn}
            >
              <FormattedMessage defaultMessage='Cancelar' id='nZLeaQ' />
            </Button>
          ): null}
        </>
      }
    >
      {(Form !== null && category) ? (
        <Form
          form={form}
          key={category.slug}
          setLegalTermsAccepted={setLegalTermsAccepted}
        />
      ) : null}
    </Dialog>
  )
}
