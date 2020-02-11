import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import debounce from 'debounce'
import EventListener from 'react-event-listener'
import { constants } from '../utils'
import resolveSlidesNumber from '../utils/resolveSlidesNumber'
import styles from './styles.css'

class Dots extends PureComponent {
  static propTypes = {
    /** Classes to style the elements fo the component */
    classes: PropTypes.shape({
      root: PropTypes.string,
      dot: PropTypes.string,
      activeDot: PropTypes.string,
      notActiveDot: PropTypes.string,
    }),
    /** Current slide on the screen, if you have perPage > 1, then the current slide is the most left slide on the screen */
    currentSlide: PropTypes.number,
    /** Extra props to be applied to the dot element */
    dotProps: PropTypes.object,
    /** The size of the dots, can be a number (in this case it will use px unit), or a string (you have to pass the number with the unit e.g '3rem') */
    dotSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /** Tag to be rendered in the dot element */
    dotTag: PropTypes.string,
    /** If the slides should be looping */
    loop: PropTypes.bool,
    /** Function to change the currentSlide */
    onChangeSlide: PropTypes.func.isRequired,
    /** This prop works the same way the minPerPage of Slider and this component should receive the same value of Slider */
    minPerPage: PropTypes.number,
    /** This prop works the same way the perPage of Slider and this component should receive the same value of Slider */
    perPage: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    /** Debounce time in milliseconds. */
    resizeDebounce: PropTypes.number,
    /** Tag of root element of the component to be rendered */
    rootTag: PropTypes.string,
    /** Total value of sliders that will be rendered */
    totalSlides: PropTypes.number.isRequired,
    /** If this flag is true, then every dot represent a page of slides (e.g. if perPage = 2 and you have 4 elements,
     * then you have 2 dots), if false, then it will render a dot to every slide */
    showDotsPerPage: PropTypes.bool,
  }

  static defaultProps = {
    classes: {
      root: '',
      dot: '',
      activeDot: '',
      notActiveDot: '',
    },
    dotTag: 'li',
    loop: false,
    perPage: 1,
    rootTag: 'ul',
    showDotsPerPage: false,
    resizeDebounce: constants.defaultResizeDebounce,
  }

  constructor(props) {
    super(props)

    this.handleResize = debounce(this._setPerPageOnResize, props.resizeDebounce)
  }

  get slideIndeces() {
    const { showDotsPerPage, totalSlides } = this.props
    return this.perPage
      ? [
          ...Array(
            showDotsPerPage
              ? Math.ceil(totalSlides / this.perPage)
              : totalSlides
          ).keys(),
        ]
      : []
  }

  get selectedDot() {
    const { showDotsPerPage, currentSlide, loop } = this.props
    const realCurrentSlide = loop ? currentSlide - this.perPage : currentSlide
    return showDotsPerPage
      ? Math.floor(realCurrentSlide / this.perPage)
      : realCurrentSlide
  }

  handleDotClick = index => {
    const { showDotsPerPage, onChangeSlide, loop } = this.props
    const slideToGo = showDotsPerPage ? index * this.perPage : index
    onChangeSlide(loop ? slideToGo + this.perPage : slideToGo)
  }

  componentWillUnmount() {
    this.handleResize.clear()
  }

  _setPerPageOnResize = () => {
    const { minPerPage, perPage } = this.props
    this.perPage = resolveSlidesNumber(minPerPage, perPage)
    this.forceUpdate()
  }

  render() {
    const {
      rootTag: RootTag,
      dotTag: DotTag,
      classes: classesProp,
      dotProps,
      minPerPage,
      perPage,
      totalSlides,
      dotSize,
    } = this.props

    const classes = {
      ...Dots.defaultProps.classes,
      ...classesProp,
    }

    if (totalSlides < 2) {
      return null
    }

    if (!this.perPage) {
      this.perPage = resolveSlidesNumber(minPerPage, perPage)
    }

    return (
      <RootTag
        className={classnames(
          styles.dotsContainer,
          classes.root,
          'absolute ma0 pa0 dib list'
        )}
      >
        <EventListener target="window" onResize={this.handleResize} />
        {this.slideIndeces.map(i => {
          const dotClasses = classnames(classes.dot, 'dib', {
            [classes.activeDot]: i === this.selectedDot,
            [classes.notActiveDot]: i !== this.selectedDot,
          })

          return (
            <DotTag
              className={dotClasses}
              key={i}
              onClick={() => this.handleDotClick(i)}
              {...{ style: { height: dotSize, width: dotSize } }}
              {...dotProps}
            />
          )
        })}
      </RootTag>
    )
  }
}

export default Dots
