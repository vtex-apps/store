import PropTypes from 'prop-types'

export const contextPropTypes = PropTypes.shape({
  /* Toast message that will be displayed  */
  message: PropTypes.shape({
    isSuccess: PropTypes.bool,
    message: PropTypes.string,
  }).isRequired,
  /* Is information still loading*/
  loading: PropTypes.bool.isRequired,
  /* Function to refetch the orderForm query */
  refetch: PropTypes.func.isRequired,
  /* Function to add a new item into the orderForm */
  addItem: PropTypes.func.isRequired,
  /* Function to update the orderForm */
  updateOrderForm: PropTypes.func.isRequired,
  /* Function to update the orderForm profile data*/
  updateOrderFormProfile: PropTypes.func.isRequired,
  /* Function to update the orderForm and refetch the data*/
  updateAndRefetchOrderForm: PropTypes.func.isRequired,
  /* Function to update the message */
  updateToastMessage: PropTypes.func.isRequired,
  /* Function to update the shipping data */
  updateOrderFormShipping: PropTypes.func.isRequired,
  /* Order form */
  orderForm: PropTypes.shape({
    /* Order form id */
    orderFormId: PropTypes.string,
    /* Total price of the order */
    value: PropTypes.number,
    /* Items in the mini cart */
    items: PropTypes.arrayOf(PropTypes.object),
    /* Shipping Address */
    shippingData: PropTypes.shape({
      address: PropTypes.shape({
        addressName: PropTypes.string,
        addressType: PropTypes.string,
        city: PropTypes.string,
        complement: PropTypes.string,
        country: PropTypes.string,
        id: PropTypes.string,
        neighborhood: PropTypes.string,
        number: PropTypes.string,
        postalCode: PropTypes.string,
        receiverName: PropTypes.string,
        reference: PropTypes.string,
        state: PropTypes.string,
        street: PropTypes.string,
        userId: PropTypes.string,
      }),
      /* Available Addresses */
      availableAddresses: PropTypes.arrayOf(PropTypes.object),
    }),
  }),
}).isRequired
