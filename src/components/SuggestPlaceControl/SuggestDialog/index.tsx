import { ComponentType, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { FormattedMessage } from 'react-intl'

import LoadingCode from '@maps/components/LoadingCode'
import Button, {
  Types as ButtonType,
  Styles as ButtonStyles
} from '@maps/components/Button'
import Dialog from '@maps/components/Dialog'

import useSuggest, { SuggestReturnType } from '../useSuggest'

type StepsProps = { suggest: SuggestReturnType }
type Props = {
  isOpen: boolean
  closeFn: () => void
  onLoadingFinish: () => void
}
export default function SuggestDialog({
  isOpen,
  closeFn,
  onLoadingFinish
}: Props) {
  const suggest = useSuggest({
    // Here handle suggest place success
    onResponseSuccess: () => {}
    // Before we were closing dialog. Not anymore.
    // onResponseSuccess: () => {
    //   closeFn()
    // }
  })
  const [Steps, setStepComponent] = useState<ComponentType<StepsProps>>()
  const onClose = () => {
    suggest?.form?.reset(() => {
      suggest.setLegalTermsAccepted(false)
    })
    closeFn()
  }
  useEffect(() => {
    if (!isOpen || Steps) return

    async function loadComponent() {
      const Component = await dynamic(() => import('../Steps'), {
        loading: () => <LoadingCode />
      })
      setStepComponent(Component)
    }
    loadComponent()
  }, [isOpen, Steps])
  const responseOk = !!suggest?.form?.response?.ok
  return (
    <Dialog
      onSubmit={suggest.onSubmit}
      onLoadingFinish={onLoadingFinish}
      isOpen={isOpen}
      title={!responseOk ? suggest.copies.title : null}
      description={!responseOk ? suggest.copies.description : null}
      onClose={onClose}
      closeFn={onClose}
      footer={
        <>
          {!responseOk ? (
            <Button
              disabled={suggest.submitButtonDisabled}
              type={ButtonType.submit}
              fullWidth
              style={ButtonStyles.branded}
            >
              {suggest.copies.submitButton}
            </Button>
          ) : null}
          {!responseOk ? (
            <Button
              disabled={suggest.form?.submitting}
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
