import { ComponentType, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { FormattedMessage } from 'react-intl'

import SearchInput  from '@maps/components/SearchInput/InForm'

import type { Category } from '@maps/types/index'
import LoadingCode from '@maps/components/LoadingCode'
import Button, { Types as ButtonType, Styles as ButtonStyles } from '@maps/components/Button'
import Dialog from '@maps/components/Dialog'

import useSuggest, { SuggestReturnType, Step } from '../useSuggest'

type StepsProps = { suggest: SuggestReturnType }
type Props = {
  isOpen: boolean
  closeFn: () => void,
  onLoadingFinish: () => void
}
export default function SuggestDialog ({ isOpen, closeFn, onLoadingFinish }: Props) {
  const suggest = useSuggest({ isOpen })
  const [Steps, setStepComponent] = useState<ComponentType<StepsProps>>()
  const onClose = () => {
    suggest.reset()
    closeFn()
  }
  useEffect(() => {
    if (!isOpen || Steps) return

    async function loadComponent () {
      const Component = await dynamic(
        () => import('../Steps'),
        { loading: () => <LoadingCode /> }
      )
      setStepComponent(Component)
    }
    loadComponent()
  }, [isOpen, Steps])
  return (
    <Dialog
      onSubmit={suggest.form.onSubmit}
      onLoadingFinish={onLoadingFinish}
      isOpen={isOpen}
      title={suggest.copies.title}
      description={suggest.copies.description}
      onClose={onClose}
      closeFn={onClose}
      footer={
        <>
          {suggest.showForm ? (
            <Button
              disabled={suggest.submitButtonDisabled}
              type={ButtonType.submit}
              fullWidth
              style={ButtonStyles.branded}
            >
              {suggest.copies.submitButton}
            </Button>
          ) : null}
          {suggest.showForm ? (
            <Button
              disabled={suggest.form.submitting}
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
      {Steps && isOpen ? <Steps suggest={suggest} /> : null}
    </Dialog>
  )
}
