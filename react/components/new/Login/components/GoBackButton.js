import React, { Component, Fragment } from 'react'
import ButtonWithIcon from '../../Styleguide/ButtonWithIcon'
import { ExtensionPoint, useChildBlock } from 'vtex.render-runtime'
import IconArrowBack from '../../StoreIcons/IconArrowBack'

import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'

import { translate } from '../utils/translate'
import styles from '../styles.css'

const Arrow = () => {
  const hasIconBlock = Boolean(useChildBlock({ id: 'icon-arrow-back' }))

  return hasIconBlock ? (
    <ExtensionPoint id="icon-arrow-back" size={10} viewBox="0 0 16 11" />
  ) : (
    <IconArrowBack size={10} viewBox="0 0 16 11" />
  )
}

class GoBackButton extends Component {
  static propTypes = {
    /** Function to change the active tab */
    onStateChange: PropTypes.func,
    /** Data that change the active tab */
    changeTab: PropTypes.object,
    /** Intl object*/
    intl: intlShape,
  }

  render() {
    const { onStateChange, intl, changeTab } = this.props
    return (
      <Fragment>
        <div className={styles.backButton}>
          <ButtonWithIcon
            icon={<Arrow />}
            iconPosition="left"
            variation="tertiary"
            size="small"
            onClick={() => onStateChange(changeTab)}
          >
            <span className="t-small ml2">
              {translate('store/login.goBack', intl)}
            </span>
          </ButtonWithIcon>
        </div>
      </Fragment>
    )
  }
}
export default injectIntl(GoBackButton)
