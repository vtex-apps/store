import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import * as ReactShare from 'react-share'

import { SOCIAL_TO_ENUM, SOCIAL_ENUM_TO_COMPONENT } from '../constants/social'
import styles from '../styles.css'

export default class SocialButton extends Component {
  static propTypes = {
    /** Share URL */
    url: PropTypes.string.isRequired,
    /** Message to be shared */
    message: PropTypes.string,
    /** Social Network Enum */
    socialEnum: PropTypes.string.isRequired,
    /** Button size in pixels */
    size: PropTypes.number,
    /** Classes to be applied to social button */
    buttonClass: PropTypes.string,
    /** Classes to be applied to icon of the button */
    iconClass: PropTypes.string,
    /** Image url to share in social medias */
    imageUrl: PropTypes.string,
  }

  static defaultProps = {
    size: 32,
    buttonClass: 'mh1 pointer outline-0 dim',
  }

  render() {
    const {
      url,
      message,
      size,
      socialEnum,
      buttonClass,
      iconClass,
      imageUrl,
    } = this.props
    const socialComponentName = SOCIAL_ENUM_TO_COMPONENT[socialEnum]
    const SocialComponent = ReactShare[`${socialComponentName}ShareButton`]
    const SocialIcon = ReactShare[`${socialComponentName}Icon`]
    const additionalProps = message && resolveMessageProp(message, socialEnum)

    const icon = (
      <SocialIcon
        round
        size={size}
        className={classNames(styles.shareSocialIcon, iconClass)}
      />
    )

    /* Pinterest requires imageUrl for the "media" prop, but
     * it might not be loaded yet */
    if (socialComponentName === SOCIAL_TO_ENUM.pinterest && !imageUrl) {
      return icon
    }

    return (
      <SocialComponent
        url={url}
        className={classNames(styles.shareSocialButton, buttonClass)}
        media={imageUrl}
        {...additionalProps}
      >
        {icon}
      </SocialComponent>
    )
  }
}

function resolveMessageProp(message, socialEnum) {
  const titlePropMessage = [
    SOCIAL_TO_ENUM.whatsapp,
    SOCIAL_TO_ENUM.twitter,
    SOCIAL_TO_ENUM.telegram,
    SOCIAL_TO_ENUM.pinterest,
  ]

  return titlePropMessage.includes(socialEnum)
    ? { title: message }
    : socialEnum === SOCIAL_TO_ENUM.facebook
    ? { quote: message }
    : { body: message }
}
