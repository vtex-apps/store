import PropTypes from 'prop-types'
import classNames from 'classnames'
import { indexBy, prop } from 'ramda'
import React, { Component } from 'react'
import ContentLoader from 'react-content-loader'
import { FormattedMessage } from 'react-intl'

import SocialButton from './components/SocialButton'
import { SOCIAL_ENUM } from './constants/social'
import styles from './styles.css'

class Share extends Component {
  static propTypes = {
    /** Social Networks configuration */
    social: PropTypes.object,
    /** Share buttons options */
    options: PropTypes.shape({
      /** Share buttons size in pixels */
      size: PropTypes.number,
    }),
    /** Share URL title */
    title: PropTypes.string,
    /** Indcates if the component should render the Content Loader */
    loading: PropTypes.bool,
    /** Component and content loader styles */
    styles: PropTypes.object,
    /** Classes to be applied to root element  */
    className: PropTypes.string,
    /** Classes to be applied to Share label */
    shareLabelClass: PropTypes.string,
    /** Classes to be applied to social button */
    socialButtonClass: PropTypes.string,
    /** Classes to be applied to container of the buttons */
    buttonsContainerClass: PropTypes.string,
    /** Classes to be applied to icon of the button */
    socialIconClass: PropTypes.string,
    /** Classes to be applied to the Content Loader container */
    loaderContainerClass: PropTypes.string,
    /** Classes to be applied to the Content Loader */
    contentLoaderClass: PropTypes.string,
    /** Image url for share in social medias */
    imageUrl: PropTypes.string,
  }

  static Loader = (loaderProps = {}) => {
    const {
      'vtex-share__button--loader': button,
      'vtex-share__button--loader-1': button1,
      'vtex-share__button--loader-2': button2,
      'vtex-share__button--loader-3': button3,
      containerClass,
      contentLoaderClass,
      ...rest
    } = loaderProps
    const loaderStyles = {
      r: '1em',
      height: '2em',
      cy: '1em',
      ...button,
    }

    return (
      <div
        className={classNames(
          styles.shareContainer,
          styles.shareLoader,
          containerClass
        )}
      >
        <ContentLoader
          className={contentLoaderClass}
          style={{
            width: '100%',
            height: '100%',
          }}
          height="100"
          width="100"
          {...rest}
        >
          <circle cx="1em" {...loaderStyles} {...button1} />
          <circle cx="3.5em" {...loaderStyles} {...button2} />
          <circle cx="6em" {...loaderStyles} {...button3} />
        </ContentLoader>
      </div>
    )
  }

  static defaultProps = {
    social: {
      Facebook: true,
      Twitter: true,
      WhatsApp: true,
      Pinterest: true,
    },
    options: {},
    className: 'flex flex-row flex-wrap w-100',
    shareLabelClass: 'pv2 pr3 t-small',
    buttonsContainerClass: 'flex flex-row',
  }

  static schema = {
    title: 'admin/editor.share.title',
    description: 'admin/editor.share.description',
    type: 'object',
    properties: {
      social: {
        title: 'admin/editor.share.social.title',
        type: 'object',
        properties: {
          ...indexBy(
            prop('title'),
            SOCIAL_ENUM.map(socialNetwork => ({
              type: 'boolean',
              title: socialNetwork,
              default: Share.defaultProps.social[socialNetwork],
            }))
          ),
        },
      },
    },
  }

  render() {
    const {
      social,
      title,
      loading,
      options: { size },
      className,
      shareLabelClass,
      buttonsContainerClass,
      socialButtonClass,
      socialIconClass,
      loaderContainerClass,
      contentLoaderClass,
      imageUrl,
    } = this.props

    if (loading) {
      return (
        <Share.Loader
          containerClass={loaderContainerClass}
          contentLoaderClass={contentLoaderClass}
          {...this.props.styles}
        />
      )
    }

    return (
      <div className={classNames(styles.shareContainer, className)}>
        <div className={classNames(styles.shareLabel, shareLabelClass)}>
          <FormattedMessage id="store/store-components.share.label" />
        </div>
        <div className={classNames(styles.shareButtons, buttonsContainerClass)}>
          {Object.keys(social).map(
            (socialNetwork, index) =>
              social[socialNetwork] && (
                <SocialButton
                  key={index}
                  imageUrl={imageUrl}
                  url={window.location && window.location.href}
                  message={title}
                  iconClass={socialIconClass}
                  buttonClass={socialButtonClass}
                  socialEnum={socialNetwork}
                  size={size}
                />
              )
          )}
        </div>
      </div>
    )
  }
}

export default Share
