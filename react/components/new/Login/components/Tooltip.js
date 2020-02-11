import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import styles from '../styles.css'

export default class Tooltip extends Component {
  render() {
    const { children, title, top } = this.props

    const classes = classNames(`${styles.tooltipContainer} pa5 br2 absolute z-max bg-near-black`, {
      [`${styles.tooltipContainerTop} mb2`]: top,
      [`${styles.tooltipContainerLeft} mr2`]: !top,
    })

    return (
      <div className={classes}>
        <div className="pa2">
          {title &&
            <div className="mb3">
              <span className="t-action b ttu c-on-base--inverted">
                {title}
              </span>
            </div>
          }
          {children}
        </div>
      </div>
    )
  }
}

Tooltip.propTypes = {
  /** Title to appear into the Tooltip */
  title: PropTypes.string,
  /** Children to appear inside the Tooltip */
  children: PropTypes.object.isRequired,
  /** Set the tooltip position */
  top: PropTypes.bool,
}
