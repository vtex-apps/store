import React, { memo } from 'react'
import { string } from 'prop-types'
import NotificationContent from './notificationContent'
import hoistNonReactStatics from 'hoist-non-react-statics'
import formatIOMessage from '../../../NativeTypes/formatIOMessage'
import { injectIntl } from 'react-intl'

import styles from './styles.css'

const NotificationBar = ({ content, intl }) => {
  return (
    content && (
      <div
        className={`${
          styles.notificationBarContainer
        } bg-base--inverted c-on-base--inverted w-100`}
      >
        <div
          className={`${
            styles.notificationBarInner
          } min-h-large flex items-center justify-center`}
        >
          <NotificationContent content={formatIOMessage({ id: content, intl })} />
        </div>
      </div>
    )
  )
}

NotificationBar.propTypes = {
  content: string,
}

NotificationBar.defaultProps = {
  content: '',
}

NotificationBar.schema = {
  title: 'admin/editor.notification-bar.title'
}

export default hoistNonReactStatics(injectIntl(NotificationBar), memo(NotificationBar))
