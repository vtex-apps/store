import React, { Component } from 'react'
import PropTypes from 'prop-types'
import debounce from 'debounce'
import classNames from 'classnames'
import { path, equals } from 'ramda'
import ReactResizeDetector from 'react-resize-detector'

import IconCaret from '../../../../../StoreIcons/IconCaret'
import withCssHandles from '../../../../../CssHandles/withCssHandles'

import Video, { getThumbUrl } from '../Video'
import ProductImage from '../ProductImage'

import styles from '../../styles.css'
import './global.css'

/**
 * ReactIdSwiper cannot be SSRendered, so this is a fake swiper that copies some of its classes and HTML layout and render only the first image of the children array.
 */
const FakeSwiper = ({ children, containerClass, direction = THUMBS_ORIENTATION.HORIZONTAL }) => {
  const swiperContainerDirection = direction === THUMBS_ORIENTATION.HORIZONTAL ? 'swiper-container-horizontal' : direction === THUMBS_ORIENTATION.VERTICAL ? 'swiper-container-vertical' : ''
  const childrenArray = React.Children.toArray(children)
  if (childrenArray.length === 0) {
    return null
  }
  const child = childrenArray[0]
  const childClass = path(['props', 'className'], child)
  const newChildClass = childClass ? `${childClass} swiper-slide-active` : childClass
  return (
    <div className={`${containerClass} swiper-container-initialized ${swiperContainerDirection}`}>
      <div className="swiper-wrapper">
        {React.cloneElement(child, {
          className: newChildClass,
        })}
      </div>
    </div>
  )
}

/** Swiper and its modules are imported using require to avoid breaking SSR */
const Swiper = window.navigator
  ? require('react-id-swiper/lib/ReactIdSwiper').default
  : FakeSwiper

const SwiperModules = window.navigator ? require('swiper/dist/js/swiper') : {}

import ThumbnailSwiper from './ThumbnailSwiper'
import {
  THUMBS_ORIENTATION,
  THUMBS_POSITION_HORIZONTAL,
} from '../../utils/enums'

const CSS_HANDLES = [
  'carouselContainer',
  'productImagesThumbsSwiperContainer',
  'productImagesGallerySwiperContainer',
  'productImagesGallerySlide',
  'swiperCaret',
  'swiperCaretNext',
  'swiperCaretPrev',
  'productImagesThumbCaret',
]

const initialState = {
  loaded: [],
  thumbUrl: [],
  alt: [],
  thumbsLoaded: false,
  activeIndex: 0,
}

class Carousel extends Component {
  thumbSwiper = null
  gallerySwiper = null
  state = initialState

  async setInitialVariablesState() {
    const slides = this.props.slides || []

    this.isVideo = []
    this.thumbLoadCount = 0

    slides.forEach(async (slide, i) => {
      if (slide.type === 'video') {
        const thumbUrl = await getThumbUrl(slide.src, slide.thumbWidth)
        this.isVideo[i] = true
        this.setVideoThumb(i)(thumbUrl)
        this.thumbLoadFinish()
      } else {
        this.getThumb(slide.thumbUrl)
      }
    })
  }

  updateSwiperSize = debounce(() => {
    if (this.thumbSwiper) {
      this.thumbSwiper.update()
    }

    if (this.gallerySwiper) {
      this.gallerySwiper.update()
    }
  }, 500)

  thumbLoadFinish = () => {
    this.thumbLoadCount++
    if (!this.props.slides || this.thumbLoadCount === this.props.slides.length) {
      this.setState({ thumbsLoaded: true })
    }
  }

  getThumb = thumbUrl => {
    if (!window.navigator) return // Image object doesn't exist when it's being rendered in the server side
    const image = new Image()
    image.onload = () => {
      this.thumbLoadFinish()
    }
    image.onerror = () => {
      this.thumbLoadFinish()
    }
    image.src = thumbUrl
  }

  handleResize = () => {
    this.updateSwiperSize()
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
    this.setInitialVariablesState()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)

    this.updateSwiperSize.clear()
  }

  componentDidUpdate(prevProps) {
    const { loaded, activeIndex } = this.state
    const isVideo = this.isVideo

    if (!equals(prevProps.slides, this.props.slides)) {
      this.setInitialVariablesState()
      this.setState(initialState)
      if (this.props.slides && this.props.slides.length > 1) {
        this.gallerySwiper && this.gallerySwiper.slideTo(0)
        this.thumbSwiper && this.thumbSwiper.slideTo(0)
      }
      return
    }

    const paginationElement = path(['pagination', 'el'], this.gallerySwiper)
    if (paginationElement) paginationElement.hidden = isVideo[activeIndex]

    const gallerySwiperZoom = path(['zoom'], this.gallerySwiper)

    if (gallerySwiperZoom) {
      loaded[activeIndex]
        ? gallerySwiperZoom.enable()
        : gallerySwiperZoom.disable()
    }
  }

  onSlideChange = () => {
    const activeIndex = path(['activeIndex'], this.gallerySwiper)
    this.setState({ activeIndex, sliderChanged: true })
  }

  setVideoThumb = i => (url, title) => {
    const thumbUrl = { ...this.state.thumbUrl }
    const alt = { ...this.state.alt }

    thumbUrl[i] = url
    alt[i] = title

    this.setState({ thumbUrl, alt })
  }

  renderSlide = (slide, i) => {
    const { aspectRatio, maxHeight, zoomMode, zoomFactor, zoomProps: legacyZoomProps } = this.props

    // Backwards compatibility
    const { zoomType: legacyZoomType } = legacyZoomProps || {}
    const isZoomDisabled = legacyZoomType === 'no-zoom' || zoomMode === 'disabled'

    switch (slide.type) {
      case 'image':
        return (
          <ProductImage
            src={slide.url}
            alt={slide.alt}
            aspectRatio={aspectRatio}
            maxHeight={maxHeight}
            zoomFactor={zoomFactor}
            zoomMode={isZoomDisabled ? 'disabled' : zoomMode}
          />
        )
      case 'video':
        return (
          <Video
            url={slide.src}
            setThumb={this.setVideoThumb(i)}
            playing={i === this.state.activeIndex}
            id={i}
          />
        )
      default:
        return null
    }
  }

  get galleryParams() {
    const {
      cssHandles,
      slides = [],
      showPaginationDots = true,
      showNavigationArrows = true,
    } = this.props

    const iconSize = 24
    const caretClassName =
      'pv8 absolute top-50 translate--50y z-2 pointer c-action-primary'

    return {
      modules: [SwiperModules.Pagination, SwiperModules.Navigation],
      containerClass: `swiper-container ${cssHandles.productImagesGallerySwiperContainer}`,
      ...(slides.length > 1 && showPaginationDots && {
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          bulletActiveClass: 'c-action-primary swiper-pagination-bullet-active',
        },
      }),
      ...(slides.length > 1 && {
        navigation: {
          prevEl: '.swiper-caret-prev',
          nextEl: '.swiper-caret-next',
          disabledClass: `c-disabled ${styles.carouselCursorDefault}`,
        },
      }),
      thumbs: {
        swiper: this.thumbSwiper,
      },
      threshold: 10,
      resistanceRatio: slides.length > 1 ? 0.85 : 0,
      ...(showNavigationArrows && {
        renderNextButton: () => (
          <span className={`swiper-caret-next pl7 pr2 right-0 ${caretClassName} ${cssHandles.swiperCaret} ${cssHandles.swiperCaretNext}`}>
            <IconCaret
              orientation="right"
              size={iconSize}
              className={styles.carouselIconCaretRight}
            />
          </span>
        ),
        renderPrevButton: () => (
          <span className={`swiper-caret-prev pr7 pl2 left-0 ${caretClassName} ${cssHandles.swiperCaret} ${cssHandles.swiperCaretPrev}`}>
            <IconCaret
              orientation="left"
              size={iconSize}
              className={styles.carouselIconCaretLeft}
            />
          </span>
        ),
      }),
      on: {
        slideChange: this.onSlideChange,
      },
      getSwiper: swiper => {
        if (this.gallerySwiper !== swiper) {
          this.gallerySwiper = swiper
        }
      }
    }
  }

  get thumbnailsParams() {
    const { displayThumbnailsArrows, thumbnailsOrientation, cssHandles } = this.props

    const isThumbsVertical =
      thumbnailsOrientation === THUMBS_ORIENTATION.VERTICAL
    const caretSize = 24
    const caretClassName = `${cssHandles.productImagesThumbCaret} absolute z-2 pointer c-action-primary flex pv2`
    const caretStyle = { transition: 'opacity 200ms' }

    return {
      modules: [SwiperModules.Navigation],
      ...(displayThumbnailsArrows && {
        navigation: {
          prevEl: '.swiper-thumbnails-caret-prev',
          nextEl: '.swiper-thumbnails-caret-next',
          disabledClass: `c-disabled o-0 pointer-events-none ${styles.carouselCursorDefault}`,
          hiddenClass: 'dn',
        },
        renderNextButton: () => {
          const classes = classNames(
            'swiper-thumbnails-caret-next',
            caretClassName,
            {
              [`bottom-0 pt7 left-0 justify-center w-100 ${styles.gradientBaseBottom}`]: isThumbsVertical,
              [`right-0 top-0 items-center h-100 pl6 ${styles.gradientBaseRight}`]: !isThumbsVertical,
            }
          )
          return (
            <span className={classes} style={caretStyle}>
              <IconCaret
                orientation={isThumbsVertical ? 'down' : 'right'}
                size={caretSize}
              />
            </span>
          )
        },
        renderPrevButton: () => {
          const classes = classNames(
            'swiper-thumbnails-caret-prev top-0 left-0',
            caretClassName,
            {
              [`pb7 justify-center w-100 ${styles.gradientBaseTop}`]: isThumbsVertical,
              [`items-center h-100 pr6 ${styles.gradientBaseLeft}`]: !isThumbsVertical,
            }
          )
          return (
            <span className={classes} style={caretStyle}>
              <IconCaret
                orientation={isThumbsVertical ? 'up' : 'left'}
                size={caretSize}
              />
            </span>
          )
        },
      }),
      observer: true,
      containerClass: `swiper-container h-100 ${cssHandles.productImagesThumbsSwiperContainer}`,
      watchSlidesVisibility: true,
      watchSlidesProgress: true,
      freeMode: false,
      // It seems crazy but this is just
      // an workaround to make it work the thumbnails with the carousel
      slideActiveClass: 'undefined',
      slideNextClass: 'undefined',
      slidePrevClass: 'undefined',
      direction: thumbnailsOrientation,
      slidesPerView: 'auto',
      touchRatio: 1,
      mousewheel: false,
      preloadImages: true,
      shouldSwiperUpdate: true,
      zoom: false,
      threshold: 8,
      /* Slides are grouped when thumbnails arrows are enabled
       * so that clicking on next/prev will scroll more than
       * one thumbnail */
      slidesPerGroup: displayThumbnailsArrows ? 4 : 1,
      getSwiper: swiper => {
        if (this.thumbSwiper !== swiper) {
          this.thumbSwiper = swiper
        }
      }
    }
  }

  render() {
    const { thumbsLoaded, activeIndex } = this.state

    const {
      position,
      cssHandles,
      slides = [],
      thumbnailMaxHeight,
      thumbnailAspectRatio,
      thumbnailsOrientation,
      zoomProps: { zoomType },
    } = this.props

    const isThumbsVertical =
      thumbnailsOrientation === THUMBS_ORIENTATION.VERTICAL
    const hasThumbs = slides && slides.length > 1

    const galleryCursor = {
      'in-page': styles.carouselGaleryCursor,
      'no-zoom': '',
    }

    const imageClasses = classNames(
      'w-100 border-box',
      galleryCursor[zoomType],
      {
        'ml-20-ns w-80-ns pl5':
          isThumbsVertical &&
          position === THUMBS_POSITION_HORIZONTAL.LEFT &&
          hasThumbs,
        'mr-20-ns w-80-ns pr5':
          isThumbsVertical &&
          position === THUMBS_POSITION_HORIZONTAL.RIGHT &&
          hasThumbs,
      }
    )

    const thumbnailSwiper = thumbsLoaded && hasThumbs && (
      <ThumbnailSwiper
        isThumbsVertical={isThumbsVertical}
        slides={slides}
        activeIndex={activeIndex}
        swiperParams={this.thumbnailsParams}
        thumbUrls={this.state.thumbUrl}
        position={position}
        onThumbClick={index => this.gallerySwiper && this.gallerySwiper.slideTo(index)}
        thumbnailAspectRatio={thumbnailAspectRatio}
        thumbnailMaxHeight={thumbnailMaxHeight}
      />
    )

    const containerClasses = classNames(cssHandles.carouselContainer, 'relative overflow-hidden w-100', {
      'flex-ns justify-end-ns': isThumbsVertical &&
        position === THUMBS_POSITION_HORIZONTAL.LEFT &&
        hasThumbs,
      'flex-ns justify-start-ns': isThumbsVertical &&
        position === THUMBS_POSITION_HORIZONTAL.RIGHT &&
        hasThumbs,
    })

    const SliderComponent = slides.length === 1 ? FakeSwiper : Swiper

    return (
      <div className={containerClasses} aria-hidden="true">
        {isThumbsVertical && thumbnailSwiper}
        <div className={imageClasses}>
          <ReactResizeDetector handleHeight onResize={this.updateSwiperSize}>
            <SliderComponent {...this.galleryParams} shouldSwiperUpdate>
              {slides.map((slide, i) => (
                <div key={i} className={`${cssHandles.productImagesGallerySlide} swiper-slide center-all`}>
                  {this.renderSlide(slide, i)}
                </div>
              ))}
            </SliderComponent>
          </ReactResizeDetector>
          {!isThumbsVertical && thumbnailSwiper}
        </div>
      </div>
    )
  }
}

Carousel.propTypes = {
  slides: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      url: PropTypes.string,
      alt: PropTypes.string,
      thumbUrl: PropTypes.string,
      bestUrlIndex: PropTypes.number,
    })
  ),
  displayThumbnailsArrows: PropTypes.bool,
}

export default withCssHandles(CSS_HANDLES)(Carousel)
