import React from 'react'
import PropTypes from 'prop-types'

import styles from '../styles.css'

export default function FormTitle({ children }) {
  return (
    <h3 className={`${styles.formTitle} t-body v-mid ttu tc relative pv2 ph3 br2`}>
      {children}
    </h3>
  )
}

FormTitle.propTypes = {
  children: PropTypes.node,
}

