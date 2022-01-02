import { Dispatch, SetStateAction, useEffect } from 'react'

import type { Category } from '@maps/types/index'
import LegalCheck from '@maps/components/LegalCheck'
import { FormReturnType } from '@maps/components/CustomJsonForms/hooks/useForm'

type Props = {
  form: FormReturnType
  setLegalTermsAccepted: Dispatch<SetStateAction<boolean>>
}
const Form = ({ form, setLegalTermsAccepted }: Props) => {
  return (
    <div>
      {form.description}
      <LegalCheck onCheck={(accepted: boolean) => setLegalTermsAccepted(accepted)} />
    </div>
  )
}

export default Form
