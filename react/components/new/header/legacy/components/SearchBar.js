import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Adopt } from 'react-adopt'
import { ExtensionPoint } from 'vtex.render-runtime'
import Button from '../../../Styleguide/Button'
import classNames from 'classnames'
import { icons } from '../defaults'

import styles from '../store-header.css'

/**
 * Represents the search bar of the header
 */
const SearchBar = ({ onCancel, iconClasses, mobile }) => {
  const searchBarClassNames = classNames(
    `${styles.topMenuSearchBar} flex pa2-m flex-grow-1`,
    mobile ? 'justify-between' : 'justify-center'
  )

  const cancelClassNames = classNames(`${iconClasses} ttl`)

  return (
    <div className={searchBarClassNames}>
      <div className="w-75">
        <Adopt
          mapper={{
            placeholder: <FormattedMessage id="store/header.search-placeholder" />,
            emptyPlaceholder: (
              <FormattedMessage id="store/header.search-emptyPlaceholder" />
            ),
          }}
        >
          {({ placeholder, emptyPlaceholder }) => (
            <ExtensionPoint
              id="search-bar"
              placeholder={placeholder}
              emptyPlaceholder={emptyPlaceholder}
              autoFocus={mobile}
              hasIconLeft={mobile}
              iconClasses={iconClasses}
            />
          )}
        </Adopt>
      </div>
      {mobile && (
        <div className="w-25 pa2-m pt2-s">
          <Button size="small" variation="tertiary" onClick={onCancel}>
            <span className={cancelClassNames}>
              <FormattedMessage id="store/header.search-cancel" />
            </span>
          </Button>
        </div>
      )}
    </div>
  )
}

SearchBar.propTypes = {
  /** If it's mobile mode */
  mobile: PropTypes.bool.isRequired,
  /** Callback function on cancel */
  onCancel: PropTypes.func,
  ...icons.propTypes,
}

SearchBar.defaultProps = {
  onCancel: () => {},
  ...icons.defaultProps,
}

export default SearchBar
