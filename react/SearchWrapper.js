import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Helmet, withRuntimeContext } from 'vtex.render-runtime'

import DataLayerApolloWrapper from './components/DataLayerApolloWrapper'
import { capitalize } from './utils/capitalize'
const APP_LOCATOR = 'vtex.store'

class SearchWrapper extends Component {
  static propTypes = {
    /** Route parameters */
    params: PropTypes.shape({
      category: PropTypes.string,
      department: PropTypes.string,
      term: PropTypes.string,
    }),
    /** Render runtime context */
    runtime: PropTypes.shape({
      page: PropTypes.string.isRequired,
      account: PropTypes.any,
      getSettings: PropTypes.func,
    }),
    /** Search query result */
    searchQuery: PropTypes.object.isRequired,
    /** Component to be rendered */
    children: PropTypes.node.isRequired,
  }

  pageCategory = products => {
    if (!products || products.length === 0) {
      return 'EmptySearch'
    }
    const { category, term } = this.props.params
    return term ? 'InternalSiteSearch' : category ? 'Category' : 'Department'
  }

  getPageEventName = products => {
    if (!products || products.length === 0) {
      return 'otherView'
    }
    const pageCategory = this.pageCategory(products)
    return `${pageCategory.charAt(0).toLowerCase()}${pageCategory.slice(1)}View`
  }

  getData = searchQuery => {
    if (!searchQuery) {
      return null
    }

    const { products, titleTag } = searchQuery
    const { department } = this.props.params
    const { account } = this.props.runtime

    const event = this.getPageEventName(products)

    return [
      {
        event: 'pageInfo',
        eventType: event,
        accountName: account,
        pageCategory: this.pageCategory(products),
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
  }

  render() {
    const {
      params,
      searchQuery: {
        data: search,
        data: {
          titleTag,
          metaTagDescription,
        } = {},
        loading,
      },
      runtime: {
        getSettings,
      },
    } = this.props
    const settings = getSettings(APP_LOCATOR) || {}
    const {
      titleTag: storeTitle,
      metaTagKeywords,
    } = settings

    return (
      <DataLayerApolloWrapper
        getData={() => this.getData(search)}
        loading={loading}
      >
        <Helmet>
          {titleTag
            ? <title>{titleTag}</title>
            : params.term && <title>{`${capitalize(params.term)} - ${storeTitle}`}</title>}
          {params.term &&
            <meta name="keywords" content={`${params.term}, ${metaTagKeywords}`} />}
          {metaTagDescription && (
            <meta name="description" content={metaTagDescription} />
          )}
        </Helmet>
        {React.cloneElement(this.props.children, this.props)}
      </DataLayerApolloWrapper>
    )
  }
}

export default withRuntimeContext(SearchWrapper)
