import {
  useEffect,
  forwardRef,
  createElement,
  Fragment,
  ReactNode,
  SyntheticEvent
} from 'react'
import cn from 'classnames'
import { Dialog, Transition } from '@headlessui/react'
import { FormattedMessage } from 'react-intl'
import { XIcon } from '@heroicons/react/outline'
import type { Props, SubmitFn } from '../index'

import Button, {
  Styles as ButtonStyles,
  Size as ButtonSize
} from '@maps/components/Button'

import Footer from './Footer'

const onSubmitFnBuilder =
  (closeFn: Function, onSubmit: SubmitFn) => (event: SyntheticEvent) => {
    event.preventDefault()
    onSubmit(closeFn)
  }
type ElementProps = {
  className: string
  onSubmit?: (event: SyntheticEvent) => Promise<any> | void
}
type ModalWrapperProps = {
  closeFn: Function
  children: ReactNode
  onSubmit?: SubmitFn
}
const ModalWrapper = forwardRef<
  HTMLDivElement | HTMLFormElement,
  ModalWrapperProps
>(function ModalWrapper({ closeFn, onSubmit, children }, ref) {
  let props: ElementProps = {
    className:
      'inline-block align-bottom bg-white rounded-lg text-left shadow transform transition-all sm:my-8 sm:align-middle sm:max-w-md md:max-w-lg w-full'
  }
  props = onSubmit
    ? {
        ...props,
        onSubmit: onSubmitFnBuilder(closeFn, onSubmit)
      }
    : props
  return createElement(onSubmit ? 'form' : 'div', { ref, ...props }, children)
})

export default function Modal({
  onLoadingFinish,
  footer,
  closeFn,
  onClose,
  isOpen,
  children,
  initialFocusRef,
  title,
  description,
  onSubmit,
  stackFooterButtons
}: Props) {
  useEffect(() => {
    onLoadingFinish?.()
  }, [onLoadingFinish])
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as='div'
        className='fixed z-50 inset-0 overflow-y-auto'
        initialFocus={initialFocusRef}
        onClose={onClose}
      >
        <div className='flex items-end justify-center pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='fixed inset-0 bg-gray-900 bg-opacity-40 backdrop-filter backdrop-blur-sm transition-opacity' />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className='hidden sm:inline-block sm:align-middle sm:h-screen'
            aria-hidden='true'
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            enterTo='opacity-100 translate-y-0 sm:scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 translate-y-0 sm:scale-100'
            leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
          >
            <ModalWrapper closeFn={closeFn} onSubmit={onSubmit}>
              <div className='rounded-xl bg-white px-4 pb-4 sm:p-6'>
                <div className='sm:flex sm:items-start'>
                  <div
                    className={cn(
                      'text-center sm:mt-0 space-y-2 sm:text-left',
                      { 'mt-3': title || description }
                    )}
                  >
                    {title ? (
                      <Dialog.Title
                        as='h3'
                        className='text-lg leading-6 font-medium text-gray-900'
                      >
                        {title}
                      </Dialog.Title>
                    ) : null}
                    {description ? (
                      <Dialog.Description className='text-sm text-gray-500'>
                        {description}
                      </Dialog.Description>
                    ) : null}
                  </div>
                </div>
                {children ? (
                  <div className='space-y-4 mt-3'>{children}</div>
                ) : null}
                <div className='hidden sm:block absolute top-0 right-0 pt-4 pr-4'>
                  <Button
                    size={ButtonSize.none}
                    style={ButtonStyles.transparent}
                    onClick={() => closeFn()}
                  >
                    <span className='sr-only'>
                      <FormattedMessage
                        defaultMessage='Cerrar modal'
                        id='MwlsML'
                      />
                    </span>
                    <XIcon className='h-6 w-6' aria-hidden='true' />
                  </Button>
                </div>
              </div>
              <Footer
                stackFooterButtons={stackFooterButtons}
                content={footer}
              />
            </ModalWrapper>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
