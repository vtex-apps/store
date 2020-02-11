import React, { ImgHTMLAttributes, Fragment } from 'react'
import useCssHandles from '../CssHandles/useCssHandles'
import { injectIntl, InjectedIntl, defineMessages } from 'react-intl'
import formatIOMessage from '../NativeTypes/formatIOMessage'

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  maxWidth?: string | number
  maxHeight?: string | number
  minWidth?: string | number
  minHeight?: string | number
  blockClass?: string
  link?: {
    url: string
    noFollow: boolean
    openNewTab: boolean
    title: string
  }
  intl: InjectedIntl
}

const CSS_HANDLES = ['imageElement', 'imageElementLink'] as const

const Image: StorefrontFunctionComponent<ImageProps> = ({
  src,
  alt = '',
  maxWidth,
  maxHeight,
  minWidth,
  minHeight,
  width,
  height,
  srcSet = '',
  sizes = '',
  link,
  intl,
}) => {
  const handles = useCssHandles(CSS_HANDLES, {
    migrationFrom: 'vtex.store-components@3.x',
  })
  const imageDimensions = {
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    width,
    height,
  }

  const formattedSrc = formatIOMessage({ id: src, intl })
  const formattedAlt = formatIOMessage({ id: alt, intl })

  const imgElement = (
    <img
      src={formattedSrc}
      srcSet={srcSet}
      sizes={sizes}
      alt={formattedAlt}
      style={imageDimensions}
      className={handles.imageElement}
    />
  )

  return link ? (
    <a
      href={formatIOMessage({ id: link.url, intl })}
      rel={link.noFollow ? 'nofollow' : ''}
      target={link.openNewTab ? '_blank' : ''}
      title={formatIOMessage({ id: link.title, intl })}
      className={handles.imageElementLink}>
      {imgElement}
    </a>
  ) : (
    <Fragment>{imgElement}</Fragment>
  )
}

const messages = defineMessages({
  title: {
    defaultMessage: '',
    id: 'admin/editor.store-image.title',
  },
  description: {
    defaultMessage: '',
    id: 'admin/editor.store-image.description',
  },
  blockClassTitle: {
    defaultMessage: '',
    id: 'admin/editor.store-image.blockClass.title',
  },
  blockClassDescription: {
    defaultMessage: '',
    id: 'admin/editor.store-image.blockClass.description',
  },
})

Image.schema = {
  title: messages.title.id,
  description: messages.description.id,
  type: 'object',
  properties: {
    blockClass: {
      title: messages.blockClassTitle.id,
      description: messages.blockClassDescription.id,
      type: 'string',
      isLayout: true,
    },
  },
}

export default injectIntl(Image)
