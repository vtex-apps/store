export const getProduct = (customFields = {}) => {
  return {
    cacheId: 'product-slug',
    productName: 'Product Name',
    productId: '1',
    description: 'Product Description',
    titleTag: 'Product Name',
    metaTagDescription: null,
    linkText: 'product-slug',
    categories: [
      '/Category A/',
      '/Category A/Category B/',
      '/Category A/Category B/Category C/',
    ],
    categoryId: '1',
    categoriesIds: ['/1/2/3/', '/1/2/', '/1/'],
    brand: 'Brand',
    categoryTree: [
      { id: '1', name: 'Category A', href: 'category-a' },
      { id: '2', name: 'Category B', href: 'category-a/category-b' },
      { id: '3', name: 'Category C', href: 'category-a/category-b/category-c' },
    ],
    items: [
      {
        itemId: '1',
        name: 'Item One',
        nameComplete: 'Name One Complete',
        images: [
          {
            imageId: '1',
            imageLabel: '1-Color',
            imageTag: 'imageTag',
            imageUrl: 'imageurl.com',
            imageText: 'imageText',
          },
        ],
        sellers: [
          {
            sellerId: '1',
            sellerName: 'Store Name',
            commertialOffer: {
              AvailableQuantity: 10,
              ListPrice: 100,
              Price: 90,
            },
          },
        ],
      },
    ],
    ...customFields,
  }
}

export const getItem = (
  id = '1',
  price = 90,
  quantity = 10,
  customFields = {}
) => {
  return {
    itemId: id,
    name: `Item ${id}`,
    nameComplete: `Name ${id} Complete`,
    images: [
      {
        imageId: id,
        imageLabel: `${id}-Color`,
        imageTag: 'imageTag',
        imageUrl: 'imageurl.com',
        imageText: 'imageText',
      },
    ],
    sellers: [
      {
        sellerId: id,
        sellerName: 'Store Name',
        commertialOffer: {
          AvailableQuantity: quantity,
          ListPrice: price + 10,
          Price: price,
        },
      },
    ],
    ...customFields,
  }
}
