import React from 'react'
import PropTypes from 'prop-types'
import { ExtensionPoint } from 'vtex.render-runtime'
import { FormattedMessage } from 'react-intl'
import ButtonWithIcon from '../../../Styleguide/ButtonWithIcon'
import IconSearch from '../../../StoreIcons/IconSearch'
import { lean, icons, searchBar, login } from '../defaults'

import styles from '../store-header.css'

/**
 * Represents the header icon buttons
 */
const Actions = ({
  showSearchBar,
  leanMode,
  iconClasses,
  labelClasses,
  showLogin,
  onActiveSearch,
  mobile,
}) => {
  return (
    <div
      className={`${
        styles.topMenuIcons
      } flex justify-end flex-grow-1 flex-grow-0-ns items-center order-1-s ml-auto-s order-2-ns`}
    >
      {mobile && (
        <div className="flex mr3">
          {showSearchBar && !leanMode && (
            <ButtonWithIcon
              icon={
                <span className={iconClasses}>
                  <IconSearch />
                </span>
              }
              variation="tertiary"
              onClick={onActiveSearch}
            />
          )}

          {showLogin && (
            <ExtensionPoint
              id="login"
              iconClasses={iconClasses}
              labelClasses={labelClasses}
            />
          )}

          {!leanMode && (
            <ExtensionPoint
              id="minicart"
              iconClasses={iconClasses}
              labelClasses={labelClasses}
            />
          )}
        </div>
      )}

      {!mobile && (
        <div className="flex">
          {showLogin && (
            <ExtensionPoint
              id="login"
              iconClasses={iconClasses}
              labelClasses={labelClasses}
              iconLabel={
                <FormattedMessage id="store/header.topMenu.login.icon.label" />
              }
            />
          )}

          {!leanMode && (
            <ExtensionPoint
              id="minicart"
              iconClasses={iconClasses}
              labelClasses={labelClasses}
              iconLabel={
                <FormattedMessage id="store/header.topMenu.minicart.icon.label" />
              }
            />
          )}
        </div>
      )}
    </div>
  )
}

Actions.propTypes = {
  /** If it's mobile mode */
  mobile: PropTypes.bool.isRequired,
  /** Callback function for search active */
  onActiveSearch: PropTypes.func,
  ...lean.propTypes,
  ...login.propTypes,
  ...searchBar.propTypes,
  ...icons.propTypes,
}

Actions.defaultProps = {
  onActiveSearch: () => {},
  ...lean.defaultProps,
  ...login.defaultProps,
  ...searchBar.defaultProps,
  ...icons.defaultProps,
}

export default Actions
