import React, { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import Button from '../Styleguide/Button'
import useCssHandles from '../CssHandles/useCssHandles'
import CheckoutUtils from '../CheckoutResources/Utils'
const { useCheckoutURL } = CheckoutUtils

import useCheckout from './modules/checkoutHook'

interface Props {
  finishShoppingButtonLink: string
}

const CSS_HANDLES = ['minicartCheckoutButton'] as const

const CheckoutButton: FC<Props> = ({ finishShoppingButtonLink }) => {
  const { url: checkoutUrl } = useCheckoutURL()
  const handles = useCssHandles(CSS_HANDLES)
  const goToCheckout = useCheckout()

  return (
    <div className={`${handles.minicartCheckoutButton} mv3 ph4 ph6-l`}>
      <Button
        id="proceed-to-checkout"
        onClick={() => goToCheckout(finishShoppingButtonLink || checkoutUrl)}
        variation="primary"
        block
      >
        <FormattedMessage id="store/minicart.go-to-checkout" />
      </Button>
    </div>
  )
}

export default CheckoutButton
