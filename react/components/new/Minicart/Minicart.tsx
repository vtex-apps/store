import React, { FC } from 'react'
import useCssHandles from '../CssHandles/useCssHandles'
import CheckoutUtils from '../CheckoutResources/Utils'
const { useCheckoutURL } = CheckoutUtils
import OrderFormOrder from '../OrderManager/OrderForm'
const { useOrderForm } = OrderFormOrder

import MinicartIconButton from './components/MinicartIconButton'
import DrawerMode from './components/DrawerMode'
import { MinicartContextProvider, useMinicartState } from './MinicartContext'
import PopupMode from './components/Popup'
import useCartIdPixel from './modules/useCartIdPixel'

const CSS_HANDLES = ['minicartWrapperContainer', 'minicartContainer'] as const

const Minicart: FC<MinicartProps> = ({
  maxDrawerWidth = 400,
  drawerSlideDirection = 'rightToLeft',
  linkVariationUrl,
  children,
}) => {
  const handles = useCssHandles(CSS_HANDLES)
  const { variation } = useMinicartState()
  const { url: checkoutUrl } = useCheckoutURL()

  if (variation === 'link') {
    return (
      <aside
        className={`${handles.minicartWrapperContainer} relative fr flex items-center`}
      >
        <div className={`${handles.minicartContainer} flex flex-column`}>
          <a href={linkVariationUrl || checkoutUrl}>{MinicartIconButton}</a>
        </div>
      </aside>
    )
  }

  return (
    <aside
      className={`${handles.minicartWrapperContainer} relative fr flex items-center`}
    >
      <div className={`${handles.minicartContainer} flex flex-column`}>
        {variation === 'drawer' ? (
          <DrawerMode
            maxDrawerWidth={maxDrawerWidth}
            drawerSlideDirection={drawerSlideDirection}
          >
            {children}
          </DrawerMode>
        ) : (
          <PopupMode>{children}</PopupMode>
        )}
      </div>
    </aside>
  )
}

const CartIdPixel = () => {
  const { orderForm, loading }: OrderFormContext = useOrderForm()

  const orderFormId = !loading && orderForm ? orderForm.id : undefined
  useCartIdPixel(orderFormId)

  return null
}

const EnhancedMinicart = (props: MinicartProps) => (
  <MinicartContextProvider
    variation={props.variation}
    openOnHover={props.openOnHover}
  >
    <CartIdPixel />
    <Minicart {...props} />
  </MinicartContextProvider>
)

export default EnhancedMinicart
