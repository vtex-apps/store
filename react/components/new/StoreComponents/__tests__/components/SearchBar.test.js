import React from 'react'
import { render } from '@vtex/test-tools/react'
import { MockedProvider } from '@apollo/react-testing'

import SearchBar from '../../SearchBar'
import autocomplete from '../../components/AutocompleteResults/queries/autocomplete.gql'

describe('<SearchBar />', () => {
  const mockedResult = {
    request: {
      query: autocomplete,
    },
    result: {
      data: {
        loading: false,
        autocomplete: {
          itemsReturned: [{ thumb: 'thumb', name: 'name', href: 'href' }],
        },
      },
    },
  }

  const renderComponent = (customProps = {}) => {
    return render(<SearchBar />, { graphql: { mocks: [mockedResult] }, MockedProvider })
  }

  it('should be able to mount and not break', () => {
    const { asFragment } = renderComponent()
    expect(asFragment()).toBeTruthy()
  })

  it('should match snapshot', () => {
    const { asFragment } = renderComponent()
    expect(asFragment()).toMatchSnapshot()
  })

  it('should have CSS handle searchBarIcon', () => {
    const { container } = renderComponent()

    const element = container.querySelector('.searchBarIcon')

    expect(element).toBeTruthy()
  })
})
