import React, { FC, useMemo, useRef } from 'react'
import Zoomable, { ZoomMode } from './Zoomable'
import { imageUrl } from '../utils/aspectRatioUtil'
import useCssHandles from '../../../../CssHandles/useCssHandles'

const IMAGE_SIZES = [600, 800, 1200]
const DEFAULT_SIZE = 800
const MAX_SIZE = 2048

interface Props {
  src: string
  alt: string
  zoomMode: ZoomMode
  zoomFactor: number
  aspectRatio?: AspectRatio
  maxHeight?: number
}

type AspectRatio = string | number

const CSS_HANDLES = [
  'productImage',
  'productImageTag'
]

const ProductImage: FC<Props> = ({
  src,
  alt,
  zoomMode = ZoomMode.InPlaceClick,
  zoomFactor = 2,
  aspectRatio='auto',
  maxHeight = 600,
}) => {
  const srcSet = useMemo(() => (
    IMAGE_SIZES
      .map(size => `${imageUrl(src, size, MAX_SIZE, aspectRatio)} ${size}w`)
      .join(',')
  ), [src, aspectRatio, IMAGE_SIZES])
  const handles = useCssHandles(CSS_HANDLES)

  const imageRef = useRef(null)

  return (
    <div className={handles.productImage}>
      <Zoomable
        mode={zoomMode}
        factor={zoomFactor}
        zoomContent={(
          <img
            src={imageUrl(src, DEFAULT_SIZE * zoomFactor, MAX_SIZE, aspectRatio)}
            className={handles.productImageTag}
            style={{
              // Resets possible resizing done via CSS
              maxWidth: 'unset',
              width: `${zoomFactor * 100}%`,
              height: `${zoomFactor * 100}%`,
              objectFit: 'contain',
            }}

            // See comment regarding sizes below
            sizes="(max-width: 64.1rem) 100vw, 50vw"
          />
        )}>
            <img
              ref={imageRef}
              className={handles.productImageTag}
              style={{
                width: '100%',
                height: '100%',
                maxHeight: maxHeight || 'unset',
                objectFit: 'contain',
              }}
              src={imageUrl(src, DEFAULT_SIZE, MAX_SIZE, aspectRatio)}
              srcSet={srcSet}
              alt={alt}
              title={alt}
              loading="lazy"

              // WIP
              // The value of the "sizes" attribute means: if the window has at most 64.1rem of width,
              // the image will be of a width of 100vw. Otherwise, the
              // image will be 50vw wide.
              // This size is used for picking the best available size
              // given the ones from the srcset above.
              //
              // This is WIP because it is a guess: we are assuming
              // the image will be of a certain size, but it should be
              // probably be gotten from flex-layout or something.
              sizes="(max-width: 64.1rem) 100vw, 50vw"
            />
      </Zoomable>
    </div>
  )
}

export default ProductImage