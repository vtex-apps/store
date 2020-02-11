import React from 'react'
import styles from '../styles.css'

const Popover = ({ children, mirrorTooltipToRight }) => (
  <div
    className={`${styles.box} z-max absolute`}
    style={mirrorTooltipToRight ? { left: 50 } : { right: -50 }}
  >
    <div
      className={`${styles.arrowUp} absolute top-0 ${
        mirrorTooltipToRight ? 'left-0 ml3' : 'right-0 mr3'
      } shadow-3 bg-base rotate-45 h2 w2`}
    />
    <div className={`${styles.contentContainer} shadow-3 mt3`}>{children}</div>
  </div>
)

export default Popover
