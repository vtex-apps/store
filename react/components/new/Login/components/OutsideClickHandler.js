import React from 'react'
import PropTypes from 'prop-types'

const DISPLAY = {
  BLOCK: 'block',
  FLEX: 'flex',
  INLINE: 'inline',
  INLINE_BLOCK: 'inline-block',
  CONTENTS: 'contents',
}

const propTypes = {
  children: PropTypes.node.isRequired,
  onOutsideClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  useCapture: PropTypes.bool,
  display: PropTypes.oneOf(Object.values(DISPLAY)),
}

const defaultProps = {
  disabled: false,

  // `useCapture` is set to true by default so that a `stopPropagation` in the
  // children will not prevent all outside click handlers from firing - maja
  useCapture: true,
  display: DISPLAY.BLOCK,
}

export default class OutsideClickHandler extends React.Component {
  constructor(...args) {
    super(...args)

    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.setChildNodeRef = this.setChildNodeRef.bind(this)
  }

  componentDidMount() {
    const { disabled, useCapture } = this.props

    if (!disabled) this.addMouseDownEventListener(useCapture)
  }

  componentDidUpdate({ disabled: prevDisabled }) {
    const { disabled, useCapture } = this.props
    if (prevDisabled !== disabled) {
      if (disabled) {
        this.removeEventListeners()
      } else {
        this.addMouseDownEventListener(useCapture)
      }
    }
  }

  componentWillUnmount() {
    this.removeEventListeners()
  }

  // Use mousedown/mouseup to enforce that clicks remain outside the root's
  // descendant tree, even when dragged. This should also get triggered on
  // touch devices.
  onMouseDown(e) {
    const { useCapture } = this.props

    const isDescendantOfRoot =
      this.childNode && this.childNode.contains(e.target)
    if (!isDescendantOfRoot) {
      document.removeEventListener('mouseup', this.onMouseUp, { useCapture })
      document.addEventListener('mouseup', this.onMouseUp, { useCapture })
    }
  }

  // Use mousedown/mouseup to enforce that clicks remain outside the root's
  // descendant tree, even when dragged. This should also get triggered on
  // touch devices.
  onMouseUp(e) {
    const { onOutsideClick, useCapture } = this.props

    const isDescendantOfRoot =
      this.childNode && this.childNode.contains(e.target)
    document.removeEventListener('mouseup', this.onMouseUp, { useCapture })

    if (!isDescendantOfRoot) {
      onOutsideClick(e)
    }
  }

  setChildNodeRef(ref) {
    this.childNode = ref
  }

  addMouseDownEventListener(useCapture) {
    document.addEventListener('mousedown', this.onMouseDown, { useCapture })
  }

  removeEventListeners() {
    const { useCapture } = this.props
    document.removeEventListener('mousedown', this.onMouseDown, { useCapture })
    document.removeEventListener('mouseup', this.onMouseUp, { useCapture })
  }

  render() {
    const { children, display } = this.props

    return (
      <div
        ref={this.setChildNodeRef}
        style={
          display !== DISPLAY.BLOCK && Object.values(DISPLAY).includes(display)
            ? { display }
            : undefined
        }
      >
        {children}
      </div>
    )
  }
}

OutsideClickHandler.propTypes = propTypes
OutsideClickHandler.defaultProps = defaultProps
