import React from 'react'
import { Button, EmptyState } from 'vtex.styleguide'
import { injectIntl, intlShape } from 'react-intl'

const OfflineWarning = ({ intl, warningTitle, message, buttonLabel }) => (
  <EmptyState
    title={
      warningTitle ||
      intl.formatMessage({ id: 'store/store.offline-warning.warningTitle' })
    }
  >
    <p>
      {message ||
        intl.formatMessage({ id: 'store/store.offline-warning.message' })}
    </p>
    <div className="pt5">
      <Button variation="secondary" size="small" onClick={() => window.location.reload()}>
        <span className="flex align-baseline">
          {buttonLabel ||
            intl.formatMessage({ id: 'store/store.offline-warning.button' })}
        </span>
      </Button>
    </div>
  </EmptyState>
)

OfflineWarning.propTypes = {
  intl: intlShape.isRequired,
  warningTitle: PropTypes.string,
  message: PropTypes.string,
  buttonLabel: PropTypes.string,
}

const OfflineWarningIntl = injectIntl(OfflineWarning)

OfflineWarningIntl.schema = {
  title: 'admin/editor.offline-warning.title',
  type: 'object',
  properties: {
    warningTitle: {
      title: 'admin/editor.offline-warning.warningTitle',
      type: 'string',
      isLayout: false,
    },
    message: {
      title: 'admin/editor.offline-warning.message',
      type: 'string',
      isLayout: false,
    },
    buttonLabel: {
      title: 'admin/editor.offline-warning.button',
      type: 'string',
      isLayout: false,
    },
  },
}

export default OfflineWarningIntl
