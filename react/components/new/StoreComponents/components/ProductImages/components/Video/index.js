import React from 'react'
import PropTypes from 'prop-types'
import { match, compose, isEmpty, complement } from 'ramda'

import Vimeo from './Vimeo'
import YouTube from './Youtube'

import useCssHandles from '../../../../../CssHandles/useCssHandles'

const isNotEmpty = complement(isEmpty)

const isVimeo = compose(isNotEmpty, match(/vimeo/))
const isYoutube = compose(isNotEmpty, match(/youtube|youtu.be/)) 

const CSS_HANDLES = ['productVideo', 'videoContainer', 'video']

export function getThumbUrl(url, thumbWidth) {
  if (isVimeo(url)) {
    return Vimeo.getThumbUrl(url, thumbWidth)
  }

  else if (isYoutube(url)) {
    return YouTube.getThumbUrl(url, thumbWidth)
  }
}

function Video(props) {
  const { url } = props
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className={handles.productVideo}>
      {isVimeo(url) && <Vimeo {...props} cssHandles={handles} />}
      {isYoutube(url) && <YouTube {...props} cssHandles={handles} />}
    </div>
  )
}

Video.propsTypes = {
  url: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  setThumb: PropTypes.func,
  thumbWidth: PropTypes.number,
  className: PropTypes.string,
  play: PropTypes.bool,
}

export default Video
