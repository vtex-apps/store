import PropTypes from 'prop-types'

export const MiniCartPropTypes = {
  /* Set the minicart type */
  type: PropTypes.oneOf(['popup', 'sidebar']),
  /* Set the content visibility */
  hideContent: PropTypes.bool,
  /* Label that will appear when the minicart is empty */
  labelMiniCartEmpty: PropTypes.string,
  /* Finish shopping button label */
  labelButtonFinishShopping: PropTypes.string,
  linkButtonFinishShopping: PropTypes.string,
  /* Icon's classnames */
  iconClasses: PropTypes.string,
  /* Icon's size */
  iconSize: PropTypes.number,
  /* Icon's label */
  iconLabel: PropTypes.object,
  /* Label's classnames */
  labelClasses: PropTypes.string,
  /* Set the discount visibility */
  showDiscount: PropTypes.bool,
  /* Set the shipping fee visibility */
  showShippingCost: PropTypes.bool,
}
