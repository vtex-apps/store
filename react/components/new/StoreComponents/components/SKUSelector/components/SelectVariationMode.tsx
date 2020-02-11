import React from 'react'
import Dropdown from '../../../../Styleguide/Dropdown'
import { injectIntl, InjectedIntlProps, defineMessages } from 'react-intl'
import styles from '../styles.css'
import { DisplayOption } from '../types'

interface VariationSelectModeProps extends InjectedIntlProps {
  selectedItem: string | null
  displayOptions: DisplayOption[]
}

const messages = defineMessages({
  selectPlaceholder: {
    id: 'store/sku-selector.select.placeholder',
    defaultMessage: '',
  }
})

function SelectVariationMode(props: VariationSelectModeProps) {
  const {
    intl,
    selectedItem,
    displayOptions,
  } = props

  const options = displayOptions.map(op => ({
    label: op.label,
    value: op.label,
  }))

  const handleClick = (_: React.MouseEvent, value: string) => {
    const options = displayOptions
      .reduce<Record<string, DisplayOption>>((acc, cur) => {
        acc[cur.label] = cur
        return acc
      }, {})
    if (options && options[value] && options[value].onSelectItem) {
      options[value].onSelectItem()
    }
  }

  return (
    <div className={styles.skuSelectorSelectContainer}>
      <Dropdown
        options={options}
        value={selectedItem}
        onChange={handleClick}
        placeholder={intl.formatMessage(messages.selectPlaceholder)}
      />
    </div>
  )
}

export default injectIntl(SelectVariationMode)
