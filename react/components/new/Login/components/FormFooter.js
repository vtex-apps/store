import React from 'react'
import PropTypes from 'prop-types'

import styles from '../styles.css'

export default function FormFooter({ children }) {
  return (
    <div className={`${styles.formFooter} bt b--muted-4 pt4 flex mt3`}>
      {children}
    </div>
  )
}

FormFooter.propTypes = {
  children: PropTypes.node,
}
