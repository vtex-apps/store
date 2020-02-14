import React, { FC } from 'react'
import useListContext from '../../ListContext/useListContext'
import useCssHandles from '../../CssHandles/useCssHandles'

import { useSliderState } from './SliderContext'

const CSS_HANDLES = ['sliderTrack', 'slide', 'slideChildrenContainer']

const SliderTrack: FC<{ totalItems: number }> = ({ children, totalItems }) => {
  const {
    transform,
    slideWidth,
    slidesPerPage,
    currentSlide,
    isOnTouchMove,
    slideTransition: { speed, timing, delay },
  } = useSliderState()
  const handles = useCssHandles(CSS_HANDLES)
  const { list } = useListContext()

  const childrenArray = React.Children.toArray(children).concat(list)

  const isSlideVisible = (
    index: number,
    currentSlide: number,
    slidesToShow: number
  ): boolean => {
    return index >= currentSlide && index < currentSlide + slidesToShow
  }

  return (
    <div
      className={`${handles.sliderTrack} flex justify-around relative pa0 ma0`}
      style={{
        transition: isOnTouchMove
          ? undefined
          : `transform ${speed}ms ${timing}`,
        transitionDelay: `${delay}ms`,
        transform: `translate3d(${transform}%, 0, 0)`,
        width:
          slidesPerPage < totalItems
            ? `${(totalItems * 100) / slidesPerPage}%`
            : '100%',
      }}
      aria-atomic="false"
      aria-live="polite"
    >
      {childrenArray.map((child, index) => (
        <div
          key={index}
          className={`flex relative ${handles.slide}`}
          data-index={index}
          style={{
            width: `${slideWidth}%`,
          }}
          aria-hidden={
            isSlideVisible(index, currentSlide, slidesPerPage)
              ? 'false'
              : 'true'
          }
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${totalItems}`}
        >
          <div
            className={`${handles.slideChildrenContainer} flex justify-center items-center w-100`}
          >
            {child}
          </div>
        </div>
      ))}
    </div>
  )
}

export default SliderTrack
