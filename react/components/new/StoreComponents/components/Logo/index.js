import React from 'react'
import { Link, useRuntime } from 'vtex.render-runtime'
import useCssHandles from '../../../CssHandles/useCssHandles'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import * as Amp from 'react-amphtml'

import Placeholder from './Placeholder'

import styles from './styles.css'

const CSS_HANDLES = ['logoLink', 'logoImage', 'logoContainer']

/**
 * Logo of the store
 */
const Logo = ({
  url,
  href,
  width,
  height,
  title,
  mobileWidth,
  mobileHeight,
}) => {
  const {
    amp,
    account,
    hints: { mobile },
  } = useRuntime()
  const handles = useCssHandles(CSS_HANDLES)
  const logoClassNames = classNames('store-logo', handles.logoContainer, {
    [styles.sizeDesktop]: !mobile,
    [styles.sizeMobile]: mobile,
  })

  const imgWidth = mobile && mobileWidth ? mobileWidth : width
  const imgHeight = mobile && mobileHeight ? mobileHeight : height

  const imageUrl = url && url.replace(/{{account}}/g, account)

  let image = null

  if (amp && url) {
    image = (
      <Amp.AmpImg
        specName="default"
        width={imgWidth}
        height={imgHeight}
        alt={title}
        src={imageUrl}
        className={handles.logoImage}
      />
    )
  } else if (url) {
    image = (
      <img
        src={imageUrl}
        width={imgWidth}
        height={imgHeight}
        alt={title}
        className={handles.logoImage}
      />
    )
  }

  const logo = (
    <span className={`${logoClassNames} pv4 ph6`}>
      {url ? (
        image
      ) : (
        <Placeholder width={width} height={height} title={title} />
      )}
    </span>
  )

  return href ? (
    <Link to={href} className={handles.logoLink}>
      {logo}
    </Link>
  ) : (
    logo
  )
}

Logo.propTypes = {
  /** URL of the logo */
  url: PropTypes.string,
  /** Title to be displayed as alt text */
  title: PropTypes.string.isRequired,
  /** Logo's width */
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /** Logo's height */
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}

Logo.schema = {
  title: 'admin/editor.logo.title',
  description: 'admin/editor.logo.description',
  type: 'object',
  properties: {
    href: {
      title: 'admin/editor.logo.href.title',
      description: 'admin/editor.logo.href.description',
      type: 'string',
    },
    url: {
      title: 'admin/editor.logo.url.title',
      description: 'admin/editor.logo.url.description',
      type: 'string',
      widget: {
        'ui:widget': 'image-uploader',
      },
    },
    width: {
      title: 'admin/editor.logo.width.title',
      description: 'admin/editor.logo.width.description',
      type: 'number',
      isLayout: true,
    },
    height: {
      title: 'admin/editor.logo.height.title',
      description: 'admin/editor.logo.height.description',
      type: 'number',
      isLayout: true,
    },
    title: {
      title: 'admin/editor.logo.title.title',
      description: 'admin/editor.logo.title.description',
      type: 'string',
    },
    mobileWidth: {
      title: 'admin/editor.logo.mobileWidth.title',
      description: 'admin/editor.logo.mobileWidth.description',
      type: 'number',
      isLayout: true,
    },
    mobileHeight: {
      title: 'admin/editor.logo.mobileHeight.title',
      description: 'admin/editor.logo.mobileHeight.description',
      type: 'number',
      isLayout: true,
    },
  },
}

export default Logo
