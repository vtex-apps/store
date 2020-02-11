import React, { memo } from 'react'
import { string } from 'prop-types'
import insane from 'insane'

import styles from './styles.css'

const NotificationContent = ({ content }) => {
  const safeContent = { __html: insane(content) }
  return (
    <div
      className={styles.notificationContent}
      dangerouslySetInnerHTML={safeContent}
    />
  )
}

NotificationContent.propTypes = {
  content: string,
}

NotificationContent.defaultProps = {
  content: '',
}

export default memo(NotificationContent)
