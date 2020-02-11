import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ANIMATIONS } from './animation'

const ANIMATION_TRANSFER = 110
const ANIMATION_TRANSFER_ENTER = 0
const ANIMATION_TIME = 0.4

/**
 * Animation component
 */
export default class Animation extends Component {
  static propTypes = {
    /* Object to be animated */
    children: PropTypes.node.isRequired,
    /* Active the animation */
    isActive: PropTypes.bool,
    /* Classname to the animation */
    className: PropTypes.string,
    /* Type of animation */
    type: PropTypes.oneOf([
      'drawerLeft',
      'drawerRight',
      'drawerTop',
      'drawerBottom',
    ]),
    /* The animation's duration in seconds */
    duration: PropTypes.number,
    /* The active animation deslocation in percentage */
    transfer: PropTypes.number,
    /* The not active animation deslocation in percentage */
    transferEnter: PropTypes.number,
  }

  static defaultProps = {
    className: '',
    type: 'drawerLeft',
    duration: ANIMATION_TIME,
    transfer: ANIMATION_TRANSFER,
    transferEnter: ANIMATION_TRANSFER_ENTER,
  }

  get animation() {
    const { isActive, type, duration, transfer, transferEnter } = this.props
    let animation = ANIMATIONS[type]
    if (isActive) {
      animation = animation['from'](duration, transferEnter)
    } else {
      animation = animation['leave'](duration, transfer)
    }
    return animation
  }

  render() {
    const { className, children } = this.props

    return (
      <div className={className} style={this.animation}>
        {children}
      </div>
    )
  }
}
