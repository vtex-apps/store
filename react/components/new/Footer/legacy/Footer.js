import PropTypes from 'prop-types'
import React, { Component } from 'react'
import classNames from 'classnames'
import { Container } from 'vtex.store-components'
import { IOMessage } from 'vtex.native-types'

import FooterBadgeList from './FooterBadgeList'
import FooterLinksMatrix from './FooterLinksMatrix'
import FooterPaymentFormMatrix from './FooterPaymentFormMatrix'
import FooterVtexLogo from './FooterVtexLogo'
import FooterSocialNetworkList from './FooterSocialNetworkList'
import { objectLikeBadgeArray, objectLikeLinkArray } from './propTypes'

import footer from './footer.css'

/**
 * Footer component that appears in the bottom of every page.
 * Can be configured by the pages editor.
 */
export default class Footer extends Component {
  static displayName = 'Footer'

  static propTypes = {
    /** Social Networks */
    socialNetworks: objectLikeLinkArray,
    /** Links Sections */
    sectionLinks: PropTypes.arrayOf(
      PropTypes.shape({
        /** Link section title */
        title: PropTypes.string,
        /** Link  section links */
        links: objectLikeLinkArray,
      })
    ),
    /** Badges */
    badges: objectLikeBadgeArray,
    /** Payment Forms */
    paymentForms: PropTypes.arrayOf(
      PropTypes.shape({
        /** Payment Form title */
        title: PropTypes.string,
        /** Payment Types */
        paymentTypes: PropTypes.arrayOf(PropTypes.string),
      })
    ),
    /** Determines if the icons are colorful */
    showPaymentFormsInColor: PropTypes.bool,
    /** Determines if the icons are colorful */
    showSocialNetworksInColor: PropTypes.bool,
    /** Determines if VTEX logo are colorful */
    showVtexLogoInColor: PropTypes.bool,
    /** Logo URL */
    logo: PropTypes.string,
    /** Store Informations */
    storeInformations: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
  }

  static defaultProps = {
    showPaymentFormsInColor: false,
    showSocialNetworksInColor: false,
    showVtexLogoInColor: false,
    socialNetworks: [
      {
        socialNetwork: 'Facebook',
        url: '#',
      },
    ],
    sectionLinks: [],
    badges: [],
    paymentForms: [
      {
        title: 'admin/editor.footer.paymentForms.paymentForm',
        paymentTypes: ['MasterCard'],
      },
    ],
    storeInformations: [],
  }

  getInformationCssClasses = (listLength, index) => {
    let paddingClass
    const defaultClasses = `${footer.textInformation} w-100 w-50-ns t-mini ma0`
    // Only apply vertical paddings if there is more than 1 element
    if (listLength > 1) {
      if (index === 0) {
        paddingClass = 'pt4-s pb4-s pr4-ns'
      } else if (index + 1 === listLength) {
        paddingClass = 'pt4-s pb4-ns pl4-ns'
      } else {
        paddingClass = 'pv4-s'
      }
    }
    return classNames(defaultClasses, paddingClass)
  }

  render() {
    const {
      showPaymentFormsInColor,
      showSocialNetworksInColor,
      showVtexLogoInColor,
      logo,
      sectionLinks,
      socialNetworks,
      paymentForms,
      badges,
      storeInformations,
    } = this.props

    return (
      <footer className={`${footer.footer} bt bw1 b--muted-4 mt4 pv5`}>
        <Container className="justify-center flex">
          <div className="w-100 mw9">
            <nav
              className={`${footer.container} ${
                footer.navigation
              } pt5-s flex justify-between bg-base c-muted-1`}>
              <div className={`${footer.links} t-small w-100-s w-80-ns pb5-s`}>
                <FooterLinksMatrix links={sectionLinks} />
              </div>
              <div className={`${footer.socialNetworkContainer} pv5-s pa1-ns`}>
                <FooterSocialNetworkList
                  titleId="store/social-networks"
                  list={socialNetworks}
                  horizontal
                  alignRight
                  titleCapitals
                  showInColor={showSocialNetworksInColor}
                />
              </div>
            </nav>
            <div
              className={`${footer.container} ${
                footer.payment
              } pv5-s flex justify-between bg-base c-muted-1`}>
              <FooterPaymentFormMatrix
                paymentForms={paymentForms}
                horizontal
                showInColor={showPaymentFormsInColor}
              />
            </div>
            <div
              className={`${footer.container} ${
                footer.informationContainer
              } pt5-s flex justify-between bg-base c-muted-1`}>
              <div
                className={`${
                  footer.textContainer
                } w-100-s pb5-s w-80-ns flex flex-wrap`}>
                {storeInformations &&
                  storeInformations.map(({ storeInformation }, index) => (
                    <p
                      key={`information-${index}`}
                      className={this.getInformationCssClasses(
                        storeInformations.length,
                        index
                      )}>
                      <IOMessage id={storeInformation} />
                    </p>
                  ))}
              </div>
              <FooterVtexLogo
                logoUrl={logo}
                showInColor={showVtexLogoInColor}
              />
              <FooterBadgeList list={badges} />
            </div>
          </div>
        </Container>
      </footer>
    )
  }
}
