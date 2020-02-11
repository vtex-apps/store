import React, { Fragment, useMemo } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { graphql } from 'react-apollo'
import Spinner from '../../../Styleguide/Spinner'
import { Link, useRuntime } from 'vtex.render-runtime'
import useCssHandles from '../../../CssHandles/useCssHandles'

// This import should NOT be removed
import styles from './styles.css'
import autocomplete from './queries/autocomplete.gql'

const MIN_RESULTS_WIDTH = 320
const CSS_HANDLES = [
  'resultsItem',
  'resultsList',
  'searchTerm',
  'resultsItemImage',
  'spinnerContainer',
  'spinnerInnerContainer',
  'resultsItemName',
]

const getImageUrl = image => {
  const imageUrl = (image.match(/https?:(.*?)"/g) || [''])[0]
  return imageUrl.replace(/https?:/, '').replace(/-25-25/g, '-50-50')
}

const getLinkProps = element => {
  let page = 'store.product'
  let params = { slug: element.slug, id: element.productId }
  let query = ''
  const terms = element.slug.split('/')

  if (element.criteria) {
    // This param is only useful to track terms searched
    // See: https://support.google.com/analytics/answer/1012264
    const paramForSearchTracking = '&_c=' + terms[0]

    page = 'store.search'
    params = { term: terms[0] }
    query = `map=c,ft&rest=${terms.slice(1).join(',')}` + paramForSearchTracking
  }

  return { page, params, query }
}

/** List of search results to be displayed*/
const AutocompleteResults = ({
  parentContainer,
  isOpen,
  data = {}, // when inputValue is '', query is skipped and value is undefined
  inputValue,
  closeMenu,
  onClearInput,
  getItemProps,
  getMenuProps,
  highlightedIndex,
  attemptPageTypeSearch,
  customSearchPageUrl,
}) => {
  const items = data.autocomplete ? data.autocomplete.itemsReturned : []
  const {
    hints: { mobile },
  } = useRuntime()
  const handles = useCssHandles(CSS_HANDLES)

  const listStyle = useMemo(
    () => ({
      width: Math.max(
        MIN_RESULTS_WIDTH,
        (parentContainer.current && parentContainer.current.offsetWidth) || 0
      ),
    }),
    /* with the isOpen here this will be called 
    only when you open or close the ResultList */
    [parentContainer]
  )

  const listClassNames = classnames(
    handles.resultsList,
    'z-max w-100 bl-ns bb br-ns bw1 b--muted-4 bg-base c-on-base t-body left-0 list pv4 ph0 mv0 list overflow-y-auto',
    mobile ? 'fixed' : 'absolute',
    { dn: !isOpen || !inputValue }
  )

  const handleItemClick = () => {
    onClearInput()
    closeMenu()
  }

  const getListItemClassNames = ({
    itemIndex = -1,
    highlightedIndex,
    hasThumb,
  } = {}) => {
    const highlightClass = highlightedIndex === itemIndex ? 'bg-muted-5' : ''
    return `pointer pa4 outline-0 ${handles.resultsItem} ${highlightClass} ${
      hasThumb ? 'flex justify-start' : 'db w-100'
    }`
  }

  const WrappedSpinner = () => (
    <div className={`w-100 flex justify-center ${handles.spinnerContainer}`}>
      <div className={`${handles.spinnerInnerContainer} w3 ma0`}>
        <Spinner />
      </div>
    </div>
  )

  const fullTextSearchLabel = (
    <FormattedMessage
      id="store/search.searchFor"
      values={{
        term: <span className={handles.searchTerm}>{`"${inputValue}"`}</span>,
      }}
    />
  )

  const renderSearchByClick = inputValue => {
    return customSearchPageUrl ? (
      <Link
        className={getListItemClassNames({
          itemIndex: 0,
          highlightedIndex,
        })}
        to={customSearchPageUrl.replace(/\$\{term\}/g, inputValue)}
      >
        {fullTextSearchLabel}
      </Link>
    ) : (
      <Link
        page="store.search"
        params={{ term: inputValue }}
        query="map=ft"
        className={getListItemClassNames({
          itemIndex: 0,
          highlightedIndex,
        })}
      >
        {fullTextSearchLabel}
      </Link>
    )
  }

  return (
    <div style={listStyle}>
      <ul className={listClassNames} {...getMenuProps()}>
        {isOpen ? (
          data.loading ? (
            <div className={getListItemClassNames({})}>
              <WrappedSpinner />
            </div>
          ) : (
            <Fragment>
              <li
                {...getItemProps({
                  key: 'ft' + inputValue,
                  item: { term: inputValue },
                  index: 0,
                  onClick: handleItemClick,
                })}
              >
                {attemptPageTypeSearch ? (
                  <a
                    href="#"
                    onClick={event => event.preventDefault()}
                    className={getListItemClassNames({
                      itemIndex: 0,
                      highlightedIndex,
                    })}
                  >
                    {fullTextSearchLabel}
                  </a>
                ) : (
                  renderSearchByClick(inputValue)
                )}
              </li>

              {items.map((item, index) => {
                return (
                  <li
                    {...getItemProps({
                      key: item.name + index,
                      index: index + 1,
                      item,
                      onClick: handleItemClick,
                    })}
                  >
                    <Link
                      {...getLinkProps(item)}
                      className={getListItemClassNames({
                        itemIndex: index + 1,
                        highlightedIndex,
                        hasThumb: !!item.thumb,
                      })}
                    >
                      {item.thumb && (
                        <img
                          width={50}
                          height={50}
                          alt={item.name}
                          className={`${handles.resultsItemImage} mr4`}
                          src={getImageUrl(item.thumb)}
                        />
                      )}
                      <div
                        className={`${handles.resultsItemName} flex justify-start items-center`}
                      >
                        {item.name}
                      </div>
                    </Link>
                  </li>
                )
              })}
            </Fragment>
          )
        ) : null}
      </ul>
    </div>
  )
}

const itemProps = PropTypes.shape({
  /** Image of the product*/
  thumb: PropTypes.string,
  /** Name of the product*/
  name: PropTypes.string,
  /** Link to the product*/
  href: PropTypes.string,
  /** Slug of the product*/
  slug: PropTypes.string,
  /** Criteria of the product*/
  criteria: PropTypes.string,
})

AutocompleteResults.propTypes = {
  /** Graphql data response. */
  data: PropTypes.shape({
    autocomplete: PropTypes.shape({
      itemsReturned: PropTypes.arrayOf(itemProps),
    }),
    loading: PropTypes.bool.isRequired,
  }),
  /** Downshift specific prop*/
  highlightedIndex: PropTypes.number,
  /** Search query*/
  inputValue: PropTypes.string.isRequired,
  /** Closes the options box. */
  closeMenu: PropTypes.func,
  /** Clears the input */
  onClearInput: PropTypes.func,
  /** Downshift function */
  getItemProps: PropTypes.func,
  /** A template for a custom url. It can have a substring ${term} used as placeholder to interpolate the searched term. (e.g. `/search?query=${term}`) */
  customSearchPageUrl: PropTypes.string,
  isOpen: PropTypes.bool,
  getMenuProps: PropTypes.func,
  attemptPageTypeSearch: PropTypes.bool,
}

const AutocompleteResultsWithData = graphql(autocomplete, {
  skip: ({ inputValue }) => !inputValue,
  options: props => ({
    variables: {
      inputValue: props.inputValue,
    },
  }),
})(AutocompleteResults)

export default AutocompleteResultsWithData
