import PropTypes from 'prop-types'
import React from 'react'
import { graphql } from 'react-apollo'

import StoreQueries from '../../../StoreResources/Queries'
const {address: addressQuery
} = StoreQueries

import Container from '../Container'
import AddressInfo from './AddressInfo'

const UserAddress = ({ variation, addressQuery }) => {
  const { orderForm } = addressQuery
  const { shippingData } = orderForm || {}

  if (!orderForm || !shippingData || !shippingData.address) {
    return null
  }

  const isInline = variation === 'inline'
  const isInverted = !isInline

  return isInline ? (
    <div
      className="ph5"
      style={{
        maxWidth: '30rem',
      }}
    >
      {
        <AddressInfo
          inverted={isInverted}
          inline={isInline}
          orderForm={orderForm}
        />
      }
    </div>
  ) : (
    <div className="bg-base--inverted c-on-base--inverted flex ph5 pointer pv3">
      <Container className="flex justify-center w-100 left-0">
        <div className="w-100 mw9 flex">
          <AddressInfo
            inverted={isInverted}
            inline={isInline}
            orderForm={orderForm}
          />
        </div>
      </Container>
    </div>
  )
}

UserAddress.propTypes = {
  variation: PropTypes.oneOf(['inline', 'bar']).isRequired,
  addressQuery: PropTypes.object.isRequired,
}

const withAddressQuery = graphql(addressQuery, {
  name: 'addressQuery',
  options: () => ({ ssr: false }),
})

export default withAddressQuery(UserAddress)
