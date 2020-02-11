import React, { PureComponent, Fragment } from 'react'
import debounce from 'debounce'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import EventListener from 'react-event-listener'
import styles from './styles.css'
import resolveSlidesNumber from '../utils/resolveSlidesNumber'
import withDevice from '../../DeviceDetector/withDevice'

import {
  getStylingTransition,
  getTranslateProperty,
  setStyle,
  constants,
} from '../utils'

class Slider extends PureComponent {
  static propTypes = {
    /** A render function that will receive as props an orientation prop
     * and a onClick callback */
    arrowRender: PropTypes.func,
    /** The component used to contain both arrows.
     * Either a string to use a DOM element or a component.
     */
    arrowsContainerComponent: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string,
    ]),
    /** The slides to render */
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element),
    ]),
    /** Classes to apply to the Slider elements */
    classes: PropTypes.shape({
      root: PropTypes.string,
      sliderFrame: PropTypes.string,
    }),
    /** Current slide on the screen (if you have perPage > 1, then the current slide is the most left slide on the screen) */
    currentSlide: PropTypes.number,
    /** Css value of cursor when mouse is hovering the slider frame */
    cursor: PropTypes.string,
    /** Css value of cursos when mouse is down */
    cursorOnMouseDown: PropTypes.string,
    // TODO draggable: PropTypes.bool,
    /** Duration of transitions */
    duration: PropTypes.number,
    /** Transition function */
    easing: PropTypes.string,
    /** If the slides should be looping */
    loop: PropTypes.bool,
    /** Function to change the value of currentSlide */
    onChangeSlide: PropTypes.func.isRequired,
    /** Minimum amount of slides to be on the screen */
    minPerPage: PropTypes.number,
    /** Amount of slides to be on the screen, if a number is passed, then thats the slides that will be shown,
     * if an object with breakpoints is passed, then the component will check the size of the screen to see how
     * many elements will be on the screen
     */
    perPage: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    /** Resize debounce timer in milliseconds */
    resizeDebounce: PropTypes.number,
    /** Tag to be rendered in the root element of the page */
    rootTag: PropTypes.string,
    /** Tag to be rendered in the slider frame */
    sliderFrameTag: PropTypes.string,
    /** Threshold of pixels to drag to the slider let it go to the next/prev slide */
    threshold: PropTypes.number,
    /** If should scroll by page or one item at a time */
    scrollByPage: PropTypes.bool,
    /** Check if on mobile using vtex.device-detector */
    isMobile: PropTypes.bool,
    draggable: PropTypes.bool,
    navigationStep: PropTypes.oneOfType([
      PropTypes.oneOf([constants.NAVIGATION_PAGE]),
      PropTypes.number,
    ]),
  }

  static defaultProps = {
    classes: {
      root: '',
      sliderFrame: '',
    },
    currentSlide: 0,
    cursor: 'default',
    cursorOnMouseDown: 'default',
    draggable: false,
    duration: 250,
    easing: 'ease-out',
    loop: false,
    perPage: 1,
    resizeDebounce: constants.defaultResizeDebounce,
    rootTag: 'div',
    showArrows: false,
    sliderFrameTag: 'ul',
    threshold: 50,
    scrollByPage: false,
    navigationStep: 'page',
  }

  static events = [
    'onTouchStart',
    'onTouchEnd',
    'onTouchMove',
    'onMouseUp',
    'onMouseDown',
    'onMouseLeave',
    'onMouseMove',
  ]

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.currentSlide !== prevState.currentSlide) {
      const { currentSlide, children } = nextProps
      const perPage = resolveSlidesNumber(
        nextProps.minPerPage,
        nextProps.perPage,
        nextProps.isMobile
      )
      const currentSlideIsClone =
        currentSlide < perPage ||
        currentSlide >= React.Children.count(children) + perPage
      return {
        currentSlide: currentSlideIsClone
          ? prevState.currentSlide
          : currentSlide,
        enableTransition: !currentSlideIsClone,
      }
    }

    return null
  }

  constructor(props) {
    super(props)

    this.drag = {
      startX: 0,
      endX: 0,
      startY: 0,
      letItGo: null,
    }

    this._selector = React.createRef()
    this._sliderFrame = React.createRef()
    this._sliderFrameWidth = 0
    this.handleResize = debounce(this.fit, props.resizeDebounce)
    this.perPage = resolveSlidesNumber(
      props.minPerPage,
      props.perPage,
      props.isMobile
    )

    this.state = {
      firstRender: true,
      currentSlide: props.currentSlide,
      enableTransition: false,
      dragDistance: 0,
    }
  }

  componentDidMount() {
    const { onChangeSlide, currentSlide, loop } = this.props
    let stateCurrentSlide = currentSlide
    if (loop) {
      if (this.isNegativeClone(currentSlide)) {
        onChangeSlide(currentSlide + this.perPage)
        stateCurrentSlide += this.perPage
      } else if (this.isPositiveClone(currentSlide)) {
        const mirrorIndex =
          this.childrenLength + this.perPage - currentSlide - 1
        onChangeSlide(mirrorIndex)
      }
    }
    this.setState({
      firstRender: false,
      currentSlide: stateCurrentSlide,
    })
  }

  componentWillUnmount() {
    this.handleResize.clear()
  }

  componentDidUpdate() {
    const newState = {
      currentSlide: this.state.currentSlide,
      dragDistance: 0,
      enableTransition: true,
    }

    if (this.props.currentSlide !== this.state.currentSlide) {
      const { currentSlide } = this.state
      const { onChangeSlide } = this.props
      if (this.isNegativeClone(currentSlide)) {
        newState.currentSlide = currentSlide + this.perPage
        onChangeSlide(newState.currentSlide)
      } else if (this.isPositiveClone(currentSlide)) {
        newState.currentSlide = this.totalSlides - currentSlide
        onChangeSlide(newState.currentSlide)
      } else {
        onChangeSlide(currentSlide)
      }
      this.setState(newState)
    } else if (this.state.dragDistance) {
      this.setState(newState)
    }

    this.setSelectorWidth()
    this.setInnerElements()
    this.perPage = resolveSlidesNumber(
      this.props.minPerPage,
      this.props.perPage,
      this.props.isMobile
    )
    this._sliderFrameWidth = this._sliderFrame.current.getBoundingClientRect().width
  }

  isNegativeClone = index => {
    return index < this.perPage
  }

  isPositiveClone = index => {
    return index >= this.childrenLength + this.perPage
  }

  getNegativeClone = index => {
    return index - this.childrenLength
  }

  getPositiveClone = index => {
    return index + this.childrenLength
  }

  fit = () => {
    const { minPerPage, perPage, currentSlide, onChangeSlide } = this.props
    this.perPage = resolveSlidesNumber(minPerPage, perPage, this.props.isMobile)
    const newCurrentSlide =
      Math.floor(currentSlide / this.perPage) * this.perPage

    this.setSelectorWidth()
    this._sliderFrameWidth = this._sliderFrame.current.getBoundingClientRect().width

    if (currentSlide !== newCurrentSlide) {
      this.setState({
        currentSlide: newCurrentSlide,
        enableTransition: false,
      })
      onChangeSlide(newCurrentSlide)
    }
    this.forceUpdate()
  }

  setSelectorWidth = () => {
    this.selectorWidth = this._selector.current.getBoundingClientRect().width
  }

  setInnerElements = () => {
    this.innerElements = Array.prototype.slice.call(
      this._sliderFrame.current.children
    )
  }

  get totalSlides() {
    const { children } = this.props

    if (children) {
      const totalChildren = React.Children.count(children)
      return totalChildren + (this.shouldAddClones ? 2 * this.perPage : 0)
    }

    return 0
  }

  get childrenLength() {
    return this.props.children ? React.Children.count(this.props.children) : 0
  }

  prev = (howManySlides = 1, dragDistance = 0) => {
    const howManyInt = Number.parseInt(howManySlides)
    const { onChangeSlide, currentSlide, loop } = this.props
    let newCurrentSlide = Number.parseInt(currentSlide)
    let stateCurrentSlide
    let enableTransition = true

    if (this.totalSlides <= this.perPage) {
      return
    }

    if (loop) {
      if (this.isNegativeClone(currentSlide - howManyInt)) {
        newCurrentSlide = this.getPositiveClone(currentSlide)
        enableTransition = false
        stateCurrentSlide = newCurrentSlide - howManyInt
      } else {
        newCurrentSlide = currentSlide - howManyInt
        stateCurrentSlide = newCurrentSlide
      }
    } else {
      newCurrentSlide = Math.max(currentSlide - howManyInt, 0)
      stateCurrentSlide = newCurrentSlide
    }

    if (newCurrentSlide !== currentSlide) {
      this.setState({
        enableTransition,
        currentSlide: stateCurrentSlide,
        dragDistance,
      })
      onChangeSlide(newCurrentSlide)
    }
  }

  next = (howManySlides = 1, dragDistance = 0) => {
    const howManyInt = Number.parseInt(howManySlides)
    const { onChangeSlide, currentSlide, loop } = this.props
    let newCurrentSlide = Number.parseInt(currentSlide)
    let stateCurrentSlide
    let enableTransition = true

    if (this.totalSlides <= this.perPage) {
      return
    }

    if (loop) {
      if (this.isPositiveClone(currentSlide + howManyInt)) {
        newCurrentSlide = this.getNegativeClone(currentSlide)
        enableTransition = false
        stateCurrentSlide = newCurrentSlide + howManyInt
      } else {
        newCurrentSlide = currentSlide + howManyInt
        stateCurrentSlide = newCurrentSlide
      }
    } else {
      newCurrentSlide = Math.min(
        currentSlide + howManyInt,
        this.totalSlides - this.perPage
      )
      stateCurrentSlide = newCurrentSlide
    }

    if (newCurrentSlide !== currentSlide) {
      this.setState({
        enableTransition,
        currentSlide: stateCurrentSlide,
        dragDistance,
      })
      onChangeSlide(newCurrentSlide)
    }
  }

  prevPage = () => {
    this.prev(this.perPage)
  }

  nextPage = () => {
    this.next(this.perPage)
  }

  updateAfterDrag = () => {
    const { threshold } = this.props
    const movement = this.drag.endX - this.drag.startX
    const movementDistance = Math.abs(movement)
    const howManySlidesToSlide = Math.ceil(
      movementDistance / (this.selectorWidth / this.perPage)
    )
    const dragDistance = (movement / this._sliderFrameWidth) * 100
    if (
      movement > 0 &&
      movementDistance > threshold &&
      this.totalSlides > this.perPage
    ) {
      this.prev(howManySlidesToSlide, dragDistance)
    } else if (
      movement < 0 &&
      movementDistance > threshold &&
      this.totalSlides > this.perPage
    ) {
      this.next(howManySlidesToSlide, dragDistance)
    } else {
      const { easing, duration, currentSlide } = this.props

      this.setState({ enableTransition: true, dragDistance: 0 })
      setStyle(this._sliderFrame.current, {
        ...getStylingTransition(easing, duration),
        ...getTranslateProperty((currentSlide / this.totalSlides) * -100),
      })
    }
  }

  _clearDrag = () => {
    this.drag = {
      startX: 0,
      endX: 0,
      startY: 0,
      letItGo: null,
    }
  }

  onTouchStart = e => {
    this.pointerDown = true
    this.drag.startX = e.touches[0].pageX
    this.drag.startY = e.touches[0].pageY
    this.setState({ enableTransition: false })
  }

  onTouchEnd = () => {
    this.pointerDown = false
    if (this.drag.endX) {
      this.updateAfterDrag()
    }
    this._clearDrag()
  }

  onTouchMove = e => {
    if (this.drag.letItGo === null) {
      this.drag.letItGo =
        Math.abs(this.drag.startY - e.touches[0].pageY) <
        Math.abs(this.drag.startX - e.touches[0].pageX)
    }

    if (this.pointerDown && this.drag.letItGo) {
      const { currentSlide } = this.props

      this.drag.endX = e.touches[0].pageX

      const currentOffset = currentSlide * (this.selectorWidth / this.perPage)
      const dragOffset = this.drag.endX - this.drag.startX
      const offset =
        ((currentOffset - dragOffset) / this._sliderFrameWidth) * -100

      setStyle(this._sliderFrame.current, {
        ...getTranslateProperty(offset),
      })
    }
  }

  onMouseDown = e => {
    const { cursorOnMouseDown } = this.props
    e.preventDefault()
    this.pointerDown = true
    this.drag.startX = e.pageX

    setStyle(this._sliderFrame.current, {
      cursor: cursorOnMouseDown,
    })

    this.setState({ enableTransition: false })
  }

  onMouseUp = () => {
    const { cursor } = this.props

    this.pointerDown = false
    setStyle(this._sliderFrame.current, { cursor })
    if (this.drag.endX) {
      this.updateAfterDrag()
    }

    this._clearDrag()
  }

  onMouseMove = e => {
    const { currentSlide, draggable, cursorOnMouseDown } = this.props
    e.preventDefault()
    if (this.pointerDown && draggable) {
      // TODO prevent link clicks
      this.drag.endX = e.pageX

      const currentOffset = currentSlide * (this.selectorWidth / this.perPage)
      const dragOffset = this.drag.endX - this.drag.startX
      const offset =
        ((currentOffset - dragOffset) / this._sliderFrameWidth) * -100
      setStyle(this._sliderFrame.current, {
        cursor: cursorOnMouseDown,
        ...getTranslateProperty(offset),
      })
    }
  }

  onMouseLeave = e => {
    if (this.pointerDown) {
      const { cursor, draggable } = this.props
      this.pointerDown = false
      this.drag.endX = e.pageX

      if (draggable) {
        setStyle(this._sliderFrame.current, { cursor })
      }
      this.updateAfterDrag()
      this._clearDrag()
    }
  }

  getSlidesToSlide = () => {
    const { navigationStep, scrollByPage } = this.props

    if (typeof navigationStep === 'number') {
      return navigationStep
    }

    if (navigationStep === constants.NAVIGATION_PAGE || scrollByPage) {
      return this.perPage
    }

    return 1
  }

  renderArrows = () => {
    const {
      arrowsContainerComponent: ArrowsContainerComponent,
      arrowRender,
    } = this.props

    if (!arrowRender) {
      return null
    }

    const slidesToSlide = this.getSlidesToSlide()

    const arrows = (
      <Fragment>
        {arrowRender({
          orientation: 'left',
          onClick: () => this.prev(slidesToSlide),
        })}
        {arrowRender({
          orientation: 'right',
          onClick: () => this.next(slidesToSlide),
        })}
      </Fragment>
    )
    return ArrowsContainerComponent ? (
      <ArrowsContainerComponent>{arrows}</ArrowsContainerComponent>
    ) : (
      arrows
    )
  }

  renderChild = child => {
    return React.cloneElement(child, {
      style: {
        ...(child.props.style ? child.props.style : {}),
        width: this.isMultiPage
          ? `${100 / this.totalSlides}%`
          : `${100 / this.perPage}%`,
      },
    })
  }

  get isMultiPage() {
    return this.childrenLength > this.perPage
  }

  get shouldAddClones() {
    const { loop } = this.props
    const { firstRender } = this.state
    return !firstRender && loop && this.isMultiPage
  }

  render() {
    const {
      children,
      sliderFrameTag: SliderFrameTag,
      rootTag: RootTag,
      classes: classesProp,
      currentSlide,
      easing,
      duration,
      cursor,
      isMobile,
      minPerPage,
    } = this.props
    const { enableTransition, dragDistance, firstRender } = this.state
    const shouldCenterSlideOnMobile =
      minPerPage && !Number.isInteger(minPerPage)
    const CURRENT_SLIDE_CENTER_SHIFT =
      isMobile && shouldCenterSlideOnMobile ? 0.75 : 0

    const classes = {
      ...Slider.defaultProps.classes,
      ...classesProp,
    }

    const arrayChildren = React.Children.toArray(children)
    const sliderFrameWidth =
      this.perPage < this.childrenLength || firstRender
        ? (100 * this.totalSlides) / this.perPage
        : 100
    const sliderFrameStyle = {
      width: `${sliderFrameWidth}%`,
      ...(this.isMultiPage &&
        getTranslateProperty(
          ((currentSlide + CURRENT_SLIDE_CENTER_SHIFT) / this.totalSlides) *
            -100 +
            dragDistance
        )),
      ...getStylingTransition(easing, enableTransition ? duration : 0),
      ...(this.isMultiPage && { cursor }),
    }

    return (
      <Fragment>
        <div className={this.isMultiPage && !firstRender ? 'db' : 'dn'}>
          {this.renderArrows()}
        </div>
        <RootTag
          className={classnames(classes.root, 'overflow-hidden h-100')}
          ref={this._selector}
          {...(this.isMultiPage &&
            Slider.events.reduce(
              (props, event) => ({ ...props, [event]: this[event] }),
              {}
            ))}
        >
          <EventListener target="window" onResize={this.handleResize} />
          <SliderFrameTag
            className={classnames(
              classes.sliderFrame,
              styles.sliderFrame,
              { 'justify-center': !this.isMultiPage },
              'list pa0 h-100 ma0 flex'
            )}
            style={sliderFrameStyle}
            ref={this._sliderFrame}
          >
            {this.shouldAddClones &&
              React.Children.map(
                arrayChildren.slice(
                  children.length - this.perPage,
                  children.length
                ),
                this.renderChild
              )}
            {React.Children.map(arrayChildren, this.renderChild)}
            {this.shouldAddClones &&
              React.Children.map(
                arrayChildren.slice(0, this.perPage),
                this.renderChild
              )}
          </SliderFrameTag>
        </RootTag>
      </Fragment>
    )
  }
}

export default withDevice(Slider)
