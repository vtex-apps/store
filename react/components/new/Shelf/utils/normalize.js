function getBuyableSellers(sellers) {
  return sellers && sellers.length > 0
    ? sellers.filter(seller => seller.sellerId)
    : sellers
}

export function normalizeBuyable(product) {
  if (!product || !product.items || product.items.length === 0) {
    return product
  }

  const buyableItems = product.items
    .map(item => ({
      ...item,
      sellers: getBuyableSellers(item.sellers),
    }))
    .filter(item => item && item.sellers && item.sellers.length > 0)

  return buyableItems ? { ...product, items: buyableItems } : null
}
