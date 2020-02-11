import React from 'react'
import classNames from 'classnames'
import { NoSSR, ExtensionPoint } from 'vtex.render-runtime'
import PropTypes from 'prop-types'
import {
  useSpring,
  animated,
  config as springPresets,
} from 'react-spring/web.cjs'
import useScrollDirection from '../hooks/useScrollDirection'
import Border from './Helpers/Border'
import { collapsible, lean } from '../defaults'

import styles from '../store-header.css'

/**
 * Represents a collapsible part of the header
 */
const Collapsible = ({ children, leanMode, collapsibleAnimation, mobile }) => {
  const { scroll, scrollingUp } = useScrollDirection()
  const {
    onScroll,
    anchor,
    always,
    from,
    to,
    preset,
    config,
  } = collapsibleAnimation

  let animationTrigger = true

  if (onScroll) {
    const animateWhen = scroll < anchor
    const elastic = always ? scrollingUp : false
    animationTrigger = animateWhen || elastic
  }

  const animationStyle =
    !!window.requestAnimationFrame && // Fix SSR Issues
    useSpring({
      config: preset ? springPresets[preset] : config,
      transform: animationTrigger
        ? `translate3d(0, ${to}rem, 0)`
        : `translate3d(0, ${-from}rem, 0)`,
    })

  const collapsibleClassnames = classNames(
    styles.topMenuCollapsible,
    'bg-base flex justify-center relative bb bw1 b--muted-4'
  )

  const fallback = <div className={collapsibleClassnames}>{children}</div>

  return (
    <React.Fragment>
      {!mobile && !leanMode ? (
        <NoSSR onSSR={fallback}>
          <animated.div
            className={collapsibleClassnames}
            style={{ ...animationStyle, zIndex: -2 }}
          >
            {children}
          </animated.div>
        </NoSSR>
      ) : (
        <Border />
      )}
      {mobile && !leanMode && (
        <ExtensionPoint id="user-address" variation="bar" />
      )}
    </React.Fragment>
  )
}

Collapsible.propTypes = {
  /** If it's mobile mode */
  mobile: PropTypes.bool.isRequired,
  ...lean.propTypes,
  ...collapsible.propTypes,
}

Collapsible.defaultProps = {
  ...lean.defaultProps,
  ...collapsible.defaultProps,
}

export default Collapsible
