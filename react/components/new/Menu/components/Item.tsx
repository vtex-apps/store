import React, { FunctionComponent } from 'react'
import CategoryItem, {
  CategoryItemSchema,
} from './CategoryItem'
import CustomItem, { CustomItemSchema } from './CustomItem'
import { StyledLinkProps } from './StyledLink'

// TODO use this
// type ItemComponent = (
//   props: CategoryItemProps | CustomItemProps
// ) => React.ReactElement

const menuItemTypes = {
  category: CategoryItem,
  custom: CustomItem,
}

const Item: FunctionComponent<ItemProps> = props => {
  const { type, itemProps, ...rest } = props

  // TODO: fix
  const Component = menuItemTypes[type] as any

  if (!Component) {
    return null
  }

  return <Component {...rest} {...itemProps} />
}

interface ItemProps extends StyledLinkProps {
  type: 'category' | 'custom'
  accordion?: boolean
  itemProps: CategoryItemSchema | CustomItemSchema
}

export default Item
