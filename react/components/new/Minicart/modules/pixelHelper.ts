export function mapCartItemToPixel(item: CartItem): PixelCartItem {
  return {
    skuId: item.id,
    variant: item.skuName,
    price: item.sellingPrice,
    name: getNameWithoutVariant(item),
    quantity: item.quantity,
    productRefId: item.productRefId,
    brand: item.additionalInfo ? item.additionalInfo.brandName : '',
    category: productCategory(item),
    detailUrl: item.detailUrl,
    imageUrl: item.imageUrls
      ? fixUrlProtocol(item.imageUrls.at3x)
      : item.imageUrl ?? '',
  }
}

export function mapBuyButtonItemToPixel(item: BuyButtonItem): PixelCartItem {
  // Change this `/Apparel & Accessories/Clothing/Tops/`
  // to this `Apparel & Accessories/Clothing/Tops`
  const category = item.category ? item.category.slice(1, -1) : ''

  return {
    skuId: item.id,
    variant: item.skuName,
    price: item.sellingPrice,
    name: item.name,
    quantity: item.quantity,
    productRefId: item.productRefId,
    brand: item.brand,
    category,
    detailUrl: item.detailUrl,
    imageUrl: item.imageUrl,
  }
}

/**
 * URL comes like "//storecomponents.vteximg.com.br/arquivos/ids/155491"
 * this function guarantees it comes with protocol in it.
 */
function fixUrlProtocol(url: string) {
  if (!url || url.indexOf('http') === 0) {
    return url
  }

  return `https:${url}`
}

/**
 * Remove the variant from the end of the name.
 * Ex: from "Classic Shoes Pink" to "Classic Shoes"
 */
function getNameWithoutVariant(item: CartItem) {
  if (!item.name.includes(item.skuName)) {
    return item.name
  }

  const leadingSpace = 1
  const variantLength = leadingSpace + item.skuName.length

  return item.name.slice(0, item.name.length - variantLength)
}

function productCategory(item: CartItem) {
  try {
    const categoryIds = item.productCategoryIds.split('/').filter(c => c.length)
    const category = categoryIds.map(id => item.productCategories[id]).join('/')

    return category
  } catch {
    return ''
  }
}

interface PixelCartItem {
  skuId: string
  variant: string
  price: number
  name: string
  quantity: number
  productRefId: string
  brand: string
  category: string
  detailUrl: string
  imageUrl: string
}

interface BuyButtonItem {
  id: string
  skuName: string
  sellingPrice: number
  name: string
  quantity: number
  productRefId: string
  brand: string
  category: string
  detailUrl: string
  imageUrl: string
}

interface CartItem {
  id: string
  skuName: string
  sellingPrice: number
  name: string
  quantity: number
  productRefId: string
  additionalInfo: {
    brandName: string
  }
  productCategoryIds: string
  productCategories: Record<string, string>
  detailUrl: string
  // Field from the usual orderForm API
  imageUrl?: string
  // Field from the order-manager orderForm API
  imageUrls?: {
    at1x: string
    at2x: string
    at3x: string
  }
}
