import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import styles from './Container.css'

const render = ({ className, children, ...props }, ref) => {
  const classes = classNames(
    styles.container,
    'ph3 ph5-m ph2-xl mw9 center',
    className
  )

  return (
    <section {...props} className={classes} ref={ref}>
      {children}
    </section>
  )
}

render.displayName = 'Container'

const Container = React.forwardRef(render)

Container.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}

export default Container
