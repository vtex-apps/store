import React, { Fragment } from 'react'
import { bool, string, object, node } from 'prop-types'
import { Link } from 'vtex.render-runtime'

const LinkWrapper = ({
  imageActionUrl,
  children,
  extraCondition,
  linkProps = {},
}) => {
  if (!imageActionUrl || imageActionUrl.length === 0 || extraCondition) {
    return <Fragment>{children}</Fragment>
  }

  return (
    <Link {...linkProps} to={imageActionUrl}>
      {children}
    </Link>
  )
}

LinkWrapper.propTypes = {
  imageActionUrl: string,
  children: node,
  extraCondition: bool,
  linkProps: object,
}

export default LinkWrapper
