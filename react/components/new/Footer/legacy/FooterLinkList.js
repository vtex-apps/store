import PropTypes from 'prop-types'
import React from 'react'
import { injectIntl, intlShape } from 'react-intl'
import { IOMessage, formatIOMessage } from 'vtex.native-types'

import footerList from './footerList'
import footer from './footer.css'

const FooterLinkItem = ({ url, title, target, intl }) =>
  title ? (
    <a
      className={`${
        footer.listLink
      } dib no-underline underline-hover mb0 mt2 w-100 t-small truncate c-muted-1 pointer`}
      href={formatIOMessage({ id: url, intl })}
      target={target ? target : '_self'}
    >
      <IOMessage id={title} />
    </a>
  ) : null

FooterLinkItem.displayName = 'FooterLinkItem'

FooterLinkItem.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  target: PropTypes.oneOf(['_self', '_blank']),
  intl: intlShape,
}

const FooterLinkItemWithIntl = injectIntl(FooterLinkItem)

export { FooterLinkItemWithIntl as FooterLinkItem }

export default footerList(FooterLinkItemWithIntl)
