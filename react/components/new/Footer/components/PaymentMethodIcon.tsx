import React from 'react'
import { injectIntl, InjectedIntl } from 'react-intl'
import { formatIOMessage } from 'vtex.native-types'
import { useCssHandles } from 'vtex.css-handles'

import withImage from './withImage'

interface PaymentMethodIconProps {
  imageSrc?: string
  /** If true, the original logo (with color) is used. If not, the grayscale's one */
  showInColor?: boolean
  /** Indicates which one of the payments method should the component show its image */
  paymentMethod: PaymentMethod
  intl: InjectedIntl
}

const CSS_HANDLES = ['paymentMethodIcon', 'paymentMethodIconImage']

/**
 * Shows an image for the payments forms accepted
 */
const PaymentMethodIcon: StorefrontFunctionComponent<
  PaymentMethodIconProps
> = ({ imageSrc, paymentMethod, intl }) => {
  const handles = useCssHandles(CSS_HANDLES)

  if (!imageSrc) {
    return null
  }

  return (
    <div className={`${handles.paymentMethodIcon} w2 h2 mh2 flex items-center`}>
      <img
        className={`${handles.paymentMethodIconImage} w-100`}
        src={imageSrc}
        alt={formatIOMessage({ id: paymentMethod, intl })}
        title={formatIOMessage({ id: paymentMethod, intl })}
      />
    </div>
  )
}

export enum PaymentMethod {
  'diners club' = 'diners club',
  'mastercard' = 'mastercard',
  'visa' = 'visa',
}

const getImagePathFromProps = ({
  paymentMethod,
  showInColor,
}: PaymentMethodIconProps) =>
  `${paymentMethod.toLowerCase()}${showInColor ? '' : '-bw'}.svg`

export default withImage(getImagePathFromProps)(injectIntl(PaymentMethodIcon))
