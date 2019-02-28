import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Helmet, withRuntimeContext } from 'vtex.render-runtime'
import map from 'lodash/map'
import reject from 'lodash/reject'
import find from 'lodash/find'
import axios from 'axios'

import DataLayerApolloWrapper from './components/DataLayerApolloWrapper'
import transformPaymentData from './utils/transformPaymentData'

class OrderPlacedWrapper extends Component {
  static propTypes = {
    /** Render runtime context */
    runtime: PropTypes.shape({
      page: PropTypes.string.isRequired,
      account: PropTypes.any,
      getSettings: PropTypes.func,
    }),
    orderGroupId: PropTypes.string.isRequired,
    /** Component to be rendered */
    children: PropTypes.node.isRequired
  }

  getInvoiceUrl(payments) {
    const payment = payments.find(payment => payment.url)
    return payment && payment.url
  }

  async getOrderGroupFromCheckout(orderGroupId, account) {
    return await axios({
      headers: {
        'x-vtex-user-agent': process.env.VTEX_APP_ID,
      },
      method: 'get',
      url: `/api/checkout/pub/orders/order-group/${orderGroupId}`,
    }).then(({ data }) => data)
  }

  getTotalizerValue(totalizers, totalizer) {
    const foundTotalizer = find(totalizers, t => t.id === totalizer)
    const value =
      foundTotalizer && foundTotalizer.value != null
        ? foundTotalizer.value / 100
        : null

    return value
  }

  getTransactionProducts(orderItems, orderSellers) {
    return map(orderItems, item => {
      let categoryIds = item.productCategoryIds
        ? item.productCategoryIds.split('/')
        : undefined
      categoryIds = reject(categoryIds, c => c.length === 0)

      const categoryId = categoryIds[categoryIds.length - 1]
      const category = item.productCategories[categoryId]

      const categoryTree = []
      const categoryIdTree = []
      categoryIds.map(id => {
        categoryIdTree.push(id)
        categoryTree.push(item.productCategories[id])
      })

      const seller = find(orderSellers, seller => seller.id === item.seller)
      const sellerName = seller && seller.name

      return {
        id: item.productId,
        name: item.name,
        sku: item.id,
        skuRefId: item.refId,
        skuName: item.skuName,
        brand: item.additionalInfo.brandName,
        brandId: item.additionalInfo.brandId,
        seller: sellerName,
        sellerId: item.seller,
        category,
        categoryId,
        categoryTree,
        categoryIdTree,
        originalPrice: item.price / 100,
        price: item.sellingPrice / 100,
        sellingPrice: item.sellingPrice / 100, // keeping this for backwards compatibility
        tax: item.tax / 100,
        quantity: item.quantity,
        components: item.components,
        measurementUnit: item.measurementUnit,
        unitMultiplier: item.unitMultiplier,
      }
    })
  }

  getData = (orderGroupId) => {
    if (!orderGroupId) {
      return null
    }

    const { account } = this.props.runtime
    const orderGroupData = this.getOrderGroupFromCheckout(orderGroupId, account)

    let events = []

    for (let i = 0; i < orderGroupData.length; i++) {
      const order = orderGroupData[i]
      const flattenedPayments = transformPaymentData(order.paymentData)

      const urlBoleto = this.getInvoiceUrl(flattenedPayments)

      const currEvent = {
        accountName: account,
        orderGroup: order.orderGroup,
        salesChannel: order.salesChannel,
        coupon: order.marketingData ? order.marketingData.coupon : undefined,
        campaignName: order.marketingData
          ? order.marketingData.utmCampaign
          : undefined,
        campaignSource: order.marketingData
          ? order.marketingData.utmSource
          : undefined,
        campaignMedium: order.marketingData
          ? order.marketingData.utmMedium
          : undefined,
        internalCampaignName: order.marketingData
          ? order.marketingData.utmiCampaign
          : undefined,
        internalCampaignPage: order.marketingData
          ? order.marketingData.utmiPage
          : undefined,
        internalCampaignPart: order.marketingData
          ? order.marketingData.utmiPart
          : undefined,
        bankInvoiceURL: urlBoleto,
        visitorType:
          order.userType === 'callCenterOperator' ? 'salesperson' : undefined,
        visitorContactInfo: [
          order.clientProfileData ? order.clientProfileData.email : undefined,
          order.clientProfileData ? order.clientProfileData.firstName : undefined,
          order.clientProfileData ? order.clientProfileData.lastName : undefined,
        ],
        transactionId: order.orderId,
        transactionDate: order.creationDate,
        transactionAffiliation:
          order.sellers && order.sellers[0] && order.sellers[0].name,
        transactionTotal: order.value / 100,
        transactionShipping: this.getTotalizerValue(order.totals, 'Shipping'),
        transactionTax: this.getTotalizerValue(order.totals, 'Tax'),
        transactionCurrency: order.storePreferencesData
          ? order.storePreferencesData.currencyCode
          : undefined,
        transactionPaymentType: map(flattenedPayments, p => {
          return {
            group: p.group,
            paymentSystemName: p.paymentSystemName,
            installments: p.installments,
            value: p.value,
          }
        }),
        transactionShippingMethod: map(order.shippingData.logisticsInfo, l => ({
          itemId: l.itemId,
          selectedSla: l.selectedSla,
        })),
        transactionProducts: this.getTransactionProducts(order.items, order.sellers),
        transactionPayment: {
          id:
            order.paymentData.transactions.length > 0
              ? order.paymentData.transactions[0].transactionId
              : undefined,
        }
      }
      events.push(currEvent, {event: "orderPlaced"})
    }

    return events
  }



  render() {
    const {
      orderGroupId
    } = this.props

    const titleTag = "Order Placed"

    return(
      <DataLayerApolloWrapper
        getData={() => this.getData(orderGroupId)}
      >
        <Helmet>
          <title>{titleTag}</title>
        </Helmet>
        {React.cloneElement(this.props.children, this.props)}
      </DataLayerApolloWrapper>
    )
  }
}

export default withRuntimeContext(OrderPlacedWrapper)
