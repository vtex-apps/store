import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Collapse } from 'react-collapse'
import { injectIntl, intlShape } from 'react-intl'

import IconCaret from '../StoreIcons/IconCaret'

import footer from './footer.css'

class Accordion extends Component {
  static propTypes = {
    /** Title shown in Accordion */
    title: PropTypes.string,
    /** Accordion children. Components shown inside Collapse */
    children: PropTypes.node.isRequired,
    /** Internationalization */
    intl: intlShape.isRequired,
  }

  state = {
    open: false,
  }

  handleClick = () => {
    this.setState(({ open }) => ({ open: !open }))
  }

  translate = id => {
    return this.props.intl.messages[id]
      ? this.props.intl.formatMessage({ id })
      : id
  }

  render() {
    const { children, title } = this.props
    const { open } = this.state

    return (
      <div className={`${footer.accordion} pv2`}>
        <div
          role="button"
          tabIndex={0}
          className="pointer"
          onKeyDown={e => {
            if (e.key === 'Enter') {
              this.handleClick()
            }
          }}
          onClick={this.handleClick}
        >
          <div>
            {title && (
              <span className={`${footer.accordionTitle} dib ma0 ttu`}>
                {this.translate(title)}
              </span>
            )}
            <span className={`${footer.accordionIcon} fr`}>
              {open ? (
                <IconCaret orientation="down" />
              ) : (
                <IconCaret orientation="right" />
              )}
            </span>
          </div>
        </div>

        <div style={{ overflowY: 'auto' }}>
          <Collapse isOpened={open}>{children}</Collapse>
        </div>
      </div>
    )
  }
}

export default injectIntl(Accordion)
