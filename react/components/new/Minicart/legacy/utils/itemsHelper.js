const isParentItem = ({ parentItemIndex, parentAssemblyBinding }) =>
  parentItemIndex == null && parentAssemblyBinding == null

export const shouldShowItem = item => !!item.quantity && isParentItem(item)
