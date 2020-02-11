import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'

import SearchBar from './components/SearchBar'

/** Canonical search bar that uses the autocomplete endpoint to search for a specific product*/
class SearchBarContainer extends Component {
  state = {
    inputValue: '',
  }

  handleClearInput = () => {
    this.setState({ inputValue: '' })
  }

  handleGoToSearchPage = () => {
    const search = this.state.inputValue
    const { customSearchPageUrl } = this.props

    if (this.props.attemptPageTypeSearch) {
      window.location.href = `/${search}`
      return
    }

    if (customSearchPageUrl) {
      this.context.navigate({
        to: customSearchPageUrl.replace(/\$\{term\}/g, search),
      })

      return
    }

    // This param is only useful to track terms searched
    // See: https://support.google.com/analytics/answer/1012264
    const paramForSearchTracking = '&_q=' + search

    this.setState({ inputValue: '' })
    this.context.navigate({
      page: 'store.search',
      params: { term: search },
      query: 'map=ft' + paramForSearchTracking,
      fallbackToWindowLocation: false,
    })
  }

  handleInputChange = event => {
    this.setState({ inputValue: event.target.value })
  }

  render() {
    const {
      intl,
      compactMode,
      hasIconLeft,
      iconClasses,
      autoFocus,
      maxWidth,
      attemptPageTypeSearch,
      customSearchPageUrl,
      placeholder = intl.formatMessage({
        id: 'store/search.placeholder',
      }),
      autocompleteAlignment = 'right',
      openAutocompleteOnFocus = false,
      blurOnSubmit = false,
      submitOnIconClick = false,
      minSearchTermLength,
      autocompleteFullWidth = false,
    } = this.props

    const { inputValue } = this.state

    return (
      <SearchBar
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autoFocus}
        placeholder={placeholder}
        inputValue={inputValue}
        onClearInput={this.handleClearInput}
        onGoToSearchPage={this.handleGoToSearchPage}
        onInputChange={this.handleInputChange}
        compactMode={compactMode}
        hasIconLeft={hasIconLeft}
        iconClasses={iconClasses}
        maxWidth={maxWidth}
        attemptPageTypeSearch={attemptPageTypeSearch}
        customSearchPageUrl={customSearchPageUrl}
        autocompleteAlignment={autocompleteAlignment}
        openAutocompleteOnFocus={openAutocompleteOnFocus}
        blurOnSubmit={blurOnSubmit}
        submitOnIconClick={submitOnIconClick}
        minSearchTermLength={minSearchTermLength}
        autocompleteFullWidth={autocompleteFullWidth}
        intl={intl}
      />
    )
  }
}

SearchBarContainer.contextTypes = {
  navigate: PropTypes.func,
}

SearchBarContainer.schema = {
  title: 'admin/editor.search-bar.title',
}

SearchBarContainer.propTypes = {
  /* Internationalization */
  intl: intlShape.isRequired,
  /** Indentify when use the compact version of the component */
  compactMode: PropTypes.bool,
  /** Identify if the search icon is on left or right position */
  hasIconLeft: PropTypes.bool,
  /** Custom classes for the search icon */
  iconClasses: PropTypes.string,
  /** Identify if the search input should autofocus or not */
  autoFocus: PropTypes.bool,
  /** Max width of the search bar */
  maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Uses the term the user has inputed to try to navigate to the proper
   * page type (e.g. a department, a brand, a category)
   */
  attemptPageTypeSearch: PropTypes.bool,
  /** A template for a custom url. It can have a substring ${term} used as placeholder to interpolate the searched term. (e.g. `/search?query=${term}`) */
  customSearchPageUrl: PropTypes.string,
  placeholder: PropTypes.string,
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
}

export default injectIntl(SearchBarContainer)
