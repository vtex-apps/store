import React, { useRef, useCallback, useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Downshift from 'downshift'
import debounce from 'debounce'
import {
  NoSSR,
  useRuntime,
  ExtensionPoint,
  useChildBlock,
} from 'vtex.render-runtime'
import Overlay from '../../../../ReactPortal/Overlay'
import useCssHandles from '../../../../CssHandles/useCssHandles'
import { intlShape, defineMessages } from 'react-intl'
import styles from '../styles.css'

import AutocompleteResults from '../../AutocompleteResults'

import AutocompleteInput from './AutocompleteInput'

const CSS_HANDLES = ['searchBarInnerContainer']
const SEARCH_DELAY_TIME = 500
const AUTCOMPLETE_EXTENSION_ID = 'autocomplete-result-list'

const messages = defineMessages({
  searchTermTooShort: {
    id: 'store/search.search-term-too-short',
    defaultMessage: '',
  },
})

const SearchBar = ({
  placeholder,
  onInputChange,
  onGoToSearchPage,
  onClearInput,
  inputValue,
  compactMode,
  hasIconLeft,
  iconClasses,
  iconBlockClass,
  autoFocus,
  maxWidth,
  attemptPageTypeSearch,
  customSearchPageUrl,
  autocompleteAlignment,
  openAutocompleteOnFocus,
  blurOnSubmit,
  submitOnIconClick,
  minSearchTermLength,
  autocompleteFullWidth,
  intl,
}) => {
  const container = useRef()
  const { navigate } = useRuntime()
  const handles = useCssHandles(CSS_HANDLES)
  const [searchTerm, setSearchTerm] = useState(inputValue)
  const [inputErrorMessage, setInputErrorMessage] = useState()

  const debouncedSetSearchTerm = useCallback(
    debounce(newValue => {
      setSearchTerm(newValue)
    }, SEARCH_DELAY_TIME),
    []
  )

  useEffect(() => {
    debouncedSetSearchTerm(inputValue)
  }, [debouncedSetSearchTerm, inputValue])

  const onSelect = useCallback(
    element => {
      if (!element) {
        return
      }

      if (element.term) {
        if (attemptPageTypeSearch) {
          window.location.href = `/${element.term}`
          return
        }

        if (customSearchPageUrl) {
          navigate({
            to: customSearchPageUrl.replace(/\$\{term\}/g, element.term),
          })

          return
        }

        navigate({
          page: 'store.search',
          params: { term: element.term },
          query: 'map=ft',
        })
        return
      }

      let page = 'store.product'
      let params = {
        slug: element.slug,
        id: element.productId,
      }
      let query = ''
      const terms = element.slug.split('/')

      if (element.criteria) {
        // This param is only useful to track terms searched
        // See: https://support.google.com/analytics/answer/1012264
        const paramForSearchTracking = '&_c=' + terms[0]

        page = 'store.search'
        params = { term: terms[0] }
        query =
          `map=c,ft&rest=${terms.slice(1).join(',')}` + paramForSearchTracking
      }

      navigate({ page, params, query })
    },
    [navigate, attemptPageTypeSearch, customSearchPageUrl]
  )

  const validateInput = () => {
    if (minSearchTermLength && inputValue.length < minSearchTermLength) {
      return intl.formatMessage(messages.searchTermTooShort)
    }

    return null
  }

  const showInputErrorMessage = inputErrorMessage => {
    setInputErrorMessage(inputErrorMessage)
  }

  const hideInputErrorMessage = () => {
    setInputErrorMessage()
  }

  const fallback = (
    <AutocompleteInput
      placeholder={placeholder}
      onInputChange={onInputChange}
      inputValue={inputValue}
      hasIconLeft={hasIconLeft}
      iconClasses={iconClasses}
      iconBlockClass={iconBlockClass}
      inputErrorMessage={inputErrorMessage}
      onGoToSearchPage={onGoToSearchPage}
    />
  )

  const isAutocompleteDeclared = Boolean(
    useChildBlock({ id: AUTCOMPLETE_EXTENSION_ID })
  )

  const SelectedAutocompleteResults = useMemo(() => {
    return isAutocompleteDeclared
      ? props => <ExtensionPoint id={AUTCOMPLETE_EXTENSION_ID} {...props} />
      : props => <AutocompleteResults {...props} />
  }, [isAutocompleteDeclared])

  return (
    <div
      ref={container}
      className={classNames('w-100 mw7 pv4', styles.searchBarContainer)}
      style={{
        ...(maxWidth && {
          maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
        }),
      }}
    >
      <NoSSR onSSR={fallback}>
        <Downshift onSelect={onSelect}>
          {({
            getInputProps,
            getItemProps,
            getMenuProps,
            selectedItem,
            highlightedIndex,
            isOpen,
            closeMenu,
            openMenu,
          }) => (
            <div
              className={classNames(
                'relative-m w-100',
                handles.searchBarInnerContainer
              )}
            >
              <AutocompleteInput
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus={autoFocus}
                compactMode={compactMode}
                onClearInput={onClearInput}
                hasIconLeft={hasIconLeft}
                iconClasses={iconClasses}
                onGoToSearchPage={onGoToSearchPage}
                submitOnIconClick={submitOnIconClick}
                openAutocompleteOnFocus={openAutocompleteOnFocus}
                openMenu={openMenu}
                inputErrorMessage={inputErrorMessage}
                {...getInputProps({
                  onKeyDown: event => {
                    // Only call default search function if user doesn't
                    // have any item highlighted in the menu options
                    if (event.key === 'Enter' && highlightedIndex === null) {
                      const errorMessage = validateInput()

                      if (errorMessage) {
                        showInputErrorMessage(errorMessage)
                        return
                      }

                      if (blurOnSubmit) {
                        event.currentTarget.blur()
                      }

                      onGoToSearchPage()
                      closeMenu()
                    } else {
                      hideInputErrorMessage()
                    }
                  },
                  placeholder,
                  value: inputValue,
                  onChange: onInputChange,
                  onFocus: openAutocompleteOnFocus ? openMenu : undefined,
                })}
              />
              <Overlay
                alignment={autocompleteAlignment}
                fullWindow={autocompleteFullWidth}
              >
                <SelectedAutocompleteResults
                  parentContainer={container}
                  {...{
                    attemptPageTypeSearch,
                    isOpen,
                    getMenuProps,
                    inputValue: searchTerm,
                    getItemProps,
                    selectedItem,
                    highlightedIndex,
                    closeMenu,
                    onClearInput,
                    customSearchPageUrl,
                  }}
                />
              </Overlay>
            </div>
          )}
        </Downshift>
      </NoSSR>
    </div>
  )
}

SearchBar.propTypes = {
  /** Placeholder to be used on the input */
  placeholder: PropTypes.string.isRequired,
  /** Current value of the input */
  inputValue: PropTypes.string.isRequired,
  /** Function to handle input changes */
  onInputChange: PropTypes.func.isRequired,
  /** Function to direct the user to the searchPage */
  onGoToSearchPage: PropTypes.func.isRequired,
  /** Function to clear the input */
  onClearInput: PropTypes.func.isRequired,
  /** Indentify when use the compact version of the component */
  compactMode: PropTypes.bool,
  /** Identify if the search icon is on left or right position */
  hasIconLeft: PropTypes.bool,
  /** Custom classes for the search icon */
  iconClasses: PropTypes.string,
  /** Block class for the search icon */
  iconBlockClass: PropTypes.string,
  /** Identify if the search input should autofocus or not */
  autoFocus: PropTypes.bool,
  /** Max width of the search bar */
  maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** A template for a custom url. It can have a substring ${term} used as placeholder to interpolate the searched term. (e.g. `/search?query=${term}`) */
  customSearchPageUrl: PropTypes.string,
  /** Uses the term the user has inputed to try to navigate to the proper
   * page type (e.g. a department, a brand, a category)
   */
  attemptPageTypeSearch: PropTypes.bool,
  /* Autocomplete Horizontal alignment */
  autocompleteAlignment: PropTypes.string,
  /** Identify if autocomplete should be open on input focus or not */
  openAutocompleteOnFocus: PropTypes.bool,
  /** Identify if input should blur on submit */
  blurOnSubmit: PropTypes.bool,
  /** Identify if icon should submit on click */
  submitOnIconClick: PropTypes.bool,
  /** Minimum search term length allowed */
  minSearchTermLength: PropTypes.number,
  /** If true, the autocomplete will fill the whole window horizontally */
  autocompleteFullWidth: PropTypes.bool,
  /* Internationalization */
  intl: intlShape.isRequired,
}

export default SearchBar
