import React, { useMemo } from 'react'
import useProduct from 'vtex.product-context/useProduct'
import { useResponsiveValues } from 'vtex.responsive-values'
import { path, map, pick } from 'ramda'

import ProductImages from './index'
import generateImageConfig from './utils/generateImageConfig'
import { THUMBS_ORIENTATION, THUMBS_POSITION_HORIZONTAL } from './utils/enums'

const ProductImagesWrapper = props => {
  const valuesFromContext = useProduct() || {}
  const { aspectRatio, maxHeight, showNavigationArrows, showPaginationDots } = useResponsiveValues(
    pick(['aspectRatio', 'maxHeight', 'showNavigationArrows', 'showPaginationDots'], props)
  )
  const { selectedItem } = valuesFromContext
  const images = useMemo(
    () =>
      props.images != null
        ? props.images
        : map(generateImageConfig, path(['images'], selectedItem) || []),
    [props.images, selectedItem]
  )

  const videos = useMemo(
    () =>
      props.videos != null
        ? props.videos
        : path(['videos'], selectedItem) || [],
    [props.videos, selectedItem]
  )

  return (
    <ProductImages
      images={images}
      videos={videos}
      zoomProps={props.zoomProps}
      hiddenImages={props.hiddenImages}
      position={props.position || props.thumbnailPosition} //thumbnailPosition is a legacy prop from product-details
      displayThumbnailsArrows={props.displayThumbnailsArrows}
      thumbnailsOrientation={props.thumbnailsOrientation}
      zoomMode={props.zoomMode}
      zoomFactor={props.zoomFactor}
      aspectRatio={aspectRatio}
      maxHeight={maxHeight}
      thumbnailAspectRatio={props.thumbnailAspectRatio}
      thumbnailMaxHeight={props.thumbnailMaxHeight}
      showNavigationArrows={showNavigationArrows}
      showPaginationDots={showPaginationDots}
      // Deprecated
      zoomProps={props.zoomProps}
    />
  )
}

ProductImagesWrapper.getSchema = ({ zoomProps: { zoomType } = {} }) => ({
  title: 'admin/editor.product-images.title',
  description: 'admin/editor.product-images.description',
  type: 'object',
  properties: {
    zoomProps: {
      title: 'admin/editor.product-images.zoomOptions.title',
      type: 'object',
      properties: {
        zoomType: {
          title: 'admin/editor.product-images.zoomType.title',
          type: 'string',
          enum: ['gallery', 'in-page', 'no-zoom'],
          enumNames: [
            'admin/editor.product-images.gallery',
            'admin/editor.product-images.in-page',
            'admin/editor.product-images.no-zoom',
          ],
          widget: {
            'ui:options': {
              inline: false,
            },
            'ui:widget': 'radio',
          },
          default: 'no-zoom',
        },
        ...(zoomType === 'gallery' && {
          bgOpacity: {
            title: 'admin/editor.product-images.bgopacity.title',
            type: 'number',
            minimum: 0.0,
            maximum: 1.0,
            multipleOf: 0.01,
            default: 0.8,
          },
        }),
      },
    },
    thumbnailsOrientation: {
      title: 'admin/editor.product-images.thumbnailsOrientation.title',
      type: 'string',
      enum: [THUMBS_ORIENTATION.VERTICAL, THUMBS_ORIENTATION.HORIZONTAL],
      enumNames: [
        'admin/editor.product-images.vertical',
        'admin/editor.product-images.horizontal',
      ],
      widget: {
        'ui:options': {
          inline: false,
        },
        'ui:widget': 'radio',
      },
      default: THUMBS_ORIENTATION.VERTICAL,
      isLayout: true,
    },
    position: {
      title: 'admin/editor.product-images.position.title',
      description: 'admin/editor.product-images.position.description',
      type: 'string',
      enum: [THUMBS_POSITION_HORIZONTAL.LEFT, THUMBS_POSITION_HORIZONTAL.RIGHT],
      enumNames: [
        'admin/editor.product-images.left',
        'admin/editor.product-images.right',
      ],
      widget: {
        'ui:options': {
          inline: false,
        },
        'ui:widget': 'radio',
      },
      default: THUMBS_POSITION_HORIZONTAL.LEFT,
      isLayout: true,
    },
    displayThumbnailsArrows: {
      title: 'admin/editor.product-images.displayThumbnailsArrows.title',
      type: 'boolean',
      default: false,
      isLayout: true,
    },
  },
})

export default ProductImagesWrapper
