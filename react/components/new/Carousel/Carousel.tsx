import classnames from 'classnames'
import React, { useState } from 'react'
import Dots from '../Slider/Dots'
import Slide from '../Slider/Slide'
import Slider from '../Slider/Slider'
import SliderContainer from '../Slider/SliderContainer'

import Container from '../StoreComponents/Container'

import IconCaret from '../StoreIcons/IconCaret'

import Banner, { Props as BannerProps } from './Banner'
import useCssHandles from '../CssHandles/useCssHandles'
import styles from './styles.css'

const GLOBAL_PAGES = global.__RUNTIME__ && [
  'Internal URL',
  ...Object.keys(global.__RUNTIME__.pages),
]

interface Props {
  /** Should change images automatically */
  autoplay?: boolean
  /** How long it should wait to change the banner in secs */
  autoplaySpeed: number | string | null
  /** Banners that will be displayed by the Carousel */
  banners: BannerProps[]
  /** Max height size of the banners */
  height?: number
  /** Set visibility of arrows */
  showArrows?: boolean
  /** Set visibility of dots */
  showDots?: boolean
}

interface ArrowProps {
  orientation: string
  onClick: (event: React.MouseEvent<HTMLElement>) => void
}

interface ArrowContainerProps {
  children: React.ReactNode
}

const PER_PAGE = 1
const CSS_HANDLES = [
  'arrow',
  'arrowLeft',
  'arrowRight',
  'arrowsContainerWrapper',
  'sliderRoot',
  'sliderFrame',
  'slide',
  'activeDot',
  'notActiveDot',
  'containerDots',
] as const

const Carousel = (props: Props) => {
  const {
    height = 420,
    autoplay = true,
    showDots = true,
    showArrows = true,
    autoplaySpeed = 5,
    banners: bannersProp
  } = props
  const [currentSlide, setCurrentSlide] = useState(0)
  const handles = useCssHandles(CSS_HANDLES)

  if (!bannersProp.length) {
    return null
  }

  const ArrowRender = ({ orientation, onClick }: ArrowProps) => {
    const containerClasses = classnames(handles.arrow, 'pointer z-1 flex', {
      [handles.arrowLeft]: orientation === 'left',
      [handles.arrowRight]: orientation === 'right',
    })
    return (
      <div className={containerClasses} onClick={onClick}>
        <IconCaret orientation={orientation} thin size={20} />
      </div>
    )
  }

  const ArrowContainerRender = ({ children }: ArrowContainerProps) => {
    const wrapperClasses = classnames(
      handles.arrowsContainerWrapper,
      'w-100 h-100 absolute left-0 top-0 flex justify-center'
    )
    const containerClasses = classnames(
      styles.arrowsContainer,
      'w-100 h-100 mw9 flex-ns justify-between items-center dn-s'
    )

    return (
      <div className={wrapperClasses}>
        <Container className={containerClasses}>{children}</Container>
      </div>
    )
  }

  const banners: BannerProps[] = bannersProp.filter(
    banner => banner && (banner.mobileImage || banner.image)
  )

  const handleNextSlide = () => {
    const nextSlide = ((currentSlide + 1 - PER_PAGE) % banners.length) + PER_PAGE
    setCurrentSlide(nextSlide)
  }

  const autoplayInterval = autoplaySpeed
    ? typeof autoplaySpeed === 'string'
      ? parseFloat(autoplaySpeed)
      : autoplaySpeed
    : 0

  return (
    <SliderContainer
      autoplay={autoplay && autoplayInterval > 0}
      autoplayInterval={autoplayInterval * 1000}
      pauseOnHover
      onNextSlide={handleNextSlide}
      className={styles.container}
    >
      <Slider
        loop
        classes={{
          root: handles.sliderRoot,
          sliderFrame: handles.sliderFrame,
        }}
        perPage={PER_PAGE}
        arrowRender={showArrows && ArrowRender}
        currentSlide={currentSlide}
        onChangeSlide={setCurrentSlide}
        arrowsContainerComponent={showArrows && ArrowContainerRender}
        duration={500}
      >
        {banners.map((banner, i) => (
          <Slide
            className={handles.slide}
            key={i}
            style={{ maxHeight: height }}
            sliderTransitionDuration={500}
          >
            <Banner height={height} {...banner} />
          </Slide>
        ))}
      </Slider>
      {showDots && (
        <Dots
          loop
          perPage={PER_PAGE}
          currentSlide={currentSlide}
          totalSlides={banners.length}
          onChangeSlide={setCurrentSlide}
          classes={{
            activeDot: classnames(handles.activeDot, 'bg-emphasis'),
            dot: classnames(styles.dot, 'mh2 mv0 pointer br-100'),
            notActiveDot: classnames(handles.notActiveDot, 'bg-muted-3'),
            root: classnames(handles.containerDots, 'bottom-0 pb4'),
          }}
        />
      )}
    </SliderContainer>
  )
}

Carousel.getSchema = () => {
  const internalRouteSchema = {
    customInternalURL: {
      description:
        'admin/editor.carousel.bannerLink.custominternalurl.description',
      isLayout: false,
      title: 'admin/editor.carousel.bannerLink.custominternalurl.title',
      type: 'string',
    },
    page: {
      enum: GLOBAL_PAGES,
      isLayout: false,
      title: 'admin/editor.carousel.bannerLink.page.title',
      type: 'string',
    },
    params: {
      description: 'admin/editor.carousel.bannerLink.params.description',
      isLayout: false,
      title: 'admin/editor.carousel.bannerLink.params.title',
      type: 'string',
    },
  }

  const externalRouteSchema = {
    url: {
      isLayout: false,
      title: 'admin/editor.carousel.bannerLink.url.title',
      type: 'string',
    },
  }

  return {
    description: 'admin/editor.carousel.description',
    dependencies: {
      autoplay: {
        oneOf: [
          {
            properties: {
              autoplay: {
                enum: [true],
              },
              autoplaySpeed: {
                enum: ['2', '3', '4', '5', '6', '7', '8'],
                isLayout: false,
                title: 'admin/editor.carousel.autoplaySpeed.title',
                type: 'string',
              },
            },
          },
        ],
      },
    },
    properties: {
      banners: {
        items: {
          properties: {
            image: {
              default: '',
              title: 'admin/editor.carousel.banner.image.title',
              type: 'string',
              widget: {
                'ui:widget': 'image-uploader',
              },
            },
            mobileImage: {
              default: '',
              title: 'admin/editor.carousel.banner.mobileImage.title',
              type: 'string',
              widget: {
                'ui:widget': 'image-uploader',
              },
            },
            tabletImage: {
              default: '',
              title: 'admin/editor.carousel.banner.tabletImage.title',
              type: 'string',
              widget: {
                'ui:widget': 'image-uploader',
              },
            },
            description: {
              default: '',
              title: 'admin/editor.carousel.banner.description.title',
              type: 'string',
            },
            externalRoute: {
              default: false,
              isLayout: false,
              title: 'admin/editor.carousel.banner.externalRoute.title',
              type: 'boolean',
            },
          },
          dependencies: {
            externalRoute: {
              oneOf: [
                {
                  properties: {
                    externalRoute: {
                      enum: [false],
                    },
                    ...internalRouteSchema,
                  },
                },
                {
                  properties: {
                    externalRoute: {
                      enum: [true],
                    },
                    ...externalRouteSchema,
                  },
                },
              ],
            },
          },
          title: 'admin/editor.carousel.banner.title',
          type: 'object',
        },
        minItems: 1,
        title: 'admin/editor.carousel.banners.title',
        type: 'array',
      },
      height: {
        default: 420,
        enum: [420, 440],
        isLayout: true,
        title: 'admin/editor.carousel.height.title',
        type: 'number',
      },
      showArrows: {
        default: true,
        isLayout: true,
        title: 'admin/editor.carousel.showArrows.title',
        type: 'boolean',
      },
      showDots: {
        default: true,
        isLayout: true,
        title: 'admin/editor.carousel.showDots.title',
        type: 'boolean',
      },
      autoplay: {
        default: true,
        isLayout: false,
        title: 'admin/editor.carousel.autoplay.title',
        type: 'boolean',
      },
    },
    title: 'admin/editor.carousel.title',
    type: 'object',
  }
}

export default Carousel
