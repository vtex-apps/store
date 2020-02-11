import BaseSpecificationBadges from '../../../ProductSpecificationBadges/BaseSpecificationBadges'
import ProductSummaryContextApp from '../../../ProductSummaryContext/ProductSummaryContext'
const { useProductSummary } = ProductSummaryContextApp

const ProductSummarySpecificationBadges = ({
  specificationGroupName,
  visibleWhen,
  specificationsOptions,
  specificationName,
  displayValue,
  orientation,
}) => {
  const { product } = useProductSummary()
  return (
    <BaseSpecificationBadges
      product={product}
      visibleWhen={visibleWhen}
      specificationsOptions={specificationsOptions}
      specificationName={specificationName}
      displayValue={displayValue}
      orientation={orientation}
      specificationGroupName={specificationGroupName}
    />
  )
}

ProductSummarySpecificationBadges.schema = {
  ...BaseSpecificationBadges.schema,
  title: 'admin/editor.product-summary-specification-badges.title',
}

export default ProductSummarySpecificationBadges
