import React, { PureComponent } from 'react'
import EventListener from 'react-event-listener'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import debounce from 'debounce'
import styles from './styles.css'
import { constants } from '../utils'

class SlideComponent extends PureComponent {
  constructor(props) {
    super(props)
    this.imgRef = React.createRef()
    this.handleResize = debounce(() => {
      setTimeout(() => {
        this.fit()
      }, props.sliderTransitionDuration)
    }, props.resizeDebounce)

    this.state = {
      firstRender: true
    }
  }

  componentDidMount() {
    this.ensureImageCover()
    this.setState({ firstRender: false })
  }

  componentDidUpdate() {
    this.ensureImageCover()
  }

  componentWillUnmount() {
    this.handleResize.clear()
  }

  fit = () => {
    const { current: imgElement } = this.imgRef

    if (!imgElement || !imgElement.complete) {
      return
    }

    const imgAspectRatio = imgElement.width / imgElement.height
    const parentAspectRatio = imgElement.parentNode.offsetWidth / imgElement.parentNode.offsetHeight

    if (imgAspectRatio > parentAspectRatio) {
      imgElement.classList.remove('w-100')
      imgElement.classList.add('h-100')
    } else {
      imgElement.classList.remove('h-100')
      imgElement.classList.add('w-100')
    }
    imgElement.removeEventListener('load', this.fit)
  }

  ensureImageCover = () => {
    const { current: imgElement } = this.imgRef
    if (!imgElement || !this.props.fitImg) {
      return
    }

    if (imgElement.complete) {
      this.fit()
    } else {
      imgElement.addEventListener('load', this.fit)
    }
  }

  render() {
    const {
      children,
      className,
      tag: RootComponent,
      fitImg,
      innerRef,
      resizeDebounce,
      defaultWidth,
      style,
      sliderTransitionDuration,
      ...rootProps
    } = this.props

    return (
      <RootComponent
        ref={innerRef}
        className={classnames(className, 'inline-flex h-100 relative overflow-hidden')}
        style={{ ...style }}
        {...rootProps}
      >
        <EventListener target="window" onResize={this.handleResize} />
        {React.Children.map(children, child => {
          if (!React.isValidElement(child)) {
            return null
          }
          if (fitImg && child.type === 'img') {
            return React.cloneElement(child, {
              ref: this.imgRef,
              className: classnames(styles.slideImg, child.props.className, 'absolute')
            })
          }

          return child
        })}
      </RootComponent>
    )
  }
}

const renderForwardRef = (props, ref) => <SlideComponent innerRef={ref} {...props} />

renderForwardRef.displayName = 'Slide'

const Slide = React.forwardRef(renderForwardRef)

Slide.propTypes = {
  /** Node to render */
  children: PropTypes.node.isRequired,
  /** Classes to pass to root of slider */
  className: PropTypes.string,
  /** Default width of root in px */
  defaultWidth: PropTypes.number,
  /** Tag to be rendered in root element */
  tag: PropTypes.string,
  /** If the slide component should try to fit the img (only works if children is an img element) */
  fitImg: PropTypes.bool,
  /** Time of debounce of resize event listener */
  resizeDebounce: PropTypes.number,
  /** Duration of transition passed to Slider (must be the same), if nothing is passed to any of the components
   * it will apply the same default value
   */
  sliderTransitionDuration: PropTypes.number
}

Slide.defaultProps = {
  tag: 'li',
  fitImg: true,
  resizeDebounce: constants.defaultResizeDebounce,
  sliderTransitionDuration: constants.defaultTransitionDuration
}

export default Slide
