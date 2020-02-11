import React, { FC } from 'react'
import { ExtensionPoint } from 'vtex.render-runtime'
import OrderForm from '../OrderManager/OrderForm'
const { useOrderForm } = OrderForm

const Summary: FC = () => {
  const {
    orderForm: { totalizers, value },
  } = useOrderForm()

  return (
    <div className="ph4 ph6-l pt5">
      <ExtensionPoint
        id="checkout-summary"
        totalizers={totalizers}
        total={value}
      />
    </div>
  )
}

export default Summary
