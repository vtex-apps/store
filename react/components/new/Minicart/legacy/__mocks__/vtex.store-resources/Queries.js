import gql from 'graphql-tag'

export const orderForm = gql`
  query {
    orderForm {
      cacheId
      orderFormId
      value
      totalizers {
        id
        name
        value
      }
      items {
        id
        name
        imageUrl
        detailUrl
        productRefId
        additionalInfo {
          brandName
        }
        productCategoryIds
        productCategories
        skuName
        quantity
        sellingPrice
        listPrice
        parentItemIndex
        parentAssemblyBinding
        assemblyOptions {
          added {
            item {
              name
              sellingPrice
              quantity
            }
            normalizedQuantity
            choiceType
            extraQuantity
          }
          removed {
            removedQuantity
            initialQuantity
            name
          }
          parentPrice
        }
      }
      shippingData {
        address {
          id
          neighborhood
          complement
          number
          street
          postalCode
          city
          reference
          addressName
          addressType
        }
        availableAddresses {
          id
          neighborhood
          complement
          number
          street
          postalCode
          city
          reference
          addressName
          addressType
        }
      }
      clientProfileData {
        email
        firstName
      }
      storePreferencesData {
        countryCode
        currencyCode
        timeZone
      }
    }
  }
`
