import PropTypes from 'prop-types'
import React, { ReactNode } from 'react'

import useCssHandles from '../CssHandles/useCssHandles'
import { Link } from 'vtex.render-runtime'
import Container from '../StoreComponents/Container'
import Options from './constants/Options'

// This is required because is used in static schema attribute of Menu Component
const GLOBAL_PAGES =
  (global as any).__RUNTIME__ && Object.keys((global as any).__RUNTIME__.pages)

const MAX_ITEMS: number = 10

const CSS_HANDLES = [
  'container',
  'linkLeft',
  'linkMiddle',
  'linkRight',
  'menuLinkNav',
  'menuLinkDivLeft',
  'menuLinkDivMiddle',
  'menuLinkDivRight',
  'renderLink',
] as const

interface Link {
  text?: string | null
  internalPage: string | null
  params?: string | null
  externalPage?: string | null
  typeOfRoute?: string | null
  page?: string | null
  position?: string | null
}

interface Options {
  LEFT: string
  MIDDLE: string
  RIGHT: string
  INTERNAL: string
  EXTERNAL: string
}

interface Props {
  links?: Link[]
}

/**
 * Convert the string params to a js object
 */
const getParams = (params?: string | null): { [key: string]: string } => {
  const json: { [key: string]: string } = {}
  if (params) {
    const array: string[] = params.split(',')
    array.forEach((item: string) => {
      const pair: string[] = item.split('=')
      json[pair[0]] = pair[1]
    })
  }
  return json
}

const getValidPage = (page?: string | null): string => {
  if (!page || (!page.startsWith('http://') && !page.startsWith('https://'))) {
    page = `http://${page}`
  }
  return page
}

/**
 * Links MenuLink Component.
 * Shows a menu bar with links.
 */
const MenuLink: StorefrontFunctionComponent<Props> = ({ links = [] }) => {
  const handles = useCssHandles(CSS_HANDLES)

  const renderLink = (link: Link, index: number): ReactNode => {
    let className: string = `${handles.renderLink} t-small link c-muted-2 dib dim mr3 mr4-ns`
    switch (link.position) {
      case Options.LEFT:
        className = `${handles.linkLeft} ${className}`
        break
      case Options.MIDDLE:
        className = `${handles.linkMiddle} ${className}`
        break
      case Options.RIGHT:
        className = `${handles.linkRight} ${className}`
        break
    }
    return link.typeOfRoute === Options.INTERNAL ? (
      <Link
        className={className}
        key={`${link.text}-${link.position}-${index}`}
        page={link.internalPage}
        params={getParams(link.params)}
      >
        {link.text}
      </Link>
    ) : (
      <a
        className={className}
        key={`${link.text}-${link.position}-${index}`}
        href={getValidPage(link.externalPage)}
        target="_blank"
      >
        {link.text}
      </a>
    )
  }

  if (!links.length) {
    return null
  }
  return (
    <div className={`${handles.container} bg-base h2 c-muted-2 w-100 dn db-ns`}>
      <Container>
        <nav className={`${handles.menuLinkNav} flex justify-between`}>
          <div className={`${handles.menuLinkDivLeft} flex-grow pa3 flex items-center`}>
            {links
              .filter(link => link.position === Options.LEFT)
              .map((link, index) => {
                return renderLink(link, index)
              })}
          </div>
          <div className={`${handles.menuLinkDivMiddle} flex-grow pa3 flex items-center`}>
            {links
              .filter(link => link.position === Options.MIDDLE)
              .map((link, index) => {
                return renderLink(link, index)
              })}
          </div>
          <div className={`${handles.menuLinkDivRight} flex-grow pa3 flex items-center`}>
            {links
              .filter(link => link.position === Options.RIGHT)
              .map((link, index) => {
                return renderLink(link, index)
              })}
          </div>
        </nav>
      </Container>
    </div>
  )
}

MenuLink.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      /** External page to redirect */
      externalPage: PropTypes.string,
      /** Internal page to redirect */
      internalPage: PropTypes.string.isRequired,
      /** Page route to redirect when clicked */
      page: PropTypes.string,
      /** Params to redirect to internal page */
      params: PropTypes.string,
      /** Link position  */
      position: PropTypes.string,
      /** Link text */
      text: PropTypes.string,
      /** Type of Route (internal or external) */
      typeOfRoute: PropTypes.string,
    }).isRequired
  ),
}

// tslint:disable: object-literal-sort-keys
MenuLink.schema = {
  title: 'admin/editor.menu-link',
  description: 'admin/editor.menu-link.description',
  type: 'object',
  properties: {
    links: {
      title: 'admin/editor.menu-link.links',
      type: 'array',
      minItems: 0,
      maxItems: MAX_ITEMS,
      items: {
        title: 'admin/editor.menu-link.links.link',
        type: 'object',
        properties: {
          text: {
            title: 'admin/editor.menu-link.links.link.text',
            type: 'string',
          },
          internalPage: {
            title: 'admin/editor.menu-link.links.link.internalPage',
            description:
              'admin/editor.menu-link.links.link.internalPage.description',
            type: 'string',
            enum: GLOBAL_PAGES,
          },
          params: {
            title: 'admin/editor.menu-link.links.link.params',
            description: 'admin/editor.menu-link.links.link.params.description',
            type: 'string',
          },
          externalPage: {
            title: 'admin/editor.menu-link.links.link.externalPage',
            description:
              'admin/editor.menu-link.links.link.externalPage.description',
            type: 'string',
          },
          typeOfRoute: {
            title: 'admin/editor.menu-link.links.link.typeOfRoute',
            type: 'string',
            enum: [Options.INTERNAL, Options.EXTERNAL],
            enumNames: [
              'admin/editor.menu-link.links.link.typeOfRoute.internal',
              'admin/editor.menu-link.links.link.typeOfRoute.external',
            ],
            default: Options.INTERNAL,
            widget: {
              'ui:widget': 'radio',
              'ui:options': {
                inline: true,
              },
            },
          },
          position: {
            title: 'admin/editor.menu-link.links.link.position',
            type: 'string',
            enum: [Options.LEFT, Options.MIDDLE, Options.RIGHT],
            enumNames: [
              'admin/editor.menu-link.links.link.position.left',
              'admin/editor.menu-link.links.link.position.middle',
              'admin/editor.menu-link.links.link.position.right',
            ],
            default: Options.MIDDLE,
          },
        },
      },
    },
  },
}

export default MenuLink
