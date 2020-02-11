import React, { FC } from 'react'
import useProduct from '../ProductContext/useProduct'
import withToast from '../Styleguide/withToast'

import AddToCartButton from './AddToCartButton'
import { mapCatalogItemToCart } from './modules/catalogItemToCart'

interface Props {
  isOneClickBuy: boolean
  available: boolean
  disabled: boolean
  customToastUrl: string
  customOneClickBuyLink: string
  showToast: Function
}

const Wrapper: FC<Props> = ({
  isOneClickBuy,
  available,
  disabled,
  customToastUrl,
  showToast,
  customOneClickBuyLink,
}) => {
  const productContext: Maybe<ProductContextState> = useProduct()

  if (!productContext) {
    throw new Error('useProduct must be used within a ProductContextProvider')
  }

  const isEmptyContext = Object.keys(productContext).length === 0

  const product = productContext && productContext.product
  const selectedItem = productContext && productContext.selectedItem
  const assemblyOptions = productContext && productContext.assemblyOptions
  const selectedSeller =
    productContext &&
    productContext.selectedItem &&
    productContext.selectedItem.sellers[0]
  const selectedQuantity =
    productContext && productContext.selectedQuantity != null
      ? productContext.selectedQuantity
      : 1

  const skuItems = mapCatalogItemToCart({
    product,
    selectedItem,
    selectedQuantity,
    selectedSeller,
    assemblyOptions,
  })

  const isAvailable =
    isEmptyContext || available != null
      ? available
      : Boolean(
          selectedSeller &&
            selectedSeller.commertialOffer &&
            selectedSeller.commertialOffer.AvailableQuantity > 0
        )

  const groupsValidArray =
    (assemblyOptions &&
      assemblyOptions.areGroupsValid &&
      Object.values(assemblyOptions.areGroupsValid)) ||
    []

  const areAssemblyGroupsValid = groupsValidArray.every(Boolean)
  const isDisabled =
    isEmptyContext || disabled != null ? disabled : !areAssemblyGroupsValid

  const areAllSkuVariationsSelected =
    productContext && productContext.skuSelector.areAllVariationsSelected

  return (
    <AddToCartButton
      allSkuVariationsSelected={areAllSkuVariationsSelected}
      skuItems={skuItems}
      available={isAvailable}
      isOneClickBuy={isOneClickBuy}
      disabled={isDisabled}
      customToastUrl={customToastUrl}
      showToast={showToast}
      customOneClickBuyLink={customOneClickBuyLink}
    />
  )
}

export default withToast(Wrapper)
