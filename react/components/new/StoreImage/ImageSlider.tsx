import React from 'react'
import { defineMessages, injectIntl, InjectedIntlProps } from 'react-intl'
import SliderLayout from '../SliderLayout/SliderLayout'
import useDevice from '../DeviceDetector/useDevice'
import formatIOMessage from '../NativeTypes/formatIOMessage'

import Image from './Image'

interface Image {
  link?: {
    url: string
    noFollow: boolean
    openNewTab: boolean
    title: string
  }
  image: string
  mobileImage: string
  description: string
}

interface SliderConfig {
  itemsPerPage: {
    desktop: number
    tablet: number
    phone: number
  }
  showNavigationArrows: 'mobileOnly' | 'desktopOnly' | 'always' | 'never'
  showPaginationDots: 'mobileOnly' | 'desktopOnly' | 'always' | 'never'
  usePagination: boolean
  infinite: boolean
}

interface Props {
  images: Image[]
  height: number
  sliderLayoutConfig: SliderConfig
}

function getImageUrl(isMobile: boolean, image: string, mobileImage: string) {
  return !!mobileImage && isMobile ? mobileImage : image
}

const ImageSlider: StorefrontFunctionComponent<Props & InjectedIntlProps> = ({
  images,
  height,
  sliderLayoutConfig = {
    itemsPerPage: {
      desktop: 1,
      tablet: 1,
      phone: 1,
    },
    infinite: true,
    showNavigationArrows: 'always',
    showPaginationDots: 'always',
    usePagination: true,
  },
  intl,
}) => {
  const { isMobile } = useDevice()

  return (
    <SliderLayout {...sliderLayoutConfig} totalItems={images.length}>
      {images.map(({ link, image, mobileImage, description }, idx) => {
        const imageUrl = getImageUrl(
          isMobile,
          formatIOMessage({ id: image, intl }),
          formatIOMessage({ id: mobileImage, intl })
        )
        const imageAltDescription = formatIOMessage({ id: description, intl })
        const imageLink = link && {
          ...link,
          url: formatIOMessage({ id: link.url, intl }),
          title: formatIOMessage({ id: link.title, intl }),
        }

        return (
          <Image
            key={idx}
            src={imageUrl}
            alt={imageAltDescription}
            link={imageLink}
            maxHeight={height}
            width="100%"
          />
        )
      })}
    </SliderLayout>
  )
}

const messages = defineMessages({
  title: { id: 'admin/editor.image-slider.title', defaultMessage: '' },
  description: {
    id: 'admin/editor.image-slider.description',
    defaultMessage: '',
  },
  imagesImageTitle: {
    id: 'admin/editor.image-list.images.image.title',
    defaultMessage: '',
  },
  imagesMobileImageTitle: {
    id: 'admin/editor.image-list.images.mobileImage.title',
    defaultMessage: '',
  },
  imagesImageDescription: {
    id: 'admin/editor.image-list.images.description.title',
    defaultMessage: '',
  },
  imagesImageLinkUrl: {
    id: 'admin/editor.image-list.images.link.url.title',
    defaultMessage: '',
  },
  imagesImageLinkOpenNewTab: {
    id: 'admin/editor.image-list.images.link.openNewTab.title',
    defaultMessage: '',
  },
  imagesImageLinkNoFollow: {
    id: 'admin/editor.image-list.images.link.noFollow.title',
    defaultMessage: '',
  },
  imagesImageLinkTitle: {
    id: 'admin/editor.image-list.images.link.title.title',
    defaultMessage: '',
  },
  imagesTitle: {
    id: 'admin/editor.image-list.images.title',
    defaultMessage: '',
  },
  heightTitle: {
    id: 'admin/editor.image-list.height.title',
    defaultMessage: '',
  },
  sliderTitle: {
    id: 'admin/editor.image-slider.slider.title',
    defaultMessage: '',
  },
  sliderInfinite: {
    id: 'admin/editor.image-slider.slider.infinite',
    defaultMessage: '',
  },
  sliderShowNavigation: {
    id: 'admin/editor.image-slider.slider.showNavigation',
    defaultMessage: '',
  },
  sliderShowPaginationDots: {
    id: 'admin/editor.image-slider.slider.showPaginationDots',
    defaultMessage: '',
  },
  sliderUsePagination: {
    id: 'admin/editor.image-slider.slider.usePagination',
    defaultMessage: '',
  },
})

ImageSlider.schema = {
  title: messages.title.id,
  description: messages.description.id,
  type: 'object',
  properties: {
    height: {
      default: 420,
      enum: [420, 440],
      isLayout: true,
      title: messages.heightTitle.id,
      type: 'number',
    },
    sliderLayoutConfig: {
      title: messages.sliderTitle.id,
      properties: {
        infinite: {
          default: true,
          title: messages.sliderInfinite.id,
          type: 'boolean',
        },
        showNavigationArrows: {
          default: 'always',
          enum: ['mobileOnly', 'desktopOnly', 'always', 'never'],
          title: messages.sliderShowNavigation.id,
          type: 'string',
        },
        showPaginationDots: {
          default: 'always',
          enum: ['mobileOnly', 'desktopOnly', 'always', 'never'],
          title: messages.sliderShowPaginationDots.id,
          type: 'string',
        },
        usePagination: {
          default: true,
          title: messages.sliderUsePagination.id,
          type: 'boolean',
        },
      },
      type: 'object',
    },
  },
}

export default injectIntl(ImageSlider)
