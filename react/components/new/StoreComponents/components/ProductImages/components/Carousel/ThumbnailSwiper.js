import React from 'react'
import { THUMB_SIZE } from '../../../module/images'
import classNames from 'classnames'

import { THUMBS_POSITION_HORIZONTAL } from '../../utils/enums'
import { imageUrl } from '../../utils/aspectRatioUtil'
import useCssHandles from '../../../../../CssHandles/useCssHandles'

const THUMB_MAX_SIZE = 256

/** Swiper and its modules are imported using require to avoid breaking SSR */
const Swiper = window.navigator
  ? require('react-id-swiper/lib/ReactIdSwiper').default
  : null

const CSS_HANDLES = [
  'figure',
  'thumbImg',
  'productImagesThumb',
  'carouselThumbBorder',
  'carouselGaleryThumbs',
  'productImagesThumbActive',
]

const Thumbnail = ({
  alt,
  index,
  onThumbClick,
  height,
  thumbUrl,
  handles,
  maxHeight = 150,
  aspectRatio = 'auto',
  itemContainerClasses,
}) => {
  return (
    <div
      className={itemContainerClasses}
      style={{ height, maxHeight: maxHeight || 'unset' }}
      onClick={() => onThumbClick(index)}
    >
      <figure
        className={handles.figure}
        itemProp="associatedMedia"
        itemScope
        itemType="http://schema.org/ImageObject"
      >
        <img
          className={`${handles.thumbImg} w-100 h-auto db`}
          itemProp="thumbnail"
          alt={alt}
          src={imageUrl(thumbUrl, THUMB_SIZE, THUMB_MAX_SIZE, aspectRatio)}
        />
      </figure>
      <div
        className={`absolute absolute--fill b--solid b--muted-2 bw0 ${handles.carouselThumbBorder}`}
      />
    </div>
  )
}

const ThumbnailSwiper = ({
  isThumbsVertical,
  slides,
  swiperParams,
  thumbUrls,
  position,
  onThumbClick,
  activeIndex,
  thumbnailAspectRatio,
  thumbnailMaxHeight,
}) => {
  const hasThumbs = slides.length > 1
  const handles = useCssHandles(CSS_HANDLES)

  const thumbClasses = classNames(`${handles.carouselGaleryThumbs} dn h-auto`, {
    'db-ns': hasThumbs,
    mt3: !isThumbsVertical,
    'w-20 bottom-0 top-0 absolute': isThumbsVertical,
    'left-0':
      isThumbsVertical && position === THUMBS_POSITION_HORIZONTAL.LEFT,
    'right-0':
      isThumbsVertical && position === THUMBS_POSITION_HORIZONTAL.RIGHT,
  })

  return (
    <div className={thumbClasses} data-testid="thumbnail-swiper">
      <Swiper {...swiperParams} shouldSwiperUpdate>
        {slides.map((slide, i) => {
          const itemContainerClasses = classNames('swiper-slide mb5 pointer',
            handles.productImagesThumb,
            {
              'w-20': !isThumbsVertical,
              'w-100': isThumbsVertical,
              'swiper-slide-active': activeIndex === i,
              [handles.productImagesThumbActive]: activeIndex === i,
            }
          )

          return (
            <Thumbnail
              key={`${i}-${slide.alt}`}
              itemContainerClasses={itemContainerClasses}
              index={i}
              handles={handles}
              height={isThumbsVertical ? 'auto' : '115px'}
              onThumbClick={onThumbClick}
              alt={slide.alt}
              thumbUrl={slide.thumbUrl || thumbUrls[i]}
              aspectRatio={thumbnailAspectRatio}
              maxHeight={thumbnailMaxHeight}
            />
          )
        })}
      </Swiper>
    </div>
  )
}

export default ThumbnailSwiper
