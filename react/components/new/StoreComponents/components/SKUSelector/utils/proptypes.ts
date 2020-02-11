import PropTypes from 'prop-types'

export const skuShape = PropTypes.shape({
  /** Name of the SKU Item */
  name: PropTypes.string.isRequired,
  /** Images of the SKU item */
  images: PropTypes.arrayOf(
    PropTypes.shape({
      /** URL of source Image */
      imageUrl: PropTypes.string.isRequired,
      /** Brief description of the image */
      imageLabel: PropTypes.string,
    })
  ).isRequired,
  /** SkuID */
  itemId: PropTypes.string.isRequired,
  /** List of products specifications names */
  variations: PropTypes.arrayOf(
    PropTypes.shape({
      /** Variation Name */
      name: PropTypes.string,
      /** Variation Values */
      values: PropTypes.arrayOf(PropTypes.string),
    })
  ),
})

export const parsedSkuShape = PropTypes.shape({
  ...skuShape,
  /** List of products specifications names */
  variations: PropTypes.arrayOf(PropTypes.string),
})

export const variationShape = PropTypes.shape({
  /** Variation Name */
  name: PropTypes.string,
  /** Options Array */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.shape({
        imageLabel: PropTypes.string,
        imageUrl: PropTypes.string,
      }),
      available: PropTypes.bool,
      label: PropTypes.string,
      onSelectItem: PropTypes.func,
      impossible: PropTypes.bool,
    })
  ),
})
