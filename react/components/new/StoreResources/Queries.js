import orderForm from './queries/orderForm.gql'
import product from './queries/product.gql'
import productPreviewFragment from './queries/productPreview.gql'
import recommendationsAndBenefits from './queries/recommendationsAndBenefits.gql'
import search from './queries/search.gql'
import productSearch from './queries/productSearch.gql'
import productSearchV2 from './queries/productSearchV2.gql'
import session from './queries/session.gql'
import productBenefits from './queries/productBenefits.gql'
import address from './queries/address.gql'
import searchMetadata from './queries/searchMetadata.gql'
import productCategoryTree from './queries/UNSTABLE__productCategoryTree.gql'
import facets from './queries/facets.gql'

export default {
  address,
  orderForm,
  product,
  productSearch,
  productSearchV2,
  productPreviewFragment,
  recommendationsAndBenefits,
  search,
  session,
  productBenefits,
  UNSTABLE__productCategoryTree: productCategoryTree,
  searchMetadata,
  facets,
}
