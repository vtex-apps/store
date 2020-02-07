import React from 'react'
import { render } from '@vtex/test-tools/react'

import Footer from './Footer'

describe('<Footer /> component', () => {
  const renderComponent = customProps => {
    const props = {
      socialNetworks: [
        {
          url: 'https://www.facebook.com/',
          socialNetwork: 'Facebook',
        },
      ],
      sectionLinks: [
        {
          title: 'Section title',
          links: [{ url: 'mockedUrl', title: 'Some title' }],
        },
      ],
      badges: [{ image: 'imageURL' }],
      paymentForms: [
        {
          title: 'Title payment',
          paymentTypes: ['MasterCard', 'Visa', 'Diners Club'],
        },
      ],
      showPaymentFormsInColor: true,
      showSocialNetworksInColor: true,
      showVtexLogoInColor: true,
      logo: 'logoUrl',
      ...customProps,
    }

    return render(<Footer {...props} />)
  }

  it('should be rendered', () => {
    const { asFragment } = renderComponent()
    expect(asFragment()).toBeDefined()
  })

  it('should match the snapshot', () => {
    const { asFragment } = renderComponent()
    expect(asFragment()).toMatchSnapshot()
  })

  it('should contain the section links', () => {
    const sectionLinks = [
      {
        title: 'We have one section title',
        links: [
          { url: 'someUrl', title: 'someTitle' },
          { url: 'anotherUrl', title: 'anotherTitle' },
        ],
      },
      {
        title: 'We have two section titles',
        links: [{ url: 'yetAnotherUrl', title: 'yetAnotherUrl' }],
      },
    ]

    const { getByText } = renderComponent({ sectionLinks })

    sectionLinks.forEach(({ title, links }) => {
      expect(getByText(title)).toBeTruthy()

      links.forEach(({ title }) => {
        expect(getByText(title)).toBeTruthy()
      })
    })
  })

  it('should contain the payment forms', () => {
    const paymentForms = [
      {
        title: 'Credit',
        paymentTypes: ['MasterCard', 'Visa', 'Diners Club'],
      },
      {
        title: 'Debit',
        paymentTypes: ['MasterCard', 'Visa'],
      },
    ]

    const { getByText } = renderComponent({ paymentForms })

    paymentForms.forEach(({ title }) => {
      expect(getByText(title)).toBeTruthy()
    })
  })
})
