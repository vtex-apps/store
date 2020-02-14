import React from 'react'
import useProduct from '../ProductContext/useProduct'
import BaseSpecificationBadges from './components/BaseSpecificationBadges'

const ProductSpecificationBadges: StorefrontFunctionComponent<BaseProps> = ({
  specificationGroupName,
  visibleWhen,
  specificationsOptions,
  specificationName,
  displayValue,
  orientation
}) => {
  const { product } = useProduct()
  return (
    <BaseSpecificationBadges
      product={product}
      orientation={orientation}
      specificationGroupName={specificationGroupName}
      visibleWhen={visibleWhen}
      specificationsOptions={specificationsOptions}
      specificationName={specificationName}
      displayValue={displayValue}
    />
  )
}

ProductSpecificationBadges.schema = {
  ...BaseSpecificationBadges.schema,
  title: 'admin/editor.product-specification-badges.title',
  description: 'admin/editor.product-specification-badges.description',
}

export default ProductSpecificationBadges
