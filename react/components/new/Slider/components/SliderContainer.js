import React, { PureComponent } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

class SliderContainerComponent extends PureComponent {
  intervalRef = null

  setNewInterval = () => {
    const { autoplay, autoplayInterval, onNextSlide } = this.props

    if (
      !autoplay ||
      typeof autoplayInterval !== 'number' ||
      autoplayInterval === 0
    ) {
      return
    }

    if (this.intervalRef) {
      clearInterval(this.intervalRef)
    }

    this.intervalRef = setInterval(() => {
      onNextSlide && onNextSlide()
    }, autoplayInterval)
  }

  componentDidMount() {
    if (this.props.autoplay && this.props.autoplayInterval > 0) {
      this.setNewInterval()
    }
  }

  componentWillUnmount() {
    clearInterval(this.intervalRef)
  }

  eventProcedure = (e, eventCallback, clearOnPause = true) => {
    const { pauseOnHover } = this.props
    if (pauseOnHover) {
      clearOnPause ? clearInterval(this.intervalRef) : this.setNewInterval()
    }
    if (eventCallback) {
      eventCallback(e)
    }
  }

  onTouchStart = e => {
    this.eventProcedure(e, this.props.onTouchStart)
  }

  onTouchEnd = e => {
    this.eventProcedure(e, this.props.onTouchEnd, false)
  }

  onMouseEnter = e => {
    this.eventProcedure(e, this.props.onMouseEnter)
  }

  onMouseLeave = e => {
    this.eventProcedure(e, this.props.onMouseLeave, false)
  }

  render() {
    const {
      className,
      children,
      tag: RootTag,
      innerRef,
      onMouseEnter,
      onMouseLeave,
      onTouchStart,
      onTouchEnd,
      onNextSlide,
      pauseOnHover,
      autoplay,
      autoplayInterval,
      ...otherProps
    } = this.props

    return (
      <RootTag
        ref={innerRef}
        className={classnames(className, 'relative')}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onTouchStart={this.onTouchStart}
        onTouchEnd={this.onTouchEnd}
        {...otherProps}
      >
        {children}
      </RootTag>
    )
  }
}

const renderForwardRef = (props, ref) => (
  <SliderContainerComponent innerRef={ref} {...props} />
)
renderForwardRef.displayName = 'SliderContainer'
const SliderContainer = React.forwardRef(renderForwardRef)

SliderContainer.propsTypes = {
  /** If the slider should be passing automatically */
  autoplay: PropTypes.boolean,
  /** Time in milliseconds of the interval to pass from a slider to the next one */
  autoplayInterval: PropTypes.number,
  /** Children of the component to render */
  children: PropTypes.node.isRequired,
  /** Classes to be applied to the root element */
  className: PropTypes.string,
  /** Function to go to the next slide */
  onNextSlide: PropTypes.func,
  /** If the interval should not be executed if the mouse is on the component */
  pauseOnHover: PropTypes.boolean,
  /** Tag to render the component */
  tag: PropTypes.string,
}

SliderContainer.defaultProps = {
  autoplay: false,
  autoplayInterval: 5000,
  pauseOnHover: true,
  tag: 'div',
}

export default SliderContainer
