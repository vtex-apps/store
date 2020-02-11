import React from 'react'
import Spinner from '../../Styleguide/Spinner'

import styles from '../styles.css'

function Loading() {
  return (
    <div className="bg-base relative">
      <div className={styles.loading}>
        <div className="w-100 tc c-emphasis pv8">
          <Spinner color="currentColor" size={32} />
        </div>
      </div>
    </div>
  )
}

export default Loading
