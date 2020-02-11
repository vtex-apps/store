const useProduct = jest.fn(() => {
  return {
    buyButton: {
      clicked: false,
    },
    skuSelector: {
      areAllVariationsSelected: true,
    },
  }
})

export default useProduct
