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

const SearchWrapper = props => {
  const {
    params,
    searchQuery,
    searchQuery: {
      data: { productSearch: { titleTag, metaTagDescription } = {} } = {},
      loading,
    } = {},
    children,
  } = props
  const { account, getSettings } = useRuntime()

  const pixelEvents = useMemo(() => {
    if (!searchQuery || typeof document === 'undefined') {
      return null
    }

    const { products, titleTag } = searchQuery
    const { department } = params

    const event = getPageEventName(products, params)

    return [
      {
        event: 'pageInfo',
        eventType: event,
        accountName: account,
        pageCategory: pageCategory(products, params),
        pageDepartment: department,
        pageFacets: [],
        pageTitle: titleTag,
        pageUrl: window.location.href,
      },
      {
        event,
        products,
      },
    ]
  }, [account, params, searchQuery])

  useDataPixel(pixelEvents, loading)

  const settings = getSettings(APP_LOCATOR) || {}
  const { titleTag: defaultStoreTitle, metaTagKeywords, storeName } = settings

  return (
    <Fragment>
      <Helmet
        title={getTitleTag(
          titleTag,
          storeName || defaultStoreTitle,
          params.term
        )}
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
