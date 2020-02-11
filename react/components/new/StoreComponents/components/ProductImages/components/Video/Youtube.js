import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Youtube extends Component {
  constructor(props) {
    super(props)

    const { loop, autoplay, title, url } = this.props
    const params = `autoplay=${autoplay}&loop=${loop}&title=${title}&enablejsapi=1&iv_load_policy=3&modestbranding=1`
    const videoId = Youtube.extractVideoID(url)

    this.iframeRef = React.createRef()
    this.state = {
      iframe: {
        src: `https://www.youtube.com/embed/${videoId}?${params}`,
      }
    }
  }

  static getThumbUrl = (url) => {
    const videoId = Youtube.extractVideoID(url)
    return Promise.resolve(`https://img.youtube.com/vi/${videoId}/default.jpg`)
  }

  static extractVideoID = url => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
    const match = url.match(regExp)
    if (match && match[7].length === 11) return match[7]
    return null
  }

  executeCommand = command => () => {
    if (!this.frameReady) return

    const youtubeCommand = JSON.stringify({ event: 'command', func: command })
    this.iframeRef.contentWindow.postMessage(
      youtubeCommand,
      'https://www.youtube.com'
    )
  }

  render() {
    const { iframe } = this.state
    const { className, id, cssHandles } = this.props

    this.props.playing
      ? this.executeCommand('playVideo')()
      : this.executeCommand('pauseVideo')()

    return (
      <div
        className={`relative ${className} ${cssHandles.videoContainer}`}
        style={{ padding: '30%' }}
      >
        <iframe
          ref={this.iframeRef}
          title={id}
          className={`${cssHandles.video} absolute top-0 left-0 w-100 h-100`}
          src={iframe.src}
          frameBorder="0"
          allowFullScreen
          allow="autoplay"
        />
      </div>
    )
  }
}

Youtube.propTypes = {
  url: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired, // Unique ID for iframe title
  setThumb: PropTypes.func,
  thumbWidth: PropTypes.number,
  className: PropTypes.string,
  loop: PropTypes.bool,
  autoplay: PropTypes.bool,
  showTitle: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
  playing: PropTypes.bool,
  title: PropTypes.string,
}

Youtube.defaultProps = {
  loop: true,
  autoplay: false,
  width: null,
  height: null,
  title: false,
  className: '',
}

export default Youtube
