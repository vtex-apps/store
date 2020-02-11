import React, { FunctionComponent } from 'react'
import { Query } from 'react-apollo'

import categoryWithChildren from '../graphql/categoryWithChildren.graphql'
import StyledLink from './StyledLink'

const CategoryLink: FunctionComponent<CategoryLinkProps> = ({
  href,
  titleTag,
  isTitle,
  name,
}: CategoryLinkProps) => {
  return (
    <StyledLink title={titleTag} to={href} isTitle={isTitle}>
      {name}
    </StyledLink>
  )
}

const CategoryMenu: FunctionComponent<CategoryMenuProps> = ({
  categoryId,
}: CategoryMenuProps) => {
  return (
    <Query query={categoryWithChildren} variables={{ id: categoryId }}>
      {({ data, loading, error }: any) => {
        if (error || loading) {
          // TODO add loader and error message
          return null
        }

        const {
          category,
          category: { children },
        }: { category: Category } = data
        return (
          <>
            <CategoryLink {...category} isTitle/>
            {children && children.map((child: Category) => (
              <li key={child.id}>
                <CategoryLink {...child} />
              </li>
            ))}
          </>
        )
      }}
    </Query>
  )
}

interface CategoryMenuProps {
  categoryId: number
  customText?: string
}

interface Category {
  id: number
  titleTag: string
  href: string
  name: string
  children: Category[]
}

interface CategoryLinkProps extends Category {
  isTitle?: boolean
}

export default CategoryMenu
