import { useSliderDispatch, useSliderState } from '../components/SliderContext'

export const useSliderControls = (infinite: boolean) => {
  const {
    currentSlide,
    slidesPerPage,
    slideWidth,
    totalItems,
    navigationStep,
  } = useSliderState()
  const dispatch = useSliderDispatch()

  const goBack = () => {
    let nextSlide = 0
    let nextTransformValue = 0

    const nextMaximumSlides = currentSlide - navigationStep

    if (nextMaximumSlides >= 0) {
      /** Have more slides hidden on left */
      nextSlide = nextMaximumSlides
      nextTransformValue = -(slideWidth * nextSlide)
    } else if (nextMaximumSlides < 0 && currentSlide !== 0) {
      /** Prevent overslide */
      nextSlide = 0
      nextTransformValue = 0
    } else if (infinite) {
      /** If reach start, go to last slide */
      nextSlide = totalItems - slidesPerPage
      nextTransformValue = -(slideWidth * nextSlide)
    }

    dispatch({
      type: 'SLIDE',
      payload: {
        transform: nextTransformValue,
        currentSlide: nextSlide,
      },
    })
  }

  const goForward = () => {
    let nextSlides = 0
    let nextPosition = 0

    const nextMaximumSlides = currentSlide + 1 + slidesPerPage + navigationStep

    if (nextMaximumSlides <= totalItems) {
      /** Have more slides hidden on right */
      nextSlides = currentSlide + navigationStep
      nextPosition = -(slideWidth * nextSlides)
    } else if (
      nextMaximumSlides > totalItems &&
      currentSlide !== totalItems - slidesPerPage
    ) {
      /** Prevent overslide */
      nextSlides = totalItems - slidesPerPage
      nextPosition = -(slideWidth * nextSlides)
    } else if (infinite) {
      /** if reach end go to first slide */
      nextSlides = 0
      nextPosition = -(slideWidth * nextSlides)
    }

    dispatch({
      type: 'SLIDE',
      payload: {
        transform: nextPosition,
        currentSlide: nextSlides,
      },
    })
  }

  return { goForward, goBack }
}
