import PropTypes from 'prop-types'
import React, { Fragment, useMemo } from 'react'
import { Helmet, useRuntime } from 'vtex.render-runtime'

import { capitalize } from './utils/capitalize'
import useDataPixel from './hooks/useDataPixel'

const APP_LOCATOR = 'vtex.store'

const pageCategory = (products, params) => {
  if (!products || products.length === 0) {
    return 'EmptySearch'
  }
  const { category, term } = params
  return term ? 'InternalSiteSearch' : category ? 'Category' : 'Department'
}

const getPageEventName = (products, params) => {
  if (!products || products.length === 0) {
    return 'otherView'
  }
  const category = pageCategory(products, params)
  return `${category.charAt(0).toLowerCase()}${category.slice(1)}View`
}

const getTitleTag = (titleTag, storeTitle, term) => {
  return titleTag
    ? `${titleTag} - ${storeTitle}`
    : term
    ? `${capitalize(decodeURI(term))} - ${storeTitle}`
    : `${storeTitle}`
}

const getSearchIdentifier = searchQuery => {
  const { variables } = searchQuery || {}
  if (!variables) {
    return null
  }
  const { query, map } = variables
  return query + map
}

const SearchWrapper = props => {
  const {
    params,
    searchQuery,
    searchQuery: {
      loading,
      data: { searchMetadata: { titleTag, metaTagDescription } = {} } = {},
    } = {},
    children,
  } = props
  const { account, getSettings } = useRuntime()
  const settings = getSettings(APP_LOCATOR) || {}
  const { titleTag: defaultStoreTitle, metaTagKeywords, storeName } = settings
  const title = getTitleTag(
    titleTag,
    storeName || defaultStoreTitle,
    params.term
  )
  const pixelEvents = useMemo(() => {
    if (
      !searchQuery ||
      typeof document === 'undefined' ||
      !searchQuery.products
    ) {
      return null
    }

    const { products } = searchQuery
    const { department } = params

    const event = getPageEventName(products, params)
    const pageView = {
      event: 'pageView',
      pageTitle: title,
      pageUrl: window.location.href,
      referrer:
        document.referrer.indexOf(location.origin) === 0
          ? undefined
          : document.referrer,
      accountName: account,
    }

    return [
      pageView,
      {
        event: 'pageInfo',
        eventType: event,
        accountName: account,
        pageCategory: pageCategory(products, params),
        pageDepartment: department,
        pageFacets: [],
        pageTitle: title,
        pageUrl: window.location.href,
      },
      {
        event,
        products,
      },
    ]
  }, [account, params, searchQuery, title])

  useDataPixel(pixelEvents, getSearchIdentifier(searchQuery), loading)

  return (
    <Fragment>
      <Helmet
        title={title}
        meta={[
          params.term && {
            name: 'keywords',
            content: `${params.term}, ${metaTagKeywords}`,
          },
          params.term && {
            name: 'robots',
            content: 'noindex,follow',
          },
          metaTagDescription && {
            name: 'description',
            content: metaTagDescription,
          },
        ].filter(Boolean)}
      />
      {React.cloneElement(children, props)}
    </Fragment>
  )
}

SearchWrapper.propTypes = {
  /** Route parameters */
  params: PropTypes.shape({
    category: PropTypes.string,
    department: PropTypes.string,
    term: PropTypes.string,
  }),
  /** Search query result */
  searchQuery: PropTypes.object.isRequired,
  /** Component to be rendered */
  children: PropTypes.node.isRequired,
}

export default SearchWrapper
