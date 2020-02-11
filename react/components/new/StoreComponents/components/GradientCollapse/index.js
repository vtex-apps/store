import React, { useState, useRef, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'
import { Transition } from 'react-transition-group'
import debounce from 'debounce'
import { FormattedMessage } from 'react-intl'
import classNames from 'classnames'
import styles from './styles.css'

const transitionStyle = transitionTime => ({
  transition: `${transitionTime}ms ease-in-out`,
})

const fadeBottomClasses = state =>
  classNames(styles.fadeBottom, { 'o-0': state === 'entered' }, 'w-100 h-50')
const pointerEventsAutoClasses = state =>
  classNames(
    styles.pointerEventsAuto,
    {
      'bg-transparent': state === 'entered',
      'bg-base': state != 'entered',
    },
    'tc w-100'
  )

function GradientCollapse(props) {
  const {
    children,
    collapseHeight,
    onCollapsedChange,
    collapsed: collapsedProp,
  } = props
  const [collapsed, setCollapsed] = useState(collapsedProp)
  const [prevCollapsedProp, setPrevCollapsedProp] = useState(collapsedProp)
  const [maxHeight, setMaxHeight] = useState('auto')
  const [collapseVisible, setCollapseVisible] = useState(true)
  const wrapper = useRef()

  if (prevCollapsedProp !== collapsedProp) {
    setCollapsed(collapsedProp)
    setPrevCollapsedProp(collapsedProp)
  }

  const calcMaxHeight = () => {
    const wrapperEl = wrapper.current
    // check if the content is smaller than the passed
    // height to collapse
    if (wrapperEl.scrollHeight > collapseHeight) {
      setMaxHeight(wrapperEl.scrollHeight + 60)
      setCollapseVisible(true)
    } else {
      setCollapseVisible(false)
      setMaxHeight('auto')
    }
  }

  const handleCollapsedChange = (e, newValue) => {
    setCollapsed(newValue)
    setPrevCollapsedProp(collapsedProp)

    if (onCollapsedChange) {
      onCollapsedChange(e, newValue)
    }
  }

  const debouncedCalcMaxHeight = debounce(calcMaxHeight, 500)
  useLayoutEffect(() => {
    window.addEventListener('resize', debouncedCalcMaxHeight)
    calcMaxHeight()
    return () => {
      window.removeEventListener('resize', debouncedCalcMaxHeight)
    }
  })

  const height = collapseVisible && collapsed ? collapseHeight : maxHeight
  const transitionTime = 600
  const fadeOutTime = 400

  const pointerEventsNoneClasses = classNames(
    styles.pointerEventsNone,
    { flex: collapseVisible, dn: !collapseVisible },
    'absolute bottom-0 w-100 h-100 flex-column justify-end'
  )

  return (
    <Transition timeout={transitionTime} in={!collapsed}>
      {state => (
        <div
          style={{
            ...transitionStyle(transitionTime),
            height,
            overflow: 'hidden',
            display: 'block',
          }}
          onTransitionEnd={calcMaxHeight}
          className="relative"
        >
          <div ref={wrapper} className="h-auto">
            {children}
          </div>
          <div className={pointerEventsNoneClasses}>
            <div
              style={transitionStyle(fadeOutTime)}
              className={fadeBottomClasses(state)}
            />
            <div className={pointerEventsAutoClasses(state)}>
              <button
                onClick={e => handleCollapsedChange(e, !collapsed)}
                className="c-action-primary t-action pointer ma5 bn outline-0"
              >
                {state === 'entered' || (collapsed && state !== 'exited') ? (
                  <FormattedMessage id="store/product-description.collapse.showLess" />
                ) : (
                    <FormattedMessage id="store/product-description.collapse.showMore" />
                  )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Transition>
  )
}

GradientCollapse.propTypes = {
  /** Maximum height collapsed */
  collapseHeight: PropTypes.number.isRequired,
  collapsed: PropTypes.bool,
  children: PropTypes.node,
  onCollapsedChange: PropTypes.func,
}

GradientCollapse.defaultProps = {
  collapsed: true,
}

export default GradientCollapse
