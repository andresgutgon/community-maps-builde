import { forwardRef, createElement, Fragment, ReactNode, SyntheticEvent } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { FormattedMessage } from 'react-intl'
import { XIcon } from '@heroicons/react/outline'
import type { Props, SubmitFn } from '../index'

import Button, { Styles as ButtonStyles, Size as ButtonSize } from '@maps/components/Button'

const onSubmitFnBuilder = (closeFn: Function, onSubmit: SubmitFn) =>
  (event: SyntheticEvent) => {
  event.preventDefault()
  onSubmit(closeFn)
}
type ElementProps = { className: string, onSubmit?: (event: SyntheticEvent) => Promise<any> | void }
type ModalWrapperProps = { closeFn: Function, children: ReactNode, onSubmit?: SubmitFn }
const ModalWrapper = forwardRef<
  HTMLDivElement | HTMLFormElement, ModalWrapperProps
>(function ModalWrapper({ closeFn, onSubmit, children }, ref) {
  let props: ElementProps = {
    className: 'inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow transform transition-all sm:my-8 sm:align-middle sm:max-w-md md:max-w-lg lg:max-w-xl sm:w-full'
  }
  props = onSubmit ? {
    ...props,
    onSubmit: onSubmitFnBuilder(closeFn, onSubmit)
  } : props
  return (
    createElement(
      onSubmit? 'form' : 'div',
      { ref, ...props },
      children
    )
  )
})

export default function Modal({
  footer,
  closeFn,
  onClose,
  isOpen,
  children,
  initialFocusRef,
  title,
  description,
  onSubmit
}: Props) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-50 inset-0 overflow-y-auto"
        initialFocus={initialFocusRef}
        onClose={onClose}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay
              className="fixed inset-0 bg-gray-900 bg-opacity-40 backdrop-filter backdrop-blur-sm transition-opacity"
            />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <ModalWrapper closeFn={closeFn} onSubmit={onSubmit}>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                  <Button
                    size={ButtonSize.none}
                    style={ButtonStyles.transparent}
                    onClick={() => closeFn()}
                  >
                    <span className="sr-only">
                      <FormattedMessage defaultMessage='Cerrar modal' id='MwlsML' />
                    </span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </Button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 space-y-2 sm:text-left">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                      {title}
                    </Dialog.Title>
                    <Dialog.Description className='text-sm text-gray-500'>
                      {description}
                    </Dialog.Description>
                  </div>
                </div>
                {children ? (
                  <div className='mt-6 mb-4'>{children}</div>
                ): null}
              </div>
              {footer ? (
                <div className="space-y-2 sm:space-y-0 space-x-3 space-x-reverse bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  {footer}
                </div>
              ): null}
            </ModalWrapper>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

