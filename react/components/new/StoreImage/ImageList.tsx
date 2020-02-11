import React from 'react'
import { defineMessages } from 'react-intl'
import useDevice from '../DeviceDetector/useDevice'
import { useListContext, ListContextProvider } from 'vtex.list-context'

import Image from './Image'

interface Link {
  url: string
  noFollow: boolean
  openNewTab: boolean
  title: string
}

interface Image {
  link?: Link
  image: string
  mobileImage: string
  description: string
}

interface Props {
  images: Image[]
  height: number
}

const ImageList: StorefrontFunctionComponent<Props> = ({
  images,
  height = 420,
  children,
}) => {
  const { isMobile } = useDevice()
  const { list } = useListContext() || []

  const imageListContent = images.map(
    ({ link, image, mobileImage, description }, idx) => (
      <Image
        key={idx}
        src={isMobile && mobileImage ? mobileImage : image}
        alt={description}
        link={link}
        maxHeight={height}
        width="100%"
      />
    )
  )

  const newListContextValue = list.concat(imageListContent)

  return (
    <ListContextProvider list={newListContextValue}>
      {children}
    </ListContextProvider>
  )
}

const messages = defineMessages({
  title: { id: 'admin/editor.image-list.title', defaultMessage: '' },
  description: {
    id: 'admin/editor.image-list.description',
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
})

ImageList.schema = {
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
  },
}

export default ImageList
