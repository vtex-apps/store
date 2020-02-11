import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

/**
 * Dots component. It's an overriden component of react-slick that controls
 * the slide transition;
 */
export default class Dots extends Component {
  render() {
    const { className, style, dots, cssClass, customClass } = this.props
    const dotsClasses = classNames([className, cssClass, customClass])

    return (
      <div className={dotsClasses}>
        <ul className="ma0 pa0" style={{ ...style }}>
          {dots}
        </ul>
      </div>
    )
  }
}

Dots.propTypes = {
  /** (react-slick prop) Css class of the element. */
  className: PropTypes.string,
  /** Dots custom classes passed by props. */
  customClass: PropTypes.string,
  /** (react-slick prop) Custom style of the element. */
  style: PropTypes.object,
  /** (react-slick prop) Dots that will be displayed */
  dots: PropTypes.node.isRequired,
  /** Specifies wich css the dots will receive. */
  cssClass: PropTypes.string.isRequired,
}
