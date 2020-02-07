import classNames from 'classnames'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { injectIntl, intlShape } from 'react-intl'

import footer from './footer.css'

const getDisplayName = Component => {
  return Component.displayName || Component.name || 'Component'
}

export default WrappedComponent => {
  class FooterList extends Component {
    static displayName = `FooterList(${getDisplayName(WrappedComponent)})`

    static propTypes = {
      titleId: PropTypes.string,
      list: PropTypes.array,
      intl: intlShape.isRequired,
      alignRight: PropTypes.bool,
      horizontal: PropTypes.bool,
      titleCapitals: PropTypes.bool,
    }

    static defaultProps = {
      alignRight: false,
      horizontal: false,
    }

    formatMessage(id) {
      return (
        (this.props.intl.messages[id] &&
          this.props.intl.formatMessage({ id })) ||
        id
      )
    }

    render() {
      const {
        list,
        titleId,
        alignRight,
        horizontal,
        titleCapitals,
        ...otherProps
      } = this.props

      if (!list || list.length === 0) return null

      const titleClasses = classNames(`${footer.listTitle} t-small ma0 db`, {
        ttu: !titleCapitals,
      })

      const listContainerClasses = classNames(
        `${footer.listContainer} pl0 w-100 mt0-ns`,
        {
          [`${footer.listContainerRightAligned} ml-auto-m`]: alignRight,
          [`${footer.listContainerHorizontal} w-auto-m`]: horizontal,
        }
      )

      const listClasses = classNames(
        `${footer.list} list flex flex-column flex-wrap pa0 mb0 mt3`,
        {
          [`${footer.listHorizontal} flex-row flex-wrap`]: horizontal,
        }
      )

      const listItemClasses = classNames(`${footer.listItem} mr0 mr3`, {
        [`${footer.listItemHorizontal}`]: horizontal,
      })

      return (
        <div className={listContainerClasses}>
          {titleId && (
            <span className={titleClasses}>{this.formatMessage(titleId)}</span>
          )}
          <ul className={listClasses}>
            {list.map((item, index) => (
              <li key={index} className={listItemClasses}>
                <WrappedComponent {...otherProps} {...item} />
              </li>
            ))}
          </ul>
        </div>
      )
    }
  }

  return injectIntl(FooterList)
}
