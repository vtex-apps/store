import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Slider from 'react-slick'
import ReactResizeDetector from 'react-resize-detector'
import { NoSSR } from 'vtex.render-runtime'

import Dots from './components/Dots'
import Arrow from './components/Arrow'

import getItemsPerPage from './utils/ItemsPerPage'

import './global.css'
import slider from './slider.css'

const VTEXClasses = {
  ARROW_RIGHT_CLASS: `${slider.arrowRight}`,
  ARROW_LEFT_CLASS: `${slider.arrowLeft}`,
  DOTS_CLASS: `${slider.dots}`,
}

/**
 * Slick Slider Component.
 */
export default class SlickSlider extends Component {
  static propTypes = {
    /** Array of items to be rendered inside the slider. */
    children: PropTypes.array.isRequired,
    /** Slider settings. */
    sliderSettings: PropTypes.object,
    /** Makes the items per page to adapt by the slider width. */
    adaptToScreen: PropTypes.bool,
    /** Default item width, it's necessary when the adaptToScreen is true. */
    defaultItemWidth: PropTypes.number,
    /** If the scroll of items is by page or not. */
    scrollByPage: PropTypes.bool,
    /** SSR fallback. */
    ssrFallback: PropTypes.element,
    /** Left arrow custom classes */
    leftArrowClasses: PropTypes.string,
    /** Right arrow custom classes */
    rightArrowClasses: PropTypes.string,
    /** Dots custom classes */
    dotsClasses: PropTypes.string,
  }

  getSettings(slideWidth) {
    const {
      sliderSettings,
      adaptToScreen,
      scrollByPage,
      defaultItemWidth,
      children,
      leftArrowClasses,
      rightArrowClasses,
      dotsClasses,
    } = this.props
    const itemsPerPage = getItemsPerPage(
      this._slick,
      slideWidth,
      defaultItemWidth,
      sliderSettings.slidesToShow
    )
    const settings = { ...sliderSettings }
    const numItems = children.length

    settings.nextArrow = settings.nextArrow || (
      <Arrow
        customClasses={rightArrowClasses}
        cssClass={VTEXClasses.ARROW_RIGHT_CLASS}
      />
    )
    settings.prevArrow = settings.prevArrow || (
      <Arrow
        customClasses={leftArrowClasses}
        cssClass={VTEXClasses.ARROW_LEFT_CLASS}
      />
    )
    settings.appendDots = dots => (
      <Dots
        dots={dots}
        customClass={dotsClasses}
        cssClass={VTEXClasses.DOTS_CLASS}
      />
    )

    if (adaptToScreen) {
      settings.slidesToShow = itemsPerPage
    }

    if (scrollByPage) {
      settings.slidesToScroll = settings.slidesToShow
    }
    if (settings.infinite === undefined) {
      settings.infinite = settings.slidesToScroll < numItems
    }
    return settings
  }

  render() {
    const component = (
      <ReactResizeDetector handleWidth>
        {width => (
          <Slider
            {...this.getSettings(width)}
            ref={c => {
              this._slick = c
            }}
          >
            {this.props.children}
          </Slider>
        )}
      </ReactResizeDetector>
    )
    if (this.props.ssrFallback) {
      return <NoSSR onSSR={this.props.ssrFallback}>{component}</NoSSR>
    }
    return component
  }
}
