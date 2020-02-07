import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

import PaymentMethodIcon, {
  PaymentMethod,
} from './components/PaymentMethodIcon'

interface Props {
  paymentMethods: PaymentMethod[]
  showInColor: boolean
}

const CSS_HANDLES = ['acceptedPaymentMethodContainer'] as const

const AcceptedPaymentMethods: StorefrontFunctionComponent<Props> = ({
  paymentMethods = [],
  showInColor = false,
}) => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className={`${handles.acceptedPaymentMethodContainer} nh2 flex`}>
      {paymentMethods.map(paymentMethod => (
        <PaymentMethodIcon
          key={paymentMethod}
          paymentMethod={paymentMethod}
          showInColor={showInColor}
        />
      ))}
    </div>
  )
}

AcceptedPaymentMethods.schema = {
  title: 'admin/editor.footer.acceptedPaymentMethods.title',
  description: 'admin/editor.footer.acceptedPaymentMethods.description',
  type: 'object',
  properties: {
    showInColor: {
      default: false,
      isLayout: true,
      title: 'admin/editor.footer.showPaymentMethodsInColor.title',
      type: 'boolean',
    },
  },
}

export default AcceptedPaymentMethods
