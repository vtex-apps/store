import React, { Component, Fragment, Suspense } from 'react'
import {
  Link,
  withRuntimeContext,
  ExtensionPoint,
  useChildBlock,
} from 'vtex.render-runtime'

import classNames from 'classnames'

import IconProfile from '../../StoreIcons/IconProfile'
import Overlay from '../../ReactPortal/Overlay'
import ButtonWithIcon from '../../Styleguide/ButtonWithIcon'

import { truncateString } from '../utils/format-string'
import { translate } from '../utils/translate'
import { LoginPropTypes } from '../propTypes'

import styles from '../styles.css'
import Loading from './Loading'
import Popover from './Popover'
import OutsideClickHandler from './OutsideClickHandler'

const LoginContent = React.lazy(() => import('./LoginContent'))

const ProfileIcon = ({ iconSize, labelClasses, classes }) => {
  const hasIconBlock = Boolean(useChildBlock({ id: 'icon-profile' }))

  if (hasIconBlock) {
    return (
      <div className={classNames(labelClasses, classes)}>
        <ExtensionPoint id="icon-profile" size={iconSize} />
      </div>
    )
  }

  return (
    <div className={classNames(labelClasses, classes)}>
      <IconProfile size={iconSize} />
    </div>
  )
}

class LoginComponent extends Component {
  static propTypes = LoginPropTypes

  /** Function called after login success */
  onClickLoginButton = () => {
    window.location.reload()
  }

  renderIcon = () => {
    const {
      iconSize,
      iconLabel: iconLabelProfile,
      labelClasses,
      intl,
      renderIconAsLink,
      onProfileIconClick,
      sessionProfile,
      showIconProfile,
      runtime: { history },
    } = this.props

    const pathname = history && history.location && history.location.pathname

    const iconClasses = 'flex items-center'
    const iconLabel = iconLabelProfile || translate('store/login.signIn', intl)
    const iconContent = (
      <Fragment>
        {showIconProfile && renderIconAsLink && (
          <ProfileIcon
            iconSize={iconSize}
            labelClasses={labelClasses}
            iconClasses={iconClasses}
          />
        )}
        {sessionProfile ? (
          <span
            className={`${styles.profile} t-action--small order-1 pl4 ${labelClasses} dn db-l`}
          >
            {translate('store/login.hello', intl)}{' '}
            {sessionProfile.firstName || truncateString(sessionProfile.email)}
          </span>
        ) : (
          iconLabel && (
            <span
              className={`${styles.label} t-action--small pl4 ${labelClasses} dn db-l`}
            >
              {iconLabel}
            </span>
          )
        )}
      </Fragment>
    )

    if (renderIconAsLink) {
      const linkTo = sessionProfile ? 'store.account' : 'store.login'
      const returnUrl =
        !sessionProfile && `returnUrl=${encodeURIComponent(pathname)}`
      return (
        <Link
          page={linkTo}
          query={returnUrl}
          className={`${styles.buttonLink} h1 w2 tc flex items-center w-100-s h-100-s pa4-s`}
        >
          {iconContent}
        </Link>
      )
    }

    return (
      <ButtonWithIcon
        variation="tertiary"
        icon={
          showIconProfile && (
            <ProfileIcon iconSize={iconSize} labelClasses={labelClasses} />
          )
        }
        iconPosition={showIconProfile ? 'left' : 'right'}
        onClick={onProfileIconClick}
      >
        <div
          className="flex pv2 items-center"
          ref={e => {
            this.iconRef = e
          }}
        >
          {iconContent}
        </div>
      </ButtonWithIcon>
    )
  }

  render() {
    const {
      isBoxOpen,
      onOutSideBoxClick,
      sessionProfile,
      mirrorTooltipToRight,
    } = this.props

    return (
      <div className={`${styles.container} flex items-center fr`}>
        <div className="relative">
          {this.renderIcon()}
          {isBoxOpen && (
            <Overlay>
              <OutsideClickHandler onOutsideClick={onOutSideBoxClick}>
                <Popover mirrorTooltipToRight={mirrorTooltipToRight}>
                  <Suspense fallback={<Loading />}>
                    <LoginContent
                      profile={sessionProfile}
                      loginCallback={this.onClickLoginButton}
                      isInitialScreenOptionOnly
                      {...this.props}
                    />
                  </Suspense>
                </Popover>
              </OutsideClickHandler>
            </Overlay>
          )}
        </div>
      </div>
    )
  }
}

export default withRuntimeContext(LoginComponent)
