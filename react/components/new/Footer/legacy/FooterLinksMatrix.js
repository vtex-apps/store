import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'

import Accordion from './Accordion'
import FooterLinkList, { FooterLinkItem } from './FooterLinkList'
import { objectLikeLinkArray } from './propTypes'
import footer from './footer.css'

export default class FooterLinksMatrix extends Component {
  static propTypes = {
    /** Links to be shown */
    links: PropTypes.arrayOf(
      PropTypes.shape({
        /** Link section title */
        title: PropTypes.string,
        /** Link section links */
        links: objectLikeLinkArray,
      })
    ),
  }

  render() {
    const { links } = this.props

    if (!links) {
      return null
    }

    return (
      <div className={`${footer.matrixContainer} flex flex-wrap`}>
        {links.map((linkItem, index) => (
          <Fragment key={`links-container-${index}`}>
            <div className={`${footer.matrixItem} flex flex-auto dn-s flex-ns`}>
              <FooterLinkList titleId={linkItem.title} list={linkItem.links} />
            </div>
            <div
              className={`${
                footer.matrixItemSmall
              } bb b--muted-2 dn-ns db-s w-100 ph2 pv3`}
            >
              <Accordion title={linkItem.title}>
                {linkItem.links.map(link => (
                  <div
                    key={`${link.title}-${index}`}
                    className={`${footer.accordionItem} pt1`}
                  >
                    <FooterLinkItem {...link} />
                  </div>
                ))}
              </Accordion>
            </div>
          </Fragment>
        ))}
      </div>
    )
  }
}
