import React, { Component } from 'react'
import PropTypes from 'prop-types'
import IconCaret from '../../../StoreIcons/IconCaret'
import IconCart from '../../../StoreIcons/IconCart'
import { injectIntl } from 'react-intl'
import OutsideClickHandler from 'react-outside-click-handler'
import Animation from '../../../StoreComponents/Animation'
import classNames from 'classnames'
import Overlay from '../../../ReactPortal/Overlay'

import minicart from '../minicart.css'

const OPEN_SIDEBAR_CLASS = minicart.sidebarOpen

/* SideBar component */
class Sidebar extends Component {
  updateComponent() {
    if (this.props.isOpen) {
      document.body.classList.add(OPEN_SIDEBAR_CLASS)
    } else {
      document.body.classList.remove(OPEN_SIDEBAR_CLASS)
    }
  }

  componentDidMount() {
    this.updateComponent()
  }

  componentDidUpdate() {
    this.updateComponent()
  }

  componentWillUnmount() {
    document.body.classList.remove(OPEN_SIDEBAR_CLASS)
  }

  render() {
    const {
      isOpen,
      onOutsideClick,
      intl,
      iconSize,
      quantity,
      iconsProps,
    } = this.props

    if (typeof document === 'undefined') {
      return null
    }

    const scrimClasses = classNames(
      `${minicart.sidebarScrim} fixed dim bg-base--inverted top-0 left-0 z-9999 w-100 vh-100 o-40`,
      {
        dn: !isOpen,
      }
    )

    return (
      <Overlay fullWidth>
        <OutsideClickHandler onOutsideClick={onOutsideClick}>
          <div
            style={{ willChange: 'opacity' }}
            className={scrimClasses}
            onClick={onOutsideClick}
          />

          <Animation
            className={`${minicart.sidebar} w-80 w-auto-ns h-100 fixed top-0 right-0 z-9999 bg-base shadow-2 flex flex-column`}
            isActive={isOpen}
            type="drawerLeft"
          >
            <div
              className={`${minicart.sidebarHeader} pointer flex flex-row items-center pa5 h3 bg-base w-100 z-max bb b--muted-3 bw1`}
            >
              <div
                className={`${minicart.sidebarRightCaretContainer} c-muted-1 pa4 flex items-center`}
                onClick={onOutsideClick}
              >
                <IconCaret orientation="right" size={17} {...iconsProps} />
              </div>
              <div
                className={`${minicart.sidebarItemQuantityContainer} relative c-muted-1`}
              >
                <IconCart size={iconSize} {...iconsProps} />
                {quantity > 0 && (
                  <span
                    className={`${minicart.badge} c-on-emphasis absolute t-mini bg-emphasis br4 w1 h1 pa1 flex justify-center items-center lh-solid`}
                  >
                    {quantity}
                  </span>
                )}
              </div>
              <span
                className={`${minicart.label} dn-m db-l t-action--small pl${
                  quantity > 0 ? '6' : '4'
                } c-muted-1`}
              >
                {intl.formatMessage({ id: 'store/sidebar-title' })}
              </span>
            </div>
            {this.props.children}
          </Animation>
        </OutsideClickHandler>
      </Overlay>
    )
  }
}

Sidebar.propTypes = {
  /* Set the sideBar visibility */
  isOpen: PropTypes.bool,
  /* Sidebar content */
  children: PropTypes.object.isRequired,
  /* Function to be called when click in the close sidebar button or outside the sidebar */
  onOutsideClick: PropTypes.func,
  /* Items quantity */
  quantity: PropTypes.number.isRequired,
  /* Cart icon size */
  iconSize: PropTypes.number,
  /** Props to passed to icons from store-icons */
  iconsProps: PropTypes.shape({
    viewBox: PropTypes.string,
    size: PropTypes.number,
  }),
}

export default injectIntl(Sidebar)
